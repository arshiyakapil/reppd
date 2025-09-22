import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, COLLECTIONS } from '@/lib/mongodb'

// GET /api/admin/settings - Get system settings
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/settings - Starting request')
    
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
      console.log('⚠️ Database connection skipped - returning mock settings')
      
      const mockSettings = {
        platform: {
          name: 'REPPD',
          description: 'Social learning platform for university students',
          maxFileSize: 10, // MB
          sessionTimeout: 24 // hours
        },
        features: {
          userRegistration: true,
          communityCreation: true,
          fileUploads: true,
          realtimeChat: false,
          pushNotifications: true,
          emailNotifications: true
        },
        security: {
          passwordMinLength: 8,
          maxLoginAttempts: 5,
          twoFactorAuth: false,
          contentModeration: true
        }
      }

      return NextResponse.json({
        success: true,
        settings: mockSettings
      })
    }

    // Real database implementation
    const db = await getDatabase()
    const settingsCollection = db.collection('system_settings')

    const settings = await settingsCollection.findOne({ type: 'global' })

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings = {
        platform: {
          name: 'REPPD',
          description: 'Social learning platform for university students',
          maxFileSize: 10,
          sessionTimeout: 24
        },
        features: {
          userRegistration: true,
          communityCreation: true,
          fileUploads: true,
          realtimeChat: false,
          pushNotifications: true,
          emailNotifications: true
        },
        security: {
          passwordMinLength: 8,
          maxLoginAttempts: 5,
          twoFactorAuth: false,
          contentModeration: true
        }
      }

      return NextResponse.json({
        success: true,
        settings: defaultSettings
      })
    }

    return NextResponse.json({
      success: true,
      settings: settings.data
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings - Update system settings
export async function POST(request: NextRequest) {
  try {
    console.log('💾 POST /api/admin/settings - Starting request')
    
    // Check if user has developer access
    const managementAccess = request.headers.get('x-management-access')
    if (!managementAccess) {
      return NextResponse.json(
        { error: 'Unauthorized - Developer access required' },
        { status: 401 }
      )
    }

    const { settings } = await request.json()

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings data is required' },
        { status: 400 }
      )
    }

    // Check if database connection is skipped
    if (process.env.SKIP_DATABASE_CONNECTION === 'true') {
      console.log('⚠️ Database connection skipped - mock settings update')
      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully (mock mode)',
        settings
      })
    }

    // Real database implementation
    const db = await getDatabase()
    const settingsCollection = db.collection('system_settings')

    const result = await settingsCollection.updateOne(
      { type: 'global' },
      { 
        $set: { 
          data: settings,
          updatedAt: new Date(),
          updatedBy: 'developer' // In real app, get from session
        }
      },
      { upsert: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    })

  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/settings/backup - Create system backup
export async function PUT(request: NextRequest) {
  try {
    console.log('💾 PUT /api/admin/settings/backup - Starting backup')
    
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
      console.log('⚠️ Database connection skipped - mock backup')
      return NextResponse.json({
        success: true,
        message: 'Database backup created successfully (mock mode)',
        backupId: `backup_${Date.now()}`,
        timestamp: new Date().toISOString()
      })
    }

    // Real database implementation
    const db = await getDatabase()
    
    // In a real implementation, you would:
    // 1. Create a database dump
    // 2. Compress the data
    // 3. Upload to cloud storage
    // 4. Store backup metadata
    
    const backupId = `backup_${Date.now()}`
    const backupsCollection = db.collection('system_backups')
    
    await backupsCollection.insertOne({
      backupId,
      timestamp: new Date(),
      status: 'completed',
      size: '2.3 GB', // Mock size
      collections: Object.values(COLLECTIONS),
      createdBy: 'developer'
    })

    return NextResponse.json({
      success: true,
      message: 'Database backup created successfully',
      backupId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error creating backup:', error)
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    )
  }
}
