'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  Code,
  Palette,
  Music,
  Camera,
  Trophy,
  BookOpen,
  Gamepad2,
  Mic,
  Heart,
  Star,
  Calendar,
  MapPin,
  UserPlus,
  MessageSquare,
  Search,
  Filter,
  X
} from 'lucide-react'

// Real communities for SRM University pilot program
const pilotCommunities = [
  {
    id: 'tech-innovators',
    name: 'SRM Tech Innovators',
    description: 'Student-led community focused on emerging technologies, hackathons, and innovation projects. We organize workshops, coding competitions, and tech talks.',
    category: 'Technology',
    members: 234,
    icon: '💻',
    color: 'retro-cyan',
    tags: ['AI/ML', 'Web Development', 'Mobile Apps', 'Blockchain'],
    nextEvent: 'Smart India Hackathon Prep - April 15',
    isJoined: false,
    posts: 156,
    rating: 4.8,
    leader: 'Arshiya Kapil',
    established: '2023',
    meetingSchedule: 'Every Friday 6 PM',
    location: 'CS Lab 301',
    achievements: [
      'Winner - Smart India Hackathon 2024',
      'Organized 15+ technical workshops',
      'Published 3 research papers'
    ],
    currentProjects: [
      'Campus Navigation AI App',
      'Student Grievance Portal',
      'Eco-friendly Campus Initiative'
    ],
    requirements: 'Basic programming knowledge, passion for technology',
    applicationDeadline: '2024-04-15',
    portfolio: [
      {
        title: 'AI-Powered Study Assistant',
        description: 'Mobile app helping students with personalized study plans',
        image: '📱',
        status: 'Completed'
      },
      {
        title: 'Campus Event Management System',
        description: 'Web platform for organizing and managing campus events',
        image: '🎯',
        status: 'In Progress'
      }
    ]
  },
  {
    id: 'robotics-club',
    name: 'SRM Robotics & Automation Club',
    description: 'Building autonomous robots and exploring automation technologies. From line-following bots to advanced AI-powered machines.',
    category: 'Technology',
    members: 156,
    icon: '🤖',
    color: 'retro-purple',
    tags: ['Robotics', 'Arduino', 'IoT', 'Automation'],
    nextEvent: 'National Robotics Championship - April 20',
    isJoined: false,
    posts: 78,
    rating: 4.6,
    leader: 'Rahul Sharma',
    established: '2022',
    meetingSchedule: 'Tuesdays & Thursdays 5 PM',
    location: 'Robotics Lab, Block B',
    achievements: [
      'National Robotics Championship - 2nd Place',
      'Built 20+ functional robots',
      'Collaborated with industry partners'
    ],
    currentProjects: [
      'Autonomous Delivery Robot',
      'Smart Home Automation System',
      'Agricultural Monitoring Drone'
    ],
    requirements: 'Interest in electronics, basic programming skills',
    applicationDeadline: '2024-04-20',
    portfolio: [
      {
        title: 'Line Following Robot',
        description: 'Autonomous robot that follows predefined paths',
        image: '🤖',
        status: 'Completed'
      },
      {
        title: 'Voice Controlled Home Assistant',
        description: 'IoT-based smart home automation system',
        image: '🏠',
        status: 'In Progress'
      }
    ]
  },
  {
    id: 'entrepreneurship-cell',
    name: 'SRM Entrepreneurship Cell',
    description: 'Fostering startup culture among students. We provide mentorship, funding guidance, and networking opportunities for aspiring entrepreneurs.',
    category: 'Business',
    members: 189,
    icon: '🚀',
    color: 'retro-orange',
    tags: ['Startups', 'Business Planning', 'Funding', 'Mentorship'],
    nextEvent: 'Investor Pitch Day - April 25',
    isJoined: false,
    posts: 134,
    rating: 4.9,
    leader: 'Priya Singh',
    established: '2021',
    meetingSchedule: 'Saturdays 10 AM',
    location: 'Incubation Center',
    achievements: [
      '12 successful startup launches',
      'Raised ₹50L+ in funding',
      'Mentored 100+ student entrepreneurs'
    ],
    currentProjects: [
      'Student Startup Incubator',
      'Investor Connect Program',
      'Business Plan Competition'
    ],
    requirements: 'Innovative mindset, business acumen',
    applicationDeadline: '2024-04-25',
    portfolio: [
      {
        title: 'EcoCart - Sustainable Shopping App',
        description: 'Mobile app promoting eco-friendly products',
        image: '🛒',
        status: 'Launched'
      },
      {
        title: 'StudyBuddy - Peer Learning Platform',
        description: 'Platform connecting students for collaborative learning',
        image: '📚',
        status: 'In Development'
      }
    ]
  },
  {
    id: 'cultural-society',
    name: 'SRM Cultural Society',
    description: 'Celebrating diversity through arts, music, dance, and cultural events. We organize festivals, competitions, and cultural exchange programs.',
    category: 'Arts',
    members: 298,
    icon: '🎭',
    color: 'retro-pink',
    tags: ['Music', 'Dance', 'Theater', 'Literature'],
    nextEvent: 'Annual Cultural Fest 2024 - April 10',
    isJoined: true,
    posts: 203,
    rating: 4.8,
    leader: 'Kavya Nair',
    established: '2020',
    meetingSchedule: 'Wednesdays 4 PM',
    location: 'Auditorium',
    achievements: [
      'Organized 25+ cultural events',
      'Inter-university cultural fest winners',
      'Published cultural magazine'
    ],
    currentProjects: [
      'Annual Cultural Fest 2024',
      'Traditional Arts Workshop Series',
      'Student Talent Showcase'
    ],
    requirements: 'Passion for arts and culture',
    applicationDeadline: '2024-04-10',
    portfolio: [
      {
        title: 'Rang Bhoomi - Cultural Festival',
        description: 'Annual inter-college cultural competition',
        image: '🎪',
        status: 'Annual Event'
      },
      {
        title: 'Heritage Walk Series',
        description: 'Exploring local cultural heritage',
        image: '🏛️',
        status: 'Ongoing'
      }
    ]
  },
  {
    id: 'environmental-club',
    name: 'Green Campus Initiative',
    description: 'Making SRM campus more sustainable and environmentally conscious. We focus on waste management, renewable energy, and awareness campaigns.',
    category: 'Environment',
    members: 167,
    icon: '🌱',
    color: 'retro-green',
    tags: ['Sustainability', 'Renewable Energy', 'Waste Management'],
    nextEvent: 'Earth Day Cleanup Drive - April 22',
    isJoined: false,
    posts: 89,
    rating: 4.7,
    leader: 'Aditya Joshi',
    established: '2023',
    meetingSchedule: 'Sundays 9 AM',
    location: 'Botanical Garden',
    achievements: [
      'Planted 500+ trees on campus',
      'Reduced plastic usage by 40%',
      'Solar panel installation project'
    ],
    currentProjects: [
      'Campus Waste Segregation System',
      'Rainwater Harvesting Project',
      'Eco-friendly Transportation Initiative'
    ],
    requirements: 'Environmental consciousness, commitment to sustainability',
    applicationDeadline: '2024-04-30',
    portfolio: [
      {
        title: 'Solar Power Initiative',
        description: 'Installing solar panels across campus buildings',
        image: '☀️',
        status: 'In Progress'
      },
      {
        title: 'Zero Waste Campus Campaign',
        description: 'Comprehensive waste reduction program',
        image: '♻️',
        status: 'Ongoing'
      }
    ]
  },
  {
    id: 'sports-club',
    name: 'SRM Sports Excellence Club',
    description: 'Promoting sports culture and physical fitness among students. We organize tournaments, training sessions, and sports events.',
    category: 'Sports',
    members: 203,
    icon: '🏆',
    color: 'retro-yellow',
    tags: ['Cricket', 'Football', 'Basketball', 'Fitness'],
    nextEvent: 'Inter-Department Sports Meet - April 18',
    isJoined: false,
    posts: 156,
    rating: 4.5,
    leader: 'Vikram Gupta',
    established: '2022',
    meetingSchedule: 'Daily 6 AM & 6 PM',
    location: 'Sports Complex',
    achievements: [
      'Inter-university sports champions',
      'Trained 50+ athletes',
      'Organized 20+ tournaments'
    ],
    currentProjects: [
      'Annual Sports Meet 2024',
      'Fitness Awareness Campaign',
      'Sports Scholarship Program'
    ],
    requirements: 'Interest in sports, physical fitness',
    applicationDeadline: '2024-04-18',
    portfolio: [
      {
        title: 'Champions League Tournament',
        description: 'Annual inter-college sports competition',
        image: '🏅',
        status: 'Annual Event'
      },
      {
        title: 'Fitness Bootcamp Program',
        description: 'Comprehensive fitness training for students',
        image: '💪',
        status: 'Ongoing'
      }
    ]
  }
]

