import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/init-database'

// POST /api/admin/init-database - Initialize database with collections and initial data
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/admin/init-database - Starting database initialization')
    
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

    console.log('🗄️ Initializing database...')
    const result = await initializeDatabase()
    
    if (result.success) {
      console.log('✅ Database initialization successful')
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully',
        timestamp: new Date().toISOString()
      })
    } else {
      console.error('❌ Database initialization failed:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error || 'Database initialization failed'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Database initialization error:', error)
    return NextResponse.json(
      { error: 'Internal server error during database initialization' },
      { status: 500 }
    )
  }
}

// GET /api/admin/init-database - Check database status
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/init-database - Checking database status')
    
    // Check if user has developer access
    const managementAccess = request.headers.get('x-management-access')
    
    if (!managementAccess) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 401 }
      )
    }

    // Check if database connection is skipped
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      return NextResponse.json({
        success: true,
        status: 'mock_mode',
        message: 'Database connection is skipped - running in mock mode',
        skipConnection: true
      })
    }

    // Try to connect to database and check status
    try {
      const { getDatabase, COLLECTIONS } = await import('@/lib/mongodb')
      const db = await getDatabase()
      
      // Check if collections exist
      const collections = await db.listCollections().toArray()
      const existingCollectionNames = collections.map(c => c.name)
      
      const requiredCollections = Object.values(COLLECTIONS)
      const missingCollections = requiredCollections.filter(
        name => !existingCollectionNames.includes(name)
      )
      
      const isInitialized = missingCollections.length === 0
      
      return NextResponse.json({
        success: true,
        status: isInitialized ? 'initialized' : 'needs_initialization',
        message: isInitialized 
          ? 'Database is properly initialized' 
          : 'Database needs initialization',
        collections: {
          existing: existingCollectionNames,
          missing: missingCollections,
          required: requiredCollections
        },
        skipConnection: false
      })
      
    } catch (dbError) {
      console.error('Database connection error:', dbError)
      return NextResponse.json({
        success: false,
        status: 'connection_error',
        error: 'Failed to connect to database',
        message: 'Please check your MongoDB connection string and ensure the database is running'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Database status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error during database status check' },
      { status: 500 }
    )
  }
}
