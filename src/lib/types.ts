import { 
  User, 
  Community, 
  Post, 
  Request, 
  Notice, 
  Message, 
  UniversityInfo,
  CommunityType,
  MemberRole,
  PostVisibility,
  RequestType,
  NoticeType,
  MessageType,
  InfoType
} from '@prisma/client'

// Extended types with relations
export type UserWithCommunities = User & {
  communities: {
    community: Community
    role: MemberRole
  }[]
}

export type PostWithAuthor = Post & {
  author: User
  community?: Community | null
}

export type RequestWithAuthor = Request & {
  author: User
  community?: Community | null
}

export type NoticeWithAuthor = Notice & {
  author: User
}

export type MessageWithSender = Message & {
  sender: User
  receiver?: User | null
  community?: Community | null
}

export type CommunityWithMembers = Community & {
  members: {
    user: User
    role: MemberRole
  }[]
}

// Form types for validation
export interface SignupFormData {
  name: string
  university: string
  section?: string
  year: number
  stream?: string
  gender?: string
  universityId: string
  password: string
  confirmPassword: string
  idFrontFile: File
  idBackFile: File
}

export interface LoginFormData {
  universityId: string
  password: string
}

export interface PostFormData {
  content: string
  images?: File[]
  tags: string[]
  visibility: PostVisibility
  communityId?: string
}

export interface RequestFormData {
  title: string
  description: string
  type: RequestType
  tags: string[]
  visibility: PostVisibility
  communityId?: string
}

export interface NoticeFormData {
  title: string
  content: string
  type: NoticeType
  images?: File[]
  validUntil?: Date
  isFreshersHighlighted: boolean
  targetYear?: number
  targetSection?: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// University data
export interface UniversityData {
  name: string
  sections: string[]
  streams: string[]
}

// OCR Response from Optic API
export interface OCRResponse {
  name?: string
  universityId?: string
  year?: number
  stream?: string
  section?: string
}

// Filter types
export interface FeedFilters {
  community?: string
  year?: number
  gender?: string
  interests?: string[]
}

export interface RequestFilters {
  type?: RequestType
  community?: string
  year?: number
  gender?: string
}

// Chat types
export interface ChatRoom {
  id: string
  name: string
  type: 'direct' | 'community'
  lastMessage?: MessageWithSender
  unreadCount: number
}

// Export all Prisma types
export {
  User,
  Community,
  Post,
  Request,
  Notice,
  Message,
  UniversityInfo,
  CommunityType,
  MemberRole,
  PostVisibility,
  RequestType,
  NoticeType,
  MessageType,
  InfoType
}
