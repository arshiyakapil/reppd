'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Menu, X, Zap, Users, MessageSquare, User, LogOut, Settings, Crown, Search, Bell, Home, GraduationCap, UserPlus, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalSearch } from '@/components/search/global-search'
import { NotificationCenter } from '@/components/notifications/notification-center'

export function RetroNavbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Navigation items for logged-in users
  const loggedInNavigationItems = [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'Classroom', href: '/classroom', icon: GraduationCap },
    { name: 'Communities', href: '/communities', icon: Users },
    { name: 'Requests', href: '/requests', icon: MessageSquare },
    { name: 'Notices', href: '/notices', icon: Bell },
  ]

  // Navigation items for logged-out users
  const loggedOutNavigationItems = [
    { name: 'For Universities', href: '/universities', icon: GraduationCap },
  ]

  const isLoggedIn = !!session

  // Check for management access
  const [hasManagementAccess, setHasManagementAccess] = useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const managementAccess = localStorage.getItem('managementAccess')
      if (managementAccess) {
        const access = JSON.parse(managementAccess)
        if (access.hasAccess && access.expiresAt > Date.now()) {
          setHasManagementAccess(true)
        } else {
          localStorage.removeItem('managementAccess')
        }
      }
    }
  }, [session])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href={isLoggedIn ? "/feed" : "/"} className="flex items-center space-x-2 group">
            <div className="relative">
              <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-retro-orange retro-glow" />
              <div className="absolute inset-0 w-6 sm:w-8 h-6 sm:h-8 bg-retro-orange/20 rounded-full blur-xl group-hover:bg-retro-orange/40 transition-all duration-300"></div>
            </div>
            <span className="text-xl sm:text-2xl font-retro retro-text font-bold">
              REPPD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              // Logged-in navigation
              <>
                {loggedInNavigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors duration-300 font-space font-medium hover:retro-glow"
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Management Crown - Only show if user has management access */}
                {hasManagementAccess && (
                  <Link
                    href="/dev-portal"
                    className="text-white/80 hover:text-white transition-colors duration-300 font-space font-medium hover:retro-glow flex items-center gap-1"
                    title="Developer Portal"
                  >
                    <Crown className="w-4 h-4 text-yellow-400" />
                    Manage
                  </Link>
                )}
              </>
            ) : (
              // Logged-out navigation
              <>
                {loggedOutNavigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors duration-300 font-space font-medium hover:retro-glow"
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Search & Notifications - Only for logged-in users */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-2 mr-4">
              <Button
                variant="ghost"
                onClick={() => setIsSearchOpen(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsNotificationsOpen(true)}
                className="text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 relative"
              >
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
              </Button>
            </div>
          )}

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="text-white hover:bg-white/10 hover:text-retro-cyan transition-all duration-300 flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-space">{session.user?.name}</span>
                </Button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 glass-morphism border border-white/20 rounded-lg shadow-xl z-50">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-semibold">{session.user?.name}</p>
                      <p className="text-white/60 text-sm font-space">{session.user?.universityId}</p>
                      <p className="text-white/60 text-xs font-space">
                        {session.user?.stream} • Year {session.user?.year}
                      </p>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Link href="/dashboard">
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Link href="/profile">
                          <Settings className="w-4 h-4 mr-2" />
                          Profile Settings
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsProfileMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  asChild
                  className="text-white hover:bg-white/10 hover:text-retro-cyan transition-all duration-300 text-sm"
                  size="sm"
                >
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-semibold shadow-lg hover:shadow-retro-pink/25 transition-all duration-300 text-sm"
                  size="sm"
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-morphism border-t border-white/10 animate-in slide-in-from-top duration-200">
          <div className="px-4 py-6 space-y-4">
            {isLoggedIn ? (
              // Logged-in mobile navigation
              <>
                {loggedInNavigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-white/80 hover:text-white transition-colors duration-300 font-space font-medium py-3 px-2 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Profile Section */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <Link
                    href="/dashboard"
                    className="block text-white/80 hover:text-white transition-colors duration-300 font-space font-medium py-3 px-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block text-white/80 hover:text-white transition-colors duration-300 font-space font-medium py-3 px-2 rounded-lg hover:bg-white/5 flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 py-3 px-2"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              // Logged-out mobile navigation
              <>
                {loggedOutNavigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-white/80 hover:text-white transition-colors duration-300 font-space font-medium py-3 px-2 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Buttons */}
                <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full text-white hover:bg-white/10 hover:text-retro-cyan transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/login">
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/auth/signup">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </>
            )}
            <div className="pt-4 space-y-3">
              {session ? (
                <>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{session.user?.name}</p>
                        <p className="text-white/60 text-sm font-space">{session.user?.universityId}</p>
                      </div>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 mb-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/dashboard">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      onClick={() => {
                        setIsMenuOpen(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      variant="outline"
                      className="w-full border-red-400/30 text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full border-white/20 text-white hover:bg-white/10 h-12"
                    size="lg"
                  >
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-semibold h-12"
                    size="lg"
                  >
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </nav>
  )
}

export function RetroStats() {
  const stats = [
    { icon: Users, label: 'Active Students', value: '10K+', color: 'text-retro-cyan' },
    { icon: MessageSquare, label: 'Messages Sent', value: '1M+', color: 'text-retro-pink' },
    { icon: Zap, label: 'Universities', value: '50+', color: 'text-retro-orange' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
      {stats.map((stat, index) => (
        <div key={index} className="text-center group">
          <div className="relative inline-block mb-4">
            <stat.icon className={cn("w-12 h-12", stat.color, "retro-glow")} />
            <div className={cn(
              "absolute inset-0 w-12 h-12 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300",
              stat.color.replace('text-', 'bg-').replace('retro-', '')
            )}></div>
          </div>
          <div className={cn("text-3xl font-retro font-bold mb-2", stat.color)}>
            {stat.value}
          </div>
          <div className="text-white/60 font-space">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
