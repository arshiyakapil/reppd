#!/usr/bin/env node

/**
 * REPPD Access Code Generation Script
 * Generates access codes for CRs, Professors, and Community Leaders
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
  ACCESS_CODES: 'access_codes'
}

// Generate access code based on role
function generateAccessCode(role) {
  const prefix = {
    'cr': 'CR',
    'community_leader': 'CL',
    'professor': 'PROF',
    'admin': 'ADM',
    'developer': 'DEV'
  }[role] || 'GEN'

  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  
  return `${prefix}-${timestamp}-${random}`
}

// Get default permissions for role
function getDefaultPermissions(role) {
  const permissions = {
    'developer': [
      'read_all', 'write_all', 'delete_all', 'manage_users', 
      'manage_communities', 'manage_access_codes', 'view_analytics', 
      'moderate_content', 'system_admin'
    ],
    'cr': [
      'read_students', 'manage_class_posts', 'moderate_class_content', 
      'view_class_analytics', 'post_announcements'
    ],
    'community_leader': [
      'read_community', 'write_community', 'moderate_community', 
      'manage_community_members', 'view_community_analytics'
    ],
    'professor': [
      'read_students', 'write_announcements', 'moderate_academic_content', 
      'view_academic_analytics', 'manage_course_content'
    ],
    'admin': [
      'read_all', 'write_all', 'moderate_content', 'manage_users', 'view_analytics'
    ]
  }

  return permissions[role] || ['read_basic']
}

async function generateAccessCodes() {
  let client

  try {
    console.log('🔑 REPPD Access Code Generator\n')
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db(DB_NAME)
    const accessCodesCollection = db.collection(COLLECTIONS.ACCESS_CODES)

    // Create index for access codes
    await accessCodesCollection.createIndex({ code: 1 }, { unique: true })
    await accessCodesCollection.createIndex({ role: 1 })
    await accessCodesCollection.createIndex({ university: 1 })
    await accessCodesCollection.createIndex({ isActive: 1 })

    console.log('📊 Creating database indexes...')

    // Predefined access codes to generate
    const codesToGenerate = [
      // Class Representatives
      { role: 'cr', university: 'SRM University Sonipat', description: 'CSE Class Representative', count: 5 },
      { role: 'cr', university: 'Delhi University', description: 'CS Class Representative', count: 3 },
      { role: 'cr', university: 'JNU', description: 'IT Class Representative', count: 2 },
      
      // Professors
      { role: 'professor', university: 'SRM University Sonipat', description: 'Computer Science Professor', count: 8 },
      { role: 'professor', university: 'Delhi University', description: 'Engineering Professor', count: 5 },
      { role: 'professor', university: 'JNU', description: 'Technology Professor', count: 3 },
      
      // Community Leaders
      { role: 'community_leader', university: 'SRM University Sonipat', description: 'Club President/Secretary', count: 10 },
      { role: 'community_leader', university: 'Delhi University', description: 'Society Leader', count: 6 },
      { role: 'community_leader', university: 'JNU', description: 'Student Organization Leader', count: 4 },
      
      // Admins
      { role: 'admin', university: 'System Wide', description: 'University Administrator', count: 2 }
    ]

    const generatedCodes = []

    console.log('🔑 Generating access codes...\n')

    for (const codeGroup of codesToGenerate) {
      console.log(`📝 Creating ${codeGroup.count} ${codeGroup.role} codes for ${codeGroup.university}...`)
      
      for (let i = 0; i < codeGroup.count; i++) {
        const accessCode = generateAccessCode(codeGroup.role)
        
        const newAccessCode = {
          code: accessCode,
          role: codeGroup.role,
          university: codeGroup.university,
          permissions: getDefaultPermissions(codeGroup.role),
          description: `${codeGroup.description} #${i + 1}`,
          isActive: true,
          createdAt: new Date(),
          createdBy: 'system_generator',
          expiresAt: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)), // 1 year
          usageCount: 0,
          lastUsedAt: null,
          maxUses: codeGroup.role === 'developer' ? -1 : 1 // Unlimited for dev, single use for others
        }

        try {
          await accessCodesCollection.insertOne(newAccessCode)
          generatedCodes.push({
            code: accessCode,
            role: codeGroup.role,
            university: codeGroup.university,
            description: newAccessCode.description
          })
        } catch (error) {
          if (error.code === 11000) {
            console.log(`⚠️ Duplicate code generated, retrying...`)
            i-- // Retry this iteration
          } else {
            throw error
          }
        }
      }
    }

    console.log('\n🎉 Access code generation completed!\n')

    // Display generated codes by role
    const roleGroups = {}
    generatedCodes.forEach(code => {
      if (!roleGroups[code.role]) {
        roleGroups[code.role] = []
      }
      roleGroups[code.role].push(code)
    })

    console.log('📋 GENERATED ACCESS CODES:\n')
    console.log('=' * 80)

    Object.entries(roleGroups).forEach(([role, codes]) => {
      console.log(`\n👑 ${role.toUpperCase()} CODES (${codes.length} generated):`)
      console.log('-'.repeat(50))
      
      codes.forEach((code, index) => {
        console.log(`${index + 1}. ${code.code}`)
        console.log(`   University: ${code.university}`)
        console.log(`   Description: ${code.description}`)
        console.log('')
      })
    })

    console.log('=' * 80)
    console.log('\n📊 SUMMARY:')
    console.log(`✅ Total codes generated: ${generatedCodes.length}`)
    console.log(`👨‍🏫 CR codes: ${roleGroups.cr?.length || 0}`)
    console.log(`🎓 Professor codes: ${roleGroups.professor?.length || 0}`)
    console.log(`👥 Community Leader codes: ${roleGroups.community_leader?.length || 0}`)
    console.log(`🔧 Admin codes: ${roleGroups.admin?.length || 0}`)

    console.log('\n📝 NEXT STEPS:')
    console.log('1. 📧 Distribute codes to respective users')
    console.log('2. 📋 Keep a record of who gets which code')
    console.log('3. 🔍 Monitor usage in the developer portal')
    console.log('4. 🔄 Generate more codes as needed')

    console.log('\n🔗 DEVELOPER PORTAL ACCESS:')
    console.log('Management Code: 19022552')
    console.log('Use this code to access the developer portal and manage all access codes')

  } catch (error) {
    console.error('❌ Access code generation failed:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('\n🔌 Database connection closed')
    }
  }
}

// Run the generator
if (require.main === module) {
  generateAccessCodes()
}

module.exports = { generateAccessCodes }
