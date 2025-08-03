'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search,
  BookOpen,
  MessageCircle,
  Users,
  Settings,
  Shield,
  Smartphone,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Clock
} from 'lucide-react'

// FAQ data
const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: BookOpen,
    questions: [
      {
        q: 'How do I create an account on REPPD?',
        a: 'To create an account, click "Sign Up" on the homepage, upload your student ID card for verification, fill in your details, and wait for approval. The process typically takes 24-48 hours.'
      },
      {
        q: 'Why do I need to upload my student ID?',
        a: 'We verify student IDs to ensure REPPD remains a safe, authentic campus community. This helps prevent fake accounts and maintains the integrity of our platform.'
      },
      {
        q: 'How long does account verification take?',
        a: 'Account verification typically takes 24-48 hours. You\'ll receive an email notification once your account is approved.'
      },
      {
        q: 'Can I use REPPD if I\'m not a student?',
        a: 'REPPD is exclusively for verified university students. Faculty and staff access is available through special institutional accounts.'
      }
    ]
  },
  {
    id: 'using-features',
    title: 'Using Features',
    icon: Users,
    questions: [
      {
        q: 'How do I join a community or club?',
        a: 'Browse communities in the Communities section, click on any community that interests you, and click "Join Community". Some communities may require approval from moderators.'
      },
      {
        q: 'How do I create a carpool request?',
        a: 'Go to the Requests section, click "Create New Request", select "Carpool", and fill in your route, timing, and cost details. Other students can then respond to your request.'
      },
      {
        q: 'Can I post anonymously?',
        a: 'Yes! When creating a post, check the "Post anonymously" option. Your identity will be hidden, but the post will still follow our community guidelines.'
      },
      {
        q: 'How do I search for specific content?',
        a: 'Use the search icon in the top navigation bar. You can search for posts, users, communities, and requests. Use hashtags to find specific topics.'
      }
    ]
  },
  {
    id: 'safety-privacy',
    title: 'Safety & Privacy',
    icon: Shield,
    questions: [
      {
        q: 'How do I report inappropriate content?',
        a: 'Click the flag icon on any post or comment, select the reason for reporting, and provide additional context. Our moderation team reviews all reports within 24 hours.'
      },
      {
        q: 'Can I control who sees my posts?',
        a: 'Yes, you can adjust your privacy settings in your profile. You can choose to make your posts visible to everyone, friends only, or specific communities.'
      },
      {
        q: 'How do I block or mute someone?',
        a: 'Go to the user\'s profile, click the three dots menu, and select "Block User" or "Mute User". Blocked users cannot see your content or contact you.'
      },
      {
        q: 'Is my personal information safe?',
        a: 'We take privacy seriously. Your personal information is encrypted and never shared with third parties. Read our Privacy Policy for full details.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Settings,
    questions: [
      {
        q: 'The app is running slowly. What can I do?',
        a: 'Try refreshing the page, clearing your browser cache, or using a different browser. If problems persist, contact our technical support team.'
      },
      {
        q: 'Can I use REPPD on my mobile phone?',
        a: 'Yes! REPPD works on all devices. For the best mobile experience, add REPPD to your home screen for app-like functionality.'
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email we send you.'
      },
      {
        q: 'Why can\'t I upload images?',
        a: 'Ensure your images are under 10MB and in supported formats (JPEG, PNG, WebP, GIF). Check your internet connection and try again.'
      }
    ]
  }
]

// Quick links
const quickLinks = [
  { title: 'Community Guidelines', href: '/guidelines', icon: Shield },
  { title: 'Privacy Policy', href: '/privacy', icon: Shield },
  { title: 'Terms of Service', href: '/terms', icon: BookOpen },
  { title: 'Contact Support', href: '/contact', icon: MessageCircle }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started')
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  // Filter questions based on search
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-4">
            🆘 Help Center
          </h1>
          <p className="text-white/70 font-space text-lg mb-6">
            Find answers to common questions and get support
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-morphism border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-morphism border-white/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white font-retro">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-white/70 hover:text-white"
                  >
                    <link.icon className="w-4 h-4" />
                    <span className="font-space text-sm">{link.title}</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="glass-morphism border-white/20 mt-6">
              <CardHeader>
                <CardTitle className="text-white font-retro">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-retro-cyan mx-auto mb-3" />
                  <p className="text-white/70 text-sm font-space mb-4">
                    Can't find what you're looking for? Our support team is here to help!
                  </p>
                  <Button className="w-full bg-gradient-to-r from-retro-cyan to-retro-blue">
                    Contact Support
                  </Button>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <div className="space-y-2 text-xs text-white/60 font-space">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>Response time: &lt; 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" />
                      <span>support@reppd.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* FAQ Categories */}
            <div className="space-y-6">
              {(searchQuery ? filteredCategories : faqCategories).map((category) => (
                <Card key={category.id} className="glass-morphism border-white/20">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <category.icon className="w-6 h-6 text-retro-cyan" />
                        <CardTitle className="text-white font-retro">{category.title}</CardTitle>
                        <Badge className="bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30">
                          {category.questions.length}
                        </Badge>
                      </div>
                      {expandedCategory === category.id ? (
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white/60" />
                      )}
                    </div>
                  </CardHeader>

                  {(expandedCategory === category.id || searchQuery) && (
                    <CardContent className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <div key={index} className="border-b border-white/10 last:border-b-0 pb-4 last:pb-0">
                          <button
                            onClick={() => setExpandedQuestion(
                              expandedQuestion === `${category.id}-${index}` 
                                ? null 
                                : `${category.id}-${index}`
                            )}
                            className="w-full text-left"
                          >
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                              <h4 className="text-white font-semibold font-space">{faq.q}</h4>
                              {expandedQuestion === `${category.id}-${index}` ? (
                                <ChevronDown className="w-4 h-4 text-white/60 flex-shrink-0 ml-2" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-white/60 flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                          
                          {(expandedQuestion === `${category.id}-${index}` || searchQuery) && (
                            <div className="px-3 pb-3">
                              <p className="text-white/70 font-space leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* No Results */}
            {searchQuery && filteredCategories.length === 0 && (
              <Card className="glass-morphism border-white/20">
                <CardContent className="pt-6 text-center">
                  <Search className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No results found</h3>
                  <p className="text-white/60 font-space mb-4">
                    We couldn't find any help articles matching "{searchQuery}"
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Additional Resources */}
            <Card className="glass-morphism border-white/20 mt-8">
              <CardHeader>
                <CardTitle className="text-white font-retro">Additional Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-retro-green" />
                      Mobile App
                    </h4>
                    <p className="text-white/70 text-sm font-space mb-3">
                      Add REPPD to your home screen for a native app experience on mobile devices.
                    </p>
                    <Button variant="outline" size="sm" className="border-retro-green text-retro-green hover:bg-retro-green hover:text-black">
                      Learn How
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-retro-purple" />
                      Video Tutorials
                    </h4>
                    <p className="text-white/70 text-sm font-space mb-3">
                      Watch step-by-step video guides on how to use REPPD's features effectively.
                    </p>
                    <Button variant="outline" size="sm" className="border-retro-purple text-retro-purple hover:bg-retro-purple hover:text-black">
                      Watch Videos
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
