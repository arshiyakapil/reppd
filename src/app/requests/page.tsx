'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Car, 
  BookOpen, 
  Users, 
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react'

// Mock data for requests
const mockRequests = [
  {
    id: '1',
    type: 'carpool',
    title: 'Daily Carpool: Gurgaon to SRM Sonipat',
    description: 'Looking for 2-3 people to share daily commute from Gurgaon Sector 14 to SRM University. Departure: 8:30 AM, Return: 5:30 PM. Cost sharing basis.',
    author: {
      name: 'Amit Verma',
      universityId: 'CS2021067',
      year: 3,
      stream: 'Computer Science',
      contact: '+91 98765 43210'
    },
    location: {
      from: 'Gurgaon Sector 14',
      to: 'SRM University Sonipat'
    },
    schedule: 'Daily (Mon-Fri)',
    cost: '₹150/day',
    seats: 3,
    timestamp: '2 hours ago',
    status: 'active',
    responses: 8
  },
  {
    id: '2',
    type: 'study',
    title: 'Study Partner for Data Structures & Algorithms',
    description: 'Looking for a serious study partner for DSA preparation. Planning to solve 2-3 problems daily and discuss approaches. Targeting placement season prep.',
    author: {
      name: 'Priya Sharma',
      universityId: 'IT2021089',
      year: 3,
      stream: 'Information Technology',
      contact: 'priya.sharma@srm.edu.in'
    },
    subjects: ['Data Structures', 'Algorithms', 'Problem Solving'],
    schedule: 'Evening 6-8 PM',
    location: {
      venue: 'Central Library or Online'
    },
    timestamp: '4 hours ago',
    status: 'active',
    responses: 12
  },
  {
    id: '3',
    type: 'carpool',
    title: 'Weekend Trip: Delhi to Manali (Car Sharing)',
    description: 'Planning a weekend trip to Manali. Have a car, looking for 3 travel buddies to share fuel and toll costs. Departure Friday evening, return Sunday night.',
    author: {
      name: 'Rahul Kumar',
      universityId: 'ME2020123',
      year: 4,
      stream: 'Mechanical Engineering',
      contact: '+91 87654 32109'
    },
    location: {
      from: 'SRM University',
      to: 'Manali, Himachal Pradesh'
    },
    schedule: 'This Weekend (Fri-Sun)',
    cost: '₹2000/person',
    seats: 3,
    timestamp: '6 hours ago',
    status: 'active',
    responses: 15
  },
  {
    id: '4',
    type: 'academic',
    title: 'Project Partner for Machine Learning Assignment',
    description: 'Need a partner for ML course project on "Sentiment Analysis of Social Media Data". Should be comfortable with Python, pandas, and scikit-learn.',
    author: {
      name: 'Sneha Patel',
      universityId: 'CS2021045',
      year: 3,
      stream: 'Computer Science',
      contact: 'sneha.patel@srm.edu.in'
    },
    subjects: ['Machine Learning', 'Python', 'Data Analysis'],
    deadline: 'Submission: 15th March',
    timestamp: '1 day ago',
    status: 'active',
    responses: 6
  },
  {
    id: '5',
    type: 'help',
    title: 'Need Help with Circuit Analysis (Electronics)',
    description: 'Struggling with AC circuit analysis and phasor diagrams. Looking for someone who can explain concepts and help with problem solving.',
    author: {
      name: 'Arjun Singh',
      universityId: 'EC2022156',
      year: 2,
      stream: 'Electronics & Communication',
      contact: '+91 76543 21098'
    },
    subjects: ['Circuit Analysis', 'AC Circuits', 'Phasor Diagrams'],
    urgency: 'Exam next week',
    timestamp: '1 day ago',
    status: 'active',
    responses: 4
  }
]

