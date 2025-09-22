import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, COLLECTIONS } from '@/lib/mongodb'

// GET /api/admin/users - List all users with filtering
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/users - Starting request')
    
    // Check if user has developer access
    const managementAccess = request.headers.get('x-management-access')
    if (!managementAccess) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search')
    const university = url.searchParams.get('university')
    const verified = url.searchParams.get('verified')

    // Check if database connection is skipped
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      console.log('⚠️ Database connection skipped - returning mock data')
      
      const mockUsers = [
        {
          id: '1',
          name: 'Arshiya Kapil',
          email: 'arshiya.kapil@srm.edu.in',
          university: 'SRM University Sonipat',
          department: 'Computer Science',
          year: '3',
          verified: true,
          role: 'student',
          createdAt: '2024-03-01',
          lastActive: '2024-03-15',
          postsCount: 23,
          communitiesCount: 3
        },
        {
          id: '2',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@du.ac.in',
          university: 'Delhi University',
          department: 'Information Technology',
          year: '2',
          verified: false,
          role: 'student',
          createdAt: '2024-02-28',
          lastActive: '2024-03-14',
          postsCount: 12,
          communitiesCount: 1
        },
        {
          id: '3',
          name: 'Dr. Priya Singh',
          email: 'priya.singh@jnu.ac.in',
          university: 'JNU',
          department: 'Computer Science',
          year: 'Faculty',
          verified: true,
          role: 'professor',
          createdAt: '2024-02-20',
          lastActive: '2024-03-15',
          postsCount: 45,
          communitiesCount: 2
        }
      ]

      // Apply filters
      let filteredUsers = mockUsers
      if (search) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        )
      }
      if (university) {
        filteredUsers = filteredUsers.filter(user => user.university === university)
      }
      if (verified !== null) {
        filteredUsers = filteredUsers.filter(user => user.verified === (verified === 'true'))
      }

      return NextResponse.json({
        success: true,
        users: filteredUsers,
        pagination: {
          page,
          limit,
          total: filteredUsers.length,
          totalPages: Math.ceil(filteredUsers.length / limit)
        }
      })
    }

    // Real database implementation
    const db = await getDatabase()
    const usersCollection = db.collection(COLLECTIONS.USERS)

    // Build query
    const query: any = {}
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    if (university) query.university = university
    if (verified !== null) query.verified = verified === 'true'

    // Get total count
    const total = await usersCollection.countDocuments(query)

    // Get paginated results
    const users = await usersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Format response
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      university: user.university,
      department: user.department,
      year: user.year,
      verified: user.verified,
      role: user.role,
      createdAt: user.createdAt,
      lastActive: user.lastActive,
      postsCount: user.postsCount || 0,
      communitiesCount: user.communitiesCount || 0
    }))

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE /api/admin/users - Starting request')
    
    // Check if user has developer access
    const managementAccess = request.headers.get('x-management-access')
    if (!managementAccess) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 401 }
      )
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if database connection is skipped
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      console.log('⚠️ Database connection skipped - mock deletion')
      return NextResponse.json({
        success: true,
        message: `User ${userId} deleted successfully (mock mode)`
      })
    }

    // Real database implementation
    const db = await getDatabase()
    const usersCollection = db.collection(COLLECTIONS.USERS)

    const result = await usersCollection.deleteOne({ _id: userId })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
