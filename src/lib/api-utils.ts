import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'
import { RateLimiterMemory } from 'rate-limiter-flexible'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

// Rate limiters for different endpoints
const rateLimiters = {
  auth: new RateLimiterMemory({
    keyGenerator: (req: NextRequest) => req.ip || 'anonymous',
    points: 5, // Number of requests
    duration: 60, // Per 60 seconds
  }),
  posts: new RateLimiterMemory({
    keyGenerator: (req: NextRequest) => req.ip || 'anonymous',
    points: 30, // Number of requests
    duration: 60, // Per 60 seconds
  }),
  general: new RateLimiterMemory({
    keyGenerator: (req: NextRequest) => req.ip || 'anonymous',
    points: 100, // Number of requests
    duration: 60, // Per 60 seconds
  })
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  INVALID_REQUEST: 'INVALID_REQUEST'
} as const

// Success response helper
export function successResponse<T>(
  data: T, 
  message?: string, 
  pagination?: ApiResponse['pagination']
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination
  })
}

// Error response helper
export function errorResponse(
  error: string | ApiError,
  status: number = 400
): NextResponse<ApiResponse> {
  const errorObj = typeof error === 'string' 
    ? { code: ERROR_CODES.INVALID_REQUEST, message: error }
    : error

  return NextResponse.json({
    success: false,
    error: errorObj.message,
    code: errorObj.code,
    details: errorObj.details
  }, { status })
}

// Validation middleware
export function validateRequest<T>(schema: ZodSchema<T>) {
  return async (request: NextRequest): Promise<{ data: T; error?: never } | { data?: never; error: NextResponse }> => {
    try {
      const body = await request.json()
      const data = schema.parse(body)
      return { data }
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          error: errorResponse({
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Validation failed',
            details: error.errors
          }, 400)
        }
      }
      return {
        error: errorResponse({
          code: ERROR_CODES.INVALID_REQUEST,
          message: 'Invalid request body'
        }, 400)
      }
    }
  }
}

// Rate limiting middleware
export async function checkRateLimit(
  request: NextRequest, 
  limiterType: keyof typeof rateLimiters = 'general'
): Promise<NextResponse | null> {
  try {
    const limiter = rateLimiters[limiterType]
    await limiter.consume(request.ip || 'anonymous')
    return null
  } catch (rejRes: any) {
    return errorResponse({
      code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
      message: `Rate limit exceeded. Try again in ${Math.round(rejRes.msBeforeNext / 1000)} seconds.`
    }, 429)
  }
}

// Authentication middleware
export async function requireAuth(request: NextRequest): Promise<{ user: any; error?: never } | { user?: never; error: NextResponse }> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return {
        error: errorResponse({
          code: ERROR_CODES.AUTHENTICATION_ERROR,
          message: 'Authentication required'
        }, 401)
      }
    }

    return { user: session.user }
  } catch (error) {
    return {
      error: errorResponse({
        code: ERROR_CODES.AUTHENTICATION_ERROR,
        message: 'Invalid authentication'
      }, 401)
    }
  }
}

// Authorization middleware
export function requireRole(allowedRoles: string[]) {
  return (user: any): NextResponse | null => {
    if (!allowedRoles.includes(user.role || 'student')) {
      return errorResponse({
        code: ERROR_CODES.AUTHORIZATION_ERROR,
        message: 'Insufficient permissions'
      }, 403)
    }
    return null
  }
}

// Pagination helper
export function getPagination(request: NextRequest) {
  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '10')))
  const skip = (page - 1) * limit

  return { page, limit, skip }
}

// Search helper
export function getSearchParams(request: NextRequest) {
  const url = new URL(request.url)
  const query = url.searchParams.get('q') || ''
  const sortBy = url.searchParams.get('sortBy') || 'createdAt'
  const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 1 : -1
  const filters: Record<string, any> = {}

  // Extract filter parameters
  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith('filter.')) {
      const filterKey = key.replace('filter.', '')
      filters[filterKey] = value
    }
  }

  return { query, sortBy, sortOrder, filters }
}

// API handler wrapper with error handling
export function apiHandler(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('API Error:', error)
      
      // Log error to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // Send to Sentry or other monitoring service
      }

      return errorResponse({
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Internal server error'
      }, 500)
    }
  }
}

// Content moderation helper
export function moderateContent(content: string): { isAppropriate: boolean; reason?: string } {
  const inappropriateWords = [
    // Add inappropriate words/phrases for content filtering
    'spam', 'scam', 'fake', 'hate'
  ]

  const lowerContent = content.toLowerCase()
  
  for (const word of inappropriateWords) {
    if (lowerContent.includes(word)) {
      return {
        isAppropriate: false,
        reason: `Content contains inappropriate language: ${word}`
      }
    }
  }

  // Check for excessive caps (potential spam)
  const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
  if (capsRatio > 0.7 && content.length > 20) {
    return {
      isAppropriate: false,
      reason: 'Excessive use of capital letters'
    }
  }

  // Check for repeated characters (potential spam)
  if (/(.)\1{4,}/.test(content)) {
    return {
      isAppropriate: false,
      reason: 'Excessive repeated characters'
    }
  }

  return { isAppropriate: true }
}

// File upload validation
export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 10MB.'
    }
  }

  return { isValid: true }
}

// Database transaction helper
export async function withTransaction<T>(
  operation: () => Promise<T>
): Promise<T> {
  // In a real implementation, this would use MongoDB transactions
  // For now, we'll just execute the operation
  return await operation()
}

// Cache helper (for future Redis integration)
export class CacheManager {
  private static cache = new Map<string, { data: any; expires: number }>()

  static set(key: string, data: any, ttlSeconds: number = 300) {
    const expires = Date.now() + (ttlSeconds * 1000)
    this.cache.set(key, { data, expires })
  }

  static get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.expires) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  static delete(key: string) {
    this.cache.delete(key)
  }

  static clear() {
    this.cache.clear()
  }
}
