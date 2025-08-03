import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByUniversityId, findOCRDataBySessionId } from '@/lib/mongodb'
import { hashPassword } from '@/lib/utils'
import { z } from 'zod'

const signupSchema = z.object({
  // University selection data
  university: z.string().min(1, 'University is required'),
  stream: z.string().min(1, 'Stream is required'),
  section: z.string().optional(),
  year: z.number().min(1).max(6),

  // Extracted OCR data
  extractedData: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    universityId: z.string().min(6, 'University ID must be at least 6 characters'),
    year: z.number().min(1).max(6),
    stream: z.string().min(1, 'Stream is required'),
    section: z.string().optional()
  }),

  // Credentials
  password: z.string().min(8, 'Password must be at least 8 characters'),

  // Session ID from OCR processing
  sessionId: z.string().optional(),

  // Optional fields
  email: z.string().email().optional(),
  interests: z.array(z.string()).default([])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = signupSchema.parse(body)

    // Check if user already exists
    const existingUser = await findUserByUniversityId(validatedData.extractedData.universityId)

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this University ID already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Get OCR data with image URLs if session ID provided
    let ocrData = null
    if (validatedData.sessionId) {
      ocrData = await findOCRDataBySessionId(validatedData.sessionId)
    }

    // Create user with extracted data
    const user = await createUser({
      name: validatedData.extractedData.name,
      email: validatedData.email,
      university: validatedData.university,
      section: validatedData.extractedData.section || validatedData.section,
      year: validatedData.extractedData.year,
      stream: validatedData.extractedData.stream,
      universityId: validatedData.extractedData.universityId,
      password: hashedPassword,
      interests: validatedData.interests,
      isVerified: false, // Will be verified after admin review
      isActive: true
    })

    // TODO: Send verification email to admin
    // TODO: Send welcome email to user
    // TODO: Log signup event for analytics

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please wait for verification.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        universityId: user.universityId,
        university: user.university,
        year: user.year,
        section: user.section,
        stream: user.stream,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
