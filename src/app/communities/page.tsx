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
  Filter
} from 'lucide-react'

// Mock data for communities
const mockCommunities = [
  {
    id: '1',
    name: 'CodeCrafters SRM',
    description: 'A community of passionate programmers and developers. We organize coding competitions, hackathons, and tech talks.',
    category: 'Technology',
    members: 245,
    icon: '💻',
    color: 'retro-cyan',
    tags: ['Programming', 'Hackathons', 'Web Dev', 'AI/ML'],
    nextEvent: 'Hackathon 2024 - March 15',
    isJoined: false,
    posts: 156,
    rating: 4.8
  },
  {
    id: '2',
    name: 'SRM Photography Club',
    description: 'Capture moments, create memories. Join us for photo walks, workshops, and exhibitions around campus and beyond.',
    category: 'Arts',
    members: 189,
    icon: '📸',
    color: 'retro-pink',
    tags: ['Photography', 'Photo Walks', 'Exhibitions', 'Workshops'],
    nextEvent: 'Campus Photo Walk - March 10',
    isJoined: true,
    posts: 89,
    rating: 4.7
  },
  {
    id: '3',
    name: 'Music Society',
    description: 'For music lovers and creators. From classical to contemporary, we celebrate all forms of music through performances and jam sessions.',
    category: 'Arts',
    members: 167,
    icon: '🎵',
    color: 'retro-orange',
    tags: ['Music', 'Performances', 'Jam Sessions', 'Instruments'],
    nextEvent: 'Open Mic Night - March 12',
    isJoined: false,
    posts: 134,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Robotics & AI Club',
    description: 'Building the future with robotics and artificial intelligence. Hands-on projects, competitions, and research opportunities.',
    category: 'Technology',
    members: 198,
    icon: '🤖',
    color: 'retro-purple',
    tags: ['Robotics', 'AI', 'IoT', 'Competitions'],
    nextEvent: 'Robot Building Workshop - March 18',
    isJoined: true,
    posts: 78,
    rating: 4.6
  },
  {
    id: '5',
    name: 'Drama & Theatre Society',
    description: 'Express yourself through the art of drama. We perform plays, organize workshops, and celebrate theatrical arts.',
    category: 'Arts',
    members: 134,
    icon: '🎭',
    color: 'retro-green',
    tags: ['Drama', 'Theatre', 'Acting', 'Performances'],
    nextEvent: 'Romeo & Juliet Auditions - March 14',
    isJoined: false,
    posts: 67,
    rating: 4.5
  },
  {
    id: '6',
    name: 'Gaming Esports Club',
    description: 'Competitive gaming and esports community. Tournaments, practice sessions, and gaming events for all skill levels.',
    category: 'Sports',
    members: 312,
    icon: '🎮',
    color: 'retro-yellow',
    tags: ['Gaming', 'Esports', 'Tournaments', 'Streaming'],
    nextEvent: 'PUBG Tournament - March 16',
    isJoined: false,
    posts: 203,
    rating: 4.4
  }
]

const categories = [
  { id: 'all', label: 'All Communities', icon: Users },
  { id: 'Technology', label: 'Technology', icon: Code },
  { id: 'Arts', label: 'Arts & Culture', icon: Palette },
  { id: 'Sports', label: 'Sports & Gaming', icon: Trophy },
  { id: 'Academic', label: 'Academic', icon: BookOpen }
]

export default function CommunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [communities, setCommunities] = useState(mockCommunities)

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
                      <Button
                        onClick={() => handleJoinCommunity(community.id)}
                        className={`flex-1 ${
                          community.isJoined
                            ? 'bg-retro-green/20 text-retro-green border border-retro-green/30 hover:bg-retro-green/30'
                            : `bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80`
                        }`}
                        variant={community.isJoined ? "outline" : "default"}
                      >
                        {community.isJoined ? (
                          <>
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            Joined
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Join
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/60 hover:text-retro-cyan"
                        asChild
                      >
                        <Link href={`/communities/${community.id}`}>
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <Button variant="glass" className="border-white/20 text-white hover:bg-white/10">
                Load More Communities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
