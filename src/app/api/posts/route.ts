import { NextRequest } from 'next/server'
import { z } from 'zod'
import { ObjectId } from 'mongodb'
import { getDatabase, COLLECTIONS } from '@/lib/mongodb'
import { 
  apiHandler, 
  successResponse, 
  errorResponse, 
  validateRequest, 
  checkRateLimit, 
  requireAuth,
  getPagination,
  getSearchParams,
  moderateContent,
  ERROR_CODES,
  CacheManager
} from '@/lib/api-utils'

// Validation schemas
const CreatePostSchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.enum(['text', 'image', 'video', 'poll', 'event']).default('text'),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isAnonymous: z.boolean().default(false),
  communityId: z.string().optional()
})

const UpdatePostSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional()
})

// GET /api/posts - Fetch posts with pagination and filtering
export const GET = apiHandler(async (request: NextRequest) => {
  // Check rate limit
  const rateLimitError = await checkRateLimit(request, 'general')
  if (rateLimitError) return rateLimitError

  const { page, limit, skip } = getPagination(request)
  const { query, sortBy, sortOrder, filters } = getSearchParams(request)

  // Check cache first
  const cacheKey = `posts:${page}:${limit}:${query}:${JSON.stringify(filters)}`
  const cachedData = CacheManager.get(cacheKey)
  if (cachedData) {
    return successResponse(cachedData.posts, 'Posts retrieved from cache', cachedData.pagination)
  }

  try {
    const db = await getDatabase()
    const postsCollection = db.collection(COLLECTIONS.POSTS)
    const usersCollection = db.collection(COLLECTIONS.USERS)

    // Build query
    const mongoQuery: any = {}

    // Text search
    if (query) {
      mongoQuery.$or = [
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    }

    // Apply filters
    if (filters.communityId) {
      mongoQuery.communityId = filters.communityId
    }
    if (filters.type) {
      mongoQuery.type = filters.type
    }
    if (filters.isAnonymous !== undefined) {
      mongoQuery.isAnonymous = filters.isAnonymous === 'true'
    }

    // Exclude reported/moderated content for regular users
    mongoQuery.isModerated = { $ne: true }

    // Get total count
    const total = await postsCollection.countDocuments(mongoQuery)

    // Fetch posts with pagination
    const posts = await postsCollection
      .find(mongoQuery)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Populate author information
    const populatedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.isAnonymous) {
          return {
            ...post,
            _id: post._id.toString(),
            author: {
              name: 'Anonymous Student',
              universityId: 'ANON',
              avatar: '🕶️'
            }
          }
        }

        const author = await usersCollection.findOne(
          { _id: new ObjectId(post.authorId) },
          { projection: { name: 1, universityId: 1, stream: 1, year: 1, section: 1 } }
        )

        return {
          ...post,
          _id: post._id.toString(),
          author: author ? {
            name: author.name,
            universityId: author.universityId,
            stream: author.stream,
            year: author.year,
            section: author.section,
            avatar: '👤'
          } : null
        }
      })
    )

    const pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }

    // Cache the result
    CacheManager.set(cacheKey, { posts: populatedPosts, pagination }, 300) // 5 minutes

    return successResponse(populatedPosts, 'Posts retrieved successfully', pagination)

  } catch (error) {
    console.error('Error fetching posts:', error)
    return errorResponse({
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to fetch posts'
    }, 500)
  }
})

