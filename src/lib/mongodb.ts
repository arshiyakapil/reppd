import { MongoClient, Db, ObjectId } from 'mongodb'
import { z } from 'zod'

// Environment validation - allow development without MongoDB
const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_LOCAL_URI || 'mongodb://localhost:27017'

// In development, we can work without MongoDB for UI testing
if (!mongoUri && process.env.NODE_ENV === 'production') {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI" or "MONGODB_LOCAL_URI"')
}

const uri = mongoUri
const dbName = process.env.MONGODB_DB_NAME || 'reppd'

// Production-optimized connection options
const options = {
  maxPoolSize: process.env.NODE_ENV === 'production' ? 20 : 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority' as const,
  // Additional production settings
  maxIdleTimeMS: 30000,
  minPoolSize: process.env.NODE_ENV === 'production' ? 5 : 0,
  connectTimeoutMS: 10000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Database helper functions
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

// Collection names (centralized)
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMUNITIES: 'communities',
  REQUESTS: 'requests',
  NOTICES: 'notices',
  REPORTS: 'reports',
  FEATURE_FLAGS: 'feature_flags',
  ANALYTICS: 'analytics',
  UNIVERSITIES: 'universities',
  ID_VERIFICATIONS: 'id_verifications',
  OCR_DATA: 'ocr_data',
  // Missing collections that need to be added:
  ACCESS_CODES: 'access_codes',
  ASSIGNMENTS: 'assignments',
  SUBMISSIONS: 'submissions',
  NOTES: 'notes',
  ANNOUNCEMENTS: 'announcements',
  NOTIFICATIONS: 'notifications',
  CHAT_ROOMS: 'chat_rooms',
  MESSAGES: 'messages',
  EVENTS: 'events',
  ATTENDANCE: 'attendance',
  COMMENTS: 'comments',
  LIKES: 'likes',
  SHARES: 'shares',
  FILES: 'files',
  SESSIONS: 'sessions',
  AUDIT_LOGS: 'audit_logs'
} as const

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await clientPromise
    await client.db(dbName).admin().ping()
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}



// User interface for MongoDB
export interface MongoUser {
  _id?: string
  name: string
  email?: string
  university: string
  section?: string
  year: number
  stream?: string
  gender?: string
  universityId: string
  password: string
  interests: string[]
  isVerified: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// OCR Data interface
export interface OCRData {
  _id?: string
  userId?: string
  sessionId: string
  frontImageUrl: string
  backImageUrl: string
  extractedData: {
    name: string
    universityId: string
    year: number
    stream: string
    section?: string
    university: string
  }
  confidence: number
  isVerified: boolean
  createdAt: Date
}

// Helper functions for database operations
export async function createUser(userData: Omit<MongoUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoUser> {
  const db = await getDatabase()
  const users = db.collection<MongoUser>(COLLECTIONS.USERS)
  
  const user: MongoUser = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  const result = await users.insertOne(user)
  return { ...user, _id: result.insertedId.toString() }
}

export async function findUserByUniversityId(universityId: string): Promise<MongoUser | null> {
  const db = await getDatabase()
  const users = db.collection<MongoUser>(COLLECTIONS.USERS)
  return await users.findOne({ universityId })
}

export async function saveOCRData(ocrData: Omit<OCRData, '_id' | 'createdAt'>): Promise<OCRData> {
  const db = await getDatabase()
  const ocrCollection = db.collection<OCRData>(COLLECTIONS.OCR_DATA)
  
  const data: OCRData = {
    ...ocrData,
    createdAt: new Date()
  }
  
  const result = await ocrCollection.insertOne(data)
  return { ...data, _id: result.insertedId.toString() }
}

export async function findOCRDataBySessionId(sessionId: string): Promise<OCRData | null> {
  const db = await getDatabase()
  const ocrCollection = db.collection<OCRData>(COLLECTIONS.OCR_DATA)
  return await ocrCollection.findOne({ sessionId })
}
