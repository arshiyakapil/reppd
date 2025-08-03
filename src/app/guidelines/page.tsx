'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  Flag,
  BookOpen,
  Scale
} from 'lucide-react'

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-retro font-bold text-white mb-4">
            🛡️ Community Guidelines
          </h1>
          <p className="text-white/70 font-space text-lg">
            Building a safe, respectful, and inclusive campus community
          </p>
        </div>

        {/* Core Principles */}
        <Card className="glass-morphism border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <Heart className="w-6 h-6 text-retro-pink" />
              Our Core Principles
            </CardTitle>
            <CardDescription className="text-white/60 font-space">
              These values guide everything we do at REPPD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-retro-cyan/10 border border-retro-cyan/20 rounded-lg">
                <h3 className="text-retro-cyan font-semibold mb-2">🤝 Respect & Kindness</h3>
                <p className="text-white/70 text-sm font-space">
                  Treat everyone with dignity and respect, regardless of their background, beliefs, or opinions.
                </p>
              </div>
              <div className="p-4 bg-retro-green/10 border border-retro-green/20 rounded-lg">
                <h3 className="text-retro-green font-semibold mb-2">🎓 Academic Integrity</h3>
                <p className="text-white/70 text-sm font-space">
                  Maintain honesty in academic discussions and respect intellectual property.
                </p>
              </div>
              <div className="p-4 bg-retro-purple/10 border border-retro-purple/20 rounded-lg">
                <h3 className="text-retro-purple font-semibold mb-2">🌟 Constructive Engagement</h3>
                <p className="text-white/70 text-sm font-space">
                  Contribute positively to discussions and help build a supportive community.
                </p>
              </div>
              <div className="p-4 bg-retro-orange/10 border border-retro-orange/20 rounded-lg">
                <h3 className="text-retro-orange font-semibold mb-2">🔒 Privacy & Safety</h3>
                <p className="text-white/70 text-sm font-space">
                  Protect your own and others' privacy, and report any safety concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Allowed */}
        <Card className="glass-morphism border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              What's Encouraged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-white font-semibold">📚 Academic Content</h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Study group formations</li>
                  <li>• Academic discussions and help</li>
                  <li>• Project collaborations</li>
                  <li>• Resource sharing</li>
                  <li>• Career guidance</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-semibold">🎉 Campus Life</h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Event announcements</li>
                  <li>• Club activities</li>
                  <li>• Campus news and updates</li>
                  <li>• Achievement celebrations</li>
                  <li>• Community building</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-semibold">🚗 Practical Help</h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Carpool arrangements</li>
                  <li>• Accommodation assistance</li>
                  <li>• Lost and found</li>
                  <li>• Local recommendations</li>
                  <li>• Emergency support</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="text-white font-semibold">💬 Healthy Discussions</h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Constructive feedback</li>
                  <li>• Respectful debates</li>
                  <li>• Knowledge sharing</li>
                  <li>• Mentorship opportunities</li>
                  <li>• Cultural exchange</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Not Allowed */}
        <Card className="glass-morphism border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-400" />
              What's Not Allowed
            </CardTitle>
            <CardDescription className="text-white/60 font-space">
              These behaviors will result in content removal and potential account restrictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Harassment & Bullying
                </h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Personal attacks or insults</li>
                  <li>• Targeted harassment of individuals</li>
                  <li>• Cyberbullying or intimidation</li>
                  <li>• Doxxing or sharing personal information</li>
                  <li>• Threats of violence or harm</li>
                </ul>
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <h4 className="text-orange-400 font-semibold mb-3">🚫 Inappropriate Content</h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Explicit or sexual content</li>
                  <li>• Graphic violence or disturbing imagery</li>
                  <li>• Hate speech or discriminatory language</li>
                  <li>• Content promoting illegal activities</li>
                  <li>• Spam or excessive promotional content</li>
                </ul>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <h4 className="text-yellow-400 font-semibold mb-3">📖 Academic Misconduct</h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Sharing exam questions or answers</li>
                  <li>• Promoting cheating or plagiarism</li>
                  <li>• Selling or buying assignments</li>
                  <li>• Impersonating faculty or staff</li>
                  <li>• Spreading false academic information</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h4 className="text-purple-400 font-semibold mb-3">⚖️ Legal & Safety Issues</h4>
                <ul className="text-white/70 text-sm font-space space-y-1">
                  <li>• Copyright infringement</li>
                  <li>• Fraud or scam attempts</li>
                  <li>• Illegal substance promotion</li>
                  <li>• Dangerous challenges or activities</li>
                  <li>• Misinformation about health or safety</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reporting System */}
        <Card className="glass-morphism border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <Flag className="w-6 h-6 text-retro-orange" />
              Reporting & Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">🚨 How to Report</h4>
                <div className="space-y-2 text-white/70 text-sm font-space">
                  <p>1. Click the flag icon on any post or comment</p>
                  <p>2. Select the appropriate reason for reporting</p>
                  <p>3. Provide additional context if needed</p>
                  <p>4. Submit the report for review</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">⚡ Response Times</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm font-space">High Priority:</span>
                    <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                      &lt; 1 hour
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm font-space">Medium Priority:</span>
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      &lt; 24 hours
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm font-space">Low Priority:</span>
                    <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      &lt; 72 hours
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consequences */}
        <Card className="glass-morphism border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <Scale className="w-6 h-6 text-retro-purple" />
              Enforcement & Consequences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
                  <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Warning</h4>
                  <p className="text-white/70 text-sm font-space">
                    First-time minor violations receive a warning and content removal.
                  </p>
                </div>
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg text-center">
                  <h4 className="text-orange-400 font-semibold mb-2">⏸️ Temporary Suspension</h4>
                  <p className="text-white/70 text-sm font-space">
                    Repeated violations result in 1-7 day account suspension.
                  </p>
                </div>
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                  <h4 className="text-red-400 font-semibold mb-2">🚫 Permanent Ban</h4>
                  <p className="text-white/70 text-sm font-space">
                    Severe violations or repeated offenses result in permanent ban.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2">📞 Appeal Process</h4>
                <p className="text-white/70 text-sm font-space">
                  If you believe your account was restricted unfairly, you can appeal by contacting our moderation team at 
                  <span className="text-retro-cyan"> moderation@reppd.com</span> within 7 days of the action.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="text-white font-retro flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-retro-green" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold mb-3">📧 Contact Us</h4>
                <div className="space-y-2 text-white/70 text-sm font-space">
                  <p><strong>General Support:</strong> support@reppd.com</p>
                  <p><strong>Moderation Issues:</strong> moderation@reppd.com</p>
                  <p><strong>Technical Problems:</strong> tech@reppd.com</p>
                  <p><strong>Emergency:</strong> emergency@reppd.com</p>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">📚 Resources</h4>
                <div className="space-y-2 text-white/70 text-sm font-space">
                  <p>• <a href="/help" className="text-retro-cyan hover:underline">Help Center</a></p>
                  <p>• <a href="/faq" className="text-retro-cyan hover:underline">Frequently Asked Questions</a></p>
                  <p>• <a href="/privacy" className="text-retro-cyan hover:underline">Privacy Policy</a></p>
                  <p>• <a href="/terms" className="text-retro-cyan hover:underline">Terms of Service</a></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center py-8">
          <p className="text-white/60 font-space text-sm">
            Last updated: {new Date().toLocaleDateString()} • Version 1.0
          </p>
        </div>
      </div>
    </div>
  )
}
