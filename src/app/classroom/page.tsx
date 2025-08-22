'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MessageCircle,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  FileText,
  Video,
  Link as LinkIcon,
  Send,
  Paperclip,
  Eye
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RealTimeChat } from '@/components/chat/real-time-chat'

// Mock data for classroom
const classroomData = {
  section: 'CSE-3A',
  course: 'Computer Science Engineering',
  year: 3,
  semester: 6,
  totalStudents: 45,
  classRepresentative: 'Arshiya Kapil',
  university: 'SRM University Sonipat',
  department: 'Computer Science & Engineering',
  batch: '2022-2026',
  roomNumber: 'CS-301',
  mentorFaculty: 'Dr. Rajesh Kumar'
}

const professors = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    subject: 'Data Structures & Algorithms',
    email: 'rajesh.kumar@srm.edu',
    office: 'Room 301, CS Block',
    officeHours: 'Mon-Wed 2:00-4:00 PM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: '2',
    name: 'Prof. Priya Sharma',
    subject: 'Database Management Systems',
    email: 'priya.sharma@srm.edu',
    office: 'Room 205, CS Block',
    officeHours: 'Tue-Thu 10:00-12:00 PM',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150'
  },
  {
    id: '3',
    name: 'Dr. Amit Singh',
    subject: 'Computer Networks',
    email: 'amit.singh@srm.edu',
    office: 'Room 402, CS Block',
    officeHours: 'Mon-Fri 3:00-5:00 PM',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  }
]

const timetable = [
  { day: 'Monday', slots: [
    { time: '9:00-10:00', subject: 'Data Structures', professor: 'Dr. Rajesh Kumar', room: 'CS-101' },
    { time: '10:00-11:00', subject: 'Database Systems', professor: 'Prof. Priya Sharma', room: 'CS-102' },
    { time: '11:30-12:30', subject: 'Computer Networks', professor: 'Dr. Amit Singh', room: 'CS-103' },
    { time: '2:00-5:00', subject: 'Lab - Data Structures', professor: 'Dr. Rajesh Kumar', room: 'Lab-1' }
  ]},
  { day: 'Tuesday', slots: [
    { time: '9:00-10:00', subject: 'Database Systems', professor: 'Prof. Priya Sharma', room: 'CS-102' },
    { time: '10:00-11:00', subject: 'Computer Networks', professor: 'Dr. Amit Singh', room: 'CS-103' },
    { time: '11:30-12:30', subject: 'Software Engineering', professor: 'Dr. Rajesh Kumar', room: 'CS-101' }
  ]},
  { day: 'Wednesday', slots: [
    { time: '9:00-10:00', subject: 'Data Structures', professor: 'Dr. Rajesh Kumar', room: 'CS-101' },
    { time: '10:00-11:00', subject: 'Database Systems', professor: 'Prof. Priya Sharma', room: 'CS-102' },
    { time: '2:00-5:00', subject: 'Lab - Database', professor: 'Prof. Priya Sharma', room: 'Lab-2' }
  ]},
  { day: 'Thursday', slots: [
    { time: '9:00-10:00', subject: 'Computer Networks', professor: 'Dr. Amit Singh', room: 'CS-103' },
    { time: '10:00-11:00', subject: 'Software Engineering', professor: 'Dr. Rajesh Kumar', room: 'CS-101' },
    { time: '11:30-12:30', subject: 'Database Systems', professor: 'Prof. Priya Sharma', room: 'CS-102' }
  ]},
  { day: 'Friday', slots: [
    { time: '9:00-10:00', subject: 'Data Structures', professor: 'Dr. Rajesh Kumar', room: 'CS-101' },
    { time: '10:00-11:00', subject: 'Computer Networks', professor: 'Dr. Amit Singh', room: 'CS-103' },
    { time: '2:00-5:00', subject: 'Lab - Networks', professor: 'Dr. Amit Singh', room: 'Lab-3' }
  ]}
]

const assignments = [
  {
    id: '1',
    title: 'Binary Search Tree Implementation',
    subject: 'Data Structures',
    professor: 'Dr. Rajesh Kumar',
    dueDate: '2024-03-15',
    status: 'pending',
    type: 'assignment',
    description: 'Implement BST with insert, delete, and search operations',
    submissionFormat: 'Code + Report'
  },
  {
    id: '2',
    title: 'Database Design Project',
    subject: 'Database Systems',
    professor: 'Prof. Priya Sharma',
    dueDate: '2024-03-20',
    status: 'submitted',
    type: 'project',
    description: 'Design a complete database for library management system',
    submissionFormat: 'ER Diagram + SQL Scripts'
  },
  {
    id: '3',
    title: 'Network Protocol Analysis',
    subject: 'Computer Networks',
    professor: 'Dr. Amit Singh',
    dueDate: '2024-03-10',
    status: 'overdue',
    type: 'lab',
    description: 'Analyze TCP/IP packet flow using Wireshark',
    submissionFormat: 'Lab Report + Screenshots'
  }
]

