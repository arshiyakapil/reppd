#!/usr/bin/env node

/**
 * REPPD Database Seeding Script
 * Populates the database with initial data for production deployment
 */

const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')
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
  UNIVERSITIES: 'universities',
  COMMUNITIES: 'communities',
  USERS: 'users',
  NOTICES: 'notices',
  POSTS: 'posts',
  REQUESTS: 'requests'
}

// Seed data
const universities = [
  {
    name: 'SRM University Sonipat',
    shortName: 'SRM Sonipat',
    location: 'Sonipat, Haryana',
    website: 'https://www.srmuniversity.ac.in',
    logo: 'https://res.cloudinary.com/reppd/image/upload/v1/universities/srm-sonipat-logo.png',
    established: 2013,
    type: 'Private',
    courses: [
      'Computer Science Engineering',
      'Information Technology',
      'Electronics and Communication Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Business Administration',
      'Commerce',
      'Law'
    ],
    stats: {
      totalStudents: 2500,
      totalFaculty: 200,
      totalCommunities: 25
    },
    settings: {
      allowPublicPosts: true,
      requireVerification: true,
      autoApproveStudents: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Delhi University',
    shortName: 'DU',
    location: 'New Delhi, Delhi',
    website: 'https://www.du.ac.in',
    logo: 'https://res.cloudinary.com/reppd/image/upload/v1/universities/du-logo.png',
    established: 1922,
    type: 'Public',
    courses: [
      'English Literature',
      'Economics',
      'Political Science',
      'Psychology',
      'Commerce',
      'Mathematics',
      'Physics',
      'Chemistry'
    ],
    stats: {
      totalStudents: 5000,
      totalFaculty: 400,
      totalCommunities: 45
    },
    settings: {
      allowPublicPosts: true,
      requireVerification: true,
      autoApproveStudents: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Jawaharlal Nehru University',
    shortName: 'JNU',
    location: 'New Delhi, Delhi',
    website: 'https://www.jnu.ac.in',
    logo: 'https://res.cloudinary.com/reppd/image/upload/v1/universities/jnu-logo.png',
    established: 1969,
    type: 'Public',
    courses: [
      'International Relations',
      'Economics',
      'History',
      'Political Science',
      'Languages',
      'Social Sciences',
      'Life Sciences',
      'Physical Sciences'
    ],
    stats: {
      totalStudents: 3000,
      totalFaculty: 300,
      totalCommunities: 30
    },
    settings: {
      allowPublicPosts: true,
      requireVerification: true,
      autoApproveStudents: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Sample users for demonstration
const sampleUsers = [
  {
    firstName: 'Arshiya',
    lastName: 'Kapil',
    name: 'Arshiya Kapil',
    email: 'arshiya.kapil@example.com',
    phone: '+91-9876543210',
    university: 'SRM University Sonipat',
    universityId: '10324210279',
    stream: 'Computer Science Engineering',
    year: 3,
    section: 'A',
    password: '$2a$12$LQv3c1yqBwEHFl5ePEJ16.VQOjqLiq2rNwdHb/pTB4KBUl1gE.3Lm', // hashed 'password123'
    bio: 'Passionate about full-stack development and open source. Love building innovative solutions!',
    interests: ['Programming', 'Web Development', 'AI/ML', 'Photography', 'Music'],
    profilePicture: 'https://res.cloudinary.com/reppd/image/upload/v1/profiles/arshiya-kapil.jpg',
    isVerified: true,
    isActive: true,
    emailVerified: true,
    idVerified: true,
    role: 'student',
    permissions: ['read', 'write'],
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    stats: {
      totalPosts: 23,
      totalComments: 45,
      totalLikes: 156,
      followers: 89,
      following: 67,
      communitiesJoined: 5
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/arshiya-kapil',
      github: 'https://github.com/arshiyakapil',
      instagram: null,
      twitter: null
    },
    betaGroup: 'alpha',
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    firstName: 'Rahul',
    lastName: 'Sharma',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91-9876543211',
    university: 'SRM University Sonipat',
    universityId: '10324210280',
    stream: 'Information Technology',
    year: 2,
    section: 'B',
    password: '$2a$12$LQv3c1yqBwEHFl5ePEJ16.VQOjqLiq2rNwdHb/pTB4KBUl1gE.3Lm',
    bio: 'Tech enthusiast and basketball player. Always ready for a coding challenge!',
    interests: ['Programming', 'Basketball', 'Gaming', 'Fitness'],
    profilePicture: 'https://res.cloudinary.com/reppd/image/upload/v1/profiles/rahul-sharma.jpg',
    isVerified: true,
    isActive: true,
    emailVerified: true,
    idVerified: true,
    role: 'student',
    permissions: ['read', 'write'],
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    stats: {
      totalPosts: 15,
      totalComments: 32,
      totalLikes: 98,
      followers: 56,
      following: 43,
      communitiesJoined: 3
    },
    socialLinks: {
      linkedin: null,
      github: 'https://github.com/rahulsharma',
      instagram: 'https://instagram.com/rahul_sharma_',
      twitter: null
    },
    betaGroup: 'beta',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    firstName: 'Priya',
    lastName: 'Singh',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91-9876543212',
    university: 'Delhi University',
    universityId: '12345678',
    stream: 'English Literature',
    year: 3,
    section: null,
    password: '$2a$12$LQv3c1yqBwEHFl5ePEJ16.VQOjqLiq2rNwdHb/pTB4KBUl1gE.3Lm',
    bio: 'Literature lover, poet, and aspiring writer. Words are my passion!',
    interests: ['Literature', 'Poetry', 'Writing', 'Reading', 'Theatre'],
    profilePicture: 'https://res.cloudinary.com/reppd/image/upload/v1/profiles/priya-singh.jpg',
    isVerified: true,
    isActive: true,
    emailVerified: true,
    idVerified: true,
    role: 'student',
    permissions: ['read', 'write'],
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    stats: {
      totalPosts: 31,
      totalComments: 67,
      totalLikes: 234,
      followers: 123,
      following: 89,
      communitiesJoined: 4
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/priya-singh-writer',
      github: null,
      instagram: 'https://instagram.com/priya_writes',
      twitter: 'https://twitter.com/priya_singh_poet'
    },
    betaGroup: 'early_access',
    createdAt: new Date('2023-09-20'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  },
  {
    firstName: 'Amit',
    lastName: 'Kumar',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91-9876543213',
    university: 'Jawaharlal Nehru University',
    universityId: '123456789',
    stream: 'International Relations',
    year: 4,
    section: null,
    password: '$2a$12$LQv3c1yqBwEHFl5ePEJ16.VQOjqLiq2rNwdHb/pTB4KBUl1gE.3Lm',
    bio: 'Future diplomat interested in global affairs and policy making.',
    interests: ['International Relations', 'Politics', 'Debate', 'Travel', 'Languages'],
    profilePicture: 'https://res.cloudinary.com/reppd/image/upload/v1/profiles/amit-kumar.jpg',
    isVerified: true,
    isActive: true,
    emailVerified: true,
    idVerified: true,
    role: 'student',
    permissions: ['read', 'write'],
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessages: true
    },
    stats: {
      totalPosts: 18,
      totalComments: 41,
      totalLikes: 87,
      followers: 67,
      following: 54,
      communitiesJoined: 2
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/amit-kumar-ir',
      github: null,
      instagram: null,
      twitter: 'https://twitter.com/amit_kumar_ir'
    },
    betaGroup: 'general',
    createdAt: new Date('2023-08-25'),
    updatedAt: new Date(),
    lastLoginAt: new Date()
  }
]

// Campus notices and events
const notices = [
  {
    title: '🎓 Annual Convocation 2024',
    content: 'The Annual Convocation ceremony will be held on April 15, 2024, at the Main Auditorium. All graduating students are required to attend.',
    type: 'announcement',
    priority: 'high',
    university: 'SRM University Sonipat',
    author: {
      name: 'Dean of Students',
      role: 'administration'
    },
    tags: ['convocation', 'graduation', 'ceremony', 'important'],
    isActive: true,
    isPinned: true,
    expiryDate: new Date('2024-04-15'),
    attachments: [
      {
        name: 'Convocation Guidelines.pdf',
        url: 'https://res.cloudinary.com/reppd/raw/upload/v1/notices/convocation-guidelines.pdf',
        type: 'pdf'
      }
    ],
    stats: {
      views: 1245,
      likes: 89,
      comments: 23
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  },
  {
    title: '🚀 Tech Fest 2024 - Innovation Unleashed',
    content: 'Join us for the biggest tech fest of the year! Hackathons, workshops, competitions, and more. Registration opens March 1st.',
    type: 'event',
    priority: 'medium',
    university: 'SRM University Sonipat',
    author: {
      name: 'Technical Society',
      role: 'student_organization'
    },
    tags: ['techfest', 'hackathon', 'competition', 'technology', 'innovation'],
    isActive: true,
    isPinned: false,
    expiryDate: new Date('2024-03-30'),
    eventDetails: {
      startDate: new Date('2024-03-25'),
      endDate: new Date('2024-03-27'),
      venue: 'Campus Grounds',
      registrationLink: 'https://techfest.srm.edu/register'
    },
    stats: {
      views: 2156,
      likes: 234,
      comments: 67
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date()
  },
  {
    title: '📚 Library Extended Hours During Exams',
    content: 'The central library will remain open 24/7 during the examination period (March 10-25). Additional study spaces available.',
    type: 'announcement',
    priority: 'medium',
    university: 'Delhi University',
    author: {
      name: 'Library Administration',
      role: 'administration'
    },
    tags: ['library', 'exams', 'study', 'extended hours'],
    isActive: true,
    isPinned: false,
    expiryDate: new Date('2024-03-25'),
    stats: {
      views: 987,
      likes: 156,
      comments: 34
    },
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date()
  },
  {
    title: '🎨 Cultural Week 2024 - Celebrating Diversity',
    content: 'Experience the rich cultural heritage through performances, exhibitions, and workshops. All students welcome to participate!',
    type: 'event',
    priority: 'medium',
    university: 'Jawaharlal Nehru University',
    author: {
      name: 'Cultural Committee',
      role: 'student_organization'
    },
    tags: ['culture', 'diversity', 'performance', 'art', 'heritage'],
    isActive: true,
    isPinned: false,
    expiryDate: new Date('2024-04-05'),
    eventDetails: {
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-05'),
      venue: 'Various Campus Locations',
      registrationLink: 'https://jnu.edu/cultural-week'
    },
    stats: {
      views: 1567,
      likes: 198,
      comments: 45
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date()
  },
  {
    title: '⚠️ Campus Maintenance Notice',
    content: 'Water supply will be temporarily disrupted on March 5th from 9 AM to 3 PM for maintenance work. Please plan accordingly.',
    type: 'maintenance',
    priority: 'high',
    university: 'SRM University Sonipat',
    author: {
      name: 'Facilities Management',
      role: 'administration'
    },
    tags: ['maintenance', 'water supply', 'disruption', 'important'],
    isActive: true,
    isPinned: true,
    expiryDate: new Date('2024-03-06'),
    stats: {
      views: 2345,
      likes: 45,
      comments: 78
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date()
  }
]

const communities = [
  // SRM University Sonipat Communities
  {
    name: 'CodeCrafters SRM',
    description: 'Programming and software development community for tech enthusiasts',
    category: 'Technology',
    university: 'SRM University Sonipat',
    type: 'club',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/codecrafters-banner.jpg',
    icon: '💻',
    isOfficial: true,
    isActive: true,
    memberCount: 245,
    moderators: [],
    tags: ['programming', 'coding', 'software', 'tech', 'development'],
    rules: [
      'Be respectful to all members',
      'Share knowledge and help others learn',
      'No spam or self-promotion without permission',
      'Keep discussions relevant to programming'
    ],
    events: [
      {
        title: 'Hackathon 2024',
        date: new Date('2024-03-15'),
        description: '48-hour coding competition'
      }
    ],
    socialLinks: {
      discord: 'https://discord.gg/codecrafters-srm',
      github: 'https://github.com/codecrafters-srm',
      linkedin: 'https://linkedin.com/company/codecrafters-srm'
    },
    stats: {
      totalPosts: 156,
      totalEvents: 12,
      totalProjects: 23
    },
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date()
  },
  {
    name: 'SRM Drama Society',
    description: 'Theatre, drama, and performing arts community',
    category: 'Arts & Culture',
    university: 'SRM University Sonipat',
    type: 'society',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/drama-society-banner.jpg',
    icon: '🎭',
    isOfficial: true,
    isActive: true,
    memberCount: 89,
    moderators: [],
    tags: ['theatre', 'drama', 'acting', 'performance', 'arts'],
    rules: [
      'Respect all forms of artistic expression',
      'Attend rehearsals regularly if cast',
      'Support fellow performers',
      'No discrimination based on experience level'
    ],
    events: [
      {
        title: 'Annual Theatre Festival',
        date: new Date('2024-04-20'),
        description: 'Showcase of student performances'
      }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/srm_drama_society',
      youtube: 'https://youtube.com/c/srmdramasociety'
    },
    stats: {
      totalPosts: 67,
      totalEvents: 8,
      totalProjects: 5
    },
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date()
  },
  {
    name: 'SRM Basketball Club',
    description: 'Basketball enthusiasts and players unite!',
    category: 'Sports',
    university: 'SRM University Sonipat',
    type: 'club',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/basketball-banner.jpg',
    icon: '🏀',
    isOfficial: true,
    isActive: true,
    memberCount: 134,
    moderators: [],
    tags: ['basketball', 'sports', 'fitness', 'team', 'competition'],
    rules: [
      'Regular practice attendance required',
      'Respect coaches and team members',
      'Maintain good academic standing',
      'Follow university sports guidelines'
    ],
    events: [
      {
        title: 'Inter-University Championship',
        date: new Date('2024-03-25'),
        description: 'Compete against other universities'
      }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/srm_basketball'
    },
    stats: {
      totalPosts: 89,
      totalEvents: 15,
      totalProjects: 3
    },
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date()
  },
  {
    name: 'Entrepreneurship Cell SRM',
    description: 'Fostering innovation and startup culture among students',
    category: 'Business',
    university: 'SRM University Sonipat',
    type: 'cell',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/ecell-banner.jpg',
    icon: '🚀',
    isOfficial: true,
    isActive: true,
    memberCount: 178,
    moderators: [],
    tags: ['entrepreneurship', 'startup', 'business', 'innovation', 'networking'],
    rules: [
      'Share startup ideas and get feedback',
      'Attend workshops and seminars',
      'Network with fellow entrepreneurs',
      'Respect intellectual property'
    ],
    events: [
      {
        title: 'Startup Pitch Competition',
        date: new Date('2024-04-10'),
        description: 'Present your startup idea to investors'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/ecell-srm',
      twitter: 'https://twitter.com/ecell_srm'
    },
    stats: {
      totalPosts: 123,
      totalEvents: 18,
      totalProjects: 34
    },
    createdAt: new Date('2023-08-01'),
    updatedAt: new Date()
  },
  {
    name: 'SRM Photography Club',
    description: 'Capture moments, create memories, share stories',
    category: 'Arts & Culture',
    university: 'SRM University Sonipat',
    type: 'club',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/photography-banner.jpg',
    icon: '📸',
    isOfficial: true,
    isActive: true,
    memberCount: 156,
    moderators: [],
    tags: ['photography', 'art', 'creative', 'visual', 'storytelling'],
    rules: [
      'Share original photography work',
      'Provide constructive feedback',
      'Respect copyright and credits',
      'Participate in photo walks'
    ],
    events: [
      {
        title: 'Campus Photo Walk',
        date: new Date('2024-03-30'),
        description: 'Explore campus through photography'
      }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/srm_photography',
      flickr: 'https://flickr.com/groups/srm-photography'
    },
    stats: {
      totalPosts: 234,
      totalEvents: 10,
      totalProjects: 12
    },
    createdAt: new Date('2023-07-15'),
    updatedAt: new Date()
  },

  // Delhi University Communities
  {
    name: 'DU Debating Society',
    description: 'Sharpen your arguments and public speaking skills',
    category: 'Academic',
    university: 'Delhi University',
    type: 'society',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/debate-banner.jpg',
    icon: '🗣️',
    isOfficial: true,
    isActive: true,
    memberCount: 198,
    moderators: [],
    tags: ['debate', 'public speaking', 'arguments', 'discussion', 'academic'],
    rules: [
      'Respect opposing viewpoints',
      'Use evidence-based arguments',
      'No personal attacks',
      'Participate in regular debates'
    ],
    events: [
      {
        title: 'Inter-College Debate Championship',
        date: new Date('2024-04-05'),
        description: 'Compete with the best debaters'
      }
    ],
    socialLinks: {
      youtube: 'https://youtube.com/c/dudebatingsociety'
    },
    stats: {
      totalPosts: 145,
      totalEvents: 20,
      totalProjects: 8
    },
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date()
  },
  {
    name: 'DU Literary Society',
    description: 'For lovers of literature, poetry, and creative writing',
    category: 'Arts & Culture',
    university: 'Delhi University',
    type: 'society',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/literary-banner.jpg',
    icon: '📚',
    isOfficial: true,
    isActive: true,
    memberCount: 167,
    moderators: [],
    tags: ['literature', 'poetry', 'writing', 'books', 'creative'],
    rules: [
      'Share original creative work',
      'Provide constructive criticism',
      'Respect all genres and styles',
      'Participate in reading sessions'
    ],
    events: [
      {
        title: 'Poetry Slam Night',
        date: new Date('2024-03-28'),
        description: 'Showcase your poetic talents'
      }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/du_literary',
      medium: 'https://medium.com/du-literary-society'
    },
    stats: {
      totalPosts: 189,
      totalEvents: 12,
      totalProjects: 15
    },
    createdAt: new Date('2023-07-25'),
    updatedAt: new Date()
  },

  // JNU Communities
  {
    name: 'JNU International Relations Forum',
    description: 'Discuss global affairs and international politics',
    category: 'Academic',
    university: 'Jawaharlal Nehru University',
    type: 'forum',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/ir-forum-banner.jpg',
    icon: '🌍',
    isOfficial: true,
    isActive: true,
    memberCount: 123,
    moderators: [],
    tags: ['international relations', 'politics', 'global affairs', 'diplomacy', 'policy'],
    rules: [
      'Maintain academic rigor in discussions',
      'Cite credible sources',
      'Respect diverse perspectives',
      'No hate speech or discrimination'
    ],
    events: [
      {
        title: 'Model United Nations',
        date: new Date('2024-04-15'),
        description: 'Simulate UN proceedings'
      }
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/jnu-ir-forum'
    },
    stats: {
      totalPosts: 98,
      totalEvents: 8,
      totalProjects: 6
    },
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date()
  },
  {
    name: 'JNU Cultural Society',
    description: 'Celebrating diversity through arts and culture',
    category: 'Arts & Culture',
    university: 'Jawaharlal Nehru University',
    type: 'society',
    image: 'https://res.cloudinary.com/reppd/image/upload/v1/communities/cultural-banner.jpg',
    icon: '🎨',
    isOfficial: true,
    isActive: true,
    memberCount: 201,
    moderators: [],
    tags: ['culture', 'arts', 'diversity', 'performance', 'heritage'],
    rules: [
      'Celebrate all cultures equally',
      'Participate in cultural events',
      'Share cultural knowledge',
      'Promote inclusivity'
    ],
    events: [
      {
        title: 'Cultural Fest 2024',
        date: new Date('2024-04-25'),
        description: 'Showcase diverse cultural performances'
      }
    ],
    socialLinks: {
      instagram: 'https://instagram.com/jnu_cultural',
      facebook: 'https://facebook.com/jnuculturalsociety'
    },
    stats: {
      totalPosts: 156,
      totalEvents: 25,
      totalProjects: 18
    },
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date()
  }
]

async function seedDatabase() {
  let client

  try {
    console.log('🌱 Starting database seeding...')
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB')

    const db = client.db(DB_NAME)

    // Clear existing placeholder data
    console.log('🧹 Clearing placeholder data...')
    await db.collection(COLLECTIONS.UNIVERSITIES).deleteMany({})
    await db.collection(COLLECTIONS.COMMUNITIES).deleteMany({})
    // Keep real users, only remove sample/demo users
    await db.collection(COLLECTIONS.USERS).deleteMany({
      email: { $regex: /@example\.com$/ }
    })
    await db.collection(COLLECTIONS.NOTICES).deleteMany({})
    console.log('✅ Placeholder data cleared')

    // Seed universities
    console.log('🏫 Seeding universities...')
    const universityResult = await db.collection(COLLECTIONS.UNIVERSITIES).insertMany(universities)
    console.log(`✅ Inserted ${universityResult.insertedCount} universities`)

    // Seed communities
    console.log('👥 Seeding communities...')
    const communityResult = await db.collection(COLLECTIONS.COMMUNITIES).insertMany(communities)
    console.log(`✅ Inserted ${communityResult.insertedCount} communities`)

    // Seed sample users
    console.log('👤 Seeding sample users...')
    const userResult = await db.collection(COLLECTIONS.USERS).insertMany(sampleUsers)
    console.log(`✅ Inserted ${userResult.insertedCount} sample users`)

    // Seed notices
    console.log('📢 Seeding notices...')
    const noticeResult = await db.collection(COLLECTIONS.NOTICES).insertMany(notices)
    console.log(`✅ Inserted ${noticeResult.insertedCount} notices`)

    // Create indexes for better performance
    console.log('📊 Creating database indexes...')
    
    // University indexes
    await db.collection(COLLECTIONS.UNIVERSITIES).createIndex({ name: 1 }, { unique: true })
    await db.collection(COLLECTIONS.UNIVERSITIES).createIndex({ shortName: 1 })
    
    // Community indexes
    await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ name: 1, university: 1 }, { unique: true })
    await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ university: 1 })
    await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ category: 1 })
    await db.collection(COLLECTIONS.COMMUNITIES).createIndex({ tags: 1 })
    
    // User indexes
    await db.collection(COLLECTIONS.USERS).createIndex({ email: 1 }, { unique: true })
    await db.collection(COLLECTIONS.USERS).createIndex({ universityId: 1 }, { unique: true })
    await db.collection(COLLECTIONS.USERS).createIndex({ university: 1 })
    await db.collection(COLLECTIONS.USERS).createIndex({ betaGroup: 1 })

    // Notice indexes
    await db.collection(COLLECTIONS.NOTICES).createIndex({ university: 1 })
    await db.collection(COLLECTIONS.NOTICES).createIndex({ type: 1 })
    await db.collection(COLLECTIONS.NOTICES).createIndex({ expiryDate: 1 })
    await db.collection(COLLECTIONS.NOTICES).createIndex({ isPinned: 1 })

    console.log('✅ Database indexes created')

    console.log('🎉 Database seeding completed successfully!')
    console.log(`
📊 Summary:
- Universities: ${universityResult.insertedCount}
- Communities: ${communityResult.insertedCount}
- Sample Users: ${userResult.insertedCount}
- Notices: ${noticeResult.insertedCount}
- Total records: ${universityResult.insertedCount + communityResult.insertedCount + userResult.insertedCount + noticeResult.insertedCount}

🔑 Demo Login Credentials:
- Email: arshiya.kapil@example.com
- Password: password123
- University ID: 10324210279

🌐 Ready for production deployment!
    `)

  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

// Run the seeding script
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase }
