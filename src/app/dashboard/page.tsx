'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  MessageSquare, 
  Bell, 
  BookOpen, 
  HelpCircle, 
  Home,
  Zap,
  Calendar,
  TrendingUp
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 text-retro-orange mx-auto mb-4 animate-pulse" />
          <p className="text-white/60 font-space">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 font-space">Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  const quickActions = [
    {
      title: 'Create Post',
      description: 'Share something with your community',
      icon: Home,
      color: 'retro-pink',
      href: '/create/post'
    },
    {
      title: 'Browse Requests',
      description: 'Find or offer help',
      icon: HelpCircle,
      color: 'retro-cyan',
      href: '/requests'
    },
    {
      title: 'Join Communities',
      description: 'Connect with clubs and groups',
      icon: Users,
      color: 'retro-orange',
      href: '/communities'
    },
    {
      title: 'Check Messages',
      description: 'See your latest conversations',
      icon: MessageSquare,
      color: 'retro-purple',
      href: '/chat'
    }
  ]

  const recentActivity = [
    { type: 'post', content: 'New study group formed for Data Structures', time: '2 hours ago' },
    { type: 'request', content: 'Carpool request for tomorrow morning', time: '4 hours ago' },
    { type: 'notice', content: 'Photography club meeting this Friday', time: '6 hours ago' },
    { type: 'message', content: 'New message from Sarah about project', time: '1 day ago' }
  ]

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-retro font-bold text-white mb-2">
            Welcome back, {session.user?.name || 'Student'}! 👋
          </h1>
          <p className="text-white/60 font-space text-sm sm:text-lg">
            {session.user?.university} • {session.user?.stream} • Year {session.user?.year}
          </p>
          {!session.user?.isVerified && (
            <div className="mt-4 p-3 sm:p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 font-space text-sm sm:text-base">
                ⏳ Your account is pending verification. You'll have full access once approved.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Quick Actions */}
            <Card className="glass-morphism border-white/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-white font-retro flex items-center gap-2 text-lg sm:text-xl">
                  <Zap className="w-5 h-5 text-retro-orange" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-white/60 font-space text-sm sm:text-base">
                  Jump into campus life
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="glass"
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:scale-105 transition-all duration-300"
                      asChild
                    >
                      <a href={action.href}>
                        <action.icon className={`w-6 h-6 text-${action.color}`} />
                        <div className="text-left">
                          <div className="font-semibold text-white">{action.title}</div>
                          <div className="text-sm text-white/60">{action.description}</div>
                        </div>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campus Feed Preview */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-retro-cyan" />
                  Campus Highlights
                </CardTitle>
                <CardDescription className="text-white/60 font-space">
                  What's happening around campus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-white mb-2">🎭 Drama Club Auditions</h4>
                    <p className="text-white/70 text-sm font-space">
                      Open auditions for the spring play "Romeo and Juliet" - Friday 3 PM at Main Auditorium
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                      <span>📍 Main Auditorium</span>
                      <span>⏰ Friday 3 PM</span>
                      <span>👥 25 interested</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <h4 className="font-semibold text-white mb-2">📚 Study Group - Data Structures</h4>
                    <p className="text-white/70 text-sm font-space">
                      Weekly study sessions for CS students. Join us every Wednesday at the library!
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
                      <span>📍 Central Library</span>
                      <span>⏰ Wednesdays 6 PM</span>
                      <span>👥 12 members</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black">
                    View Full Feed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro text-lg">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-retro-pink to-retro-orange rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white">{session.user?.name}</h3>
                  <p className="text-white/60 text-sm font-space">{session.user?.universityId}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">University:</span>
                    <span className="text-white">{session.user?.university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Stream:</span>
                    <span className="text-white">{session.user?.stream}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Year:</span>
                    <span className="text-white">{session.user?.year}</span>
                  </div>
                  {session.user?.section && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Section:</span>
                      <span className="text-white">{session.user?.section}</span>
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro text-lg flex items-center gap-2">
                  <Bell className="w-4 h-4 text-retro-yellow" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="w-2 h-2 bg-retro-cyan rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm">{activity.content}</p>
                        <p className="text-white/50 text-xs font-space">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" size="sm" className="w-full mt-4 text-retro-cyan hover:text-retro-pink">
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-retro-green" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white font-semibold text-sm">Tech Fest 2024</h4>
                    <p className="text-white/60 text-xs font-space">Tomorrow, 10 AM</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white font-semibold text-sm">Career Fair</h4>
                    <p className="text-white/60 text-xs font-space">Friday, 9 AM</p>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="w-full mt-4 text-retro-green hover:text-retro-cyan">
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
