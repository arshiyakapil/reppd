import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, COLLECTIONS } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

// Access code verification endpoint
export async function POST(request: NextRequest) {
  try {
    const { accessCode } = await request.json()

    if (!accessCode) {
      return NextResponse.json(
        { message: 'Access code is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES || 'access_codes')

    // Find the access code
    const codeRecord = await accessCodesCollection.findOne({
      code: accessCode,
      isActive: true,
      expiresAt: { $gt: new Date() }
    })

    if (!codeRecord) {
      return NextResponse.json(
        { message: 'Invalid or expired access code' },
        { status: 401 }
      )
    }

    // Update last used timestamp
    await accessCodesCollection.updateOne(
      { _id: codeRecord._id },
      { 
        $set: { lastUsedAt: new Date() },
        $inc: { usageCount: 1 }
      }
    )

    return NextResponse.json({
      success: true,
      role: codeRecord.role,
      permissions: codeRecord.permissions,
      university: codeRecord.university,
      message: 'Access granted'
    })

  } catch (error) {
    console.error('Access code verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate access code (for dev portal)
export async function PUT(request: NextRequest) {
  try {
    const { 
      role, 
      university, 
      permissions, 
      expiresInDays = 30,
      description,
      createdBy 
    } = await request.json()

    // Verify developer access (you can implement this check)
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate unique access code
    const accessCode = generateAccessCode(role)
    
    const db = await getDatabase()
    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES || 'access_codes')

    const newAccessCode = {
      code: accessCode,
      role,
      university,
      permissions: permissions || getDefaultPermissions(role),
      description: description || `${role} access code`,
      isActive: true,
      createdAt: new Date(),
      createdBy,
      expiresAt: new Date(Date.now() + (expiresInDays * 24 * 60 * 60 * 1000)),
      usageCount: 0,
      lastUsedAt: null
    }

    await accessCodesCollection.insertOne(newAccessCode)

    return NextResponse.json({
      success: true,
      accessCode,
      role,
      expiresAt: newAccessCode.expiresAt,
      message: 'Access code generated successfully'
    })

  } catch (error) {
    console.error('Access code generation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Generate access code based on role
function generateAccessCode(role: string): string {
  const prefix = {
    'developer': 'DEV',
    'cr': 'CR',
    'community_leader': 'CL',
    'professor': 'PROF',
    'admin': 'ADM'
  }[role] || 'GEN'

  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  return `${prefix}-${timestamp}-${random}`
}

// Get default permissions for role
function getDefaultPermissions(role: string): string[] {
  const permissions = {
    'developer': [
      'read_all',
      'write_all',
      'delete_all',
      'manage_users',
      'manage_communities',
      'manage_access_codes',
      'view_analytics',
      'moderate_content',
      'system_admin'
    ],
    'cr': [
      'read_students',
      'manage_class_posts',
      'moderate_class_content',
      'view_class_analytics'
    ],
    'community_leader': [
      'read_community',
      'write_community',
      'moderate_community',
      'manage_community_members',
      'view_community_analytics'
    ],
    'professor': [
      'read_students',
      'write_announcements',
      'moderate_academic_content',
      'view_academic_analytics',
      'manage_course_content'
    ],
    'admin': [
      'read_all',
      'write_all',
      'moderate_content',
      'manage_users',
      'view_analytics'
    ]
  }

  return permissions[role] || ['read_basic']
}

// List access codes (for dev portal)
export async function GET(request: NextRequest) {
  try {
    // Verify developer access
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const role = url.searchParams.get('role')
    const university = url.searchParams.get('university')

    const db = await getDatabase()
    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES || 'access_codes')

    // Build query
    const query: any = {}
    if (role) query.role = role
    if (university) query.university = university

    // Get total count
    const total = await accessCodesCollection.countDocuments(query)

    // Get paginated results
    const accessCodes = await accessCodesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Remove sensitive data
    const sanitizedCodes = accessCodes.map(code => ({
      id: code._id,
      code: code.code.substring(0, 8) + '***', // Partially hide code
      role: code.role,
      university: code.university,
      description: code.description,
      isActive: code.isActive,
      createdAt: code.createdAt,
      expiresAt: code.expiresAt,
      usageCount: code.usageCount,
      lastUsedAt: code.lastUsedAt
    }))

    return NextResponse.json({
      success: true,
      accessCodes: sanitizedCodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Access codes list error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Deactivate access code
export async function DELETE(request: NextRequest) {
  try {
    const { accessCode } = await request.json()

    // Verify developer access
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES || 'access_codes')

    await accessCodesCollection.updateOne(
      { code: accessCode },
      { 
        $set: { 
          isActive: false,
          deactivatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Access code deactivated'
    })

  } catch (error) {
    console.error('Access code deactivation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