// POST /api/posts - Create a new post
export const POST = apiHandler(async (request: NextRequest) => {
  // Check rate limit
  const rateLimitError = await checkRateLimit(request, 'posts')
  if (rateLimitError) return rateLimitError

  // Require authentication
  const authResult = await requireAuth(request)
  if (authResult.error) return authResult.error

  // Validate request body
  const validator = validateRequest(CreatePostSchema)
  const validationResult = await validator(request)
  if (validationResult.error) return validationResult.error

  const { content, type, images, tags, isAnonymous, communityId } = validationResult.data

  try {
    // Content moderation
    const moderation = moderateContent(content)
    if (!moderation.isAppropriate) {
      return errorResponse({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `Content rejected: ${moderation.reason}`
      }, 400)
    }

    const db = await getDatabase()
    const postsCollection = db.collection(COLLECTIONS.POSTS)

    // Verify community exists if specified
    if (communityId) {
      const communitiesCollection = db.collection(COLLECTIONS.COMMUNITIES)
      const community = await communitiesCollection.findOne({ _id: new ObjectId(communityId) })
      if (!community) {
        return errorResponse({
          code: ERROR_CODES.NOT_FOUND,
          message: 'Community not found'
        }, 404)
      }
    }

    // Create post
    const post = {
      authorId: authResult.user.id,
      content,
      type,
      images: images || [],
      tags: tags || [],
      isAnonymous,
      communityId: communityId ? new ObjectId(communityId) : null,
      likes: [],
      comments: [],
      shares: 0,
      views: 0,
      isReported: false,
      reportCount: 0,
      isModerated: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await postsCollection.insertOne(post)

    // Clear relevant caches
    CacheManager.clear() // Simple approach - clear all caches

    // Update user's post count
    const usersCollection = db.collection(COLLECTIONS.USERS)
    await usersCollection.updateOne(
      { _id: new ObjectId(authResult.user.id) },
      { $inc: { 'stats.totalPosts': 1 } }
    )

    // Update community post count if applicable
    if (communityId) {
      const communitiesCollection = db.collection(COLLECTIONS.COMMUNITIES)
      await communitiesCollection.updateOne(
        { _id: new ObjectId(communityId) },
        { $inc: { 'stats.totalPosts': 1 } }
      )
    }

    const createdPost = {
      ...post,
      _id: result.insertedId.toString(),
      author: isAnonymous ? {
        name: 'Anonymous Student',
        universityId: 'ANON',
        avatar: '🕶️'
      } : {
        name: authResult.user.name,
        universityId: authResult.user.universityId,
        avatar: '👤'
      }
    }

    return successResponse(createdPost, 'Post created successfully')

  } catch (error) {
    console.error('Error creating post:', error)
    return errorResponse({
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to create post'
    }, 500)
  }
})

// PUT /api/posts/[id] - Update a post
export const PUT = apiHandler(async (request: NextRequest) => {
  // Check rate limit
  const rateLimitError = await checkRateLimit(request, 'posts')
  if (rateLimitError) return rateLimitError

  // Require authentication
  const authResult = await requireAuth(request)
  if (authResult.error) return authResult.error

  // Validate request body
  const validator = validateRequest(UpdatePostSchema)
  const validationResult = await validator(request)
  if (validationResult.error) return validationResult.error

  const url = new URL(request.url)
  const postId = url.pathname.split('/').pop()

  if (!postId || !ObjectId.isValid(postId)) {
    return errorResponse({
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Invalid post ID'
    }, 400)
  }

  try {
    const db = await getDatabase()
    const postsCollection = db.collection(COLLECTIONS.POSTS)

    // Find the post
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) })
    if (!post) {
      return errorResponse({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Post not found'
      }, 404)
    }

    // Check if user owns the post
    if (post.authorId !== authResult.user.id) {
      return errorResponse({
        code: ERROR_CODES.AUTHORIZATION_ERROR,
        message: 'You can only edit your own posts'
      }, 403)
    }

    const updateData = validationResult.data

    // Content moderation if content is being updated
    if (updateData.content) {
      const moderation = moderateContent(updateData.content)
      if (!moderation.isAppropriate) {
        return errorResponse({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: `Content rejected: ${moderation.reason}`
        }, 400)
      }
    }

    // Update post
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return errorResponse({
        code: ERROR_CODES.NOT_FOUND,
        message: 'Post not found'
      }, 404)
    }

    // Clear caches
    CacheManager.clear()

    return successResponse(null, 'Post updated successfully')

  } catch (error) {
    console.error('Error updating post:', error)
    return errorResponse({
      code: ERROR_CODES.INTERNAL_ERROR,
      message: 'Failed to update post'
    }, 500)
  }
})
