'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell,
  X,
  Heart,
  MessageSquare,
  Users,
  Calendar,
  Flag,
  Crown,
  CheckCircle,
  Clock,
  Dot
} from 'lucide-react'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'event' | 'report' | 'admin' | 'community'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  actionUrl?: string
  avatar?: string
  metadata?: {
    postId?: string
    userId?: string
    communityId?: string
  }
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New Like',
    message: 'Priya Sharma liked your post about Machine Learning',
    timestamp: '2 minutes ago',
    isRead: false,
    avatar: '👩‍💻',
    actionUrl: '/feed',
    metadata: { postId: '123', userId: 'priya' }
  },
  {
    id: '2',
    type: 'comment',
    title: 'New Comment',
    message: 'Rahul Kumar commented on your carpool request',
    timestamp: '15 minutes ago',
    isRead: false,
    avatar: '👨‍🔧',
    actionUrl: '/requests',
    metadata: { postId: '456', userId: 'rahul' }
  },
  {
    id: '3',
    type: 'community',
    title: 'Community Update',
    message: 'CodeCrafters SRM posted a new event: React Workshop',
    timestamp: '1 hour ago',
    isRead: true,
    avatar: '💻',
    actionUrl: '/communities/1',
    metadata: { communityId: '1' }
  },
  {
    id: '4',
    type: 'event',
    title: 'Event Reminder',
    message: 'Tech Fest 2024 registration closes in 2 days',
    timestamp: '2 hours ago',
    isRead: true,
    actionUrl: '/notices'
  },
  {
    id: '5',
    type: 'admin',
    title: 'System Update',
    message: 'New features added: Global search and enhanced notifications',
    timestamp: '1 day ago',
    isRead: true,
    actionUrl: '/feed'
  }
]

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-400" />
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-400" />
      case 'follow': return <Users className="w-4 h-4 text-green-400" />
      case 'event': return <Calendar className="w-4 h-4 text-purple-400" />
      case 'report': return <Flag className="w-4 h-4 text-orange-400" />
      case 'admin': return <Crown className="w-4 h-4 text-yellow-400" />
      case 'community': return <Users className="w-4 h-4 text-cyan-400" />
      default: return <Bell className="w-4 h-4 text-white/60" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'bg-red-500/10 border-red-500/20'
      case 'comment': return 'bg-blue-500/10 border-blue-500/20'
      case 'follow': return 'bg-green-500/10 border-green-500/20'
      case 'event': return 'bg-purple-500/10 border-purple-500/20'
      case 'report': return 'bg-orange-500/10 border-orange-500/20'
      case 'admin': return 'bg-yellow-500/10 border-yellow-500/20'
      case 'community': return 'bg-cyan-500/10 border-cyan-500/20'
      default: return 'bg-white/5 border-white/10'
    }
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications (for demo)
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ['like', 'comment', 'community'][Math.floor(Math.random() * 3)] as any,
          title: 'New Activity',
          message: 'Someone interacted with your content',
          timestamp: 'Just now',
          isRead: false,
          avatar: ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓'][Math.floor(Math.random() * 4)]
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end pt-16 pr-4">
      <Card className="glass-morphism border-white/20 shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white font-retro flex items-center gap-2">
                <Bell className="w-5 h-5 text-retro-cyan" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white border-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-white/60 font-space">
                Stay updated with your campus activity
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30' : 'text-white/60'}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-retro-orange/20 text-retro-orange border border-retro-orange/30' : 'text-white/60'}
            >
              Unread ({unreadCount})
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-white/60 hover:text-white ml-auto"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-1">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                      getNotificationColor(notification.type)
                    } ${!notification.isRead ? 'bg-white/5' : ''}`}
                    onClick={() => {
                      markAsRead(notification.id)
                      if (notification.actionUrl) {
                        // Navigate to action URL
                        window.location.href = notification.actionUrl
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.avatar ? (
                          <div className="w-8 h-8 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center text-sm">
                            {notification.avatar}
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-semibold text-sm">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <Dot className="w-4 h-4 text-retro-cyan fill-current" />
                          )}
                        </div>
                        <p className="text-white/70 text-sm font-space line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-white/40 text-xs font-space flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.timestamp}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="text-white/40 hover:text-red-400 p-1 h-auto"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60 font-space">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p className="text-white/40 text-sm font-space mt-1">
                  {filter === 'unread' 
                    ? 'You\'re all caught up!' 
                    : 'Activity will appear here when it happens'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
