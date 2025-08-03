'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Image as ImageIcon,
  Video,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Flag,
  MessageSquare
} from 'lucide-react'
import { ReportModal } from '@/components/moderation/report-modal'

// Mock data for posts
const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Priya Sharma',
      universityId: 'CS2021045',
      year: 3,
      stream: 'Computer Science Engineering',
      section: 'B',
      avatar: '👩‍💻'
    },
    content: 'Just finished our Machine Learning project! 🤖 Our team built an AI model that can predict student performance. Excited to present it tomorrow! #MachineLearning #AI #SRMProjects',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3,
    type: 'text',
    tags: ['MachineLearning', 'AI', 'SRMProjects']
  },
  {
    id: '2',
    author: {
      name: 'Rahul Kumar',
      universityId: 'ME2020123',
      year: 4,
      stream: 'Mechanical Engineering',
      section: 'A',
      avatar: '👨‍🔧'
    },
    content: 'Looking for teammates for the upcoming Hackathon! 💻 Need 2 more developers (preferably frontend + backend). Theme is "Smart Campus Solutions". DM me if interested! 🚀',
    timestamp: '4 hours ago',
    likes: 18,
    comments: 12,
    shares: 6,
    type: 'text',
    tags: ['Hackathon', 'TeamUp', 'SmartCampus']
  },
  {
    id: '3',
    author: {
      name: 'Sneha Patel',
      universityId: 'EC2021089',
      year: 3,
      stream: 'Electronics & Communication',
      section: 'C',
      avatar: '👩‍🔬'
    },
    content: 'Amazing workshop on IoT and Embedded Systems today! 📡 Learned so much about sensor integration and wireless communication. Thanks to Prof. Gupta for the hands-on session! 🙏',
    timestamp: '6 hours ago',
    likes: 31,
    comments: 5,
    shares: 2,
    type: 'text',
    tags: ['IoT', 'Workshop', 'Electronics']
  },
  {
    id: '4',
    author: {
      name: 'Arjun Singh',
      universityId: 'IT2022156',
      year: 2,
      stream: 'Information Technology',
      section: 'A',
      avatar: '👨‍💻'
    },
    content: 'Study group for Data Structures & Algorithms forming! 📚 Meeting every Tuesday & Thursday 6 PM at Central Library. Currently covering Trees and Graphs. All years welcome! 🌳',
    timestamp: '8 hours ago',
    likes: 42,
    comments: 15,
    shares: 8,
    type: 'text',
    tags: ['StudyGroup', 'DSA', 'Library']
  }
]

