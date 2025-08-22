'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { mockAPI, shouldUseMockData } from '@/lib/mock-data'
import { scaledMockAPI, shouldUseScaledMockData } from '@/lib/scaled-mock-data'
import { MediaUpload } from '@/components/posts/media-upload'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Image as ImageIcon,
  Video,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Flag,
  MessageSquare
} from 'lucide-react'
import { ReportModal } from '@/components/moderation/report-modal'

// Mock data for posts
const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Priya Sharma',
      universityId: 'CS2021045',
      year: 3,
      stream: 'Computer Science Engineering',
      section: 'B',
      avatar: '👩‍💻'
    },
    content: 'Just finished our Machine Learning project! 🤖 Our team built an AI model that can predict student performance. Excited to present it tomorrow! #MachineLearning #AI #SRMProjects',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3,
    type: 'text',
    tags: ['MachineLearning', 'AI', 'SRMProjects']
  },
  {
    id: '2',
    author: {
      name: 'Rahul Kumar',
      universityId: 'ME2020123',
      year: 4,
      stream: 'Mechanical Engineering',
      section: 'A',
      avatar: '👨‍🔧'
    },
    content: 'Looking for teammates for the upcoming Hackathon! 💻 Need 2 more developers (preferably frontend + backend). Theme is "Smart Campus Solutions". DM me if interested! 🚀',
    timestamp: '4 hours ago',
    likes: 18,
    comments: 12,
    shares: 6,
    type: 'text',
    tags: ['Hackathon', 'TeamUp', 'SmartCampus']
  },
  {
    id: '3',
    author: {
      name: 'Sneha Patel',
      universityId: 'EC2021089',
      year: 3,
      stream: 'Electronics & Communication',
      section: 'C',
      avatar: '👩‍🔬'
    },
    content: 'Amazing workshop on IoT and Embedded Systems today! 📡 Learned so much about sensor integration and wireless communication. Thanks to Prof. Gupta for the hands-on session! 🙏',
    timestamp: '6 hours ago',
    likes: 31,
    comments: 5,
    shares: 2,
    type: 'text',
    tags: ['IoT', 'Workshop', 'Electronics']
  },
  {
    id: '4',
    author: {
      name: 'Arjun Singh',
      universityId: 'IT2022156',
      year: 2,
      stream: 'Information Technology',
      section: 'A',
      avatar: '👨‍💻'
    },
    content: 'Study group for Data Structures & Algorithms forming! 📚 Meeting every Tuesday & Thursday 6 PM at Central Library. Currently covering Trees and Graphs. All years welcome! 🌳',
    timestamp: '8 hours ago',
    likes: 42,
    comments: 15,
    shares: 8,
    type: 'text',
    tags: ['StudyGroup', 'DSA', 'Library']
  }
]