const notes = [
  {
    id: '1',
    title: 'Binary Trees - Complete Notes',
    subject: 'Data Structures',
    professor: 'Dr. Rajesh Kumar',
    uploadedBy: 'Arshiya Kapil',
    uploadDate: '2024-03-01',
    fileType: 'PDF',
    fileSize: '2.3 MB',
    downloads: 23,
    url: '#'
  },
  {
    id: '2',
    title: 'SQL Joins and Subqueries',
    subject: 'Database Systems',
    professor: 'Prof. Priya Sharma',
    uploadedBy: 'Rahul Sharma',
    uploadDate: '2024-02-28',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    downloads: 31,
    url: '#'
  },
  {
    id: '3',
    title: 'OSI Model Explained',
    subject: 'Computer Networks',
    professor: 'Dr. Amit Singh',
    uploadedBy: 'Priya Singh',
    uploadDate: '2024-02-25',
    fileType: 'PPT',
    fileSize: '4.1 MB',
    downloads: 18,
    url: '#'
  }
]

const chatMessages = [
  {
    id: '1',
    sender: 'Arshiya Kapil',
    message: 'Hey everyone! Don\'t forget about the DSA assignment due tomorrow.',
    timestamp: '2 hours ago',
    isOwn: true
  },
  {
    id: '2',
    sender: 'Rahul Sharma',
    message: 'Thanks for the reminder! Has anyone completed the BST implementation?',
    timestamp: '1 hour ago',
    isOwn: false
  },
  {
    id: '3',
    sender: 'Priya Singh',
    message: 'I\'m stuck on the delete operation. Can someone help?',
    timestamp: '45 minutes ago',
    isOwn: false
  },
  {
    id: '4',
    sender: 'You',
    message: 'Sure! The delete operation has three cases to handle...',
    timestamp: '30 minutes ago',
    isOwn: true
  }
]

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'overdue':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return '✅'
    case 'pending':
      return '⏳'
    case 'overdue':
      return '⚠️'
    default:
      return '📝'
  }
}

