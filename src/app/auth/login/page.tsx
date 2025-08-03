'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showManagementCode, setShowManagementCode] = useState(false)
  const [managementCode, setManagementCode] = useState('')
  const [formData, setFormData] = useState({
    universityId: '',
    password: '',
    hasManagementCode: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Check management code first if provided
      let hasManagementAccess = false
      if (formData.hasManagementCode && managementCode) {
        if (managementCode === '19022552') {
          hasManagementAccess = true
          // Store management access in session
          localStorage.setItem('managementAccess', JSON.stringify({
            hasAccess: true,
            code: managementCode,
            role: 'developer',
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          }))
        } else {
          setError('Invalid management code')
          setIsLoading(false)
          return
        }
      }

      const result = await signIn('credentials', {
        universityId: formData.universityId,
        password: formData.password,
        managementCode: hasManagementAccess ? managementCode : undefined,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid university ID or password')
      } else {
        router.push('/feed')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center text-white/60 hover:text-white mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card className="glass-morphism border-white/20">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Zap className="w-10 sm:w-12 h-10 sm:h-12 text-retro-orange retro-glow" />
                <div className="absolute inset-0 w-10 sm:w-12 h-10 sm:h-12 bg-retro-orange/20 rounded-full blur-xl"></div>
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-retro text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-white/60 font-space text-sm sm:text-base">
              Sign in to your REPPD account
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm font-space">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">
                  University ID
                </label>
                <Input
                  type="text"
                  placeholder="Enter your university ID"
                  value={formData.universityId}
                  onChange={(e) => setFormData(prev => ({ ...prev, universityId: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40 focus:border-retro-cyan"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="glass-morphism border-white/20 text-white placeholder:text-white/40 focus:border-retro-cyan pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Management Code Section */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasManagementCode}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, hasManagementCode: e.target.checked }))
                      setShowManagementCode(e.target.checked)
                    }}
                    className="rounded border-white/20 bg-transparent text-retro-cyan focus:ring-retro-cyan"
                  />
                  <span className="text-sm text-white/70 font-space">I have a management code</span>
                </label>

                {showManagementCode && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 font-space">
                      Management Code
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter management code"
                      value={managementCode}
                      onChange={(e) => setManagementCode(e.target.value)}
                      className="glass-morphism border-white/20 text-white placeholder:text-white/40 focus:border-retro-purple"
                    />
                    <p className="text-white/40 text-xs font-space">
                      For developers, CRs, community leaders, and professors
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-transparent text-retro-cyan focus:ring-retro-cyan"
                  />
                  <span className="text-sm text-white/60 font-space">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-retro-cyan hover:text-retro-pink transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold"
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 font-space">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-retro-cyan hover:text-retro-pink transition-colors font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>



            {/* Social Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-white/60 font-space">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="glass"
                  className="border-white/20 hover:border-white/40"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="glass"
                  className="border-white/20 hover:border-white/40"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Twitter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
