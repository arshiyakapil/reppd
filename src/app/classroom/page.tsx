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
  Paperclip
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Mock data for classroom
const classroomData = {
  section: 'CSE-3A',
  course: 'Computer Science Engineering',
  year: 3,
  semester: 6,
  totalStudents: 45,
  classRepresentative: 'Arshiya Kapil'
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
                🎓 Classroom
              </h1>
              <p className="text-white/70 font-space">
                {classroomData.section} • {classroomData.course} • Year {classroomData.year}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 font-space text-sm">Class Representative</p>
              <p className="text-retro-cyan font-semibold">{classroomData.classRepresentative}</p>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <Badge className="bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30">
              {classroomData.totalStudents} Students
            </Badge>
            <Badge className="bg-retro-purple/20 text-retro-purple border border-retro-purple/30">
              Semester {classroomData.semester}
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

          {/* Continue with other tabs... */}
        </Tabs>
      </div>
    </div>
  )
}
