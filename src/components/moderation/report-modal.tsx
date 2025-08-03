'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  X,
  Flag,
  AlertTriangle,
  MessageSquare,
  User,
  Shield,
  CheckCircle
} from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  contentType: 'post' | 'comment' | 'user' | 'community'
  contentId: string
  contentPreview?: string
}

const reportReasons = [
  {
    id: 'spam',
    label: 'Spam or Unwanted Content',
    description: 'Repetitive, irrelevant, or promotional content',
    icon: MessageSquare,
    severity: 'medium'
  },
  {
    id: 'harassment',
    label: 'Harassment or Bullying',
    description: 'Targeting individuals with harmful content',
    icon: AlertTriangle,
    severity: 'high'
  },
  {
    id: 'inappropriate',
    label: 'Inappropriate Content',
    description: 'Content that violates community guidelines',
    icon: Flag,
    severity: 'high'
  },
  {
    id: 'misinformation',
    label: 'False Information',
    description: 'Spreading false or misleading information',
    icon: Shield,
    severity: 'medium'
  },
  {
    id: 'impersonation',
    label: 'Impersonation',
    description: 'Pretending to be someone else',
    icon: User,
    severity: 'high'
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else that concerns you',
    icon: Flag,
    severity: 'low'
  }
]

export function ReportModal({ isOpen, onClose, contentType, contentId, contentPreview }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Report submitted:', {
        contentType,
        contentId,
        reason: selectedReason,
        additionalInfo,
        timestamp: new Date().toISOString()
      })
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose()
        setIsSubmitted(false)
        setSelectedReason('')
        setAdditionalInfo('')
      }, 2000)
    }, 1000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-white/20 text-white border-white/30'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-morphism border-white/20 shadow-2xl w-full max-w-md">
        {isSubmitted ? (
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-retro text-white mb-2">Report Submitted</h2>
            <p className="text-white/60 font-space">
              Thank you for helping keep our community safe. We'll review this report and take appropriate action.
            </p>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white font-retro flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-400" />
                    Report {contentType}
                  </CardTitle>
                  <CardDescription className="text-white/60 font-space">
                    Help us maintain a safe and respectful community
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content Preview */}
                {contentPreview && (
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-white/60 text-sm font-space mb-1">Reporting this {contentType}:</p>
                    <p className="text-white text-sm line-clamp-3">{contentPreview}</p>
                  </div>
                )}

                {/* Reason Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-white/80 font-space">
                    What's the issue? *
                  </label>
                  <div className="space-y-2">
                    {reportReasons.map((reason) => (
                      <div
                        key={reason.id}
                        onClick={() => setSelectedReason(reason.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedReason === reason.id
                            ? 'border-red-400 bg-red-500/10'
                            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <reason.icon className={`w-5 h-5 mt-0.5 ${
                            selectedReason === reason.id ? 'text-red-400' : 'text-white/60'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-semibold ${
                                selectedReason === reason.id ? 'text-red-400' : 'text-white'
                              }`}>
                                {reason.label}
                              </h4>
                              <Badge className={`${getSeverityColor(reason.severity)} border text-xs`}>
                                {reason.severity}
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm font-space">
                              {reason.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80 font-space">
                    Additional Information (Optional)
                  </label>
                  <Textarea
                    placeholder="Provide any additional context that might help us understand the issue..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="glass-morphism border-white/20 text-white placeholder:text-white/40 resize-none min-h-[80px]"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    className="flex-1 text-white/60 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!selectedReason || isSubmitting}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Flag className="w-4 h-4 mr-2" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Disclaimer */}
              <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-xs font-space">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Reports are reviewed by our moderation team. False reports may result in account restrictions.
                </p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
