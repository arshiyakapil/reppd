'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Car, 
  BookOpen, 
  Users, 
  MessageCircle,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Plus
} from 'lucide-react'

const requestTypes = [
  { 
    id: 'carpool', 
    label: 'Carpool', 
    icon: Car, 
    color: 'retro-pink',
    description: 'Share rides and split costs'
  },
  { 
    id: 'study', 
    label: 'Study Group', 
    icon: BookOpen, 
    color: 'retro-orange',
    description: 'Find study partners and groups'
  },
  { 
    id: 'academic', 
    label: 'Academic Help', 
    icon: Users, 
    color: 'retro-purple',
    description: 'Get help with assignments and projects'
  },
  { 
    id: 'help', 
    label: 'General Help', 
    icon: MessageCircle, 
    color: 'retro-green',
    description: 'Ask for any kind of assistance'
  }
]

export default function CreateRequestPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // Carpool specific
    fromLocation: '',
    toLocation: '',
    schedule: '',
    cost: '',
    seats: '',
    // Study/Academic specific
    subjects: '',
    venue: '',
    deadline: '',
    // General
    urgency: 'medium',
    contactMethod: 'message'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType || !formData.title || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    // TODO: Submit to API
    console.log('Creating request:', { type: selectedType, ...formData })
    
    // Redirect back to requests page
    router.push('/requests')
  }

  const renderTypeSpecificFields = () => {
    switch (selectedType) {
      case 'carpool':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">From Location</label>
                <Input
                  placeholder="Starting point"
                  value={formData.fromLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, fromLocation: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">To Location</label>
                <Input
                  placeholder="Destination"
                  value={formData.toLocation}
                  onChange={(e) => setFormData(prev => ({ ...prev, toLocation: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Schedule</label>
                <Input
                  placeholder="e.g., Daily 8:30 AM"
                  value={formData.schedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Cost per Person</label>
                <Input
                  placeholder="₹150/day"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Available Seats</label>
                <Input
                  type="number"
                  placeholder="3"
                  value={formData.seats}
                  onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </div>
        )

      case 'study':
      case 'academic':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 font-space">Subjects/Topics</label>
              <Input
                placeholder="e.g., Data Structures, Machine Learning"
                value={formData.subjects}
                onChange={(e) => setFormData(prev => ({ ...prev, subjects: e.target.value }))}
                className="glass-morphism border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Preferred Venue</label>
                <Input
                  placeholder="Library, Online, etc."
                  value={formData.venue}
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80 font-space">Deadline (if any)</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </div>
        )

      case 'help':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 font-space">Urgency Level</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full p-3 glass-morphism border-white/20 rounded-lg text-white bg-transparent"
              >
                <option value="low" className="bg-gray-800">Low - Can wait</option>
                <option value="medium" className="bg-gray-800">Medium - This week</option>
                <option value="high" className="bg-gray-800">High - Urgent</option>
              </select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/requests"
          className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Requests
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-2">
            Create New Request 📝
          </h1>
          <p className="text-white/60 font-space">
            Get help from your campus community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Request Type Selection */}
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-retro">Select Request Type</CardTitle>
              <CardDescription className="text-white/60 font-space">
                Choose the type of help you need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requestTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedType === type.id
                        ? `border-${type.color} bg-${type.color}/10`
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <type.icon className={`w-6 h-6 ${selectedType === type.id ? `text-${type.color}` : 'text-white/60'}`} />
                      <h3 className={`font-semibold ${selectedType === type.id ? `text-${type.color}` : 'text-white'}`}>
                        {type.label}
                      </h3>
                    </div>
                    <p className="text-white/60 text-sm font-space">{type.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          {selectedType && (
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 font-space">Title *</label>
                  <Input
                    placeholder="Brief, descriptive title for your request"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="glass-morphism border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 font-space">Description *</label>
                  <Textarea
                    placeholder="Provide detailed information about what you need..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-morphism border-white/20 text-white placeholder:text-white/40 min-h-[120px]"
                    required
                  />
                </div>

                {renderTypeSpecificFields()}
              </CardContent>
            </Card>
          )}

          {/* Contact Preferences */}
          {selectedType && (
            <Card className="glass-morphism border-white/20">
              <CardHeader>
                <CardTitle className="text-white font-retro">Contact Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/80 font-space">How should people contact you?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="message"
                          checked={formData.contactMethod === 'message'}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactMethod: e.target.value }))}
                          className="text-retro-cyan focus:ring-retro-cyan"
                        />
                        <span className="text-white/70 font-space">REPPD Messages</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contactMethod"
                          value="phone"
                          checked={formData.contactMethod === 'phone'}
                          onChange={(e) => setFormData(prev => ({ ...prev, contactMethod: e.target.value }))}
                          className="text-retro-cyan focus:ring-retro-cyan"
                        />
                        <span className="text-white/70 font-space">Phone Number</span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          {selectedType && (
            <div className="flex gap-4">
              <Button
                type="button"
                variant="glass"
                onClick={() => router.push('/requests')}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-retro-pink to-retro-orange hover:from-retro-pink/80 hover:to-retro-orange/80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Request
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
