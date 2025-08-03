'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  Users, 
  Settings, 
  AlertTriangle, 
  Activity, 
  Database,
  Shield,
  Trash2,
  Eye,
  Plus,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Bug,
  Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock data for dev portal
const systemStats = {
  totalUsers: 2847,
  activeUsers: 1923,
  totalPosts: 15642,
  totalCommunities: 47,
  totalRequests: 892,
  systemUptime: '99.8%',
  responseTime: '245ms',
  errorRate: '0.2%'
}

const recentActivity = [
  { id: '1', type: 'user_signup', message: 'New user registered: Arshiya Kapil', timestamp: '2 minutes ago' },
  { id: '2', type: 'post_created', message: 'Post created in CodeCrafters SRM', timestamp: '5 minutes ago' },
  { id: '3', type: 'error', message: 'Database connection timeout (resolved)', timestamp: '12 minutes ago' },
  { id: '4', type: 'community_created', message: 'New community: Photography Club', timestamp: '1 hour ago' },
  { id: '5', type: 'user_verified', message: 'User ID verified: Rahul Sharma', timestamp: '2 hours ago' }
]

const accessCodes = [
  { id: '1', code: 'CR-1K2L3M4N5O', role: 'cr', university: 'SRM University Sonipat', createdAt: '2024-03-01', usageCount: 3, isActive: true },
  { id: '2', code: 'CL-9P8Q7R6S5T', role: 'community_leader', university: 'Delhi University', createdAt: '2024-02-28', usageCount: 1, isActive: true },
  { id: '3', code: 'PROF-4U3V2W1X', role: 'professor', university: 'JNU', createdAt: '2024-02-25', usageCount: 0, isActive: false }
]

const bugReports = [
  { id: '1', title: 'Login page not responsive on mobile', severity: 'medium', status: 'open', reportedBy: 'Arshiya Kapil', reportedAt: '2024-03-01' },
  { id: '2', title: 'Image upload fails for large files', severity: 'high', status: 'in_progress', reportedBy: 'Rahul Sharma', reportedAt: '2024-02-29' },
  { id: '3', title: 'Notification sound not working', severity: 'low', status: 'resolved', reportedBy: 'Priya Singh', reportedAt: '2024-02-28' }
]

export default function DevPortalPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [newCodeRole, setNewCodeRole] = useState('')
  const [newCodeUniversity, setNewCodeUniversity] = useState('')
  const [copiedCode, setCopiedCode] = useState('')

  useEffect(() => {
    // Check if user has developer access
    const managementAccess = localStorage.getItem('managementAccess')
    if (managementAccess) {
      const access = JSON.parse(managementAccess)
      if (access.hasAccess && access.role === 'developer' && access.expiresAt > Date.now()) {
        setIsAuthorized(true)
      } else {
        router.push('/auth/login')
      }
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const generateAccessCode = async () => {
    if (!newCodeRole || !newCodeUniversity) {
      alert('Please select role and university')
      return
    }

    // Generate code based on role
    const prefix = {
      'cr': 'CR',
      'community_leader': 'CL', 
      'professor': 'PROF',
      'admin': 'ADM'
    }[newCodeRole] || 'GEN'

    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newCode = `${prefix}-${timestamp}-${random}`

    // In real implementation, this would call an API
    console.log('Generated code:', newCode)
    alert(`Access code generated: ${newCode}`)
    
    // Reset form
    setNewCodeRole('')
    setNewCodeUniversity('')
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // API call to delete user
      console.log('Deleting user:', userId)
    }
  }

  const deleteRequest = (requestId: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      // API call to delete request
      console.log('Deleting request:', requestId)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60">You don't have permission to access the developer portal.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white">
                Developer Portal
              </h1>
              <p className="text-white/70 font-space">
                System administration and monitoring dashboard
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              System Online
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Developer Access
            </Badge>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-cyan mb-1">{systemStats.totalUsers}</div>
                <div className="text-white/60 text-sm font-space">Total Users</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-green mb-1">{systemStats.activeUsers}</div>
                <div className="text-white/60 text-sm font-space">Active Users</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-purple mb-1">{systemStats.totalPosts}</div>
                <div className="text-white/60 text-sm font-space">Total Posts</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-orange mb-1">{systemStats.systemUptime}</div>
                <div className="text-white/60 text-sm font-space">Uptime</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-morphism border-white/20 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="access-codes" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Access Codes
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              User Management
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="bugs" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Bug Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <Activity className="w-5 h-5 text-retro-green" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'error' ? 'bg-red-400' : 
                        activity.type === 'user_signup' ? 'bg-green-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.message}</p>
                        <p className="text-white/60 text-xs">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Response Time</span>
                    <Badge className="bg-green-500/20 text-green-400">{systemStats.responseTime}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Error Rate</span>
                    <Badge className="bg-green-500/20 text-green-400">{systemStats.errorRate}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Database</span>
                    <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Cache</span>
                    <Badge className="bg-green-500/20 text-green-400">Operational</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Access Codes Tab */}
          <TabsContent value="access-codes" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Generate New Code */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <Plus className="w-5 h-5 text-retro-green" />
                    Generate Access Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Role</label>
                    <select
                      value={newCodeRole}
                      onChange={(e) => setNewCodeRole(e.target.value)}
                      className="w-full mt-1 p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                    >
                      <option value="" className="bg-gray-800">Select Role</option>
                      <option value="cr" className="bg-gray-800">Class Representative</option>
                      <option value="community_leader" className="bg-gray-800">Community Leader</option>
                      <option value="professor" className="bg-gray-800">Professor</option>
                      <option value="admin" className="bg-gray-800">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-white/80 text-sm font-space">University</label>
                    <select
                      value={newCodeUniversity}
                      onChange={(e) => setNewCodeUniversity(e.target.value)}
                      className="w-full mt-1 p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                    >
                      <option value="" className="bg-gray-800">Select University</option>
                      <option value="SRM University Sonipat" className="bg-gray-800">SRM University Sonipat</option>
                      <option value="Delhi University" className="bg-gray-800">Delhi University</option>
                      <option value="JNU" className="bg-gray-800">Jawaharlal Nehru University</option>
                    </select>
                  </div>
                  
                  <Button
                    onClick={generateAccessCode}
                    className="w-full bg-gradient-to-r from-retro-green to-retro-cyan"
                  >
                    Generate Code
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Codes */}
              <Card className="glass-morphism border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Existing Access Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {accessCodes.map((code) => (
                      <div key={code.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-retro-cyan font-mono text-sm">{code.code}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(code.code)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedCode === code.code ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="text-white/60 text-xs">
                            {code.role} • {code.university} • Used {code.usageCount} times
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={code.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                            {code.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs would be implemented here... */}
        </Tabs>
      </div>
    </div>
  )
}
