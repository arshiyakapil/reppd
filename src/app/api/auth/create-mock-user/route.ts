import { NextRequest, NextResponse } from 'next/server'
import { createUser, findUserByUniversityId } from '@/lib/mongodb'
import { hashPassword } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    // Check if mock user already exists
    const existingUser = await findUserByUniversityId('10324210279')
    
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'Mock user already exists',
        user: {
          universityId: existingUser.universityId,
          name: existingUser.name
        }
      })
    }

    // Hash the password
    const hashedPassword = await hashPassword('dev02022005')

    // Create mock user
    const user = await createUser({
      name: 'Dev Student',
      email: 'dev.student@srm.edu.in',
      university: 'SRM University Sonipat',
      section: 'A',
      year: 3,
      stream: 'Computer Science Engineering',
      universityId: '10324210279',
      password: hashedPassword,
      interests: ['coding', 'gaming', 'music'],
      isVerified: true, // Pre-verified for testing
      isActive: true
    })

    return NextResponse.json({
      success: true,
      message: 'Mock user created successfully',
      user: {
        id: user._id,
        name: user.name,
        universityId: user.universityId,
        university: user.university,
        stream: user.stream,
        year: user.year,
        section: user.section,
        isVerified: user.isVerified
      }
    })

  } catch (error) {
    console.error('Mock user creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create mock user' },
      { status: 500 }
    )
  }
}
