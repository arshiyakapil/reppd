import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, COLLECTIONS } from '@/lib/mongodb'
import { z } from 'zod'

// Validation schemas
const CreateAccessCodeSchema = z.object({
  role: z.enum(['developer', 'cr', 'community_leader', 'professor', 'admin']),
  university: z.string().min(1, 'University is required'),
  description: z.string().optional(),
  expiresInDays: z.number().min(1).max(365).default(30),
  maxUsage: z.number().min(1).max(1000).default(100)
})

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

// GET /api/admin/access-codes - List all access codes
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/access-codes - Starting request')

    // Check if user has developer access
    const managementAccess = request.headers.get('x-management-access')
    console.log('🔐 Management access header:', managementAccess)

    if (!managementAccess) {
      console.log('❌ No management access header found')
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const role = url.searchParams.get('role')
    const university = url.searchParams.get('university')
    const isActive = url.searchParams.get('isActive')

    console.log('📊 Query params:', { page, limit, role, university, isActive })

    // Check if database connection is skipped
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      console.log('⚠️ Database connection skipped - returning mock data')
      const mockAccessCodes = [
        {
          id: '1',
          code: 'CR-1K2L3M4N5O',
          role: 'cr',
          university: 'SRM University Sonipat',
          description: 'CR access for SRM University Sonipat',
          isActive: true,
          createdAt: '2024-03-01',
          expiresAt: '2024-04-01',
          usageCount: 3,
          maxUsage: 100,
          lastUsedAt: '2024-03-15',
          createdBy: 'developer'
        },
        {
          id: '2',
          code: 'CL-9P8Q7R6S5T',
          role: 'community_leader',
          university: 'Delhi University',
          description: 'Community Leader access for Delhi University',
          isActive: true,
          createdAt: '2024-02-28',
          expiresAt: '2024-03-30',
          usageCount: 1,
          maxUsage: 100,
          lastUsedAt: '2024-03-10',
          createdBy: 'developer'
        }
      ]

      return NextResponse.json({
        success: true,
        accessCodes: mockAccessCodes,
        pagination: {
          page: 1,
          limit: 20,
          total: mockAccessCodes.length,
          totalPages: 1
        }
      })
    }

    console.log('🗄️ Connecting to database...')
    const db = await getDatabase()
    console.log('✅ Database connected successfully')

    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES)
    console.log('📋 Access codes collection ready')

    // Build query
    const query: any = {}
    if (role) query.role = role
    if (university) query.university = university
    if (isActive !== null) query.isActive = isActive === 'true'

    // Get total count
    const total = await accessCodesCollection.countDocuments(query)

    // Get paginated results
    const accessCodes = await accessCodesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Format response
    const formattedCodes = accessCodes.map(code => ({
      id: code._id.toString(),
      code: code.code,
      role: code.role,
      university: code.university,
      description: code.description,
      isActive: code.isActive,
      createdAt: code.createdAt,
      expiresAt: code.expiresAt,
      usageCount: code.usageCount,
      maxUsage: code.maxUsage,
      lastUsedAt: code.lastUsedAt,
      createdBy: code.createdBy
    }))

    return NextResponse.json({
      success: true,
      accessCodes: formattedCodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching access codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch access codes' },
      { status: 500 }
    )
  }
}

// POST /api/admin/access-codes - Create new access code
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/admin/access-codes - Starting request')

    // Check if user has developer access
    const managementAccess = request.headers.get('x-management-access')
    console.log('🔐 Management access header:', managementAccess)

    if (!managementAccess) {
      console.log('❌ No management access header found')
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 401 }
      )
    }

    console.log('📥 Reading request body...')
    const body = await request.json()
    console.log('📋 Request body:', body)

    console.log('✅ Validating request data...')
    const validatedData = CreateAccessCodeSchema.parse(body)
    console.log('✅ Data validation successful:', validatedData)

    // Generate unique access code
    const accessCode = generateAccessCode(validatedData.role)
    console.log('🔑 Generated access code:', accessCode)

    // Check if database connection is skipped
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      console.log('⚠️ Database connection skipped - returning mock success')

      const mockAccessCode = {
        id: Date.now().toString(),
        code: accessCode,
        role: validatedData.role,
        university: validatedData.university,
        description: validatedData.description || `${validatedData.role} access code`,
        isActive: true,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (validatedData.expiresInDays * 24 * 60 * 60 * 1000)).toISOString(),
        usageCount: 0,
        maxUsage: validatedData.maxUsage,
        lastUsedAt: null,
        createdBy: 'developer'
      }

      return NextResponse.json({
        success: true,
        accessCode: mockAccessCode,
        message: 'Access code generated successfully (mock mode)'
      })
    }

    console.log('🗄️ Connecting to database...')
    const db = await getDatabase()
    console.log('✅ Database connected successfully')

    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES)
    console.log('📋 Access codes collection ready')

    // Check if code already exists (very unlikely but possible)
    const existingCode = await accessCodesCollection.findOne({ code: accessCode })
    if (existingCode) {
      // Generate a new one
      const newAccessCode = generateAccessCode(validatedData.role)
      const newCodeData = {
        code: newAccessCode,
        role: validatedData.role,
        university: validatedData.university,
        description: validatedData.description || `${validatedData.role} access code`,
        isActive: true,
        createdAt: new Date(),
        createdBy: 'developer', // In real app, get from session
        expiresAt: new Date(Date.now() + (validatedData.expiresInDays * 24 * 60 * 60 * 1000)),
        usageCount: 0,
        maxUsage: validatedData.maxUsage,
        lastUsedAt: null
      }

      const result = await accessCodesCollection.insertOne(newCodeData)

      return NextResponse.json({
        success: true,
        accessCode: {
          id: result.insertedId.toString(),
          code: newAccessCode,
          role: validatedData.role,
          university: validatedData.university,
          expiresAt: newCodeData.expiresAt,
          maxUsage: validatedData.maxUsage
        },
        message: 'Access code generated successfully'
      })
    }

    const newCodeData = {
      code: accessCode,
      role: validatedData.role,
      university: validatedData.university,
      description: validatedData.description || `${validatedData.role} access code`,
      isActive: true,
      createdAt: new Date(),
      createdBy: 'developer', // In real app, get from session
      expiresAt: new Date(Date.now() + (validatedData.expiresInDays * 24 * 60 * 60 * 1000)),
      usageCount: 0,
      maxUsage: validatedData.maxUsage,
      lastUsedAt: null
    }

    const result = await accessCodesCollection.insertOne(newCodeData)

    return NextResponse.json({
      success: true,
      accessCode: {
        id: result.insertedId.toString(),
        code: accessCode,
        role: validatedData.role,
        university: validatedData.university,
        expiresAt: newCodeData.expiresAt,
        maxUsage: validatedData.maxUsage
      },
      message: 'Access code generated successfully'
    })

  } catch (error) {
    console.error('Error creating access code:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create access code' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/access-codes/[id] - Deactivate access code
export async function DELETE(request: NextRequest) {
  try {
    // Check if user has developer access
    const managementAccess = request.headers.get('x-management-access')
    if (!managementAccess) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const codeId = url.pathname.split('/').pop()

    if (!codeId) {
      return NextResponse.json(
        { error: 'Access code ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES)

    const result = await accessCodesCollection.updateOne(
      { _id: codeId },
      { 
        $set: { 
          isActive: false,
          deactivatedAt: new Date(),
          deactivatedBy: 'developer' // In real app, get from session
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Access code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Access code deactivated successfully'
    })

  } catch (error) {
    console.error('Error deactivating access code:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate access code' },
      { status: 500 }
    )
  }
}
