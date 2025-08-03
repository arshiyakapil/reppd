'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  MapPin,
  Star,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalUsers: 2156,
    activeUsers: 1834,
    totalPosts: 8945,
    totalCommunities: 47,
    totalRequests: 1234,
    totalReports: 23
  },
  growth: {
    userGrowth: 12.5,
    postGrowth: 8.3,
    engagementGrowth: 15.7,
    communityGrowth: 6.2
  },
  engagement: {
    dailyActiveUsers: 1245,
    weeklyActiveUsers: 1834,
    monthlyActiveUsers: 2156,
    averageSessionTime: '24m 32s',
    postsPerUser: 4.2,
    commentsPerPost: 3.8
  },
  topCommunities: [
    { name: 'CodeCrafters SRM', members: 245, posts: 156, engagement: 89 },
    { name: 'Photography Club', members: 189, posts: 134, engagement: 92 },
    { name: 'Music Society', members: 167, posts: 98, engagement: 85 },
    { name: 'Robotics Club', members: 198, posts: 87, engagement: 78 },
    { name: 'Drama Society', members: 134, posts: 76, engagement: 82 }
  ],
  userActivity: {
    peakHours: ['10:00 AM', '2:00 PM', '7:00 PM'],
    mostActiveDay: 'Wednesday',
    deviceBreakdown: {
      mobile: 68,
      desktop: 28,
      tablet: 4
    }
  },
  contentStats: {
    totalPosts: 8945,
    totalComments: 34567,
    totalLikes: 67890,
    totalShares: 12345,
    reportedContent: 23,
    moderatedContent: 18
  },
  geographics: [
    { location: 'Sonipat Campus', users: 1456, percentage: 67.5 },
    { location: 'Gurgaon', users: 234, percentage: 10.9 },
    { location: 'Delhi', users: 189, percentage: 8.8 },
    { location: 'Faridabad', users: 156, percentage: 7.2 },
    { location: 'Other', users: 121, percentage: 5.6 }
  ]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const exportData = () => {
    // Implementation for data export
    console.log('Exporting analytics data...')
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
                📊 Analytics Dashboard
              </h1>
              <p className="text-white/60 font-space">
                Insights and metrics for REPPD platform performance
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={refreshData}
                disabled={isLoading}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={exportData}
                className="bg-gradient-to-r from-retro-cyan to-retro-blue"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mt-4">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30' : 'text-white/60'}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-space">Total Users</p>
                  <p className="text-2xl font-bold text-white">{mockAnalytics.overview.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs">+{mockAnalytics.growth.userGrowth}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-retro-cyan" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-space">Active Users</p>
                  <p className="text-2xl font-bold text-white">{mockAnalytics.overview.activeUsers.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs">+{mockAnalytics.growth.engagementGrowth}%</span>
                  </div>
                </div>
                <Activity className="w-8 h-8 text-retro-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-space">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{mockAnalytics.overview.totalPosts.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs">+{mockAnalytics.growth.postGrowth}%</span>
                  </div>
                </div>
                <MessageSquare className="w-8 h-8 text-retro-pink" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-space">Communities</p>
                  <p className="text-2xl font-bold text-white">{mockAnalytics.overview.totalCommunities}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs">+{mockAnalytics.growth.communityGrowth}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-retro-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-space">Requests</p>
                  <p className="text-2xl font-bold text-white">{mockAnalytics.overview.totalRequests.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs">+12.3%</span>
                  </div>
                </div>
                <Calendar className="w-8 h-8 text-retro-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-space">Reports</p>
                  <p className="text-2xl font-bold text-white">{mockAnalytics.overview.totalReports}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs">-5.2%</span>
                  </div>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Top Communities */}
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-retro">Top Communities</CardTitle>
              <CardDescription className="text-white/60 font-space">
                Most active communities by engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topCommunities.map((community, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{community.name}</h4>
                        <p className="text-white/60 text-sm font-space">
                          {community.members} members • {community.posts} posts
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">{community.engagement}%</span>
                      </div>
                      <p className="text-white/60 text-xs font-space">engagement</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-retro">User Activity</CardTitle>
              <CardDescription className="text-white/60 font-space">
                Activity patterns and device usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-3">Peak Activity Hours</h4>
                <div className="flex gap-2">
                  {mockAnalytics.userActivity.peakHours.map((hour, index) => (
                    <Badge key={index} className="bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30">
                      {hour}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Device Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-space">Mobile</span>
                    <span className="text-white font-semibold">{mockAnalytics.userActivity.deviceBreakdown.mobile}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-retro-pink to-retro-orange h-2 rounded-full"
                      style={{ width: `${mockAnalytics.userActivity.deviceBreakdown.mobile}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-space">Desktop</span>
                    <span className="text-white font-semibold">{mockAnalytics.userActivity.deviceBreakdown.desktop}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-retro-cyan to-retro-blue h-2 rounded-full"
                      style={{ width: `${mockAnalytics.userActivity.deviceBreakdown.desktop}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 font-space">Tablet</span>
                    <span className="text-white font-semibold">{mockAnalytics.userActivity.deviceBreakdown.tablet}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-retro-purple to-retro-pink h-2 rounded-full"
                      style={{ width: `${mockAnalytics.userActivity.deviceBreakdown.tablet}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm font-space">Avg Session</p>
                  <p className="text-white font-bold text-lg">{mockAnalytics.engagement.averageSessionTime}</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <p className="text-white/60 text-sm font-space">Posts/User</p>
                  <p className="text-white font-bold text-lg">{mockAnalytics.engagement.postsPerUser}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="text-white font-retro">Geographic Distribution</CardTitle>
            <CardDescription className="text-white/60 font-space">
              User distribution by location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {mockAnalytics.geographics.map((location, index) => (
                <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-retro-cyan" />
                    <h4 className="text-white font-semibold">{location.location}</h4>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{location.users.toLocaleString()}</p>
                  <p className="text-white/60 text-sm font-space">{location.percentage}% of users</p>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-retro-cyan to-retro-blue h-2 rounded-full"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
