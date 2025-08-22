'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Crown, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Mock data for CR admin
const sectionData = {
  section: 'CSE-3A',
  course: 'Computer Science Engineering',
  year: 3,
  semester: 6,
  totalStudents: 45,
  activeStudents: 42,
  university: 'SRM University Sonipat',
  department: 'Computer Science & Engineering',
  roomNumber: 'CS-301'
}

const mockNotes = [
  {
    id: '1',
    title: 'Data Structures - Trees and Graphs',
    subject: 'Data Structures',
    uploadedBy: 'Arshiya Kapil',
    uploadDate: '2024-03-10',
    fileType: 'PDF',
    fileSize: '2.3 MB',
    downloads: 23,
    status: 'approved'
  },
  {
    id: '2',
    title: 'Database Normalization Notes',
    subject: 'Database Management',
    uploadedBy: 'Rahul Sharma',
    uploadDate: '2024-03-08',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    downloads: 31,
    status: 'pending'
  }
]

const mockAssignments = [
  {
    id: '1',
    title: 'Binary Search Tree Implementation',
    subject: 'Data Structures',
    professor: 'Dr. Rajesh Kumar',
    dueDate: '2024-03-15',
    submissionCount: 38,
    totalStudents: 45,
    status: 'active'
  },
  {
    id: '2',
    title: 'Database Design Project',
    subject: 'Database Management',
    professor: 'Prof. Priya Sharma',
    dueDate: '2024-03-20',
    submissionCount: 12,
    totalStudents: 45,
    status: 'active'
  }
]

