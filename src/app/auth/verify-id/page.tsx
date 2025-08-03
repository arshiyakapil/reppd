'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Upload,
  FileImage,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  RotateCcw,
  Shield,
  Camera,
  X
} from 'lucide-react'
import { validateImageFile } from '@/lib/cloudinary'

interface UploadedImage {
  file: File
  preview: string
  uploaded?: boolean
  cloudinaryUrl?: string
}

interface ExtractedData {
  name: string
  universityId: string
  university?: string
  course?: string
  year?: string
  section?: string
  dateOfBirth?: string
  validUntil?: string
}

export default function VerifyIdPage() {
  const router = useRouter()
  const [frontImage, setFrontImage] = useState<UploadedImage | null>(null)
  const [backImage, setBackImage] = useState<UploadedImage | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [verificationStep, setVerificationStep] = useState<'upload' | 'preview' | 'extract' | 'confirm'>('upload')
  const [errors, setErrors] = useState<string[]>([])

  // Front image dropzone
  const onDropFront = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        setErrors([validation.error || 'Invalid file'])
        return
      }

      setFrontImage({
        file,
        preview: URL.createObjectURL(file)
      })
      setErrors([])
    }
  }, [])

  // Back image dropzone
  const onDropBack = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        setErrors([validation.error || 'Invalid file'])
        return
      }

      setBackImage({
        file,
        preview: URL.createObjectURL(file)
      })
      setErrors([])
    }
  }, [])

  const { getRootProps: getFrontRootProps, getInputProps: getFrontInputProps, isDragActive: isFrontDragActive } = useDropzone({
    onDrop: onDropFront,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading || isExtracting
  })

  const { getRootProps: getBackRootProps, getInputProps: getBackInputProps, isDragActive: isBackDragActive } = useDropzone({
    onDrop: onDropBack,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading || isExtracting
  })

  // Upload images to Cloudinary
  const uploadImages = async () => {
    if (!frontImage) return

    setIsUploading(true)
    setErrors([])

    try {
      const formData = new FormData()
      formData.append('frontImage', frontImage.file)
      if (backImage) {
        formData.append('backImage', backImage.file)
      }

      const response = await fetch('/api/upload/id-verification', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      // Update image objects with Cloudinary URLs
      setFrontImage(prev => prev ? { ...prev, uploaded: true, cloudinaryUrl: result.frontUrl } : null)
      if (backImage && result.backUrl) {
        setBackImage(prev => prev ? { ...prev, uploaded: true, cloudinaryUrl: result.backUrl } : null)
      }

      setVerificationStep('preview')

    } catch (error) {
      console.error('Upload error:', error)
      setErrors([error instanceof Error ? error.message : 'Upload failed'])
    } finally {
      setIsUploading(false)
    }
  }

  // Extract data from uploaded images
  const extractData = async () => {
    if (!frontImage?.cloudinaryUrl) return

    setIsExtracting(true)
    setErrors([])

    try {
      const response = await fetch('/api/id-verification/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          frontImageUrl: frontImage.cloudinaryUrl,
          backImageUrl: backImage?.cloudinaryUrl
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Data extraction failed')
      }

      if (result.success && result.extractedData) {
        setExtractedData(result.extractedData)
        setVerificationStep('confirm')
      } else {
        throw new Error(result.error || 'No data could be extracted from the ID')
      }

    } catch (error) {
      console.error('Extraction error:', error)
      setErrors([error instanceof Error ? error.message : 'Data extraction failed'])
    } finally {
      setIsExtracting(false)
    }
  }

  // Confirm and submit verification
  const confirmVerification = async () => {
    if (!extractedData || !frontImage?.cloudinaryUrl) return

    try {
      const response = await fetch('/api/id-verification/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          extractedData,
          frontImageUrl: frontImage.cloudinaryUrl,
          backImageUrl: backImage?.cloudinaryUrl
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Verification submission failed')
      }

      // Redirect to success page or dashboard
      router.push('/auth/verification-pending')

    } catch (error) {
      console.error('Verification error:', error)
      setErrors([error instanceof Error ? error.message : 'Verification submission failed'])
    }
  }

  // Remove uploaded image
  const removeImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      if (frontImage?.preview) {
        URL.revokeObjectURL(frontImage.preview)
      }
      setFrontImage(null)
    } else {
      if (backImage?.preview) {
        URL.revokeObjectURL(backImage.preview)
      }
      setBackImage(null)
    }
  }

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="w-16 h-16 text-retro-cyan mx-auto mb-4" />
        <h2 className="text-2xl font-retro text-white mb-2">Verify Your University ID</h2>
        <p className="text-white/60 font-space">
          Upload clear photos of your university ID card for verification
        </p>
      </div>

      {/* Front Image Upload */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Front of ID Card *</h3>
        {frontImage ? (
          <div className="relative">
            <img
              src={frontImage.preview}
              alt="Front of ID"
              className="w-full max-w-md mx-auto rounded-lg border border-white/20"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeImage('front')}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            {...getFrontRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isFrontDragActive 
                ? 'border-retro-cyan bg-retro-cyan/10' 
                : 'border-white/30 hover:border-white/50'
            }`}
          >
            <input {...getFrontInputProps()} />
            <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 font-space mb-2">
              {isFrontDragActive ? 'Drop the image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-white/40 text-sm font-space">
              JPEG, PNG, WebP up to 10MB
            </p>
          </div>
        )}
      </div>

      {/* Back Image Upload */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Back of ID Card (Optional)</h3>
        {backImage ? (
          <div className="relative">
            <img
              src={backImage.preview}
              alt="Back of ID"
              className="w-full max-w-md mx-auto rounded-lg border border-white/20"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeImage('back')}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            {...getBackRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isBackDragActive 
                ? 'border-retro-cyan bg-retro-cyan/10' 
                : 'border-white/30 hover:border-white/50'
            }`}
          >
            <input {...getBackInputProps()} />
            <Camera className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 font-space mb-2">
              {isBackDragActive ? 'Drop the image here' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-white/40 text-sm font-space">
              Upload if your ID has information on the back
            </p>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={uploadImages}
          disabled={!frontImage || isUploading}
          className="bg-gradient-to-r from-retro-cyan to-retro-blue"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Eye className="w-16 h-16 text-retro-green mx-auto mb-4" />
        <h2 className="text-2xl font-retro text-white mb-2">Review Your Images</h2>
        <p className="text-white/60 font-space">
          Make sure your ID is clearly visible and readable
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {frontImage && (
          <div>
            <h3 className="text-white font-semibold mb-2">Front of ID</h3>
            <img
              src={frontImage.preview}
              alt="Front of ID"
              className="w-full rounded-lg border border-white/20"
            />
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-space">Uploaded successfully</span>
            </div>
          </div>
        )}

        {backImage && (
          <div>
            <h3 className="text-white font-semibold mb-2">Back of ID</h3>
            <img
              src={backImage.preview}
              alt="Back of ID"
              className="w-full rounded-lg border border-white/20"
            />
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-space">Uploaded successfully</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Button
          variant="outline"
          onClick={() => setVerificationStep('upload')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Re-upload
        </Button>
        <Button
          onClick={extractData}
          disabled={isExtracting}
          className="bg-gradient-to-r from-retro-green to-retro-cyan"
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Extracting Data...
            </>
          ) : (
            <>
              <FileImage className="w-4 h-4 mr-2" />
              Extract Information
            </>
          )}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <Card className="glass-morphism border-white/20">
          <CardContent className="pt-6">
            {/* Progress Indicator */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {['upload', 'preview', 'extract', 'confirm'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      verificationStep === step 
                        ? 'bg-retro-cyan text-black' 
                        : index < ['upload', 'preview', 'extract', 'confirm'].indexOf(verificationStep)
                        ? 'bg-green-500 text-white'
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {index < ['upload', 'preview', 'extract', 'confirm'].indexOf(verificationStep) ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 3 && (
                      <div className={`w-8 h-1 mx-2 ${
                        index < ['upload', 'preview', 'extract', 'confirm'].indexOf(verificationStep) 
                          ? 'bg-green-500' 
                          : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-6">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-space">{error}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Step Content */}
            {verificationStep === 'upload' && renderUploadStep()}
            {verificationStep === 'preview' && renderPreviewStep()}
            {/* Additional steps would be implemented here */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
