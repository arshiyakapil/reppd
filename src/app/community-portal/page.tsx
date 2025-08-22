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
  Settings,
  Plus,
  Eye,
  Check,
  X,
  Edit,
  Trash2,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Award,
  Target,
  TrendingUp,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Star,
  Download
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Mock data for community leader
const leaderCommunities = [
  {
    id: 'tech-innovators',
    name: 'SRM Tech Innovators',
    members: 234,
    pendingApplications: 12,
    activeProjects: 3,
    upcomingEvents: 2,
    category: 'Technology',
    icon: '💻',
    description: 'Student-led community focused on emerging technologies, hackathons, and innovation projects.',
    established: '2023',
    meetingSchedule: 'Every Friday 6 PM',
    location: 'CS Lab 301'
  }
]

const mockApplications = [
  {
    id: 'app-1',
    applicantName: 'Rahul Sharma',
    email: 'rahul.sharma@srm.edu.in',
    phone: '+91 98765 43210',
    year: '2',
    department: 'Computer Science',
    experience: 'Built 3 web applications using React and Node.js. Participated in 2 hackathons.',
    motivation: 'I want to contribute to innovative tech projects and learn from experienced developers.',
    skills: 'JavaScript, React, Node.js, Python, Git',
    availability: 'high',
    appliedDate: '2024-03-15',
    status: 'pending',
    communityId: 'tech-innovators'
  },
  {
    id: 'app-2',
    applicantName: 'Priya Singh',
    email: 'priya.singh@srm.edu.in',
    phone: '+91 87654 32109',
    year: '3',
    department: 'Information Technology',
    experience: 'Led a team of 5 in college project. Experience with mobile app development.',
    motivation: 'Passionate about AI/ML and want to work on real-world projects.',
    skills: 'Flutter, Dart, Python, Machine Learning, Leadership',
    availability: 'medium',
    appliedDate: '2024-03-14',
    status: 'pending',
    communityId: 'tech-innovators'
  },
  {
    id: 'app-3',
    applicantName: 'Amit Kumar',
    email: 'amit.kumar@srm.edu.in',
    phone: '+91 76543 21098',
    year: '1',
    department: 'Computer Science',
    experience: 'New to programming but very enthusiastic. Completed online courses in web development.',
    motivation: 'Want to learn from seniors and contribute to meaningful projects.',
    skills: 'HTML, CSS, JavaScript (beginner), Eager to learn',
    availability: 'high',
    appliedDate: '2024-03-13',
    status: 'pending',
    communityId: 'tech-innovators'
  }
]

const mockMembers = [
  {
    id: 'member-1',
    name: 'Arshiya Kapil',
    role: 'Leader',
    email: 'arshiya.kapil@srm.edu.in',
    year: '3',
    department: 'Computer Science',
    joinDate: '2023-08-01',
    contributions: 15,
    status: 'active'
  },
  {
    id: 'member-2',
    name: 'Vikram Gupta',
    role: 'Core Member',
    email: 'vikram.gupta@srm.edu.in',
    year: '3',
    department: 'Computer Science',
    joinDate: '2023-09-15',
    contributions: 12,
    status: 'active'
  },
  {
    id: 'member-3',
    name: 'Kavya Nair',
    role: 'Member',
    email: 'kavya.nair@srm.edu.in',
    year: '2',
    department: 'Information Technology',
    joinDate: '2023-10-01',
    contributions: 8,
    status: 'active'
  }
]