export default function ClassroomPage() {
  const [newMessage, setNewMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'submitted': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="w-4 h-4" />
      case 'overdue': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
                🎓 {classroomData.section} Classroom
              </h1>
              <p className="text-white/70 font-space mb-2">
                {classroomData.course} • Year {classroomData.year} • {classroomData.university}
              </p>
              <p className="text-white/60 font-space text-sm">
                {classroomData.department} • Batch {classroomData.batch} • Room {classroomData.roomNumber}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-center sm:text-right">
                <p className="text-white/60 font-space text-sm">Class Representative</p>
                <p className="text-retro-cyan font-semibold">{classroomData.classRepresentative}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-white/60 font-space text-sm">Mentor Faculty</p>
                <p className="text-retro-green font-semibold">{classroomData.mentorFaculty}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Badge className="bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30">
              👥 {classroomData.totalStudents} Students
            </Badge>
            <Badge className="bg-retro-purple/20 text-retro-purple border border-retro-purple/30">
              📚 Semester {classroomData.semester}
            </Badge>
            <Badge className="bg-retro-green/20 text-retro-green border border-retro-green/30">
              🏫 {classroomData.roomNumber}
            </Badge>
            <Badge className="bg-retro-orange/20 text-retro-orange border border-retro-orange/30">
              📅 {classroomData.batch}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-morphism border-white/20 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-retro-cyan data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="timetable" className="data-[state=active]:bg-retro-cyan data-[state=active]:text-black">
              Timetable
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-retro-cyan data-[state=active]:text-black">
              Assignments
            </TabsTrigger>
            <TabsTrigger value="notes" className="data-[state=active]:bg-retro-cyan data-[state=active]:text-black">
              Notes
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-retro-cyan data-[state=active]:text-black">
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Professors */}
              <Card className="glass-morphism border-white/20 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <Users className="w-5 h-5 text-retro-green" />
                    Professors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {professors.map((prof) => (
                    <div key={prof.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <img
                        src={prof.avatar}
                        alt={prof.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{prof.name}</h4>
                        <p className="text-retro-cyan text-sm">{prof.subject}</p>
                        <p className="text-white/60 text-xs">{prof.officeHours}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-xs">{prof.office}</p>
                        <a href={`mailto:${prof.email}`} className="text-retro-cyan text-xs hover:underline">
                          {prof.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="glass-morphism border-white/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-retro-cyan mb-1">
                        {assignments.filter(a => a.status === 'pending').length}
                      </div>
                      <div className="text-white/60 text-sm font-space">Pending Assignments</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism border-white/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-retro-green mb-1">
                        {notes.length}
                      </div>
                      <div className="text-white/60 text-sm font-space">Shared Notes</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism border-white/20">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-retro-purple mb-1">
                        {professors.length}
                      </div>
                      <div className="text-white/60 text-sm font-space">Professors</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs would be implemented here... */}
          <TabsContent value="timetable">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Weekly Timetable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timetable.map((day) => (
                    <div key={day.day} className="border border-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-3">{day.day}</h3>
                      <div className="grid gap-2">
                        {day.slots.map((slot, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                            <div>
                              <span className="text-retro-cyan font-medium">{slot.time}</span>
                              <span className="text-white ml-3">{slot.subject}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-white/70 text-sm">{slot.professor}</div>
                              <div className="text-white/50 text-xs">{slot.room}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timetable Tab */}
          <TabsContent value="timetable">
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Weekly Timetable</CardTitle>
                <CardDescription className="text-white/60">
                  {classroomData.section} class schedule for Semester {classroomData.semester}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timetable.map((day) => (
                    <div key={day.day} className="border border-white/10 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        📅 {day.day}
                      </h3>
                      <div className="grid gap-2">
                        {day.slots.map((slot, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-retro-cyan rounded-full"></div>
                              <div>
                                <span className="text-retro-cyan font-medium">{slot.time}</span>
                                <span className="text-white ml-3 font-semibold">{slot.subject}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white/70 text-sm">{slot.professor}</div>
                              <div className="text-white/50 text-xs">{slot.room}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments">
            <div className="grid gap-6">
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Assignment Tracker</CardTitle>
                  <CardDescription className="text-white/60">
                    Keep track of all assignments and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-semibold">{assignment.title}</h4>
                              <Badge className={`${getStatusColor(assignment.status)} text-xs`}>
                                {getStatusIcon(assignment.status)}
                                <span className="ml-1">{assignment.status}</span>
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm mb-1">{assignment.subject} • {assignment.professor}</p>
                            <p className="text-white/50 text-xs">{assignment.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-retro-orange font-semibold text-sm">Due: {assignment.dueDate}</div>
                            <div className="text-white/60 text-xs">{assignment.submissionFormat}</div>
                            <div className="mt-2 flex gap-2">
                              <Button
                                size="sm"
                                className="bg-retro-cyan/20 hover:bg-retro-cyan/30 text-retro-cyan text-xs"
                                onClick={() => alert(`Assignment Details:\n\nTitle: ${assignment.title}\nSubject: ${assignment.subject}\nProfessor: ${assignment.professor}\nDue Date: ${assignment.dueDate}\nDescription: ${assignment.description}\nSubmission Format: ${assignment.submissionFormat}\n\nStatus: ${assignment.status}\nSubmissions: ${assignment.submissionCount}/${assignment.totalStudents}`)}
                              >
                                View Details
                              </Button>
                              {assignment.status === 'pending' && (
                                <Button
                                  size="sm"
                                  className="bg-retro-green/20 hover:bg-retro-green/30 text-retro-green text-xs"
                                  onClick={() => alert(`Assignment Submission:\n\nTitle: ${assignment.title}\nDue: ${assignment.dueDate}\n\nSubmission options:\n- Upload file\n- Text submission\n- Link submission\n\nNote: Make sure to submit before the deadline!`)}
                                >
                                  Submit
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <div className="grid gap-6">
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Class Notes & Resources</CardTitle>
                  <CardDescription className="text-white/60">
                    Shared study materials and notes from classmates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notes.map((note) => (
                      <div key={note.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-retro-cyan" />
                            <span className="text-white/60 text-xs">{note.fileType}</span>
                          </div>
                          <Badge className="bg-retro-green/20 text-retro-green text-xs">
                            {note.downloads} downloads
                          </Badge>
                        </div>

                        <h4 className="text-white font-semibold text-sm mb-2">{note.title}</h4>
                        <p className="text-retro-cyan text-xs mb-1">{note.subject}</p>
                        <p className="text-white/60 text-xs mb-3">
                          By {note.uploadedBy} • {note.uploadDate} • {note.fileSize}
                        </p>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-retro-cyan/20 hover:bg-retro-cyan/30 text-retro-cyan text-xs"
                            onClick={() => alert(`Downloading: ${note.title}\n\nFile: ${note.title}.pdf\nSize: ${note.fileSize}\nUploaded by: ${note.uploadedBy}\nDate: ${note.uploadDate}\n\nDownload will start automatically...`)}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/60 hover:text-white"
                            onClick={() => alert(`Preview: ${note.title}\n\nSubject: ${note.subject}\nUploaded by: ${note.uploadedBy}\nDate: ${note.uploadDate}\nSize: ${note.fileSize}\nDownloads: ${note.downloads}\n\nFile preview will open in new window...`)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload Section */}
                  <div className="mt-6 p-4 border-2 border-dashed border-white/20 rounded-lg text-center">
                    <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 text-sm mb-2">Share your notes with the class</p>
                    <Button
                      size="sm"
                      className="bg-retro-purple/20 hover:bg-retro-purple/30 text-retro-purple"
                      onClick={() => alert('Upload Notes:\n\nSupported formats:\n- PDF documents\n- Word documents\n- PowerPoint presentations\n- Images (JPG, PNG)\n\nUpload process:\n1. Select file(s)\n2. Add title and description\n3. Choose subject\n4. Submit for review\n\nNotes will be available to all classmates after approval.')}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <RealTimeChat
              roomId={`classroom-${classroomData.section}`}
              roomName={`${classroomData.section} Class Chat`}
              className="h-[600px]"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
