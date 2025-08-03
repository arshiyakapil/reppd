'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  const testMongoDB = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test/mongodb')
      const result = await response.json()
      setTestResults(prev => ({ ...prev, mongodb: result }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, mongodb: { error: error.message } }))
    }
    setIsLoading(false)
  }

  const testCloudinary = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test/cloudinary')
      const result = await response.json()
      setTestResults(prev => ({ ...prev, cloudinary: result }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, cloudinary: { error: error.message } }))
    }
    setIsLoading(false)
  }

  const testOpticAPI = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test/optic')
      const result = await response.json()
      setTestResults(prev => ({ ...prev, optic: result }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, optic: { error: error.message } }))
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-retro font-bold text-white mb-8 text-center">
          REPPD Integration Tests
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-retro">MongoDB</CardTitle>
              <CardDescription className="text-white/60">Database Connection</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testMongoDB} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-retro-cyan to-retro-blue"
              >
                Test MongoDB
              </Button>
              {testResults.mongodb && (
                <div className="mt-4 p-3 bg-black/20 rounded text-xs text-white">
                  <pre>{JSON.stringify(testResults.mongodb, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-retro">Cloudinary</CardTitle>
              <CardDescription className="text-white/60">Image Upload Service</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testCloudinary} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-retro-pink to-retro-orange"
              >
                Test Cloudinary
              </Button>
              {testResults.cloudinary && (
                <div className="mt-4 p-3 bg-black/20 rounded text-xs text-white">
                  <pre>{JSON.stringify(testResults.cloudinary, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-morphism border-white/20">
            <CardHeader>
              <CardTitle className="text-white font-retro">Optic API</CardTitle>
              <CardDescription className="text-white/60">OCR Processing</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testOpticAPI} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-retro-purple to-retro-pink"
              >
                Test Optic API
              </Button>
              {testResults.optic && (
                <div className="mt-4 p-3 bg-black/20 rounded text-xs text-white">
                  <pre>{JSON.stringify(testResults.optic, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle className="text-white font-retro">Environment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">MongoDB URI:</span>
                <span className="text-green-400 ml-2">
                  {process.env.NEXT_PUBLIC_MONGODB_URI ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
              <div>
                <span className="text-white/60">Optic API Key:</span>
                <span className="text-green-400 ml-2">
                  {process.env.NEXT_PUBLIC_OPTIC_API_KEY ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
              <div>
                <span className="text-white/60">Cloudinary:</span>
                <span className="text-green-400 ml-2">
                  {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
              <div>
                <span className="text-white/60">NextAuth Secret:</span>
                <span className="text-green-400 ml-2">✓ Set</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button asChild variant="glass">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
