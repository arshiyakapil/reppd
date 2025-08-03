import { getDatabase, COLLECTIONS } from './mongodb'
import { ObjectId } from 'mongodb'

// Feature flags configuration
export interface FeatureFlag {
  name: string
  enabled: boolean
  rolloutPercentage: number
  targetGroups: string[]
  description: string
  createdAt: Date
  updatedAt: Date
}

// Beta testing groups
export enum BetaGroup {
  ALPHA = 'alpha',
  BETA = 'beta',
  EARLY_ACCESS = 'early_access',
  GENERAL = 'general'
}

// Feature flags
export const FEATURES = {
  ADVANCED_SEARCH: 'advanced_search',
  REAL_TIME_CHAT: 'real_time_chat',
  VIDEO_POSTS: 'video_posts',
  COMMUNITY_POLLS: 'community_polls',
  ENHANCED_NOTIFICATIONS: 'enhanced_notifications',
  AI_CONTENT_SUGGESTIONS: 'ai_content_suggestions',
  DARK_MODE: 'dark_mode',
  VOICE_MESSAGES: 'voice_messages'
} as const

// Default feature flags
const defaultFeatures: Record<string, FeatureFlag> = {
  [FEATURES.ADVANCED_SEARCH]: {
    name: FEATURES.ADVANCED_SEARCH,
    enabled: true,
    rolloutPercentage: 100,
    targetGroups: [BetaGroup.GENERAL],
    description: 'Enhanced search with filters and suggestions',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  [FEATURES.REAL_TIME_CHAT]: {
    name: FEATURES.REAL_TIME_CHAT,
    enabled: false,
    rolloutPercentage: 10,
    targetGroups: [BetaGroup.ALPHA],
    description: 'Real-time messaging between users',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  [FEATURES.VIDEO_POSTS]: {
    name: FEATURES.VIDEO_POSTS,
    enabled: false,
    rolloutPercentage: 25,
    targetGroups: [BetaGroup.BETA],
    description: 'Support for video content in posts',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  [FEATURES.COMMUNITY_POLLS]: {
    name: FEATURES.COMMUNITY_POLLS,
    enabled: true,
    rolloutPercentage: 50,
    targetGroups: [BetaGroup.BETA, BetaGroup.EARLY_ACCESS],
    description: 'Polling feature for communities',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  [FEATURES.ENHANCED_NOTIFICATIONS]: {
    name: FEATURES.ENHANCED_NOTIFICATIONS,
    enabled: true,
    rolloutPercentage: 75,
    targetGroups: [BetaGroup.BETA, BetaGroup.EARLY_ACCESS, BetaGroup.GENERAL],
    description: 'Advanced notification system with real-time updates',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Beta testing manager
export class BetaTestingManager {
  private static featureCache = new Map<string, FeatureFlag>()
  private static userGroupCache = new Map<string, BetaGroup>()

  // Initialize feature flags in database
  static async initializeFeatures() {
    try {
      const db = await getDatabase()
      const featuresCollection = db.collection('feature_flags')

      for (const [key, feature] of Object.entries(defaultFeatures)) {
        await featuresCollection.updateOne(
          { name: feature.name },
          { $setOnInsert: feature },
          { upsert: true }
        )
      }

      console.log('Feature flags initialized')
    } catch (error) {
      console.error('Failed to initialize feature flags:', error)
    }
  }

  // Get user's beta group
  static async getUserBetaGroup(userId: string): Promise<BetaGroup> {
    // Check cache first
    if (this.userGroupCache.has(userId)) {
      return this.userGroupCache.get(userId)!
    }

    try {
      const db = await getDatabase()
      const usersCollection = db.collection(COLLECTIONS.USERS)
      
      const user = await usersCollection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { betaGroup: 1, createdAt: 1 } }
      )

      if (!user) {
        return BetaGroup.GENERAL
      }

      let betaGroup = user.betaGroup || this.assignBetaGroup(user.createdAt)

      // Update user with beta group if not set
      if (!user.betaGroup) {
        await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { betaGroup } }
        )
      }

      // Cache the result
      this.userGroupCache.set(userId, betaGroup)
      return betaGroup

    } catch (error) {
      console.error('Error getting user beta group:', error)
      return BetaGroup.GENERAL
    }
  }

  // Assign beta group based on user registration date and random selection
  private static assignBetaGroup(createdAt: Date): BetaGroup {
    const daysSinceRegistration = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    const random = Math.random()

    // Early users get priority access
    if (daysSinceRegistration > 30) {
      if (random < 0.05) return BetaGroup.ALPHA
      if (random < 0.15) return BetaGroup.BETA
      if (random < 0.35) return BetaGroup.EARLY_ACCESS
    } else {
      // New users have lower chance for beta access
      if (random < 0.02) return BetaGroup.ALPHA
      if (random < 0.08) return BetaGroup.BETA
      if (random < 0.20) return BetaGroup.EARLY_ACCESS
    }

    return BetaGroup.GENERAL
  }

  // Check if feature is enabled for user
  static async isFeatureEnabled(featureName: string, userId?: string): Promise<boolean> {
    try {
      const feature = await this.getFeature(featureName)
      if (!feature || !feature.enabled) {
        return false
      }

      // If no user ID provided, check global rollout
      if (!userId) {
        return Math.random() * 100 < feature.rolloutPercentage
      }

      const userGroup = await this.getUserBetaGroup(userId)
      
      // Check if user's group is in target groups
      if (!feature.targetGroups.includes(userGroup)) {
        return false
      }

      // Check rollout percentage
      const userHash = this.hashUserId(userId)
      return userHash < feature.rolloutPercentage

    } catch (error) {
      console.error('Error checking feature flag:', error)
      return false
    }
  }

  // Get feature configuration
  static async getFeature(featureName: string): Promise<FeatureFlag | null> {
    // Check cache first
    if (this.featureCache.has(featureName)) {
      return this.featureCache.get(featureName)!
    }

    try {
      const db = await getDatabase()
      const featuresCollection = db.collection('feature_flags')
      
      const feature = await featuresCollection.findOne({ name: featureName })
      
      if (feature) {
        this.featureCache.set(featureName, feature)
        return feature
      }

      return null
    } catch (error) {
      console.error('Error getting feature:', error)
      return null
    }
  }

  // Update feature flag
  static async updateFeature(featureName: string, updates: Partial<FeatureFlag>): Promise<boolean> {
    try {
      const db = await getDatabase()
      const featuresCollection = db.collection('feature_flags')
      
      const result = await featuresCollection.updateOne(
        { name: featureName },
        { 
          $set: {
            ...updates,
            updatedAt: new Date()
          }
        }
      )

      if (result.matchedCount > 0) {
        // Clear cache
        this.featureCache.delete(featureName)
        return true
      }

      return false
    } catch (error) {
      console.error('Error updating feature:', error)
      return false
    }
  }

  // Get all features for admin dashboard
  static async getAllFeatures(): Promise<FeatureFlag[]> {
    try {
      const db = await getDatabase()
      const featuresCollection = db.collection('feature_flags')
      
      return await featuresCollection.find({}).toArray()
    } catch (error) {
      console.error('Error getting all features:', error)
      return []
    }
  }

  // Hash user ID for consistent rollout
  private static hashUserId(userId: string): number {
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100
  }

  // Track feature usage
  static async trackFeatureUsage(featureName: string, userId: string, action: string) {
    try {
      const db = await getDatabase()
      const usageCollection = db.collection('feature_usage')
      
      await usageCollection.insertOne({
        featureName,
        userId,
        action,
        timestamp: new Date()
      })
    } catch (error) {
      console.error('Error tracking feature usage:', error)
    }
  }

  // Get feature usage analytics
  static async getFeatureAnalytics(featureName: string, days: number = 7) {
    try {
      const db = await getDatabase()
      const usageCollection = db.collection('feature_usage')
      
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const pipeline = [
        {
          $match: {
            featureName,
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
              action: '$action'
            },
            count: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            date: '$_id.date',
            action: '$_id.action',
            count: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        },
        {
          $sort: { date: 1 }
        }
      ]

      return await usageCollection.aggregate(pipeline).toArray()
    } catch (error) {
      console.error('Error getting feature analytics:', error)
      return []
    }
  }

  // Clear caches (useful for testing)
  static clearCaches() {
    this.featureCache.clear()
    this.userGroupCache.clear()
  }
}

// React hook for feature flags (to be used in components)
export function useFeatureFlag(featureName: string, userId?: string) {
  const [isEnabled, setIsEnabled] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    BetaTestingManager.isFeatureEnabled(featureName, userId)
      .then(enabled => {
        setIsEnabled(enabled)
        setIsLoading(false)
      })
      .catch(() => {
        setIsEnabled(false)
        setIsLoading(false)
      })
  }, [featureName, userId])

  return { isEnabled, isLoading }
}

// Initialize feature flags on startup
if (typeof window === 'undefined') {
  BetaTestingManager.initializeFeatures()
}
