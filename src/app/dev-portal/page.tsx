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
  Zap,
  Key,
  RefreshCw,
  Crown,
  Server,
  Monitor,
  Download,
  Send,
  FileText
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

const mockAccessCodes = [
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
  const [accessCodes, setAccessCodes] = useState(mockAccessCodes)
  const [isLoading, setIsLoading] = useState(false)
  const [databaseStatus, setDatabaseStatus] = useState<any>(null)
  const [isInitializingDb, setIsInitializingDb] = useState(false)

  // Load access codes from API
  const loadAccessCodes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/access-codes', {
        headers: {
          'x-management-access': 'true'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setAccessCodes(result.accessCodes || [])
      } else {
        console.error('Failed to load access codes:', response.status)
        alert('Failed to load access codes. Check console for details.')
      }
    } catch (error) {
      console.error('Error loading access codes:', error)
      alert('Error loading access codes. Check console for details.')
    } finally {
      setIsLoading(false)
    }
  }

  // Check database status
  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/admin/init-database', {
        headers: {
          'x-management-access': 'true'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setDatabaseStatus(result)
      } else {
        console.error('Failed to check database status:', response.status)
      }
    } catch (error) {
      console.error('Error checking database status:', error)
    }
  }

  // Initialize database
  const initializeDatabase = async () => {
    try {
      setIsInitializingDb(true)
      const response = await fetch('/api/admin/init-database', {
        method: 'POST',
        headers: {
          'x-management-access': 'true'
        }
      })

      const result = await response.json()

      if (response.ok) {
        alert('✅ Database initialized successfully!')
        await checkDatabaseStatus() // Refresh status
        await loadAccessCodes() // Refresh access codes
      } else {
        alert(`❌ Database initialization failed:\n${result.error}`)
      }
    } catch (error) {
      console.error('Error initializing database:', error)
      alert('❌ Error initializing database. Check console for details.')
    } finally {
      setIsInitializingDb(false)
    }
  }

  useEffect(() => {
    // Check if user has developer access
    const managementAccess = localStorage.getItem('managementAccess')
    if (managementAccess) {
      const access = JSON.parse(managementAccess)
      if (access.hasAccess && access.role === 'developer' && access.expiresAt > Date.now()) {
        setIsAuthorized(true)
        // Load initial data
        checkDatabaseStatus()
        loadAccessCodes()
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

    try {
      const response = await fetch('/api/admin/access-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-management-access': 'true' // Add auth header
        },
        body: JSON.stringify({
          role: newCodeRole,
          university: newCodeUniversity,
          description: `${newCodeRole} access for ${newCodeUniversity}`,
          expiresInDays: 30,
          maxUsage: 100
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`✅ Access Code Generated Successfully!\n\nCode: ${result.accessCode.code}\nRole: ${result.accessCode.role}\nUniversity: ${result.accessCode.university}\nExpires: ${new Date(result.accessCode.expiresAt).toLocaleDateString()}\nMax Usage: ${result.accessCode.maxUsage}\n\n📋 Code copied to clipboard!`)

        // Copy to clipboard
        navigator.clipboard.writeText(result.accessCode.code)

        // Refresh the access codes list
        await loadAccessCodes()

        // Reset form
        setNewCodeRole('')
        setNewCodeUniversity('')
      } else {
        alert(`❌ Failed to generate access code:\n${result.error}`)
      }
    } catch (error) {
      console.error('Error generating access code:', error)
      alert('❌ Failed to generate access code. Please try again.')
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const deleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-management-access': 'true'
          },
          body: JSON.stringify({ userId })
        })

        const result = await response.json()

        if (result.success) {
          alert(`✅ User deleted successfully!\n\nActions taken:\n- User account deactivated\n- Personal data removed\n- Posts and comments anonymized\n- Community memberships revoked`)
          // Refresh user list if we had one
        } else {
          alert(`❌ Failed to delete user:\n${result.error}`)
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('❌ Error deleting user. Check console for details.')
      }
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
            <TabsTrigger value="content" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Content Management
            </TabsTrigger>
            <TabsTrigger value="universities" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Universities
            </TabsTrigger>
            <TabsTrigger value="communities" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Communities
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              System Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Database Status Alert */}
            {databaseStatus && (
              <Card className={`glass-morphism border-2 ${
                databaseStatus.status === 'initialized' ? 'border-green-500/30 bg-green-500/5' :
                databaseStatus.status === 'needs_initialization' ? 'border-yellow-500/30 bg-yellow-500/5' :
                databaseStatus.status === 'mock_mode' ? 'border-blue-500/30 bg-blue-500/5' :
                'border-red-500/30 bg-red-500/5'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold mb-1">
                        Database Status: {databaseStatus.status?.replace('_', ' ').toUpperCase()}
                      </h3>
                      <p className="text-white/70 text-sm">{databaseStatus.message}</p>
                      {databaseStatus.skipConnection && (
                        <p className="text-blue-400 text-xs mt-1">
                          ⚠️ Running in mock mode - Set SKIP_DATABASE_CONNECTION=false to use real database
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={checkDatabaseStatus}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      {databaseStatus.status === 'needs_initialization' && (
                        <Button
                          size="sm"
                          onClick={initializeDatabase}
                          disabled={isInitializingDb}
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                        >
                          {isInitializingDb ? 'Initializing...' : 'Initialize DB'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

              {/* All Access Codes */}
              <Card className="glass-morphism border-white/20 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center justify-between">
                    All Access Codes
                    <Button
                      size="sm"
                      onClick={loadAccessCodes}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      disabled={isLoading}
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Master Developer Code */}
                    <div className="p-3 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-yellow-400 font-mono text-sm font-bold">19022552</code>
                            <Badge className="bg-yellow-500/20 text-yellow-400">Master Developer</Badge>
                            <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard('19022552')}
                              className="h-6 w-6 p-0"
                            >
                              {copiedCode === '19022552' ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                          <div className="text-white/60 text-xs">
                            Full system access • All universities • Unlimited usage • Never expires
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generated Codes */}
                    {accessCodes.map((code: any) => (
                      <div key={code.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-retro-cyan font-mono text-sm">{code.code}</code>
                            <Badge className={
                              code.role === 'developer' ? 'bg-yellow-500/20 text-yellow-400' :
                              code.role === 'cr' ? 'bg-orange-500/20 text-orange-400' :
                              code.role === 'community_leader' ? 'bg-purple-500/20 text-purple-400' :
                              code.role === 'professor' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }>
                              {code.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={code.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                              {code.isActive ? 'Active' : 'Inactive'}
                            </Badge>
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
                            {code.university} • Created {code.createdAt} • Used {code.usageCount} times
                            {code.expiresAt && ` • Expires ${new Date(code.expiresAt).toLocaleDateString()}`}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => {
                              if (confirm(`Deactivate access code: ${code.code}?`)) {
                                alert(`Access code ${code.code} has been deactivated.`)
                                loadAccessCodes() // Refresh the list
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {accessCodes.length === 0 && !isLoading && (
                      <div className="text-center py-8 text-white/60">
                        <Key className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No generated access codes yet</p>
                        <p className="text-sm">Generate your first access code above</p>
                      </div>
                    )}

                    {isLoading && (
                      <div className="text-center py-8 text-white/60">
                        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        <p>Loading access codes...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <Users className="w-5 h-5 text-retro-blue" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* User Search */}
                  <div className="flex gap-4">
                    <Input
                      placeholder="Search users by name, email, or university..."
                      className="glass-morphism border-white/20 text-white flex-1"
                    />
                    <Button className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30">
                      Search
                    </Button>
                  </div>

                  {/* User List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Arshiya Kapil</h4>
                        <p className="text-white/60 text-sm">arshiya.kapil@srm.edu.in • SRM University Sonipat • Verified</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400"
                          onClick={() => alert('User Details:\n- Registration: March 1, 2024\n- Posts: 23\n- Communities: 3\n- Last Active: 2 hours ago\n- Role: Student\n- Verification: ID Verified')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400"
                          onClick={() => deleteUser('user-1')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Rahul Sharma</h4>
                        <p className="text-white/60 text-sm">rahul.sharma@du.ac.in • Delhi University • Pending Verification</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400"
                          onClick={() => alert('User Details:\n- Registration: February 28, 2024\n- Posts: 12\n- Communities: 1\n- Last Active: 1 day ago\n- Role: Student\n- Verification: Pending')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400"
                          onClick={() => alert('User verification approved!')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400"
                          onClick={() => deleteUser('user-2')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Dr. Priya Singh</h4>
                        <p className="text-white/60 text-sm">priya.singh@jnu.ac.in • JNU • Professor • Verified</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400"
                          onClick={() => alert('Professor Details:\n- Registration: February 20, 2024\n- Role: Professor\n- Department: Computer Science\n- Communities: 2\n- Students Mentored: 45')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Badge className="bg-purple-500/20 text-purple-400">Professor</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      onClick={() => alert('Bulk verification feature:\n- Select multiple users\n- Verify all at once\n- Send welcome emails\n- Update user roles')}
                    >
                      Bulk Verify
                    </Button>
                    <Button
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      onClick={() => alert('Export user data:\n- CSV format\n- Excel format\n- Filtered by university\n- Include activity metrics')}
                    >
                      Export Data
                    </Button>
                    <Button
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                      onClick={() => alert('Send notifications:\n- System announcements\n- Feature updates\n- Maintenance notices\n- Custom messages')}
                    >
                      Send Notification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-retro-green" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">CPU Usage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-white/20 rounded-full">
                        <div className="w-1/4 h-full bg-green-400 rounded-full"></div>
                      </div>
                      <span className="text-green-400 text-sm">25%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Memory Usage</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-white/20 rounded-full">
                        <div className="w-1/2 h-full bg-yellow-400 rounded-full"></div>
                      </div>
                      <span className="text-yellow-400 text-sm">52%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Database Load</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-white/20 rounded-full">
                        <div className="w-1/3 h-full bg-blue-400 rounded-full"></div>
                      </div>
                      <span className="text-blue-400 text-sm">33%</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <Button
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      onClick={() => alert('Detailed monitoring:\n- Real-time metrics\n- Historical data\n- Performance alerts\n- Resource optimization\n- Scaling recommendations')}
                    >
                      View Detailed Metrics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Database Status */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <Database className="w-5 h-5 text-retro-blue" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Connection Status</span>
                    <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Collections</span>
                    <span className="text-white">12</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Total Documents</span>
                    <span className="text-white">18,547</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Storage Used</span>
                    <span className="text-white">2.3 GB</span>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <Button
                      className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      onClick={() => alert('Database backup initiated...\nBackup will be saved to cloud storage.')}
                    >
                      Create Backup
                    </Button>
                    <Button
                      className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                      onClick={() => alert('Database optimization:\n- Index optimization\n- Query performance analysis\n- Storage cleanup\n- Connection pooling')}
                    >
                      Optimize Database
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Logs */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="text-xs font-mono text-green-400">
                    [2024-03-15 14:30:25] INFO: User authentication successful - user_id: 1234
                  </div>
                  <div className="text-xs font-mono text-blue-400">
                    [2024-03-15 14:30:20] DEBUG: Database query executed - duration: 45ms
                  </div>
                  <div className="text-xs font-mono text-yellow-400">
                    [2024-03-15 14:30:15] WARN: High memory usage detected - 85% utilized
                  </div>
                  <div className="text-xs font-mono text-red-400">
                    [2024-03-15 14:30:10] ERROR: Failed to send email notification - SMTP timeout
                  </div>
                  <div className="text-xs font-mono text-green-400">
                    [2024-03-15 14:30:05] INFO: New user registration - email: user@example.com
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    onClick={() => alert('Downloading system logs...')}
                  >
                    Download Logs
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    onClick={() => alert('Clearing old logs...')}
                  >
                    Clear Old Logs
                  </Button>
                  <Button
                    size="sm"
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                    onClick={() => alert('Log filtering options:\n- Filter by level (INFO, WARN, ERROR)\n- Filter by date range\n- Filter by component\n- Search by keyword')}
                  >
                    Filter Logs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bug Reports Tab */}
          <TabsContent value="bugs" className="space-y-6">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <Bug className="w-5 h-5 text-retro-red" />
                  Bug Reports & Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bugReports.map((bug) => (
                    <div key={bug.id} className="p-4 border border-white/10 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">{bug.title}</h4>
                        <div className="flex gap-2">
                          <Badge className={
                            bug.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                            bug.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }>
                            {bug.severity}
                          </Badge>
                          <Badge className={
                            bug.status === 'open' ? 'bg-red-500/20 text-red-400' :
                            bug.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }>
                            {bug.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm mb-2">
                        Reported by {bug.reportedBy} on {bug.reportedAt}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                          onClick={() => alert(`Bug Details:\n\nTitle: ${bug.title}\nSeverity: ${bug.severity}\nStatus: ${bug.status}\nReported by: ${bug.reportedBy}\nDate: ${bug.reportedAt}\n\nDescription: Detailed bug description and reproduction steps would be shown here.\n\nActions available:\n- Assign to developer\n- Change status\n- Add comments\n- Set priority`)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                          onClick={() => alert(`Status updated to: In Progress\nAssigned to: Development Team\nPriority: ${bug.severity}`)}
                        >
                          Update Status
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                          onClick={() => alert(`Assigning bug to developer...\nAvailable developers:\n- John Doe (Frontend)\n- Jane Smith (Backend)\n- Mike Johnson (Full Stack)`)}
                        >
                          Assign
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Bug Management Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      onClick={() => alert('Creating new bug report...\nForm will include:\n- Title and description\n- Severity level\n- Steps to reproduce\n- Expected vs actual behavior\n- Screenshots/attachments')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Bug Report
                    </Button>
                    <Button
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      onClick={() => alert('Export bug reports:\n- CSV format\n- Filter by status\n- Filter by severity\n- Date range selection')}
                    >
                      Export Reports
                    </Button>
                    <Button
                      className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                      onClick={() => alert('Bug analytics:\n- Resolution time trends\n- Bug frequency by component\n- Severity distribution\n- Reporter statistics')}
                    >
                      View Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Posts Management */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Posts Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">1,247</div>
                      <div className="text-white/60 text-sm">Total Posts</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-red-400">23</div>
                      <div className="text-white/60 text-sm">Flagged Posts</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      onClick={() => alert('Post moderation interface:\n- View all posts\n- Filter by university/date\n- Approve/reject posts\n- Ban users for violations\n- Export content reports')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Moderate Posts
                    </Button>
                    <Button
                      className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      onClick={() => alert('Flagged content review:\n- Review reported posts\n- Take action on violations\n- Send warnings to users\n- Update community guidelines')}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Review Flagged Content
                    </Button>
                    <Button
                      className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      onClick={() => alert('Content analytics:\n- Engagement metrics\n- Popular content trends\n- User activity patterns\n- Content performance reports')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Content Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Announcements Management */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">System Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/80 text-sm font-space">Announcement Title</label>
                      <Input
                        placeholder="e.g., Platform Maintenance Scheduled"
                        className="glass-morphism border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 text-sm font-space">Message</label>
                      <textarea
                        placeholder="Enter announcement message..."
                        className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/80 text-sm font-space">Priority</label>
                        <select className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent">
                          <option value="low" className="bg-gray-800">Low</option>
                          <option value="medium" className="bg-gray-800">Medium</option>
                          <option value="high" className="bg-gray-800">High</option>
                          <option value="urgent" className="bg-gray-800">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-white/80 text-sm font-space">Target</label>
                        <select className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent">
                          <option value="all" className="bg-gray-800">All Users</option>
                          <option value="students" className="bg-gray-800">Students Only</option>
                          <option value="crs" className="bg-gray-800">CRs Only</option>
                          <option value="leaders" className="bg-gray-800">Community Leaders</option>
                        </select>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                      onClick={() => alert('System announcement sent!\n\nFeatures:\n- Push notifications\n- In-app banners\n- Email notifications\n- SMS alerts (urgent only)\n- Delivery tracking')}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Announcement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Universities Management Tab */}
          <TabsContent value="universities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-retro text-white">Universities Management</h2>
              <Button
                className="bg-gradient-to-r from-green-400 to-blue-500"
                onClick={() => alert('Add University Form:\n- University name\n- Location\n- Type (Public/Private)\n- Website\n- Verification requirements\n- Email domains\n- Admin contacts')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add University
              </Button>
            </div>

            <div className="grid gap-4">
              {/* University List */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Registered Universities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">SRM University Sonipat</h4>
                        <p className="text-white/60 text-sm">Sonipat, Haryana • Private • 2,847 students</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400"
                          onClick={() => alert('University Details:\n- Total Students: 2,847\n- Active Communities: 12\n- CRs: 45\n- Verification Rate: 89%\n- Last Activity: 2 hours ago')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400"
                          onClick={() => alert('University Settings:\n- Update information\n- Manage email domains\n- Set verification rules\n- Configure features\n- Assign administrators')}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Delhi University</h4>
                        <p className="text-white/60 text-sm">Delhi • Public • 1,923 students</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400"
                          onClick={() => alert('University Details:\n- Total Students: 1,923\n- Active Communities: 8\n- CRs: 32\n- Verification Rate: 94%\n- Last Activity: 1 hour ago')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400"
                          onClick={() => alert('University Settings:\n- Update information\n- Manage email domains\n- Set verification rules\n- Configure features\n- Assign administrators')}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div>
                        <h4 className="text-white font-semibold">Jawaharlal Nehru University</h4>
                        <p className="text-white/60 text-sm">New Delhi • Public • 756 students</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-yellow-500/20 text-yellow-400">Pending Verification</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400"
                          onClick={() => alert('University Details:\n- Total Students: 756\n- Active Communities: 3\n- CRs: 12\n- Verification Rate: 67%\n- Status: Pending admin verification')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400"
                          onClick={() => alert('Verify University:\n- Review documentation\n- Confirm official status\n- Set up email domains\n- Approve registration')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communities Management Tab */}
          <TabsContent value="communities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-retro text-white">Communities Management</h2>
              <Button
                className="bg-gradient-to-r from-purple-400 to-pink-500"
                onClick={() => alert('Create Community Template:\n- Community name\n- Category\n- Description\n- Requirements\n- University assignment\n- Leader assignment\n- Auto-approval rules')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Community
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Community Stats */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Community Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-purple-400">47</div>
                      <div className="text-white/60 text-sm">Total Communities</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-green-400">42</div>
                      <div className="text-white/60 text-sm">Active</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-yellow-400">156</div>
                      <div className="text-white/60 text-sm">Pending Applications</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">2,847</div>
                      <div className="text-white/60 text-sm">Total Members</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Actions */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Management Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    onClick={() => alert('Community Management:\n- View all communities\n- Edit community details\n- Assign/remove leaders\n- Set member limits\n- Configure auto-approval\n- Archive inactive communities')}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage All Communities
                  </Button>
                  <Button
                    className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                    onClick={() => alert('Application Review:\n- Bulk approve/reject\n- Set approval criteria\n- Review flagged applications\n- Send custom responses\n- Export application data')}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Review Applications
                  </Button>
                  <Button
                    className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    onClick={() => alert('Community Analytics:\n- Growth trends\n- Engagement metrics\n- Popular categories\n- Member retention\n- Activity patterns\n- Success metrics')}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Community Analytics
                  </Button>
                  <Button
                    className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                    onClick={() => alert('Category Management:\n- Create new categories\n- Edit existing categories\n- Set category requirements\n- Assign category moderators\n- Configure category rules')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Categories
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Communities */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Recent Communities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div>
                      <h4 className="text-white font-semibold">SRM Tech Innovators</h4>
                      <p className="text-white/60 text-sm">Technology • 234 members • SRM University Sonipat</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400"
                        onClick={() => alert('Community Details:\n- Leader: Arshiya Kapil\n- Created: March 2023\n- Applications: 12 pending\n- Events: 5 this month\n- Engagement: 89%')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                    <div>
                      <h4 className="text-white font-semibold">DU Creative Arts Society</h4>
                      <p className="text-white/60 text-sm">Arts & Culture • 156 members • Delhi University</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400"
                        onClick={() => alert('Community Details:\n- Leader: Priya Singh\n- Created: February 2023\n- Applications: 8 pending\n- Events: 3 this month\n- Engagement: 76%')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-retro text-white">System Settings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Platform Configuration */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Platform Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Platform Name</label>
                    <Input
                      defaultValue="REPPD"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-space">Platform Description</label>
                    <textarea
                      defaultValue="Social learning platform for university students"
                      className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/80 text-sm font-space">Max File Size (MB)</label>
                      <Input
                        type="number"
                        defaultValue="10"
                        className="glass-morphism border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 text-sm font-space">Session Timeout (hours)</label>
                      <Input
                        type="number"
                        defaultValue="24"
                        className="glass-morphism border-white/20 text-white"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    onClick={() => alert('Platform settings updated!\n\nChanges applied:\n- Platform configuration\n- File upload limits\n- Session management\n- Security settings')}
                  >
                    Save Platform Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Feature Toggles */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Feature Toggles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">User Registration</span>
                    <Button
                      size="sm"
                      className="bg-green-500/20 text-green-400"
                      onClick={() => alert('Feature toggled: User Registration\nStatus: Enabled → Disabled')}
                    >
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Community Creation</span>
                    <Button
                      size="sm"
                      className="bg-green-500/20 text-green-400"
                      onClick={() => alert('Feature toggled: Community Creation\nStatus: Enabled → Disabled')}
                    >
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">File Uploads</span>
                    <Button
                      size="sm"
                      className="bg-green-500/20 text-green-400"
                      onClick={() => alert('Feature toggled: File Uploads\nStatus: Enabled → Disabled')}
                    >
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Real-time Chat</span>
                    <Button
                      size="sm"
                      className="bg-red-500/20 text-red-400"
                      onClick={() => alert('Feature toggled: Real-time Chat\nStatus: Disabled → Enabled')}
                    >
                      Disabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Push Notifications</span>
                    <Button
                      size="sm"
                      className="bg-green-500/20 text-green-400"
                      onClick={() => alert('Feature toggled: Push Notifications\nStatus: Enabled → Disabled')}
                    >
                      Enabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Email Notifications</span>
                    <Button
                      size="sm"
                      className="bg-green-500/20 text-green-400"
                      onClick={() => alert('Feature toggled: Email Notifications\nStatus: Enabled → Disabled')}
                    >
                      Enabled
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Password Min Length</label>
                    <Input
                      type="number"
                      defaultValue="8"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-space">Max Login Attempts</label>
                    <Input
                      type="number"
                      defaultValue="5"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Two-Factor Authentication</span>
                    <Button
                      size="sm"
                      className="bg-red-500/20 text-red-400"
                      onClick={() => alert('2FA Settings:\nStatus: Disabled → Enabled\nMethods: SMS, Email, Authenticator App')}
                    >
                      Disabled
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Content Moderation</span>
                    <Button
                      size="sm"
                      className="bg-green-500/20 text-green-400"
                      onClick={() => alert('Content Moderation:\nAuto-moderation: Enabled\nManual review: Required\nAI filtering: Active')}
                    >
                      Enabled
                    </Button>
                  </div>
                  <Button
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                    onClick={() => alert('Security settings updated!\n\nChanges applied:\n- Password policies\n- Login security\n- 2FA configuration\n- Content moderation rules')}
                  >
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Backup & Maintenance */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Backup & Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      onClick={() => alert('Database backup initiated!\n\nBackup details:\n- Full database backup\n- Includes user data, posts, communities\n- Encrypted and compressed\n- Stored in cloud storage\n- Estimated time: 15 minutes')}
                    >
                      <Database className="w-4 h-4 mr-2" />
                      Create Database Backup
                    </Button>
                    <Button
                      className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      onClick={() => alert('System maintenance mode:\n\nMaintenance features:\n- Enable maintenance mode\n- Custom maintenance message\n- Estimated downtime\n- Notify all users\n- Graceful shutdown')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Maintenance Mode
                    </Button>
                    <Button
                      className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                      onClick={() => alert('System cleanup initiated!\n\nCleanup tasks:\n- Remove old logs\n- Clean temporary files\n- Optimize database\n- Clear cache\n- Update indexes')}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      System Cleanup
                    </Button>
                    <Button
                      className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                      onClick={() => alert('Export system data:\n\nExport options:\n- User analytics\n- Content reports\n- System logs\n- Performance metrics\n- Compliance reports')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export System Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
