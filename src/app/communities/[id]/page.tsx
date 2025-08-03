'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft,
  Users, 
  Calendar, 
  MapPin,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Plus,
  Settings,
  Crown,
  Clock,
  Pin,
  Image as ImageIcon
} from 'lucide-react'

// Mock community data
const mockCommunityData = {
  '1': {
    id: '1',
    name: 'CodeCrafters SRM',
    description: 'A community of passionate programmers and developers. We organize coding competitions, hackathons, and tech talks. Join us to enhance your coding skills and connect with like-minded individuals.',
    category: 'Technology',
    members: 245,
    icon: '💻',
    color: 'retro-cyan',
    tags: ['Programming', 'Hackathons', 'Web Dev', 'AI/ML'],
    isJoined: false,
    posts: 156,
    rating: 4.8,
    coverImage: '/api/placeholder/800/200',
    leaders: [
      { name: 'Arjun Sharma', role: 'President', avatar: '👨‍💻' },
      { name: 'Priya Patel', role: 'Vice President', avatar: '👩‍💻' }
    ],
    upcomingEvents: [
      {
        id: '1',
        title: 'Hackathon 2024',
        date: '2024-03-15',
        time: '10:00 AM',
        venue: 'Tech Lab',
        attendees: 45
      },
      {
        id: '2',
        title: 'React Workshop',
        date: '2024-03-20',
        time: '2:00 PM',
        venue: 'Computer Lab 1',
        attendees: 30
      }
    ],
    recentPosts: [
      {
        id: '1',
        author: { name: 'Rahul Kumar', avatar: '👨‍💻' },
        content: 'Excited for the upcoming hackathon! Who else is participating? 🚀',
        timestamp: '2 hours ago',
        likes: 12,
        comments: 5
      },
      {
        id: '2',
        author: { name: 'Sneha Gupta', avatar: '👩‍💻' },
        content: 'Just finished the JavaScript workshop. Amazing session by our seniors! 💯',
        timestamp: '5 hours ago',
        likes: 18,
        comments: 3
      }
    ]
  }
  // Add more communities as needed
}

export default function CommunityPage() {
  const params = useParams()
  const communityId = params.id as string
  const [newPost, setNewPost] = useState('')
  const [isJoined, setIsJoined] = useState(false)
  
  const community = mockCommunityData[communityId as keyof typeof mockCommunityData]
  
  if (!community) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-retro text-white mb-4">Community Not Found</h1>
          <Button asChild variant="glass">
            <Link href="/communities">Back to Communities</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleJoin = () => {
    setIsJoined(!isJoined)
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return
    // TODO: Add post to community
    setNewPost('')
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/communities"
          className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Communities
        </Link>

        {/* Community Header */}
        <Card className="glass-morphism border-white/20 mb-8">
          <div className="relative h-48 bg-gradient-to-r from-retro-cyan/20 to-retro-purple/20 rounded-t-lg">
            <div className="absolute inset-0 bg-black/20 rounded-t-lg"></div>
            <div className="absolute bottom-4 left-6 flex items-end gap-4">
              <div className={`w-20 h-20 bg-${community.color}/20 rounded-xl flex items-center justify-center text-4xl border-2 border-${community.color}/30`}>
                {community.icon}
              </div>
              <div>
                <h1 className="text-3xl font-retro font-bold text-white mb-1">
                  {community.name}
                </h1>
                <Badge className={`bg-${community.color}/20 text-${community.color} border border-${community.color}/30`}>
                  {community.category}
                </Badge>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="text-white/70 font-space mb-4">
                  {community.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {community.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 bg-${community.color}/10 text-${community.color} text-xs rounded-full font-space border border-${community.color}/20`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-white font-bold text-xl">{community.members}</div>
                    <div className="text-white/60 text-xs font-space">Members</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl">{community.posts}</div>
                    <div className="text-white/60 text-xs font-space">Posts</div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-xl flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      {community.rating}
                    </div>
                    <div className="text-white/60 text-xs font-space">Rating</div>
                  </div>
                </div>
                
                <Button
                  onClick={handleJoin}
                  className={`w-full ${
                    isJoined || community.isJoined
                      ? 'bg-retro-green/20 text-retro-green border border-retro-green/30 hover:bg-retro-green/30'
                      : `bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80`
                  }`}
                  variant={isJoined || community.isJoined ? "outline" : "default"}
                >
                  {isJoined || community.isJoined ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 fill-current" />
                      Joined
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Join Community
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            {(isJoined || community.isJoined) && (
              <Card className="glass-morphism border-white/20">
                <CardHeader>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <Plus className="w-5 h-5 text-retro-orange" />
                    Share with Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Share updates, ask questions, or start discussions..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="glass-morphism border-white/20 text-white placeholder:text-white/40 resize-none min-h-[100px]"
                  />
                  
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Add Photo
                    </Button>
                    
                    <Button 
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                      className="bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
                    >
                      Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Posts */}
            <div className="space-y-4">
              <h2 className="text-xl font-retro text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-retro-cyan" />
                Recent Posts
              </h2>
              
              {community.recentPosts.map((post) => (
                <Card key={post.id} className="glass-morphism border-white/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center">
                        {post.author.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{post.author.name}</span>
                          <span className="text-white/40 text-sm font-space">{post.timestamp}</span>
                        </div>
                        <p className="text-white/70 font-space">{post.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-pink">
                        <Heart className="w-4 h-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-cyan">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-orange">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Leaders */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <Crown className="w-5 h-5 text-retro-yellow" />
                  Community Leaders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {community.leaders.map((leader, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                    <div className="w-8 h-8 bg-gradient-to-r from-retro-orange to-retro-pink rounded-full flex items-center justify-center">
                      {leader.avatar}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{leader.name}</p>
                      <p className="text-white/60 text-xs font-space">{leader.role}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-retro-green" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {community.upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-white/5 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">{event.title}</h4>
                    <div className="space-y-1 text-sm text-white/60 font-space">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {event.attendees} attending
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3 border-retro-green text-retro-green hover:bg-retro-green hover:text-black">
                      Join Event
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
