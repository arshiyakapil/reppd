'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, ArrowLeft, Upload, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { UNIVERSITIES } from '@/lib/utils'

type SignupStep = 'university' | 'upload' | 'verify' | 'credentials' | 'complete'

interface FormData {
  university: string
  stream: string
  section: string
  year: number
  idFrontFile: File | null
  idBackFile: File | null
  extractedData: {
    name: string
    universityId: string
    year: number
    stream: string
    section: string
    sessionId?: string
  } | null
  password: string
  confirmPassword: string
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('university')
  const [showPassword, setShowPassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    university: '',
    stream: '',
    section: '',
    year: 1,
    idFrontFile: null,
    idBackFile: null,
    extractedData: null,
    password: '',
    confirmPassword: ''
  })

  const selectedUniversity = UNIVERSITIES.find(u => u.name === formData.university)

  const handleUniversitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.university && formData.stream && formData.year) {
      setCurrentStep('upload')
    }
  }

  const handleFileUpload = (type: 'front' | 'back', file: File) => {
    setFormData(prev => ({
      ...prev,
      [type === 'front' ? 'idFrontFile' : 'idBackFile']: file
    }))
  }

  const processOCR = async () => {
    if (!formData.idFrontFile || !formData.idBackFile) return

    setIsProcessing(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('frontImage', formData.idFrontFile)
      formDataToSend.append('backImage', formData.idBackFile)

      const response = await fetch('/api/ocr/process-id', {
        method: 'POST',
        body: formDataToSend
      })

      const result = await response.json()
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          extractedData: {
            ...result.data,
            sessionId: result.data.sessionId
          }
        }))
        setCurrentStep('verify')
      } else {
        alert('Failed to process ID. Please try again.')
      }
    } catch (error) {
      console.error('OCR processing error:', error)
      alert('Error processing ID. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setIsProcessing(true)
    try {
      const signupData = {
        university: formData.university,
        stream: formData.stream,
        section: formData.section,
        year: formData.year,
        extractedData: formData.extractedData,
        password: formData.password,
        sessionId: formData.extractedData?.sessionId
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      })

      const result = await response.json()

      if (result.success) {
        setCurrentStep('complete')
      } else {
        alert(result.error || 'Failed to create account')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('Error creating account. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderUniversityStep = () => (
    <Card className="glass-morphism border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-retro text-white">Choose Your University</CardTitle>
        <CardDescription className="text-white/60 font-space">
          Select your university and academic details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUniversitySubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 font-space">University</label>
            <select
              value={formData.university}
              onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
              className="w-full p-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent focus:border-retro-cyan"
              required
            >
              <option value="" className="bg-gray-800">Select your university</option>
              {UNIVERSITIES.map(uni => (
                <option key={uni.name} value={uni.name} className="bg-gray-800">
                  {uni.name}
                </option>
              ))}
            </select>
          </div>

          {selectedUniversity && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Stream/Department</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData(prev => ({ ...prev, stream: e.target.value }))}
                  className="w-full p-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent focus:border-retro-cyan"
                  required
                >
                  <option value="" className="bg-gray-800">Select your stream</option>
                  {selectedUniversity.streams.map(stream => (
                    <option key={stream} value={stream} className="bg-gray-800">
                      {stream}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 font-space">Section</label>
                  <Input
                    type="text"
                    placeholder="Enter section (A-J)"
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value.toUpperCase() }))}
                    className="glass-morphism border-white/20 text-white placeholder:text-white/40 focus:border-retro-cyan"
                    maxLength={1}
                  />
                  <p className="text-xs text-white/50 font-space">Enter A, B, C, D, E, F, G, H, I, or J</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 font-space">Year of Study</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full p-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent focus:border-retro-cyan"
                    required
                  >
                    <option value={1} className="bg-gray-800">1st Year</option>
                    <option value={2} className="bg-gray-800">2nd Year</option>
                    <option value={3} className="bg-gray-800">3rd Year</option>
                    <option value={4} className="bg-gray-800">4th Year</option>
                    <option value={5} className="bg-gray-800">5th Year</option>
                    <option value={6} className="bg-gray-800">6th Year</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold"
            size="lg"
            disabled={!formData.university || !formData.stream || !formData.year}
          >
            Continue to ID Upload
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderUploadStep = () => (
    <Card className="glass-morphism border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-retro text-white">Upload University ID</CardTitle>
        <CardDescription className="text-white/60 font-space">
          Upload clear photos of both sides of your university ID card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Front ID Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80 font-space">Front Side of ID</label>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-retro-cyan transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload('front', e.target.files[0])}
              className="hidden"
              id="front-upload"
            />
            <label htmlFor="front-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
              <p className="text-white/60 font-space">
                {formData.idFrontFile ? formData.idFrontFile.name : 'Click to upload front side'}
              </p>
            </label>
          </div>
        </div>

        {/* Back ID Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80 font-space">Back Side of ID</label>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-retro-cyan transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload('back', e.target.files[0])}
              className="hidden"
              id="back-upload"
            />
            <label htmlFor="back-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
              <p className="text-white/60 font-space">
                {formData.idBackFile ? formData.idBackFile.name : 'Click to upload back side'}
              </p>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="glass"
            onClick={() => setCurrentStep('university')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={processOCR}
            disabled={!formData.idFrontFile || !formData.idBackFile || isProcessing}
            className="flex-1 bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold"
          >
            {isProcessing ? 'Processing...' : 'Process ID'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderVerifyStep = () => (
    <Card className="glass-morphism border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-retro text-white">Verify Information</CardTitle>
        <CardDescription className="text-white/60 font-space">
          Please confirm the extracted information is correct
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.extractedData && (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-space">ID processed successfully!</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Full Name</label>
                <Input
                  value={formData.extractedData.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    extractedData: prev.extractedData ? { ...prev.extractedData, name: e.target.value } : null
                  }))}
                  className="glass-morphism border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">University ID</label>
                <Input
                  value={formData.extractedData.universityId}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    extractedData: prev.extractedData ? { ...prev.extractedData, universityId: e.target.value } : null
                  }))}
                  className="glass-morphism border-white/20 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 font-space">Stream</label>
                  <Input
                    value={formData.extractedData.stream}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      extractedData: prev.extractedData ? { ...prev.extractedData, stream: e.target.value } : null
                    }))}
                    className="glass-morphism border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 font-space">Year</label>
                  <select
                    value={formData.extractedData.year}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      extractedData: prev.extractedData ? { ...prev.extractedData, year: parseInt(e.target.value) } : null
                    }))}
                    className="w-full p-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent"
                  >
                    <option value={1} className="bg-gray-800">1st Year</option>
                    <option value={2} className="bg-gray-800">2nd Year</option>
                    <option value={3} className="bg-gray-800">3rd Year</option>
                    <option value={4} className="bg-gray-800">4th Year</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Section</label>
                <Input
                  value={formData.extractedData.section}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    extractedData: prev.extractedData ? { ...prev.extractedData, section: e.target.value } : null
                  }))}
                  className="glass-morphism border-white/20 text-white"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            variant="glass"
            onClick={() => setCurrentStep('upload')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={() => setCurrentStep('credentials')}
            className="flex-1 bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold"
          >
            Confirm & Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderCredentialsStep = () => (
    <Card className="glass-morphism border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-retro text-white">Set Your Password</CardTitle>
        <CardDescription className="text-white/60 font-space">
          Create a secure password for your REPPD account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 font-space">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="glass-morphism border-white/20 text-white placeholder:text-white/40 pr-10"
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 font-space">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="glass-morphism border-white/20 text-white placeholder:text-white/40"
              required
            />
          </div>

          <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-400 text-sm font-space">
              🔒 Your University ID ({formData.extractedData?.universityId}) will be your username for login.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="glass"
              onClick={() => setCurrentStep('verify')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold"
            >
              Create Account
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderCompleteStep = () => (
    <Card className="glass-morphism border-white/20">
      <CardHeader className="text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <CardTitle className="text-2xl font-retro text-white">Account Created!</CardTitle>
        <CardDescription className="text-white/60 font-space">
          Welcome to REPPD! Your account is pending verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
          <p className="text-yellow-400 text-sm font-space">
            Your account will be verified within 24-48 hours. You'll receive an email once approved.
          </p>
        </div>

        <Button
          asChild
          className="w-full bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80 text-white font-bold"
          size="lg"
        >
          <Link href="/auth/login">Go to Login</Link>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-6 sm:mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative">
            <Zap className="w-10 sm:w-12 h-10 sm:h-12 text-retro-orange retro-glow" />
            <div className="absolute inset-0 w-10 sm:w-12 h-10 sm:h-12 bg-retro-orange/20 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-max px-4">
            {['university', 'upload', 'verify', 'credentials', 'complete'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                  currentStep === step
                    ? 'bg-retro-orange text-black'
                    : index < ['university', 'upload', 'verify', 'credentials', 'complete'].indexOf(currentStep)
                    ? 'bg-retro-cyan text-black'
                    : 'bg-white/20 text-white/60'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-4 sm:w-8 h-0.5 ${
                    index < ['university', 'upload', 'verify', 'credentials', 'complete'].indexOf(currentStep)
                      ? 'bg-retro-cyan'
                      : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 'university' && renderUniversityStep()}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'verify' && renderVerifyStep()}
        {currentStep === 'credentials' && renderCredentialsStep()}
        {currentStep === 'complete' && renderCompleteStep()}

        {currentStep !== 'complete' && (
          <div className="mt-6 text-center">
            <p className="text-white/60 font-space">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-retro-cyan hover:text-retro-pink transition-colors font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
