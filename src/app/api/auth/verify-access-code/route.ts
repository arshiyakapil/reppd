import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, COLLECTIONS } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// POST /api/auth/verify-access-code - Verify and use access code
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 POST /api/auth/verify-access-code - Starting verification')

    const { accessCode } = await request.json()
    console.log('🔑 Access code to verify:', accessCode ? `${accessCode.substring(0, 4)}****` : 'null')

    if (!accessCode) {
      console.log('❌ No access code provided')
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      )
    }

    // Check for master developer code first
    if (accessCode === '19022552') {
      console.log('✅ Master developer code verified')
      return NextResponse.json({
        success: true,
        role: 'developer',
        permissions: ['all'],
        university: 'All Universities',
        message: 'Master developer access granted',
        accessLevel: 'master'
      })
    }

    // Check if database connection is skipped
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      console.log('⚠️ Database connection skipped - checking mock codes')

      // Mock access codes for testing
      const mockCodes = {
        'CR-1K2L3M4N5O': { role: 'cr', university: 'SRM University Sonipat' },
        'CL-9P8Q7R6S5T': { role: 'community_leader', university: 'Delhi University' },
        'PROF-4U3V2W1X': { role: 'professor', university: 'JNU' }
      }

      const mockCode = mockCodes[accessCode as keyof typeof mockCodes]
      if (mockCode) {
        console.log('✅ Mock access code verified:', mockCode.role)
        return NextResponse.json({
          success: true,
          role: mockCode.role,
          permissions: getRolePermissions(mockCode.role),
          university: mockCode.university,
          message: 'Access granted (mock mode)',
          accessLevel: 'generated'
        })
      } else {
        console.log('❌ Invalid mock access code')
        return NextResponse.json(
          { error: 'Invalid or inactive access code' },
          { status: 401 }
        )
      }
    }

    console.log('🗄️ Connecting to database...')
    const db = await getDatabase()
    console.log('✅ Database connected successfully')

    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES)
    console.log('📋 Access codes collection ready')

    // Find the access code
    const codeRecord = await accessCodesCollection.findOne({
      code: accessCode,
      isActive: true
    })

    if (!codeRecord) {
      return NextResponse.json(
        { error: 'Invalid or inactive access code' },
        { status: 401 }
      )
    }

    // Check if code has expired
    if (codeRecord.expiresAt && new Date() > codeRecord.expiresAt) {
      return NextResponse.json(
        { error: 'Access code has expired' },
        { status: 401 }
      )
    }

    // Check if code has reached max usage
    if (codeRecord.maxUsage && codeRecord.usageCount >= codeRecord.maxUsage) {
      return NextResponse.json(
        { error: 'Access code usage limit exceeded' },
        { status: 401 }
      )
    }

    // Update usage statistics
    await accessCodesCollection.updateOne(
      { _id: codeRecord._id },
      { 
        $set: { lastUsedAt: new Date() },
        $inc: { usageCount: 1 }
      }
    )

    // Get role permissions
    const permissions = getRolePermissions(codeRecord.role)

    return NextResponse.json({
      success: true,
      role: codeRecord.role,
      permissions,
      university: codeRecord.university,
      message: 'Access granted',
      accessLevel: 'generated',
      expiresAt: codeRecord.expiresAt,
      usageCount: codeRecord.usageCount + 1,
      maxUsage: codeRecord.maxUsage
    })

  } catch (error) {
    console.error('Access code verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get permissions for each role
function getRolePermissions(role: string): string[] {
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
      'view_class_analytics',
      'manage_assignments',
      'upload_notes',
      'send_announcements'
    ],
    'community_leader': [
      'read_community',
      'write_community',
      'moderate_community',
      'manage_community_members',
      'view_community_analytics',
      'create_events',
      'manage_applications'
    ],
    'professor': [
      'read_students',
      'write_announcements',
      'moderate_academic_content',
      'view_academic_analytics',
      'manage_course_content',
      'grade_assignments',
      'verify_students'
    ],
    'admin': [
      'read_all',
      'write_all',
      'moderate_content',
      'manage_users',
      'view_analytics',
      'manage_communities'
    ]
  }

  return permissions[role] || ['read_basic']
}
