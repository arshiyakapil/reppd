'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Crown,
  Users, 
  Calendar, 
  MessageSquare,
  FileText,
  Settings,
  Plus,
  BarChart3,
  Bell,
  Upload,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

// Mock data for management dashboard
const mockManagementData = {
  userRole: 'club_leader', // club_leader, professor, cr
  managedCommunities: [
    {
      id: '1',
      name: 'CodeCrafters SRM',
      type: 'club',
      members: 245,
      pendingRequests: 12,
      recentActivity: 'New member joined 2 hours ago'
    }
  ],
  managedClasses: [
    {
      id: '1',
      name: 'Data Structures & Algorithms',
      code: 'CS301',
      students: 45,
      assignments: 3,
      pendingSubmissions: 8
    }
  ],
  pendingApprovals: [
    {
      id: '1',
      type: 'member_request',
      title: 'Membership Request - Arjun Sharma',
      description: 'CS 3rd year student wants to join CodeCrafters',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'event_proposal',
      title: 'Event Proposal - React Workshop',
      description: 'Workshop on React.js fundamentals for beginners',
      timestamp: '5 hours ago'
    }
  ],
  recentNotices: [
    {
      id: '1',
      title: 'Club Meeting Scheduled',
      content: 'Monthly club meeting on Friday 3 PM',
      status: 'published',
      views: 156
    }
  ]
}

export default function ManagePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(mockManagementData)

  // Check if user has management permissions
  const hasManagementAccess = true // TODO: Check actual permissions

  if (!hasManagementAccess) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <Card className="glass-morphism border-white/20 max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-xl font-retro text-white mb-2">Access Restricted</h2>
            <p className="text-white/60 font-space">
              You don't have management permissions. Contact your administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'classes', label: 'Classes', icon: FileText },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'approvals', label: 'Approvals', icon: CheckCircle }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-morphism border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-space">Total Members</p>
                <p className="text-2xl font-bold text-white">245</p>
              </div>
              <Users className="w-8 h-8 text-retro-cyan" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-space">Pending Requests</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Clock className="w-8 h-8 text-retro-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-space">Active Events</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <Calendar className="w-8 h-8 text-retro-pink" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm font-space">Published Notices</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <Bell className="w-8 h-8 text-retro-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-morphism border-white/20">
        <CardHeader>
          <CardTitle className="text-white font-retro">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.pendingApprovals.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-semibold">{item.title}</h4>
                  <p className="text-white/60 text-sm font-space">{item.description}</p>
                  <span className="text-white/40 text-xs font-space">{item.timestamp}</span>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-retro-cyan to-retro-blue">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCommunities = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-retro text-white">Managed Communities</h2>
        <Button className="bg-gradient-to-r from-retro-pink to-retro-orange">
          <Plus className="w-4 h-4 mr-2" />
          Create Community
        </Button>
      </div>

      <div className="grid gap-6">
        {data.managedCommunities.map((community) => (
          <Card key={community.id} className="glass-morphism border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white font-retro">{community.name}</CardTitle>
                  <CardDescription className="text-white/60 font-space">
                    {community.members} members • {community.pendingRequests} pending requests
                  </CardDescription>
                </div>
                <Badge className="bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30">
                  {community.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-white/70 font-space">{community.recentActivity}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderApprovals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-retro text-white">Pending Approvals</h2>
        <Badge className="bg-retro-orange/20 text-retro-orange border border-retro-orange/30">
          {data.pendingApprovals.length} pending
        </Badge>
      </div>

      <div className="space-y-4">
        {data.pendingApprovals.map((item) => (
          <Card key={item.id} className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-retro-purple/20 text-retro-purple border border-retro-purple/30">
                      {item.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-white/40 text-sm font-space">{item.timestamp}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/70 font-space">{item.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" className="border-red-400 text-red-400 hover:bg-red-500/10">
                    Reject
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-retro-green to-retro-cyan">
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderNotices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-retro text-white">Notice Management</h2>
        <Button className="bg-gradient-to-r from-retro-pink to-retro-orange">
          <Plus className="w-4 h-4 mr-2" />
          Create Notice
        </Button>
      </div>

      <div className="space-y-4">
        {data.recentNotices.map((notice) => (
          <Card key={notice.id} className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${
                      notice.status === 'published' 
                        ? 'bg-retro-green/20 text-retro-green border-retro-green/30' 
                        : 'bg-retro-orange/20 text-retro-orange border-retro-orange/30'
                    } border`}>
                      {notice.status}
                    </Badge>
                    <span className="text-white/60 text-sm font-space">{notice.views} views</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{notice.title}</h3>
                  <p className="text-white/70 font-space">{notice.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-retro-yellow" />
            <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white">
              Management Portal
            </h1>
          </div>
          <p className="text-white/60 font-space">
            Manage your communities, classes, and campus activities
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id 
                  ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'communities' && renderCommunities()}
        {activeTab === 'approvals' && renderApprovals()}
        {activeTab === 'notices' && renderNotices()}
      </div>
    </div>
  )
}
