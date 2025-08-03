#!/usr/bin/env node

/**
 * REPPD Placeholder Data Cleanup Script
 * Removes all mock/demo data and prepares for real user onboarding
 */

const { MongoClient } = require('mongodb')
require('dotenv').config()

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI
const DB_NAME = process.env.MONGODB_DB_NAME || 'reppd'

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables')
  process.exit(1)
}

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMUNITIES: 'communities',
  REQUESTS: 'requests',
  NOTICES: 'notices',
  REPORTS: 'reports',
  UNIVERSITIES: 'universities'
}

async function cleanupPlaceholderData() {
  let client

  try {
    console.log('🧹 Starting placeholder data cleanup...')
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db(DB_NAME)

    // 1. Remove demo/sample users (keep some real sample users)
    console.log('👤 Removing demo users...')
    const demoUserResult = await db.collection(COLLECTIONS.USERS).deleteMany({
      $or: [
        { email: { $regex: /@example\.com$/ } },
        { email: { $regex: /@demo\./ } },
        { email: { $regex: /@test\./ } },
        { universityId: { $in: ['10324210280', '12345678', '123456789'] } }, // Keep 10324210279 as sample
        { name: { $in: ['Dev Student', 'Test User', 'Sample User'] } } // Keep some real names
      ]
    })
    console.log(`✅ Removed ${demoUserResult.deletedCount} demo users`)

    // 2. Keep 5 sample posts, remove excessive mock data
    console.log('📝 Cleaning sample posts (keeping 5 good examples)...')

    // First, mark good sample posts to keep
    const goodPosts = await db.collection(COLLECTIONS.POSTS).find({
      $and: [
        { content: { $not: { $regex: /mock|demo|test/i } } },
        { content: { $regex: /study|workshop|event|announcement|help/i } }
      ]
    }).limit(5).toArray()

    const keepPostIds = goodPosts.map(post => post._id)

    // Remove other sample posts
    const samplePostResult = await db.collection(COLLECTIONS.POSTS).deleteMany({
      $and: [
        { _id: { $nin: keepPostIds } },
        { $or: [
          { author: { $regex: /demo|test|sample/i } },
          { content: { $regex: /mock|demo|test/i } }
        ]}
      ]
    })
    console.log(`✅ Removed ${samplePostResult.deletedCount} sample posts, kept ${goodPosts.length} examples`)

    // 3. Remove demo requests
    console.log('🚗 Removing demo requests...')
    const demoRequestResult = await db.collection(COLLECTIONS.REQUESTS).deleteMany({
      $or: [
        { author: { $regex: /demo|test|sample/i } },
        { title: { $regex: /mock|demo|test|sample/i } }
      ]
    })
    console.log(`✅ Removed ${demoRequestResult.deletedCount} demo requests`)

    // 4. Keep universities but update stats to 0
    console.log('🏫 Resetting university statistics...')
    await db.collection(COLLECTIONS.UNIVERSITIES).updateMany(
      {},
      {
        $set: {
          'stats.totalStudents': 0,
          'stats.totalCommunities': 0,
          updatedAt: new Date()
        }
      }
    )
    console.log('✅ University statistics reset')

    // 5. Reset community member counts
    console.log('👥 Resetting community member counts...')
    await db.collection(COLLECTIONS.COMMUNITIES).updateMany(
      {},
      {
        $set: {
          memberCount: 0,
          'stats.totalPosts': 0,
          'stats.totalEvents': 0,
          'stats.totalProjects': 0,
          updatedAt: new Date()
        }
      }
    )
    console.log('✅ Community statistics reset')

    // 6. Remove old notices (keep template structure)
    console.log('📢 Removing old notices...')
    const oldNoticeResult = await db.collection(COLLECTIONS.NOTICES).deleteMany({
      createdAt: { $lt: new Date() }
    })
    console.log(`✅ Removed ${oldNoticeResult.deletedCount} old notices`)

    // 7. Create initial admin user (optional)
    console.log('👑 Creating initial admin user...')
    const adminUser = {
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: 'admin@reppd.com',
      universityId: 'ADMIN001',
      university: 'System Administrator',
      stream: 'Administration',
      year: 0,
      section: null,
      password: '$2a$12$LQv3c1yqBwEHFl5ePEJ16.VQOjqLiq2rNwdHb/pTB4KBUl1gE.3Lm', // 'admin123'
      role: 'admin',
      isVerified: true,
      isActive: true,
      emailVerified: true,
      idVerified: true,
      permissions: ['read_all', 'write_all', 'delete_all', 'manage_users', 'system_admin'],
      privacy: {
        profileVisibility: 'private',
        showEmail: false,
        showPhone: false,
        allowMessages: false
      },
      stats: {
        totalPosts: 0,
        totalComments: 0,
        totalLikes: 0,
        followers: 0,
        following: 0,
        communitiesJoined: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null
    }

    // Check if admin already exists
    const existingAdmin = await db.collection(COLLECTIONS.USERS).findOne({ 
      email: 'admin@reppd.com' 
    })

    if (!existingAdmin) {
      await db.collection(COLLECTIONS.USERS).insertOne(adminUser)
      console.log('✅ Admin user created (email: admin@reppd.com, password: admin123)')
    } else {
      console.log('ℹ️ Admin user already exists')
    }

    // 8. Create indexes for performance
    console.log('📊 Creating database indexes...')
    
    // User indexes
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })
    await db.collection(COLLECTIONS.USERS).createIndex({ universityId: 1 }, { unique: true })
    await db.collection(COLLECTIONS.USERS).createIndex({ university: 1 })
    await db.collection(COLLECTIONS.USERS).createIndex({ isActive: 1 })
    await db.collection(COLLECTIONS.USERS).createIndex({ isVerified: 1 })
    
    // Post indexes
    await db.collection(COLLECTIONS.POSTS).createIndex({ createdAt: -1 })
    await db.collection(COLLECTIONS.POSTS).createIndex({ author: 1 })
    await db.collection(COLLECTIONS.POSTS).createIndex({ university: 1 })
    
    // Community indexes
    await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ university: 1 })
    await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ category: 1 })
    await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ isActive: 1 })
    
    // Request indexes
    await db.collection(COLLECTIONS.REQUESTS).createIndex({ type: 1 })
    await db.collection(COLLECTIONS.REQUESTS).createIndex({ university: 1 })
    await db.collection(COLLECTIONS.REQUESTS).createIndex({ isActive: 1 })
    
    console.log('✅ Database indexes created')

    console.log('🎉 Placeholder data cleanup completed successfully!')
    console.log(`
📊 Cleanup Summary:
- Demo Users Removed: ${demoUserResult.deletedCount}
- Sample Posts Removed: ${samplePostResult.deletedCount}
- Demo Requests Removed: ${demoRequestResult.deletedCount}
- Old Notices Removed: ${oldNoticeResult.deletedCount}
- University Stats Reset: ✅
- Community Stats Reset: ✅
- Admin User Created: ✅
- Database Indexes: ✅

🚀 Platform is now ready for real user onboarding!

📝 Next Steps:
1. Update environment variables for production
2. Configure email service (Resend/SendGrid)
3. Set up Cloudinary for image uploads
4. Configure university ID verification
5. Start user registration process

🔑 Admin Access:
- Email: admin@reppd.com
- Password: admin123
- Management Code: 19022552
    `)

  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the cleanup script
if (require.main === module) {
  cleanupPlaceholderData()
}

module.exports = { cleanupPlaceholderData }
