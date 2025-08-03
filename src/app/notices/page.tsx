'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Calendar, 
  MapPin,
  Clock,
  Users,
  Star,
  AlertCircle,
  Info,
  Trophy,
  GraduationCap,
  Briefcase,
  Heart,
  Filter,
  Pin
} from 'lucide-react'

// Mock data for notices
const mockNotices = [
  {
    id: '1',
    title: 'Tech Fest 2024 - Registration Open',
    description: 'The biggest technical festival of SRM University Sonipat is here! Register now for coding competitions, robotics challenges, and tech talks by industry experts.',
    type: 'event',
    priority: 'high',
    author: 'Technical Society',
    date: '2024-03-15',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    deadline: '2024-03-10',
    attendees: 450,
    tags: ['Technology', 'Competition', 'Festival'],
    isPinned: true,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    title: 'Mid-Semester Exam Schedule Released',
    description: 'Mid-semester examinations will commence from March 20th. Check your individual timetables on the student portal. All students must carry their ID cards.',
    type: 'academic',
    priority: 'high',
    author: 'Academic Office',
    date: '2024-03-20',
    deadline: '2024-03-19',
    tags: ['Exams', 'Academic', 'Important'],
    isPinned: true,
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    title: 'Career Fair 2024 - Top Companies Participating',
    description: 'Annual career fair with 50+ companies including Google, Microsoft, Amazon, and TCS. Dress code: Formal. Bring multiple copies of your resume.',
    type: 'career',
    priority: 'medium',
    author: 'Placement Cell',
    date: '2024-03-25',
    time: '9:00 AM - 5:00 PM',
    venue: 'Sports Complex',
    attendees: 1200,
    tags: ['Career', 'Placement', 'Companies'],
    isPinned: false,
    timestamp: '6 hours ago'
  },
  {
    id: '4',
    title: 'Drama Club Auditions - Romeo & Juliet',
    description: 'Open auditions for the spring play "Romeo and Juliet". All students welcome. No prior experience required. Audition pieces will be provided.',
    type: 'cultural',
    priority: 'low',
    author: 'Drama Society',
    date: '2024-03-14',
    time: '3:00 PM',
    venue: 'Drama Hall',
    attendees: 25,
    tags: ['Drama', 'Auditions', 'Theatre'],
    isPinned: false,
    timestamp: '8 hours ago'
  },
  {
    id: '5',
    title: 'Library Extended Hours During Exams',
    description: 'Central Library will remain open 24/7 during the examination period (March 20-30). Additional study spaces and resources will be available.',
    type: 'facility',
    priority: 'medium',
    author: 'Library Administration',
    date: '2024-03-20',
    tags: ['Library', 'Study', 'Facilities'],
    isPinned: false,
    timestamp: '1 day ago'
  },
  {
    id: '6',
    title: 'Inter-University Sports Championship',
    description: 'SRM Sonipat will host the Inter-University Sports Championship. Students can register for various sports including cricket, football, basketball, and athletics.',
    type: 'sports',
    priority: 'medium',
    author: 'Sports Committee',
    date: '2024-04-05',
    time: '8:00 AM',
    venue: 'Sports Complex',
    deadline: '2024-03-30',
    attendees: 300,
    tags: ['Sports', 'Championship', 'Inter-University'],
    isPinned: false,
    timestamp: '1 day ago'
  }
]

const noticeTypes = [
  { id: 'all', label: 'All Notices', icon: Bell, color: 'retro-cyan' },
  { id: 'academic', label: 'Academic', icon: GraduationCap, color: 'retro-purple' },
  { id: 'event', label: 'Events', icon: Calendar, color: 'retro-pink' },
  { id: 'career', label: 'Career', icon: Briefcase, color: 'retro-orange' },
  { id: 'cultural', label: 'Cultural', icon: Heart, color: 'retro-green' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: 'retro-yellow' },
  { id: 'facility', label: 'Facilities', icon: Info, color: 'retro-blue' }
]