const categories = [
  { id: 'all', label: 'All Communities', icon: Users },
  { id: 'Technology', label: 'Technology', icon: Code },
  { id: 'Arts', label: 'Arts & Culture', icon: Palette },
  { id: 'Sports', label: 'Sports & Gaming', icon: Trophy },
  { id: 'Business', label: 'Business', icon: BookOpen },
  { id: 'Environment', label: 'Environment', icon: Heart }
]

export default function CommunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [communities, setCommunities] = useState(pilotCommunities)
  const [selectedCommunity, setSelectedCommunity] = useState<any>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const filteredCommunities = selectedCategory === 'all' 
    ? communities 
    : communities.filter(community => community.category === selectedCategory)

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(communities.map(community =>
      community.id === communityId
        ? {
            ...community,
            isJoined: !community.isJoined,
            members: community.isJoined ? community.members - 1 : community.members + 1
          }
        : community
    ))
  }

  const handleViewCommunity = (community: any) => {
    setSelectedCommunity(community)
  }

  const handleApplyToCommunity = (community: any) => {
    setSelectedCommunity(community)
    setShowApplicationForm(true)
  }

  const handleSubmitApplication = (applicationData: any) => {
    console.log('Application submitted for:', selectedCommunity?.name, applicationData)
    alert(`Application submitted successfully for ${selectedCommunity?.name}! You will be notified about the status soon.`)
    setShowApplicationForm(false)
    setSelectedCommunity(null)
  }

  const getCommunityIcon = (category: string) => {
    switch (category) {
      case 'Technology': return <Code className="w-5 h-5" />
      case 'Arts': return <Palette className="w-5 h-5" />
      case 'Sports': return <Trophy className="w-5 h-5" />
      case 'Academic': return <BookOpen className="w-5 h-5" />
      default: return <Users className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
            Campus Communities 🌟
          </h1>
          <p className="text-white/60 font-space">
            Join clubs, societies, and groups that match your interests
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism border-white/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <Filter className="w-5 h-5 text-retro-cyan" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedCategory === category.id 
                        ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Communities Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCommunities.map((community) => (
                <Card key={community.id} className="glass-morphism border-white/20 hover:scale-[1.02] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-${community.color}/20 rounded-xl flex items-center justify-center text-2xl border border-${community.color}/30`}>
                          {community.icon}
                        </div>
                        <div>
                          <CardTitle className="text-white font-retro text-lg">
                            {community.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`bg-${community.color}/20 text-${community.color} border border-${community.color}/30`}>
                              {getCommunityIcon(community.category)}
                              <span className="ml-1">{community.category}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <CardDescription className="text-white/70 font-space">
                      {community.description}
                    </CardDescription>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-white font-bold text-lg">{community.members}</div>
                        <div className="text-white/60 text-xs font-space">Members</div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">{community.posts}</div>
                        <div className="text-white/60 text-xs font-space">Posts</div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {community.rating}
                        </div>
                        <div className="text-white/60 text-xs font-space">Rating</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-1 bg-${community.color}/10 text-${community.color} text-xs rounded-full font-space border border-${community.color}/20`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Next Event */}
                    {community.nextEvent && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2 text-white/70">
                          <Calendar className="w-4 h-4 text-retro-orange" />
                          <span className="text-sm font-space font-semibold">Upcoming:</span>
                        </div>
                        <p className="text-white text-sm font-space mt-1">{community.nextEvent}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t border-white/10">
                      {community.isJoined ? (
                        <Button
                          onClick={() => handleViewCommunity(community)}
                          className="flex-1 bg-retro-green/20 text-retro-green border border-retro-green/30 hover:bg-retro-green/30"
                          variant="outline"
                        >
                          <Heart className="w-4 h-4 mr-2 fill-current" />
                          View Community
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleApplyToCommunity(community)}
                            className="flex-1 bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Apply
                          </Button>

                          <Button
                            onClick={() => handleViewCommunity(community)}
                            variant="outline"
                            className="flex-1 border-retro-cyan text-retro-cyan hover:bg-retro-cyan/10"
                          >
                            <Search className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <Button
                variant="glass"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  console.log('Load more communities clicked')
                  // TODO: Implement load more functionality
                  alert('Load more functionality will be implemented with backend integration')
                }}
              >
                Load More Communities
              </Button>
            </div>
          </div>
        </div>

        {/* Community Detail Modal */}
        {selectedCommunity && !showApplicationForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="glass-morphism border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{selectedCommunity.icon}</div>
                    <div>
                      <h2 className="text-2xl font-retro text-white mb-2">{selectedCommunity.name}</h2>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>👥 {selectedCommunity.members} members</span>
                        <span>⭐ {selectedCommunity.rating}/5</span>
                        <span>📅 Est. {selectedCommunity.established}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCommunity(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-retro text-white mb-3">About</h3>
                      <p className="text-white/80 font-space">{selectedCommunity.description}</p>
                    </div>

                    {/* Meeting Info */}
                    <div>
                      <h3 className="text-lg font-retro text-white mb-3">Meeting Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-retro-cyan" />
                          <span className="text-white/80">{selectedCommunity.meetingSchedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-retro-green" />
                          <span className="text-white/80">{selectedCommunity.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-retro-purple" />
                          <span className="text-white/80">Led by {selectedCommunity.leader}</span>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-lg font-retro text-white mb-3">Requirements</h3>
                      <p className="text-white/80 font-space text-sm">{selectedCommunity.requirements}</p>
                      <div className="mt-2 text-xs text-retro-orange">
                        Application Deadline: {selectedCommunity.applicationDeadline}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Achievements */}
                    <div>
                      <h3 className="text-lg font-retro text-white mb-3">Achievements</h3>
                      <div className="space-y-2">
                        {selectedCommunity.achievements.map((achievement: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-400" />
                            <span className="text-white/80 text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Projects */}
                    <div>
                      <h3 className="text-lg font-retro text-white mb-3">Current Projects</h3>
                      <div className="space-y-2">
                        {selectedCommunity.currentProjects.map((project: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-retro-cyan" />
                            <span className="text-white/80 text-sm">{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                      <h3 className="text-lg font-retro text-white mb-3">Portfolio</h3>
                      <div className="space-y-3">
                        {selectedCommunity.portfolio.map((item: any, index: number) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-lg">{item.image}</span>
                              <span className="text-white font-semibold text-sm">{item.title}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                item.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                item.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-white/70 text-xs">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                  {!selectedCommunity.isJoined && (
                    <Button
                      onClick={() => setShowApplicationForm(true)}
                      className="bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Apply to Join
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCommunity(null)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Form Modal */}
        {showApplicationForm && selectedCommunity && (
          <ApplicationForm
            community={selectedCommunity}
            onSubmit={handleSubmitApplication}
            onClose={() => {
              setShowApplicationForm(false)
              setSelectedCommunity(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

// Application Form Component
function ApplicationForm({ community, onSubmit, onClose }: {
  community: any
  onSubmit: (data: any) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    department: '',
    experience: '',
    motivation: '',
    skills: '',
    availability: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="glass-morphism border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-retro text-white">Apply to {community.name}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-white/80 text-sm font-space">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 glass-morphism border-white/20 rounded text-white placeholder:text-white/40"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-space">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 glass-morphism border-white/20 rounded text-white placeholder:text-white/40"
                  placeholder="your.email@srm.edu.in"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-white/80 text-sm font-space">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-3 glass-morphism border-white/20 rounded text-white placeholder:text-white/40"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="text-white/80 text-sm font-space">Year *</label>
                <select
                  required
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full p-3 glass-morphism border-white/20 rounded text-white bg-transparent"
                >
                  <option value="" className="bg-gray-800">Select Year</option>
                  <option value="1" className="bg-gray-800">1st Year</option>
                  <option value="2" className="bg-gray-800">2nd Year</option>
                  <option value="3" className="bg-gray-800">3rd Year</option>
                  <option value="4" className="bg-gray-800">4th Year</option>
                </select>
              </div>
              <div>
                <label className="text-white/80 text-sm font-space">Department *</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full p-3 glass-morphism border-white/20 rounded text-white bg-transparent"
                >
                  <option value="" className="bg-gray-800">Select Department</option>
                  <option value="CSE" className="bg-gray-800">Computer Science</option>
                  <option value="IT" className="bg-gray-800">Information Technology</option>
                  <option value="ECE" className="bg-gray-800">Electronics & Communication</option>
                  <option value="ME" className="bg-gray-800">Mechanical Engineering</option>
                  <option value="CE" className="bg-gray-800">Civil Engineering</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-white/80 text-sm font-space">Relevant Experience</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full p-3 glass-morphism border-white/20 rounded text-white placeholder:text-white/40 resize-none"
                rows={3}
                placeholder="Any relevant experience, projects, or achievements..."
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-space">Why do you want to join? *</label>
              <textarea
                required
                value={formData.motivation}
                onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                className="w-full p-3 glass-morphism border-white/20 rounded text-white placeholder:text-white/40 resize-none"
                rows={3}
                placeholder="Tell us about your motivation and what you hope to contribute..."
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-space">Skills & Interests</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full p-3 glass-morphism border-white/20 rounded text-white placeholder:text-white/40"
                placeholder="e.g., Programming, Design, Leadership, etc."
              />
            </div>

            <div>
              <label className="text-white/80 text-sm font-space">Availability *</label>
              <select
                required
                value={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full p-3 glass-morphism border-white/20 rounded text-white bg-transparent"
              >
                <option value="" className="bg-gray-800">Select Availability</option>
                <option value="high" className="bg-gray-800">High (Can attend most meetings)</option>
                <option value="medium" className="bg-gray-800">Medium (Can attend some meetings)</option>
                <option value="low" className="bg-gray-800">Low (Limited availability)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
              >
                Submit Application
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
