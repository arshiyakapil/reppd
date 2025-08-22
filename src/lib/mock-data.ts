// Mock data service for development when database is not available

export const mockPosts = [
  {
    id: '1',
    content: 'Hey everyone! Just finished my Data Structures assignment. Anyone want to form a study group for the upcoming exam? 📚',
    author: {
      id: 'user1',
      name: 'Arshiya Kapil',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
      university: 'SRM University Sonipat',
      year: 3,
      stream: 'Computer Science'
    },
    timestamp: new Date('2024-03-10T10:30:00'),
    likes: 12,
    comments: 5,
    shares: 2,
    isLiked: false,
    isBookmarked: false,
    isAnonymous: false,
    images: [],
    tags: ['study-group', 'data-structures', 'exam-prep']
  },
  {
    id: '2',
    content: 'Looking for a carpool from Gurgaon to campus tomorrow morning. Can share fuel costs! 🚗',
    author: {
      id: 'user2',
      name: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      university: 'SRM University Sonipat',
      year: 2,
      stream: 'Computer Science'
    },
    timestamp: new Date('2024-03-10T09:15:00'),
    likes: 8,
    comments: 3,
    shares: 1,
    isLiked: true,
    isBookmarked: false,
    isAnonymous: false,
    images: [],
    tags: ['carpool', 'gurgaon', 'transport']
  },
  {
    id: '3',
    content: 'Anonymous post: Feeling overwhelmed with assignments. Any tips for time management? 😅',
    author: {
      id: 'anonymous',
      name: 'Anonymous',
      avatar: '',
      university: 'SRM University Sonipat',
      year: 0,
      stream: 'Anonymous'
    },
    timestamp: new Date('2024-03-10T08:45:00'),
    likes: 15,
    comments: 8,
    shares: 0,
    isLiked: false,
    isBookmarked: true,
    isAnonymous: true,
    images: [],
    tags: ['anonymous', 'help', 'time-management']
  }
]

export const mockCommunities = [
  {
    id: '1',
    name: 'CodeCrafters SRM',
    description: 'Programming and development community for SRM students',
    category: 'Academic',
    memberCount: 234,
    university: 'SRM University Sonipat',
    avatar: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=150',
    isJoined: true,
    tags: ['programming', 'development', 'coding']
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'Capture moments, create memories',
    category: 'Creative',
    memberCount: 156,
    university: 'SRM University Sonipat',
    avatar: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=150',
    isJoined: false,
    tags: ['photography', 'creative', 'art']
  }
]

export const mockRequests = [
  {
    id: '1',
    title: 'Study Group for Database Management',
    description: 'Looking for 3-4 people to form a study group for DBMS. We can meet twice a week.',
    type: 'study-group',
    author: {
      id: 'user1',
      name: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
    },
    timestamp: new Date('2024-03-10T11:00:00'),
    responses: 7,
    isActive: true,
    tags: ['study-group', 'database', 'academic']
  },
  {
    id: '2',
    title: 'Carpool from Delhi to Campus',
    description: 'Daily carpool from Connaught Place to SRM campus. Looking for 2 more people.',
    type: 'carpool',
    author: {
      id: 'user2',
      name: 'Amit Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    timestamp: new Date('2024-03-10T10:30:00'),
    responses: 12,
    isActive: true,
    tags: ['carpool', 'delhi', 'transport']
  }
]

export const mockNotices = [
  {
    id: '1',
    title: 'Mid-Semester Exam Schedule Released',
    content: 'The mid-semester examination schedule has been released. Please check the academic portal for your exam dates.',
    type: 'academic',
    priority: 'high',
    author: 'Academic Office',
    timestamp: new Date('2024-03-10T09:00:00'),
    expiryDate: new Date('2024-03-25T23:59:59'),
    isPinned: true,
    university: 'SRM University Sonipat'
  },
  {
    id: '2',
    title: 'Tech Fest 2024 Registration Open',
    content: 'Registration for Tech Fest 2024 is now open. Participate in coding competitions, hackathons, and tech talks.',
    type: 'event',
    priority: 'medium',
    author: 'Student Council',
    timestamp: new Date('2024-03-09T14:30:00'),
    expiryDate: new Date('2024-03-20T23:59:59'),
    isPinned: false,
    university: 'SRM University Sonipat'
  }
]

// Mock API functions
export const mockAPI = {
  // Posts
  async getPosts() {
    return { posts: mockPosts, hasMore: false }
  },

  async createPost(postData: any) {
    console.log('Mock API: Creating post with data:', postData)

    const newPost = {
      id: Date.now().toString(),
      content: postData.content || '',
      author: {
        id: 'current-user',
        name: postData.isAnonymous ? 'Anonymous Student' : 'Current User',
        avatar: postData.isAnonymous ? '🕶️' : '👤',
        university: 'SRM University Sonipat',
        year: 3,
        stream: 'Computer Science Engineering',
        section: 'A'
      },
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: postData.isAnonymous || false,
      images: postData.images || [],
      videos: postData.videos || [],
      type: postData.type || 'text',
      tags: postData.tags || []
    }

    console.log('Mock API: Created post:', newPost)
    mockPosts.unshift(newPost)
    return newPost
  },

  async likePost(postId: string) {
    const post = mockPosts.find(p => p.id === postId)
    if (post) {
      post.isLiked = !post.isLiked
      post.likes += post.isLiked ? 1 : -1
    }
    return post
  },

  // Communities
  async getCommunities() {
    return mockCommunities
  },

  async joinCommunity(communityId: string) {
    const community = mockCommunities.find(c => c.id === communityId)
    if (community) {
      community.isJoined = !community.isJoined
      community.memberCount += community.isJoined ? 1 : -1
    }
    return community
  },

  // Requests
  async getRequests() {
    return mockRequests
  },

  async createRequest(requestData: any) {
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      author: {
        id: 'current-user',
        name: 'Current User',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
      },
      timestamp: new Date(),
      responses: 0,
      isActive: true,
      tags: []
    }
    mockRequests.unshift(newRequest)
    return newRequest
  },

  // Notices
  async getNotices() {
    return mockNotices
  }
}

// Check if we should use mock data
export const shouldUseMockData = () => {
  return process.env.NODE_ENV === 'development' && 
         (process.env.SKIP_DATABASE_CONNECTION === 'true' || 
          process.env.MOCK_DATA_ENABLED === 'true')
}