export default function CRAdminPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Form states
  const [newNote, setNewNote] = useState({
    title: '',
    subject: '',
    description: '',
    file: null as File | null
  })

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    professor: '',
    dueDate: '',
    description: '',
    submissionFormat: ''
  })

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'medium',
    expiryDate: ''
  })

  useEffect(() => {
    // Check if user has CR access
    const managementAccess = localStorage.getItem('managementAccess')
    if (managementAccess) {
      const access = JSON.parse(managementAccess)
      if (access.hasAccess && (access.role === 'cr' || access.role === 'developer') && access.expiresAt > Date.now()) {
        setIsAuthorized(true)
      } else {
        router.push('/auth/login')
      }
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const handleUploadNote = async () => {
    if (!newNote.title || !newNote.subject || !newNote.file) {
      alert('Please fill all required fields and select a file')
      return
    }

    // In real implementation, upload to Cloudinary and save to database
    console.log('Uploading note:', newNote)
    alert('Note uploaded successfully!')
    
    // Reset form
    setNewNote({
      title: '',
      subject: '',
      description: '',
      file: null
    })
  }

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.subject || !newAssignment.dueDate) {
      alert('Please fill all required fields')
      return
    }

    // In real implementation, save to database
    console.log('Creating assignment:', newAssignment)
    alert('Assignment created successfully!')
    
    // Reset form
    setNewAssignment({
      title: '',
      subject: '',
      professor: '',
      dueDate: '',
      description: '',
      submissionFormat: ''
    })
  }

  const handleSendAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Please fill all required fields')
      return
    }

    // In real implementation, save to database and send notifications
    console.log('Sending announcement:', newAnnouncement)
    alert('Announcement sent successfully!')
    
    // Reset form
    setNewAnnouncement({
      title: '',
      content: '',
      priority: 'medium',
      expiryDate: ''
    })
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60">You don't have permission to access the CR admin panel.</p>
          <p className="text-white/40 text-sm mt-2">Please login with a CR access code.</p>
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
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white">
                CR Admin Panel
              </h1>
              <p className="text-white/70 font-space">
                Class Representative Dashboard for {sectionData.section}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              👑 Class Representative
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {sectionData.section} Section
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              {sectionData.activeStudents}/{sectionData.totalStudents} Active
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-cyan mb-1">{sectionData.totalStudents}</div>
                <div className="text-white/60 text-sm font-space">Total Students</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-green mb-1">{mockNotes.length}</div>
                <div className="text-white/60 text-sm font-space">Shared Notes</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-purple mb-1">{mockAssignments.length}</div>
                <div className="text-white/60 text-sm font-space">Active Assignments</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-orange mb-1">98%</div>
                <div className="text-white/60 text-sm font-space">Attendance</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-morphism border-white/20 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Manage Notes
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Announcements
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Monitor Chat
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white text-sm">New note uploaded: "Database Normalization"</p>
                      <p className="text-white/60 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white text-sm">Assignment deadline reminder sent</p>
                      <p className="text-white/60 text-xs">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white text-sm">Class chat moderated - 2 messages removed</p>
                      <p className="text-white/60 text-xs">6 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab('notes')}
                    className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Class Notes
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('assignments')}
                    className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add Assignment Deadline
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('announcements')}
                    className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Announcement
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('chat')}
                    className="w-full justify-start bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Monitor Class Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notes Management Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upload New Note */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Upload New Note</CardTitle>
                  <CardDescription className="text-white/60">
                    Share study materials with your section
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Title</label>
                    <Input
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Data Structures - Trees and Graphs"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">Subject</label>
                    <select
                      value={newNote.subject}
                      onChange={(e) => setNewNote(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                    >
                      <option value="" className="bg-gray-800">Select Subject</option>
                      <option value="Data Structures" className="bg-gray-800">Data Structures</option>
                      <option value="Database Management" className="bg-gray-800">Database Management</option>
                      <option value="Computer Networks" className="bg-gray-800">Computer Networks</option>
                      <option value="Software Engineering" className="bg-gray-800">Software Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">Description (Optional)</label>
                    <Textarea
                      value={newNote.description}
                      onChange={(e) => setNewNote(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the notes..."
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">File</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={(e) => setNewNote(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                      className="w-full p-2 glass-morphism border-white/20 rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-retro-cyan file:text-black"
                    />
                  </div>

                  <Button
                    onClick={handleUploadNote}
                    className="w-full bg-gradient-to-r from-retro-cyan to-retro-blue"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Note
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Notes */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Manage Existing Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockNotes.map((note) => (
                      <div key={note.id} className="p-3 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-white font-semibold text-sm">{note.title}</h4>
                            <p className="text-white/60 text-xs">{note.subject} • {note.fileSize}</p>
                          </div>
                          <Badge className={note.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                            {note.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-xs">{note.downloads} downloads</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create Assignment */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Add Assignment Deadline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Assignment Title</label>
                    <Input
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Binary Search Tree Implementation"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/80 text-sm font-space">Subject</label>
                      <select
                        value={newAssignment.subject}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                      >
                        <option value="" className="bg-gray-800">Select Subject</option>
                        <option value="Data Structures" className="bg-gray-800">Data Structures</option>
                        <option value="Database Management" className="bg-gray-800">Database Management</option>
                        <option value="Computer Networks" className="bg-gray-800">Computer Networks</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/80 text-sm font-space">Due Date</label>
                      <Input
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="glass-morphism border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">Professor</label>
                    <Input
                      value={newAssignment.professor}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, professor: e.target.value }))}
                      placeholder="e.g., Dr. Rajesh Kumar"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">Description</label>
                    <Textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Assignment details and requirements..."
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleCreateAssignment}
                    className="w-full bg-gradient-to-r from-retro-green to-retro-cyan"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add Assignment
                  </Button>
                </CardContent>
              </Card>

              {/* Assignment List */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Active Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-semibold">{assignment.title}</h4>
                            <p className="text-white/60 text-sm">{assignment.subject} • {assignment.professor}</p>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400">
                            Due {assignment.dueDate}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-retro-cyan">{assignment.submissionCount}</span>
                            <span className="text-white/60">/{assignment.totalStudents} submitted</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                              View Submissions
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                              Send Reminder
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create Assignment */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Add Assignment Deadline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Assignment Title</label>
                    <Input
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Binary Search Tree Implementation"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/80 text-sm font-space">Subject</label>
                      <select
                        value={newAssignment.subject}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                        className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                      >
                        <option value="" className="bg-gray-800">Select Subject</option>
                        <option value="Data Structures" className="bg-gray-800">Data Structures</option>
                        <option value="Database Management" className="bg-gray-800">Database Management</option>
                        <option value="Computer Networks" className="bg-gray-800">Computer Networks</option>
                        <option value="Software Engineering" className="bg-gray-800">Software Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/80 text-sm font-space">Due Date</label>
                      <Input
                        type="date"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="glass-morphism border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">Professor</label>
                    <Input
                      value={newAssignment.professor}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, professor: e.target.value }))}
                      placeholder="e.g., Dr. Rajesh Kumar"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">Description</label>
                    <Textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Assignment details and requirements..."
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <Button
                    onClick={handleCreateAssignment}
                    className="w-full bg-gradient-to-r from-retro-green to-retro-cyan"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Add Assignment
                  </Button>
                </CardContent>
              </Card>

              {/* Assignment List */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Active Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 border border-white/10 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-white font-semibold">{assignment.title}</h4>
                            <p className="text-white/60 text-sm">{assignment.subject} • {assignment.professor}</p>
                          </div>
                          <Badge className="bg-orange-500/20 text-orange-400">
                            Due {assignment.dueDate}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-retro-cyan">{assignment.submissionCount}</span>
                            <span className="text-white/60">/{assignment.totalStudents} submitted</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-3 text-xs"
                              onClick={() => alert(`Viewing submissions for: ${assignment.title}`)}
                            >
                              View Submissions
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-3 text-xs"
                              onClick={() => alert(`Reminder sent for: ${assignment.title}`)}
                            >
                              Send Reminder
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Create Announcement */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Send Announcement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Title</label>
                    <Input
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Important: Class Cancelled Tomorrow"
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-space">Message</label>
                    <Textarea
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Type your announcement message here..."
                      className="glass-morphism border-white/20 text-white"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/80 text-sm font-space">Priority</label>
                      <select
                        value={newAnnouncement.priority}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-2 glass-morphism border-white/20 rounded text-white bg-transparent"
                      >
                        <option value="low" className="bg-gray-800">Low Priority</option>
                        <option value="medium" className="bg-gray-800">Medium Priority</option>
                        <option value="high" className="bg-gray-800">High Priority</option>
                        <option value="urgent" className="bg-gray-800">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-white/80 text-sm font-space">Expiry Date (Optional)</label>
                      <Input
                        type="date"
                        value={newAnnouncement.expiryDate}
                        onChange={(e) => setNewAnnouncement(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="glass-morphism border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendAnnouncement}
                    className="w-full bg-gradient-to-r from-retro-purple to-retro-pink"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Announcement
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Announcements */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border border-white/10 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold text-sm">Class Schedule Update</h4>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">Medium</Badge>
                      </div>
                      <p className="text-white/70 text-xs mb-2">Tomorrow's Data Structures class has been moved to 2 PM.</p>
                      <span className="text-white/50 text-xs">Sent 2 hours ago</span>
                    </div>

                    <div className="p-3 border border-white/10 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold text-sm">Assignment Reminder</h4>
                        <Badge className="bg-red-500/20 text-red-400 text-xs">High</Badge>
                      </div>
                      <p className="text-white/70 text-xs mb-2">Database project submission deadline is tomorrow!</p>
                      <span className="text-white/50 text-xs">Sent 1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Monitoring Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Class Chat Monitoring</CardTitle>
                <CardDescription className="text-white/60">
                  Monitor and moderate class chat messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-retro-cyan">156</div>
                      <div className="text-white/60 text-sm">Messages Today</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-retro-green">32</div>
                      <div className="text-white/60 text-sm">Active Users</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-retro-orange">2</div>
                      <div className="text-white/60 text-sm">Flagged Messages</div>
                    </div>
                  </div>

                  {/* Recent Messages */}
                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">Recent Messages</h4>

                    <div className="p-3 border border-white/10 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">Rahul Sharma</span>
                          <span className="text-white/60 text-xs">2 minutes ago</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:bg-red-500/10"
                          onClick={() => alert('Message moderation feature will be implemented')}
                        >
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-white/80 text-sm">Can someone share the notes from today's lecture?</p>
                    </div>

                    <div className="p-3 border border-white/10 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">Priya Singh</span>
                          <span className="text-white/60 text-xs">5 minutes ago</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:bg-green-500/10"
                          onClick={() => alert('Message approved')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-white/80 text-sm">Thanks for the assignment clarification!</p>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      onClick={() => alert('Opening full chat interface...')}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Chat
                    </Button>
                    <Button
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                      onClick={() => alert('Chat settings will be implemented')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Chat Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-retro text-white">Class Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Academic Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Average Assignment Score</span>
                      <span className="text-green-400 font-bold">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Submission Rate</span>
                      <span className="text-blue-400 font-bold">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Class Attendance</span>
                      <span className="text-purple-400 font-bold">88%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Active Participation</span>
                      <span className="text-orange-400 font-bold">76%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Daily Chat Messages</span>
                      <span className="text-green-400 font-bold">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Notes Downloads</span>
                      <span className="text-blue-400 font-bold">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Study Group Participation</span>
                      <span className="text-purple-400 font-bold">34%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Help Requests</span>
                      <span className="text-orange-400 font-bold">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Export Options */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Export Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    onClick={() => alert('Exporting attendance report...')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Attendance Report
                  </Button>
                  <Button
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    onClick={() => alert('Exporting performance report...')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Performance Report
                  </Button>
                  <Button
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                    onClick={() => alert('Exporting engagement report...')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Engagement Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