export default function CommunityPortalPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [applications, setApplications] = useState(mockApplications)
  const [members, setMembers] = useState(mockMembers)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)

  useEffect(() => {
    // Check if user has community leader access
    const managementAccess = localStorage.getItem('managementAccess')
    if (managementAccess) {
      const access = JSON.parse(managementAccess)
      if (access.hasAccess && (access.role === 'community_leader' || access.role === 'developer') && access.expiresAt > Date.now()) {
        setIsAuthorized(true)
      } else {
        router.push('/auth/login')
      }
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const handleApplicationAction = (applicationId: string, action: 'approve' | 'reject') => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
          : app
      )
    )

    if (action === 'approve') {
      const application = applications.find(app => app.id === applicationId)
      if (application) {
        // Add to members list
        const newMember = {
          id: `member-${Date.now()}`,
          name: application.applicantName,
          role: 'Member',
          email: application.email,
          year: application.year,
          department: application.department,
          joinDate: new Date().toISOString().split('T')[0],
          contributions: 0,
          status: 'active'
        }
        setMembers(prev => [...prev, newMember])
      }
    }

    alert(`Application ${action === 'approve' ? 'approved' : 'rejected'} successfully!`)
    setSelectedApplication(null)
  }

  const sendMessage = (memberId: string) => {
    alert(`Message feature will be implemented. Sending message to member ${memberId}`)
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-white/60">You don't have permission to access the Community Portal.</p>
          <p className="text-white/40 text-sm mt-2">Please login with community leader access.</p>
        </div>
      </div>
    )
  }

  const community = leaderCommunities[0] // For demo, using first community

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white">
                Community Portal
              </h1>
              <p className="text-white/70 font-space">
                Manage {community.name} - {community.members} members
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
              👑 Community Leader
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {community.category}
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
              Est. {community.established}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-cyan mb-1">{community.members}</div>
                <div className="text-white/60 text-sm font-space">Total Members</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-orange mb-1">{community.pendingApplications}</div>
                <div className="text-white/60 text-sm font-space">Pending Applications</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-green mb-1">{community.activeProjects}</div>
                <div className="text-white/60 text-sm font-space">Active Projects</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-morphism border-white/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-retro-purple mb-1">{community.upcomingEvents}</div>
                <div className="text-white/60 text-sm font-space">Upcoming Events</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-morphism border-white/20 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-400 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-400 data-[state=active]:text-white">
              Applications ({applications.filter(app => app.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-purple-400 data-[state=active]:text-white">
              Members
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-purple-400 data-[state=active]:text-white">
              Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-400 data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-400 data-[state=active]:text-white">
              Settings
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
                    <UserCheck className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white text-sm">New member joined: Kavya Nair</p>
                      <p className="text-white/60 text-xs">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white text-sm">New application received from Rahul Sharma</p>
                      <p className="text-white/60 text-xs">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white text-sm">Upcoming meeting: Friday 6 PM</p>
                      <p className="text-white/60 text-xs">Tomorrow</p>
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
                    onClick={() => setActiveTab('applications')}
                    className="w-full justify-start bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Review Applications ({applications.filter(app => app.status === 'pending').length} pending)
                  </Button>
                  <Button
                    onClick={() => setActiveTab('members')}
                    className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Members
                  </Button>
                  <Button
                    onClick={() => setActiveTab('events')}
                    className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                  <Button
                    onClick={() => setActiveTab('analytics')}
                    className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-retro text-white">Pending Applications</h2>
              <Badge className="bg-orange-500/20 text-orange-400">
                {applications.filter(app => app.status === 'pending').length} pending
              </Badge>
            </div>

            <div className="grid gap-4">
              {applications.filter(app => app.status === 'pending').map((application) => (
                <Card key={application.id} className="glass-morphism border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{application.applicantName}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                          <span>📧 {application.email}</span>
                          <span>📱 {application.phone}</span>
                          <span>🎓 Year {application.year} • {application.department}</span>
                        </div>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        Applied {application.appliedDate}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-white/80 font-semibold text-sm mb-2">Experience</h4>
                        <p className="text-white/70 text-sm">{application.experience}</p>
                      </div>
                      <div>
                        <h4 className="text-white/80 font-semibold text-sm mb-2">Skills</h4>
                        <p className="text-white/70 text-sm">{application.skills}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white/80 font-semibold text-sm mb-2">Motivation</h4>
                      <p className="text-white/70 text-sm">{application.motivation}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">Availability:</span>
                        <Badge className={
                          application.availability === 'high' ? 'bg-green-500/20 text-green-400' :
                          application.availability === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {application.availability}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => setSelectedApplication(application)}
                          variant="outline"
                          size="sm"
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleApplicationAction(application.id, 'approve')}
                          size="sm"
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleApplicationAction(application.id, 'reject')}
                          size="sm"
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {applications.filter(app => app.status === 'pending').length === 0 && (
                <Card className="glass-morphism border-white/20">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">All caught up!</h3>
                    <p className="text-white/60">No pending applications to review.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-retro text-white">Community Members</h2>
              <Badge className="bg-blue-500/20 text-blue-400">
                {members.length} members
              </Badge>
            </div>

            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id} className="glass-morphism border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{member.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-white/60">
                            <span>📧 {member.email}</span>
                            <span>🎓 Year {member.year} • {member.department}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-white/60 mt-1">
                            <span>📅 Joined {member.joinDate}</span>
                            <span>🏆 {member.contributions} contributions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={
                          member.role === 'Leader' ? 'bg-yellow-500/20 text-yellow-400' :
                          member.role === 'Core Member' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-blue-500/20 text-blue-400'
                        }>
                          {member.role}
                        </Badge>
                        <Button
                          onClick={() => sendMessage(member.id)}
                          size="sm"
                          variant="outline"
                          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-retro text-white">Events & Meetings</h2>
              <Button
                className="bg-gradient-to-r from-green-400 to-blue-500"
                onClick={() => alert('Event creation form will open here. Features:\n- Event title and description\n- Date and time selection\n- Location (physical/virtual)\n- Registration management\n- Attendee tracking\n- Reminder notifications')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Events */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-green-500/20 rounded-lg bg-green-500/5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">Weekly Tech Meeting</h4>
                      <Badge className="bg-green-500/20 text-green-400">Tomorrow</Badge>
                    </div>
                    <p className="text-white/70 text-sm mb-2">Discuss ongoing projects and plan next week's activities</p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>📅 Friday, 6:00 PM</span>
                      <span>📍 CS Lab 301</span>
                      <span>👥 15 registered</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        onClick={() => alert('Event details:\n- Agenda: Project updates, new member introductions\n- Duration: 2 hours\n- Materials: Bring laptops\n- RSVP deadline: Thursday 11 PM')}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white/80"
                        onClick={() => alert('Edit event functionality:\n- Modify date/time\n- Update location\n- Change description\n- Manage attendees\n- Send updates to registered members')}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">Hackathon Prep Workshop</h4>
                      <Badge className="bg-blue-500/20 text-blue-400">Next Week</Badge>
                    </div>
                    <p className="text-white/70 text-sm mb-2">Preparation session for Smart India Hackathon</p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>📅 Monday, 4:00 PM</span>
                      <span>📍 Auditorium</span>
                      <span>👥 28 registered</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        className="bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        onClick={() => alert('Workshop details:\n- Topics: Problem solving, team formation\n- Guest speaker: Industry mentor\n- Registration required\n- Certificates provided')}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white/80"
                        onClick={() => alert('Sending reminder to all registered participants...')}
                      >
                        Send Reminder
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Management */}
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Event Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-green-400">5</div>
                      <div className="text-white/60 text-sm">Events This Month</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <div className="text-xl font-bold text-blue-400">127</div>
                      <div className="text-white/60 text-sm">Total Attendees</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      onClick={() => alert('Quick event templates:\n- Weekly Meeting\n- Workshop/Seminar\n- Social Gathering\n- Competition/Contest\n- Study Session\n- Guest Lecture')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Quick Create Event
                    </Button>

                    <Button
                      className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      onClick={() => alert('Attendance tracking:\n- QR code check-in\n- Manual attendance\n- Export attendance reports\n- Member participation history')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Track Attendance
                    </Button>

                    <Button
                      className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                      onClick={() => alert('Event analytics:\n- Attendance rates\n- Popular event types\n- Member engagement\n- Feedback scores\n- Growth trends')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>

                    <Button
                      className="w-full justify-start bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30"
                      onClick={() => alert('Notification system:\n- Event reminders\n- Registration confirmations\n- Last-minute updates\n- Post-event feedback requests')}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Notifications
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Past Events */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-white/10 rounded-lg">
                    <div>
                      <h4 className="text-white font-semibold text-sm">AI/ML Workshop</h4>
                      <p className="text-white/60 text-xs">March 10, 2024 • 32 attendees</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400"
                        onClick={() => alert('Event feedback:\n- Average rating: 4.8/5\n- 95% found it helpful\n- Top comment: "Great hands-on session!"\n- Suggestions: More advanced topics')}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-400"
                        onClick={() => alert('Downloading attendance report for AI/ML Workshop...')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-white/10 rounded-lg">
                    <div>
                      <h4 className="text-white font-semibold text-sm">Team Building Session</h4>
                      <p className="text-white/60 text-xs">March 5, 2024 • 28 attendees</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400"
                        onClick={() => alert('Event feedback:\n- Average rating: 4.6/5\n- 88% enjoyed activities\n- Great team bonding\n- Request for more such events')}
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-400"
                        onClick={() => alert('Downloading attendance report for Team Building Session...')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-retro text-white">Community Analytics</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">New Members (This Month)</span>
                      <span className="text-green-400 font-bold">+12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Applications Received</span>
                      <span className="text-blue-400 font-bold">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Approval Rate</span>
                      <span className="text-purple-400 font-bold">67%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro">Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Active Members</span>
                      <span className="text-green-400 font-bold">89%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Meeting Attendance</span>
                      <span className="text-blue-400 font-bold">76%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Project Participation</span>
                      <span className="text-purple-400 font-bold">54%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-retro text-white">Community Settings</h2>

            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white/80 text-sm font-space">Community Name</label>
                  <Input
                    defaultValue={community.name}
                    className="glass-morphism border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-white/80 text-sm font-space">Description</label>
                  <Textarea
                    defaultValue={community.description}
                    className="glass-morphism border-white/20 text-white"
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-space">Meeting Schedule</label>
                    <Input
                      defaultValue={community.meetingSchedule}
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm font-space">Location</label>
                    <Input
                      defaultValue={community.location}
                      className="glass-morphism border-white/20 text-white"
                    />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-400 to-purple-500">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="glass-morphism border-white/20 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-retro text-white">Application Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedApplication(null)}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedApplication.applicantName}</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-white/80">{selectedApplication.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-400" />
                        <span className="text-white/80">{selectedApplication.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Academic Information</h4>
                      <p className="text-white/70 text-sm">Year: {selectedApplication.year}</p>
                      <p className="text-white/70 text-sm">Department: {selectedApplication.department}</p>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Availability</h4>
                      <Badge className={
                        selectedApplication.availability === 'high' ? 'bg-green-500/20 text-green-400' :
                        selectedApplication.availability === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }>
                        {selectedApplication.availability} availability
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Experience</h4>
                    <p className="text-white/70 text-sm">{selectedApplication.experience}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Skills</h4>
                    <p className="text-white/70 text-sm">{selectedApplication.skills}</p>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Motivation</h4>
                    <p className="text-white/70 text-sm">{selectedApplication.motivation}</p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => handleApplicationAction(selectedApplication.id, 'approve')}
                      className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      onClick={() => handleApplicationAction(selectedApplication.id, 'reject')}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
