'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  GraduationCap,
  Upload,
  Eye,
  EyeOff,
  ArrowLeft,
  Phone,
  MapPin,
  BookOpen,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { signupSchema, type SignupFormData, universityOptions, streamOptions, interestOptions } from '@/lib/auth-schemas'

export default function EnhancedSignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      agreeToTerms: false,
      agreeToPrivacy: false,
      interests: []
    }
  })

  const watchedUniversity = watch('university')
  const watchedPassword = watch('password')

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          interests: selectedInterests
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect to ID verification page
        router.push('/auth/verify-id')
      } else {
        throw new Error(result.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert(error instanceof Error ? error.message : 'Signup failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number): (keyof SignupFormData)[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone']
      case 2:
        return ['university', 'universityId', 'stream', 'year', 'section']
      case 3:
        return ['password', 'confirmPassword']
      case 4:
        return ['agreeToTerms', 'agreeToPrivacy']
      default:
        return []
    }
  }

  const toggleInterest = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest]
    
    setSelectedInterests(newInterests)
    setValue('interests', newInterests)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-retro text-white mb-2">Personal Information</h2>
              <p className="text-white/60 font-space">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/80 font-space">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    placeholder="Enter your first name"
                    className="pl-10 glass-morphism border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-400 text-sm font-space flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/80 font-space">Last Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    placeholder="Enter your last name"
                    className="pl-10 glass-morphism border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-400 text-sm font-space flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 font-space">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email address"
                  className="pl-10 glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm font-space flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/80 font-space">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="Enter your phone number"
                  className="pl-10 glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-sm font-space flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-retro text-white mb-2">University Information</h2>
              <p className="text-white/60 font-space">Your academic details</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university" className="text-white/80 font-space">University *</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <select
                  id="university"
                  {...register('university')}
                  className="w-full pl-10 pr-4 py-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent"
                >
                  <option value="" className="bg-gray-800">Select your university</option>
                  {universityOptions.map((uni) => (
                    <option key={uni} value={uni} className="bg-gray-800">
                      {uni}
                    </option>
                  ))}
                </select>
              </div>
              {errors.university && (
                <p className="text-red-400 text-sm font-space flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.university.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="universityId" className="text-white/80 font-space">University ID *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="universityId"
                  {...register('universityId')}
                  placeholder="Enter your university ID"
                  className="pl-10 glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              {errors.universityId && (
                <p className="text-red-400 text-sm font-space flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.universityId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stream" className="text-white/80 font-space">Stream/Course *</Label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <select
                    id="stream"
                    {...register('stream')}
                    className="w-full pl-10 pr-4 py-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent"
                  >
                    <option value="" className="bg-gray-800">Select stream</option>
                    {streamOptions.map((stream) => (
                      <option key={stream} value={stream} className="bg-gray-800">
                        {stream}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.stream && (
                  <p className="text-red-400 text-sm font-space flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.stream.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-white/80 font-space">Year *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <select
                    id="year"
                    {...register('year', { valueAsNumber: true })}
                    className="w-full pl-10 pr-4 py-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent"
                  >
                    <option value="" className="bg-gray-800">Year</option>
                    {[1, 2, 3, 4, 5, 6].map((year) => (
                      <option key={year} value={year} className="bg-gray-800">
                        Year {year}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.year && (
                  <p className="text-red-400 text-sm font-space flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.year.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="section" className="text-white/80 font-space">Section</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="section"
                    {...register('section')}
                    placeholder="e.g., A, B, C"
                    className="pl-10 glass-morphism border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
                {errors.section && (
                  <p className="text-red-400 text-sm font-space flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.section.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      // Additional steps would be implemented here...
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-retro-cyan to-retro-purple rounded-xl flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-retro font-bold text-white">Join REPPD</h1>
          </div>
          
          <p className="text-white/60 font-space">
            Connect with your campus community
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= currentStep 
                    ? 'bg-retro-cyan text-black' 
                    : 'bg-white/20 text-white/60'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-8 h-1 mx-2 ${
                    step < currentStep ? 'bg-retro-cyan' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <Card className="glass-morphism border-white/20">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="text-white/60 hover:text-white"
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-retro-cyan to-retro-blue"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="bg-gradient-to-r from-retro-pink to-retro-orange"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-white/60 font-space">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-retro-cyan hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
