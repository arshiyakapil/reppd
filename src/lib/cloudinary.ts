import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

/**
 * Upload image to Cloudinary
 * @param buffer - Image buffer
 * @param folder - Cloudinary folder (e.g., 'university-ids', 'profile-pics')
 * @param publicId - Optional public ID for the image
 * @returns Upload result with URL and metadata
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
    }

    if (publicId) {
      uploadOptions.public_id = publicId
    }

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
          })
        } else {
          reject(new Error('Upload failed - no result'))
        }
      }
    ).end(buffer)
  })
}

/**
 * Upload university ID images
 * @param frontBuffer - Front ID image buffer
 * @param backBuffer - Back ID image buffer
 * @param universityId - Student's university ID for naming
 * @returns Object with front and back image URLs
 */
export async function uploadUniversityIdImages(
  frontBuffer: Buffer,
  backBuffer: Buffer,
  universityId: string
): Promise<{ frontUrl: string; backUrl: string }> {
  try {
    const timestamp = Date.now()
    
    const [frontResult, backResult] = await Promise.all([
      uploadImage(
        frontBuffer,
        'university-ids',
        `${universityId}_front_${timestamp}`
      ),
      uploadImage(
        backBuffer,
        'university-ids',
        `${universityId}_back_${timestamp}`
      ),
    ])

    return {
      frontUrl: frontResult.secure_url,
      backUrl: backResult.secure_url,
    }
  } catch (error) {
    console.error('Error uploading university ID images:', error)
    throw new Error('Failed to upload ID images')
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @returns Deletion result
 */
export async function deleteImage(publicId: string): Promise<any> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

/**
 * Generate optimized image URL
 * @param publicId - Public ID of the image
 * @param transformations - Cloudinary transformations
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations?: any
): string {
  return cloudinary.url(publicId, {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations,
  })
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.',
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 10MB.',
    }
  }

  return { isValid: true }
}

export default cloudinary
