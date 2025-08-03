'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Users, 
  MessageSquare, 
  Calendar,
  FileText,
  Hash,
  User,
  MapPin,
  Clock,
  X
} from 'lucide-react'

interface SearchResult {
  id: string
  type: 'post' | 'user' | 'community' | 'request' | 'notice' | 'hashtag'
  title: string
  description: string
  metadata?: {
    author?: string
    timestamp?: string
    location?: string
    members?: number
    tags?: string[]
  }
  url: string
}

// Mock search results
const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'post',
    title: 'Machine Learning project presentation tomorrow',
    description: 'Our team built an AI model that can predict student performance...',
    metadata: {
      author: 'Priya Sharma',
      timestamp: '2 hours ago',
      tags: ['MachineLearning', 'AI']
    },
    url: '/feed'
  },
  {
    id: '2',
    type: 'user',
    title: 'Rahul Kumar',
    description: 'Mechanical Engineering • Year 4 • Section A',
    metadata: {
      location: 'SRM University Sonipat'
    },
    url: '/profile/rahul-kumar'
  },
  {
    id: '3',
    type: 'community',
    title: 'CodeCrafters SRM',
    description: 'A community of passionate programmers and developers',
    metadata: {
      members: 245,
      tags: ['Programming', 'Hackathons']
    },
    url: '/communities/1'
  },
  {
    id: '4',
    type: 'request',
    title: 'Daily Carpool: Gurgaon to SRM Sonipat',
    description: 'Looking for 2-3 people to share daily commute...',
    metadata: {
      author: 'Amit Verma',
      location: 'Gurgaon → SRM',
      timestamp: '4 hours ago'
    },
    url: '/requests'
  }
]

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, -1))
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault()
        handleResultClick(results[selectedIndex])
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose])

  useEffect(() => {
    if (query.trim()) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const filtered = mockSearchResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.metadata?.tags?.some(tag => 
            tag.toLowerCase().includes(query.toLowerCase())
          )
        )
        setResults(filtered)
        setIsLoading(false)
        setSelectedIndex(-1)
      }, 300)
    } else {
      setResults([])
      setSelectedIndex(-1)
    }
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url)
    onClose()
    setQuery('')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <MessageSquare className="w-4 h-4" />
      case 'user': return <User className="w-4 h-4" />
      case 'community': return <Users className="w-4 h-4" />
      case 'request': return <FileText className="w-4 h-4" />
      case 'notice': return <Calendar className="w-4 h-4" />
      case 'hashtag': return <Hash className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/30'
      case 'user': return 'bg-retro-pink/20 text-retro-pink border-retro-pink/30'
      case 'community': return 'bg-retro-purple/20 text-retro-purple border-retro-purple/30'
      case 'request': return 'bg-retro-orange/20 text-retro-orange border-retro-orange/30'
      case 'notice': return 'bg-retro-green/20 text-retro-green border-retro-green/30'
      case 'hashtag': return 'bg-retro-yellow/20 text-retro-yellow border-retro-yellow/30'
      default: return 'bg-white/20 text-white border-white/30'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4">
        <Card className="glass-morphism border-white/20 shadow-2xl">
          <CardContent className="p-0">
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/60" />
              <Input
                ref={inputRef}
                placeholder="Search posts, users, communities, requests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 text-lg"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-retro-cyan border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-white/60 font-space">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        index === selectedIndex 
                          ? 'bg-white/10 border border-white/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <Badge className={`${getTypeColor(result.type)} border`}>
                            {getTypeIcon(result.type)}
                            <span className="ml-1 capitalize">{result.type}</span>
                          </Badge>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">
                            {result.title}
                          </h3>
                          <p className="text-white/70 text-sm font-space line-clamp-2 mt-1">
                            {result.description}
                          </p>
                          
                          {result.metadata && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-white/50 font-space">
                              {result.metadata.author && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {result.metadata.author}
                                </span>
                              )}
                              {result.metadata.timestamp && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {result.metadata.timestamp}
                                </span>
                              )}
                              {result.metadata.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {result.metadata.location}
                                </span>
                              )}
                              {result.metadata.members && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {result.metadata.members} members
                                </span>
                              )}
                            </div>
                          )}
                          
                          {result.metadata?.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {result.metadata.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="px-1.5 py-0.5 bg-retro-cyan/20 text-retro-cyan text-xs rounded font-space"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60 font-space">No results found for "{query}"</p>
                  <p className="text-white/40 text-sm font-space mt-1">
                    Try different keywords or check your spelling
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60 font-space">Start typing to search</p>
                  <p className="text-white/40 text-sm font-space mt-1">
                    Find posts, users, communities, and more
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {!query.trim() && (
              <div className="p-4 border-t border-white/10">
                <p className="text-white/40 text-xs font-space mb-3">Quick Actions</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white text-xs">
                    <Hash className="w-3 h-3 mr-1" />
                    #trending
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Popular Communities
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white text-xs">
                    <FileText className="w-3 h-3 mr-1" />
                    Recent Requests
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
