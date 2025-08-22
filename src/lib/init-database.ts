import { getDatabase, COLLECTIONS } from './mongodb'

// Initialize database with required collections and indexes
export async function initializeDatabase() {
  try {
    console.log('🗄️ Initializing database...')
    
    const db = await getDatabase()
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const existingCollectionNames = collections.map(c => c.name)
    
    for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
      if (!existingCollectionNames.includes(collectionName)) {
        await db.createCollection(collectionName)
        console.log(`✅ Created collection: ${collectionName}`)
      }
    }
    
    // Create indexes for better performance
    await createIndexes(db)
    
    // Insert initial data if collections are empty
    await insertInitialData(db)
    
    console.log('✅ Database initialization complete')
    return { success: true }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return { success: false, error: error.message }
  }
}

async function createIndexes(db: any) {
  console.log('📊 Creating database indexes...')
  
  // Users collection indexes
  await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })
  await db.collection(COLLECTIONS.USERS).createIndex({ university: 1 })
  await db.collection(COLLECTIONS.USERS).createIndex({ createdAt: -1 })
  
  // Access codes collection indexes
  await db.collection(COLLECTIONS.ACCESS_CODES).createIndex({ code: 1 }, { unique: true })
  await db.collection(COLLECTIONS.ACCESS_CODES).createIndex({ role: 1 })
  await db.collection(COLLECTIONS.ACCESS_CODES).createIndex({ isActive: 1 })
  await db.collection(COLLECTIONS.ACCESS_CODES).createIndex({ expiresAt: 1 })
  
  // Posts collection indexes
  await db.collection(COLLECTIONS.POSTS).createIndex({ createdAt: -1 })
  await db.collection(COLLECTIONS.POSTS).createIndex({ authorId: 1 })
  await db.collection(COLLECTIONS.POSTS).createIndex({ university: 1 })
  
  // Communities collection indexes
  await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ name: 1 })
  await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ category: 1 })
  await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ university: 1 })
  
  console.log('✅ Database indexes created')
}

async function insertInitialData(db: any) {
  console.log('📝 Inserting initial data...')
  
  // Check if access codes collection is empty
  const accessCodesCount = await db.collection(COLLECTIONS.ACCESS_CODES).countDocuments()
  if (accessCodesCount === 0) {
    const initialAccessCodes = [
      {
        code: 'CR-DEMO-2024',
        role: 'cr',
        university: 'SRM University Sonipat',
        description: 'Demo CR access code',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        expiresAt: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year
        usageCount: 0,
        maxUsage: 50,
        lastUsedAt: null
      },
      {
        code: 'CL-DEMO-2024',
        role: 'community_leader',
        university: 'Delhi University',
        description: 'Demo Community Leader access code',
        isActive: true,
        createdAt: new Date(),
        createdBy: 'system',
        expiresAt: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year
        usageCount: 0,
        maxUsage: 50,
        lastUsedAt: null
      }
    ]
    
    await db.collection(COLLECTIONS.ACCESS_CODES).insertMany(initialAccessCodes)
    console.log('✅ Initial access codes inserted')
  }
  
  // Check if universities collection is empty
  const universitiesCount = await db.collection(COLLECTIONS.UNIVERSITIES).countDocuments()
  if (universitiesCount === 0) {
    const initialUniversities = [
      {
        name: 'SRM University Sonipat',
        code: 'SRMS',
        location: 'Sonipat, Haryana',
        type: 'Private',
        established: 2013,
        website: 'https://srmuniversity.ac.in',
        isActive: true,
        createdAt: new Date()
      },
      {
        name: 'Delhi University',
        code: 'DU',
        location: 'Delhi',
        type: 'Public',
        established: 1922,
        website: 'https://du.ac.in',
        isActive: true,
        createdAt: new Date()
      },
      {
        name: 'Jawaharlal Nehru University',
        code: 'JNU',
        location: 'New Delhi',
        type: 'Public',
        established: 1969,
        website: 'https://jnu.ac.in',
        isActive: true,
        createdAt: new Date()
      },
      {
        name: 'Indian Institute of Technology Delhi',
        code: 'IITD',
        location: 'New Delhi',
        type: 'Public',
        established: 1961,
        website: 'https://iitd.ac.in',
        isActive: true,
        createdAt: new Date()
      }
    ]
    
    await db.collection(COLLECTIONS.UNIVERSITIES).insertMany(initialUniversities)
    console.log('✅ Initial universities inserted')
  }
  
  // Check if communities collection is empty
  const communitiesCount = await db.collection(COLLECTIONS.COMMUNITIES).countDocuments()
  if (communitiesCount === 0) {
    const initialCommunities = [
      {
        name: 'SRM Tech Innovators',
        description: 'Student-led community focused on emerging technologies, hackathons, and innovation projects.',
        category: 'Technology',
        university: 'SRM University Sonipat',
        icon: '💻',
        memberCount: 234,
        isActive: true,
        established: '2023',
        meetingSchedule: 'Every Friday 6 PM',
        location: 'CS Lab 301',
        leaderId: null, // Will be set when leaders join
        createdAt: new Date(),
        requirements: {
          minYear: 1,
          maxYear: 4,
          departments: ['Computer Science', 'Information Technology', 'Electronics'],
          skills: ['Programming', 'Problem Solving']
        }
      },
      {
        name: 'DU Creative Arts Society',
        description: 'Explore and showcase your artistic talents through various creative mediums and collaborative projects.',
        category: 'Arts & Culture',
        university: 'Delhi University',
        icon: '🎨',
        memberCount: 156,
        isActive: true,
        established: '2022',
        meetingSchedule: 'Every Tuesday 4 PM',
        location: 'Arts Building Room 205',
        leaderId: null,
        createdAt: new Date(),
        requirements: {
          minYear: 1,
          maxYear: 4,
          departments: ['Fine Arts', 'English', 'History', 'Philosophy'],
          skills: ['Creativity', 'Artistic Expression']
        }
      }
    ]
    
    await db.collection(COLLECTIONS.COMMUNITIES).insertMany(initialCommunities)
    console.log('✅ Initial communities inserted')
  }
  
  console.log('✅ Initial data insertion complete')
}

// API endpoint to initialize database
export async function GET() {
  const result = await initializeDatabase()
  
  if (result.success) {
    return Response.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    })
  } else {
    return Response.json({ 
      success: false, 
      error: result.error 
    }, { status: 500 })
  }
}
