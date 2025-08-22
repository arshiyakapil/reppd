'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Image as ImageIcon, 
  Video, 
  X, 
  Upload, 
  FileImage, 
  FileVideo,
  Loader2
} from 'lucide-react'

interface MediaFile {
  id: string
  file: File
  preview: string
  type: 'image' | 'video'
  uploading?: boolean
  uploaded?: boolean
  url?: string
}

interface MediaUploadProps {
  onFilesChange: (files: MediaFile[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
}

export function MediaUpload({ 
  onFilesChange, 
  maxFiles = 4, 
  acceptedTypes = ['image/*', 'video/*'],
  className 
}: MediaUploadProps) {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: MediaFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      uploading: false,
      uploaded: false
    }))

    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles)
    setFiles(updatedFiles)
    
    // Upload files to Cloudinary
    await uploadFiles(newFiles, updatedFiles)
  }, [files, maxFiles])

  const uploadFiles = async (newFiles: MediaFile[], allFiles: MediaFile[]) => {
    setUploading(true)
    
    try {
      for (const mediaFile of newFiles) {
        // Mark as uploading
        setFiles(prev => prev.map(f => 
          f.id === mediaFile.id ? { ...f, uploading: true } : f
        ))

        const formData = new FormData()
        formData.append('file', mediaFile.file)
        formData.append('upload_preset', 'reppd_posts') // You'll need to create this in Cloudinary

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${mediaFile.type}/upload`,
          {
            method: 'POST',
            body: formData
          }
        )

        if (response.ok) {
          const result = await response.json()
          
          // Mark as uploaded
          setFiles(prev => prev.map(f => 
            f.id === mediaFile.id 
              ? { ...f, uploading: false, uploaded: true, url: result.secure_url }
              : f
          ))
        } else {
          throw new Error('Upload failed')
        }
      }

      // Update parent component
      const finalFiles = allFiles.map(f => {
        const uploaded = newFiles.find(nf => nf.id === f.id)
        return uploaded ? { ...f, uploaded: true } : f
      })
      
      onFilesChange(finalFiles)
    } catch (error) {
      console.error('Upload error:', error)
      // Remove failed uploads
      setFiles(prev => prev.filter(f => !newFiles.some(nf => nf.id === f.id)))
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles || uploading
  })

  return (
    <div className={className}>
      {/* Upload Area */}
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-retro-cyan bg-retro-cyan/10' 
              : 'border-white/30 hover:border-white/50 hover:bg-white/5'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              {uploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {isDragActive ? 'Drop files here' : 'Upload photos or videos'}
              </p>
              <p className="text-white/60 text-sm">
                Drag & drop or click to select • Max {maxFiles} files
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {files.map((mediaFile) => (
            <Card key={mediaFile.id} className="glass-morphism border-white/20 relative overflow-hidden">
              <CardContent className="p-0">
                {/* Preview */}
                <div className="aspect-square relative">
                  {mediaFile.type === 'image' ? (
                    <img
                      src={mediaFile.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <FileVideo className="w-8 h-8 text-white mx-auto mb-2" />
                        <p className="text-white text-xs">{mediaFile.file.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Upload Status Overlay */}
                  {mediaFile.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin mx-auto mb-2" />
                        <p className="text-white text-xs">Uploading...</p>
                      </div>
                    </div>
                  )}

                  {/* Success Indicator */}
                  {mediaFile.uploaded && (
                    <div className="absolute top-2 left-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(mediaFile.id)}
                    className="absolute top-2 right-2 w-6 h-6 p-0 bg-black/50 hover:bg-black/70 text-white"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                {/* File Info */}
                <div className="p-2">
                  <div className="flex items-center gap-2">
                    {mediaFile.type === 'image' ? (
                      <FileImage className="w-4 h-4 text-retro-cyan" />
                    ) : (
                      <FileVideo className="w-4 h-4 text-retro-purple" />
                    )}
                    <span className="text-white text-xs truncate">
                      {mediaFile.file.name}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs">
                    {(mediaFile.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-retro-cyan animate-spin" />
            <span className="text-white text-sm">Uploading files...</span>
          </div>
        </div>
      )}
    </div>
  )
}