export default function FeedPage() {
  const { data: session } = useSession()
  const [newPost, setNewPost] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  // In production, start with empty posts array and load from API
  const [posts, setPosts] = useState(process.env.NODE_ENV === 'development' ? mockPosts : [])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean
    postId: string
    content: string
  }>({ isOpen: false, postId: '', content: '' })

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center mx-auto mb-6">
        <MessageSquare className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-2xl font-retro text-white mb-4">Welcome to REPPD!</h3>
      <p className="text-white/60 font-space mb-6 max-w-md mx-auto">
        Be the first to share something with your campus community. Create a post to get the conversation started!
      </p>
      <Button
        onClick={() => document.getElementById('create-post-textarea')?.focus()}
        className="bg-gradient-to-r from-retro-cyan to-retro-purple hover:from-retro-cyan/80 hover:to-retro-purple/80"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create First Post
      </Button>
    </div>
  )

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const post = {
      id: Date.now().toString(),
      author: {
        name: isAnonymous ? 'Anonymous Student' : (session?.user?.name || 'Anonymous'),
        universityId: isAnonymous ? 'ANON' : (session?.user?.universityId || 'UNKNOWN'),
        year: isAnonymous ? 0 : (session?.user?.year || 1),
        stream: isAnonymous ? 'Anonymous' : (session?.user?.stream || 'Unknown'),
        section: isAnonymous ? '' : (session?.user?.section || 'A'),
        avatar: isAnonymous ? '🕶️' : '👤'
      },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      type: 'text',
      tags: [],
      isAnonymous
    }

    setPosts([post, ...posts])
    setNewPost('')
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMorePosts) return

    setIsLoadingMore(true)

    // Simulate API call
    setTimeout(() => {
      // Generate more mock posts
      const morePosts = Array.from({ length: 5 }, (_, index) => ({
        id: `${Date.now()}-${index}`,
        author: {
          name: `Student ${currentPage * 5 + index + 1}`,
          universityId: `CS202${currentPage}${index}`,
          year: Math.floor(Math.random() * 4) + 1,
          stream: 'Computer Science Engineering',
          section: String.fromCharCode(65 + Math.floor(Math.random() * 3)),
          avatar: ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓'][Math.floor(Math.random() * 4)]
        },
        content: `This is a sample post from page ${currentPage + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        timestamp: `${Math.floor(Math.random() * 24)} hours ago`,
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        shares: Math.floor(Math.random() * 10),
        type: 'text' as const,
        tags: ['Sample', 'Post']
      }))

      setPosts(prev => [...prev, ...morePosts])
      setCurrentPage(prev => prev + 1)
      setIsLoadingMore(false)

      // Simulate end of posts after 5 pages
      if (currentPage >= 5) {
        setHasMorePosts(false)
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
            Campus Feed 🚀
          </h1>
          <p className="text-white/60 font-space">
            What's happening at SRM University Sonipat
          </p>
        </div>

        {/* Create Post */}
        <Card className="glass-morphism border-white/20 mb-6 sm:mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <Plus className="w-5 h-5 text-retro-orange" />
              Share Something
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's on your mind? Share updates, ask questions, or start discussions..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="glass-morphism border-white/20 text-white placeholder:text-white/40 resize-none min-h-[100px]"
            />
            
            {/* Anonymous Toggle */}
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-white/20 bg-transparent text-retro-cyan focus:ring-retro-cyan"
              />
              <label htmlFor="anonymous" className="text-white/70 text-sm font-space cursor-pointer">
                🕶️ Post anonymously
              </label>
              <span className="text-white/40 text-xs font-space ml-auto">
                Your identity will be hidden
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Photo
                </Button>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Event
                </Button>
              </div>

              <Button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
              >
                {isAnonymous ? 'Post Anonymously' : 'Post'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            posts.map((post) => (
            <Card key={post.id} className="glass-morphism border-white/20 hover:scale-[1.02] transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center text-xl">
                      {post.author.avatar}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{post.author.name}</h3>
                      <p className="text-white/60 text-sm font-space">
                        {post.author.stream} • Year {post.author.year} • Section {post.author.section}
                      </p>
                      <p className="text-white/40 text-xs font-space flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-red-400"
                      onClick={() => setReportModal({
                        isOpen: true,
                        postId: post.id,
                        content: post.content
                      })}
                    >
                      <Flag className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-white font-space leading-relaxed">
                  {post.content}
                </p>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-retro-cyan/20 text-retro-cyan text-xs rounded-full font-space"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleLike(post.id)}
                      className="text-white/60 hover:text-retro-pink transition-colors"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      {post.likes}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-cyan transition-colors">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.comments}
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-orange transition-colors">
                      <Share2 className="w-4 h-4 mr-2" />
                      {post.shares}
                    </Button>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-retro-yellow transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          {hasMorePosts ? (
            <Button
              onClick={loadMorePosts}
              disabled={isLoadingMore}
              variant="glass"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {isLoadingMore ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Loading...
                </>
              ) : (
                'Load More Posts'
              )}
            </Button>
          ) : (
            <p className="text-white/60 font-space">
              🎉 You've reached the end! No more posts to load.
            </p>
          )}
        </div>

        {/* Report Modal */}
        <ReportModal
          isOpen={reportModal.isOpen}
          onClose={() => setReportModal({ isOpen: false, postId: '', content: '' })}
          contentType="post"
          contentId={reportModal.postId}
          contentPreview={reportModal.content}
        />
      </div>
    </div>
  )
}