const requestTypes = [
  { id: 'all', label: 'All Requests', icon: Users, color: 'retro-cyan' },
  { id: 'carpool', label: 'Carpools', icon: Car, color: 'retro-pink' },
  { id: 'study', label: 'Study Groups', icon: BookOpen, color: 'retro-orange' },
  { id: 'academic', label: 'Academic Help', icon: Users, color: 'retro-purple' },
  { id: 'help', label: 'General Help', icon: MessageCircle, color: 'retro-green' }
]

export default function RequestsPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [requests, setRequests] = useState(mockRequests)

  const filteredRequests = selectedType === 'all' 
    ? requests 
    : requests.filter(req => req.type === selectedType)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'carpool': return <Car className="w-4 h-4" />
      case 'study': return <BookOpen className="w-4 h-4" />
      case 'academic': return <Users className="w-4 h-4" />
      case 'help': return <MessageCircle className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'carpool': return 'bg-retro-pink/20 text-retro-pink border-retro-pink/30'
      case 'study': return 'bg-retro-orange/20 text-retro-orange border-retro-orange/30'
      case 'academic': return 'bg-retro-purple/20 text-retro-purple border-retro-purple/30'
      case 'help': return 'bg-retro-green/20 text-retro-green border-retro-green/30'
      default: return 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/30'
    }
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
            Campus Requests 🤝
          </h1>
          <p className="text-white/60 font-space">
            Find carpools, study partners, and get help from your campus community
          </p>
        </div>

        {/* Create Request Button */}
        <div className="mb-6">
          <Button
            asChild
            className="w-full sm:w-auto bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
          >
            <Link href="/requests/create">
              <Plus className="w-4 h-4 mr-2" />
              Create New Request
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism border-white/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <Filter className="w-5 h-5 text-retro-cyan" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requestTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedType === type.id 
                        ? `bg-${type.color}/20 text-${type.color} border border-${type.color}/30` 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <type.icon className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          <div className="lg:col-span-3 space-y-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="glass-morphism border-white/20 hover:scale-[1.02] transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getTypeColor(request.type)} border`}>
                          {getTypeIcon(request.type)}
                          <span className="ml-1 capitalize">{request.type}</span>
                        </Badge>
                        <span className="text-white/40 text-sm font-space flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {request.timestamp}
                        </span>
                      </div>
                      <CardTitle className="text-white font-retro text-xl mb-2">
                        {request.title}
                      </CardTitle>
                      <CardDescription className="text-white/70 font-space">
                        {request.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Author Info */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{request.author.name}</p>
                      <p className="text-white/60 text-sm font-space">
                        {request.author.stream} • Year {request.author.year}
                      </p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {request.location && (
                      <div className="flex items-center gap-2 text-white/70">
                        <MapPin className="w-4 h-4 text-retro-cyan" />
                        <span className="text-sm font-space">
                          {request.location.from && request.location.to 
                            ? `${request.location.from} → ${request.location.to}`
                            : request.location.venue || 'Location TBD'
                          }
                        </span>
                      </div>
                    )}

                    {request.schedule && (
                      <div className="flex items-center gap-2 text-white/70">
                        <Calendar className="w-4 h-4 text-retro-orange" />
                        <span className="text-sm font-space">{request.schedule}</span>
                      </div>
                    )}

                    {request.cost && (
                      <div className="flex items-center gap-2 text-white/70">
                        <DollarSign className="w-4 h-4 text-retro-green" />
                        <span className="text-sm font-space">{request.cost}</span>
                      </div>
                    )}

                    {request.seats && (
                      <div className="flex items-center gap-2 text-white/70">
                        <Users className="w-4 h-4 text-retro-pink" />
                        <span className="text-sm font-space">{request.seats} seats available</span>
                      </div>
                    )}
                  </div>

                  {/* Subjects/Tags */}
                  {request.subjects && (
                    <div className="flex flex-wrap gap-2">
                      {request.subjects.map((subject, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-retro-purple/20 text-retro-purple text-xs rounded-full font-space"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-cyan">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {request.responses} responses
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80">
                        Respond
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