export default function NoticesPage() {
  const [selectedType, setSelectedType] = useState('all')
  const [notices, setNotices] = useState(mockNotices)

  const filteredNotices = selectedType === 'all' 
    ? notices 
    : notices.filter(notice => notice.type === selectedType)

  const pinnedNotices = filteredNotices.filter(notice => notice.isPinned)
  const regularNotices = filteredNotices.filter(notice => !notice.isPinned)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return <GraduationCap className="w-4 h-4" />
      case 'event': return <Calendar className="w-4 h-4" />
      case 'career': return <Briefcase className="w-4 h-4" />
      case 'cultural': return <Heart className="w-4 h-4" />
      case 'sports': return <Trophy className="w-4 h-4" />
      case 'facility': return <Info className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-retro-purple/20 text-retro-purple border-retro-purple/30'
      case 'event': return 'bg-retro-pink/20 text-retro-pink border-retro-pink/30'
      case 'career': return 'bg-retro-orange/20 text-retro-orange border-retro-orange/30'
      case 'cultural': return 'bg-retro-green/20 text-retro-green border-retro-green/30'
      case 'sports': return 'bg-retro-yellow/20 text-retro-yellow border-retro-yellow/30'
      case 'facility': return 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/30'
      default: return 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-white/60'
    }
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
            Campus Notices 📢
          </h1>
          <p className="text-white/60 font-space">
            Stay updated with important announcements, events, and deadlines
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism border-white/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <Filter className="w-5 h-5 text-retro-cyan" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {noticeTypes.map((type) => (
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

          {/* Notices List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pinned Notices */}
            {pinnedNotices.length > 0 && (
              <div>
                <h2 className="text-xl font-retro text-white mb-4 flex items-center gap-2">
                  <Pin className="w-5 h-5 text-retro-orange" />
                  Pinned Notices
                </h2>
                <div className="space-y-4">
                  {pinnedNotices.map((notice) => (
                    <Card key={notice.id} className="glass-morphism border-white/20 border-l-4 border-l-retro-orange">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`${getTypeColor(notice.type)} border`}>
                                {getTypeIcon(notice.type)}
                                <span className="ml-1 capitalize">{notice.type}</span>
                              </Badge>
                              {notice.priority && (
                                <AlertCircle className={`w-4 h-4 ${getPriorityColor(notice.priority)}`} />
                              )}
                              <span className="text-white/40 text-sm font-space">{notice.timestamp}</span>
                            </div>
                            <CardTitle className="text-white font-retro text-xl mb-2">
                              {notice.title}
                            </CardTitle>
                            <CardDescription className="text-white/70 font-space">
                              {notice.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Event Details */}
                        {(notice.date || notice.venue || notice.time) && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {notice.date && (
                              <div className="flex items-center gap-2 text-white/70">
                                <Calendar className="w-4 h-4 text-retro-cyan" />
                                <span className="text-sm font-space">{notice.date}</span>
                              </div>
                            )}
                            {notice.time && (
                              <div className="flex items-center gap-2 text-white/70">
                                <Clock className="w-4 h-4 text-retro-orange" />
                                <span className="text-sm font-space">{notice.time}</span>
                              </div>
                            )}
                            {notice.venue && (
                              <div className="flex items-center gap-2 text-white/70">
                                <MapPin className="w-4 h-4 text-retro-pink" />
                                <span className="text-sm font-space">{notice.venue}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tags */}
                        {notice.tags && (
                          <div className="flex flex-wrap gap-2">
                            {notice.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-retro-cyan/20 text-retro-cyan text-xs rounded-full font-space"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4">
                            {notice.attendees && (
                              <span className="text-white/60 text-sm font-space flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {notice.attendees} interested
                              </span>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black">
                              <Star className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notices */}
            <div className="space-y-4">
              {regularNotices.map((notice) => (
                <Card key={notice.id} className="glass-morphism border-white/20 hover:scale-[1.01] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getTypeColor(notice.type)} border`}>
                            {getTypeIcon(notice.type)}
                            <span className="ml-1 capitalize">{notice.type}</span>
                          </Badge>
                          {notice.priority && (
                            <AlertCircle className={`w-4 h-4 ${getPriorityColor(notice.priority)}`} />
                          )}
                          <span className="text-white/40 text-sm font-space">{notice.timestamp}</span>
                        </div>
                        <CardTitle className="text-white font-retro text-lg mb-2">
                          {notice.title}
                        </CardTitle>
                        <CardDescription className="text-white/70 font-space">
                          {notice.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Event Details */}
                    {(notice.date || notice.venue || notice.time) && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {notice.date && (
                          <div className="flex items-center gap-2 text-white/70">
                            <Calendar className="w-4 h-4 text-retro-cyan" />
                            <span className="text-sm font-space">{notice.date}</span>
                          </div>
                        )}
                        {notice.time && (
                          <div className="flex items-center gap-2 text-white/70">
                            <Clock className="w-4 h-4 text-retro-orange" />
                            <span className="text-sm font-space">{notice.time}</span>
                          </div>
                        )}
                        {notice.venue && (
                          <div className="flex items-center gap-2 text-white/70">
                            <MapPin className="w-4 h-4 text-retro-pink" />
                            <span className="text-sm font-space">{notice.venue}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {notice.tags && (
                      <div className="flex flex-wrap gap-2">
                        {notice.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-retro-cyan/20 text-retro-cyan text-xs rounded-full font-space"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        {notice.attendees && (
                          <span className="text-white/60 text-sm font-space flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {notice.attendees} interested
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-yellow">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-black">
                          View Details
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
    </div>
  )
}