export default function FeedPage() {
  const { data: session } = useSession()
  const [newPost, setNewPost] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [posts, setPosts] = useState<any[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [mediaFiles, setMediaFiles] = useState<any[]>([])
  const [showMediaUpload, setShowMediaUpload] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean
    postId: string
    content: string
  }>({ isOpen: false, postId: '', content: '' })

  // Load posts on component mount
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setIsLoading(true)

      if (shouldUseScaledMockData()) {
        // Use scaled mock data for 2000+ students pilot
        console.log('Loading scaled mock data for pilot program')
        const result = await scaledMockAPI.getPosts(1, 20)
        setPosts(result.posts)
        setHasMorePosts(result.hasMore)
        setCurrentPage(1)
      } else if (shouldUseMockData()) {
        // Use regular mock data for development
        const result = await mockAPI.getPosts()
        setPosts(result.posts)
        setHasMorePosts(result.hasMore)
      } else {
        // Use real API
        const response = await fetch('/api/posts')
        if (response.ok) {
          const result = await response.json()
          setPosts(result.posts || [])
          setHasMorePosts(result.hasMore || false)
        }
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
      // Fallback to scaled mock data
      const result = await scaledMockAPI.getPosts(1, 20)
      setPosts(result.posts)
      setHasMorePosts(result.hasMore)
    } finally {
      setIsLoading(false)
    }
  }

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageSquare className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-2xl font-retro text-white mb-4">Welcome to REPPD!</h3>
      <p className="text-white/60 font-space mb-6 max-w-md mx-auto">
        Be the first to share something with your campus community. Create a post to get the conversation started!
      </p>
      <Button
        onClick={() => document.getElementById('create-post-textarea')?.focus()}
        className="bg-gradient-to-r from-retro-cyan to-retro-purple hover:from-retro-cyan/80 hover:to-retro-purple/80"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create First Post
      </Button>
    </div>
  )

  const handleCreatePost = async () => {
    console.log('Create post clicked!', { newPost, isAnonymous, mediaFiles })

    if (!newPost.trim()) {
      console.log('Post is empty, not creating')
      alert('Please enter some content for your post!')
      return
    }

    try {
      console.log('Creating post...')

      // Create post object directly (simplified approach)
      const newPostObj = {
        id: Date.now().toString(),
        content: newPost,
        author: {
          id: session?.user?.id || 'anonymous',
          name: isAnonymous ? 'Anonymous Student' : (session?.user?.name || 'Current User'),
          avatar: isAnonymous ? '🕶️' : (session?.user?.image || '👤'),
          university: session?.user?.university || 'SRM University Sonipat',
          year: session?.user?.year || 3,
          stream: session?.user?.stream || 'Computer Science Engineering',
          section: session?.user?.section || 'A'
        },
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        isAnonymous,
        images: mediaFiles.filter(f => f.type === 'image').map(f => f.url || f.preview),
        videos: mediaFiles.filter(f => f.type === 'video').map(f => f.url || f.preview),
        type: mediaFiles.length > 0 ? 'media' : 'text',
        tags: []
      }

      console.log('New post object:', newPostObj)

      // Add to posts list
      setPosts(prevPosts => {
        console.log('Adding post to list, current posts:', prevPosts.length)
        return [newPostObj, ...prevPosts]
      })

      // Clear form
      setNewPost('')
      setIsAnonymous(false)
      setMediaFiles([])
      setShowMediaUpload(false)

      console.log('Post created successfully!')

      // Optional: Save to database in background
      if (!shouldUseMockData()) {
        try {
          const response = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPostObj)
          })
          if (response.ok) {
            console.log('Post saved to database')
          }
        } catch (dbError) {
          console.log('Database save failed, but post created locally:', dbError)
        }
      }

    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Error creating post. Please try again.')
    }
  }

  const handleLike = (postId: string) => {
    console.log('Like clicked for post:', postId)

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isCurrentlyLiked = post.isLiked || false
          const newLikeCount = isCurrentlyLiked ? post.likes - 1 : post.likes + 1

          console.log(`Post ${postId}: ${isCurrentlyLiked ? 'unliking' : 'liking'}, new count: ${newLikeCount}`)

          return {
            ...post,
            likes: Math.max(0, newLikeCount), // Ensure likes don't go below 0
            isLiked: !isCurrentlyLiked
          }
        }
        return post
      })
    )
  }

  const handleComment = (postId: string) => {
    console.log('Comment clicked for post:', postId)
    // For now, just increment comment count
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, comments: post.comments + 1 }
          : post
      )
    )
  }

  const handleShare = (postId: string) => {
    console.log('Share clicked for post:', postId)
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, shares: post.shares + 1 }
          : post
      )
    )
  }

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMorePosts) return

    setIsLoadingMore(true)

    try {
      if (shouldUseScaledMockData()) {
        // Load more posts from scaled mock data for 2000+ students
        const result = await scaledMockAPI.getPosts(currentPage + 1, 15)
        setPosts(prev => [...prev, ...result.posts])
        setCurrentPage(prev => prev + 1)
        setHasMorePosts(result.hasMore)
        console.log(`Loaded page ${currentPage + 1}, total posts: ${posts.length + result.posts.length}`)
      } else {
        // Fallback to simple mock generation
        const morePosts = Array.from({ length: 10 }, (_, index) => ({
          id: `${Date.now()}-${index}`,
          author: {
            name: `Student ${currentPage * 10 + index + 1}`,
            universityId: `CS202${currentPage}${index}`,
            year: Math.floor(Math.random() * 4) + 1,
            stream: 'Computer Science Engineering',
            section: String.fromCharCode(65 + Math.floor(Math.random() * 3)),
            avatar: ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓'][Math.floor(Math.random() * 4)]
          },
          content: `This is a sample post from page ${currentPage + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10),
          type: 'text' as const,
          tags: ['Sample', 'Post'],
          isLiked: false,
          isBookmarked: false,
          isAnonymous: false,
          images: []
        }))

        setPosts(prev => [...prev, ...morePosts])
        setCurrentPage(prev => prev + 1)

        // Stop loading more after 10 pages for demo
        if (currentPage >= 9) {
          setHasMorePosts(false)
        }
      }
    } catch (error) {
      console.error('Failed to load more posts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-2 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-retro font-bold text-white mb-2">
            Campus Feed 🚀
          </h1>
          <p className="text-white/60 font-space">
            What's happening at SRM University Sonipat
          </p>
        </div>

        {/* Debug Info - Only show after mount to prevent hydration issues */}
        {process.env.NODE_ENV === 'development' && mounted && (
          <Card className="glass-morphism border-yellow-500/20 mb-4">
            <CardContent className="pt-4">
              <div className="text-xs text-yellow-400 space-y-1">
                <p>🚀 REPPD Pilot Program (2000+ Students)</p>
                <p>Posts loaded: {posts.length}</p>
                <p>Scaled mock data: {mounted ? (shouldUseScaledMockData() ? 'Active' : 'Inactive') : 'Loading...'}</p>
                <p>Session: {session?.user?.name || 'Not logged in'}</p>
                <p>Page: {currentPage} | Has more: {hasMorePosts ? 'Yes' : 'No'}</p>
                <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Create Post */}
        <Card className="glass-morphism border-white/20 mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <Plus className="w-5 h-5 text-retro-orange" />
              Share Something
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share updates, ask questions, or start discussions..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="glass-morphism border-white/20 text-white placeholder:text-white/40 resize-none min-h-[100px]"
            />
            
            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-white/20 bg-transparent text-retro-cyan focus:ring-retro-cyan"
              />
              <label htmlFor="anonymous" className="text-white/70 text-sm font-space cursor-pointer">
                🕶️ Post anonymously
              </label>
              <span className="text-white/40 text-xs font-space ml-auto">
                Your identity will be hidden
              </span>
            </div>

            {/* Media Upload Section */}
            {showMediaUpload && (
              <div className="mt-4">
                <MediaUpload
                  onFilesChange={setMediaFiles}
                  maxFiles={4}
                  acceptedTypes={['image/*', 'video/*']}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-white/60 hover:text-white ${showMediaUpload ? 'bg-white/10 text-retro-cyan' : ''}`}
                  onClick={() => setShowMediaUpload(!showMediaUpload)}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {showMediaUpload ? 'Hide Media' : 'Add Media'}
                </Button>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Event
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    console.log('Post button clicked!')
                    handleCreatePost()
                  }}
                  disabled={!newPost.trim()}
                  className="flex-1 sm:flex-none sm:w-auto bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
                >
                  {isAnonymous ? 'Post Anonymously' : 'Post'}
                </Button>

                {/* Test button for debugging */}
                <Button
                  onClick={() => {
                    console.log('Test button clicked!')
                    const testPost = {
                      id: 'test-' + Date.now(),
                      content: 'Test post created at ' + new Date().toLocaleTimeString(),
                      author: {
                        name: 'Test User',
                        avatar: '🧪'
                      },
                      timestamp: 'Just now',
                      likes: 0,
                      comments: 0,
                      shares: 0,
                      isLiked: false,
                      isBookmarked: false,
                      isAnonymous: false,
                      images: [],
                      type: 'text',
                      tags: []
                    }
                    setPosts(prev => [testPost, ...prev])
                    console.log('Test post added!')
                  }}
                  variant="outline"
                  size="sm"
                  className="border-retro-cyan text-retro-cyan hover:bg-retro-cyan/10"
                >
                  Test
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-retro-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/60 font-space">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <EmptyState />
          ) : (
            posts.map((post) => (
            <Card key={post.id} className="glass-morphism border-white/20 hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center text-xl">
                      {post.author.avatar}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{post.author.name}</h3>
                      <p className="text-white/60 text-sm font-space">
                        {post.author.stream} • Year {post.author.year} • Section {post.author.section}
                      </p>
                      <p className="text-white/40 text-xs font-space flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-red-400"
                      onClick={() => setReportModal({
                        isOpen: true,
                        postId: post.id,
                        content: post.content
                      })}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-white font-space leading-relaxed">
                  {post.content}
                </p>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-retro-cyan/20 text-retro-cyan text-xs rounded-full font-space"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLike(post.id)}
                      className="text-white/60 hover:text-retro-pink transition-colors"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {post.likes}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleComment(post.id)}
                      className="text-white/60 hover:text-retro-cyan transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.comments}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post.id)}
                      className="text-white/60 hover:text-retro-orange transition-colors"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {post.shares}
                    </Button>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-yellow transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          {hasMorePosts ? (
            <Button
              onClick={loadMorePosts}
              disabled={isLoadingMore}
              variant="glass"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {isLoadingMore ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More Posts'
              )}
            </Button>
          ) : (
            <p className="text-white/60 font-space">
              🎉 You've reached the end! No more posts to load.
            </p>
          )}
        </div>

        {/* Report Modal */}
        <ReportModal
          isOpen={reportModal.isOpen}
          onClose={() => setReportModal({ isOpen: false, postId: '', content: '' })}
          contentType="post"
          contentId={reportModal.postId}
          contentPreview={reportModal.content}
        />
      </div>
    </div>
  )
}
