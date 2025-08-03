'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  MessageSquare, 
  Bell, 
  Users, 
  HelpCircle, 
  BookOpen, 
  User,
  Search,
  Plus
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Feed',
    href: '/feed',
    icon: Home,
    description: 'Main social feed'
  },
  {
    name: 'Requests',
    href: '/requests',
    icon: HelpCircle,
    description: 'Help requests & carpools'
  },
  {
    name: 'Notices',
    href: '/notices',
    icon: Bell,
    description: 'University announcements'
  },
  {
    name: 'MyUni',
    href: '/myuni',
    icon: BookOpen,
    description: 'University information'
  },
  {
    name: 'Communities',
    href: '/communities',
    icon: Users,
    description: 'Clubs & groups'
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageSquare,
    description: 'Messages & conversations'
  }
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-amber-50 border-r-4 border-red-400 shadow-lg h-screen w-64 fixed left-0 top-0 overflow-y-auto notebook-lines">
      {/* Red margin */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-red-50 border-r border-red-300">
        {/* Hole punches */}
        <div className="absolute left-3 top-8 w-2 h-2 bg-white border border-gray-300 rounded-full"></div>
        <div className="absolute left-3 top-20 w-2 h-2 bg-white border border-gray-300 rounded-full"></div>
        <div className="absolute left-3 top-32 w-2 h-2 bg-white border border-gray-300 rounded-full"></div>
        <div className="absolute left-3 top-44 w-2 h-2 bg-white border border-gray-300 rounded-full"></div>
      </div>

      {/* Navigation content */}
      <div className="ml-12 pl-4 pr-4 py-6">
        {/* Logo/Brand */}
        <div className="mb-8">
          <Link href="/" className="block">
            <h1 className="text-3xl font-handwriting text-blue-900 font-bold">
              REPPD
            </h1>
            <p className="text-sm text-blue-600 font-handwriting">
              Your Campus Community
            </p>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 space-y-2">
          <Button 
            variant="notebook" 
            size="sm" 
            className="w-full justify-start"
            asChild
          >
            <Link href="/create/post">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start bg-amber-50 border-blue-300"
            asChild
          >
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Link>
          </Button>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  "hover:bg-blue-50 hover:text-blue-700",
                  isActive 
                    ? "bg-blue-100 text-blue-900 border-l-4 border-blue-500" 
                    : "text-blue-700"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <div>
                  <div className="font-handwriting text-base">{item.name}</div>
                  <div className="text-xs text-blue-500">{item.description}</div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* User Profile Section */}
        <div className="mt-8 pt-6 border-t border-blue-200">
          <Link
            href="/profile"
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
              "hover:bg-blue-50 hover:text-blue-700",
              pathname === '/profile' 
                ? "bg-blue-100 text-blue-900 border-l-4 border-blue-500" 
                : "text-blue-700"
            )}
          >
            <User className="w-5 h-5 mr-3" />
            <div>
              <div className="font-handwriting text-base">Profile</div>
              <div className="text-xs text-blue-500">Your account</div>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-amber-50 border-t-2 border-blue-300 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navigationItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center px-2 py-1 rounded-md transition-colors",
                isActive 
                  ? "text-blue-900 bg-blue-100" 
                  : "text-blue-600 hover:text-blue-800"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-handwriting mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
