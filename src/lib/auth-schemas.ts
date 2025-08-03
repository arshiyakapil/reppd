import { z } from 'zod'

// University ID validation patterns
const universityIdPatterns = {
  'SRM University Sonipat': /^[0-9]{11}$/,
  'Delhi University': /^[0-9]{8}$/,
  'Jawaharlal Nehru University': /^[0-9]{9}$/,
  'Jamia Millia Islamia': /^[0-9]{10}$/,
  'Guru Gobind Singh Indraprastha University': /^[0-9]{11}$/,
  'Amity University': /^[A-Z0-9]{10}$/,
  'Other': /^[A-Z0-9]{6,15}$/
}

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')

// University ID validation
const universityIdSchema = z
  .string()
  .min(6, 'University ID must be at least 6 characters')
  .max(15, 'University ID must be less than 15 characters')
  .regex(/^[A-Z0-9]+$/i, 'University ID can only contain letters and numbers')

// Login schema
export const loginSchema = z.object({
  universityId: universityIdSchema,
  password: z.string().min(1, 'Password is required')
})

// Signup schema
export const signupSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  phone: z
    .string()
    .regex(/^[+]?[0-9]{10,15}$/, 'Please enter a valid phone number')
    .optional(),

  // University Information
  university: z
    .string()
    .min(1, 'Please select your university'),
  
  universityId: universityIdSchema,
  
  stream: z
    .string()
    .min(2, 'Please enter your stream/course')
    .max(100, 'Stream name is too long'),
  
  year: z
    .number()
    .min(1, 'Year must be at least 1')
    .max(6, 'Year cannot exceed 6'),
  
  section: z
    .string()
    .min(1, 'Please enter your section')
    .max(10, 'Section name is too long')
    .optional(),

  // Authentication
  password: passwordSchema,
  confirmPassword: z.string(),

  // Terms and Privacy
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
  
  agreeToPrivacy: z
    .boolean()
    .refine(val => val === true, 'You must agree to the privacy policy'),

  // Optional fields
  interests: z
    .array(z.string())
    .max(10, 'You can select up to 10 interests')
    .optional(),
  
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()

}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine(data => {
  // Validate university ID format based on selected university
  const pattern = universityIdPatterns[data.university as keyof typeof universityIdPatterns] || universityIdPatterns['Other']
  return pattern.test(data.universityId)
}, {
  message: "Invalid university ID format for selected university",
  path: ["universityId"]
})

// ID Verification schema
export const idVerificationSchema = z.object({
  frontImage: z
    .string()
    .url('Please upload a valid front image of your ID'),
  
  backImage: z
    .string()
    .url('Please upload a valid back image of your ID'),
  
  extractedData: z.object({
    name: z.string().optional(),
    universityId: z.string().optional(),
    university: z.string().optional(),
    course: z.string().optional(),
    year: z.string().optional()
  }).optional()
})

// Password reset schema
export const passwordResetSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
})

// New password schema
export const newPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
  
  interests: z
    .array(z.string())
    .max(10, 'You can select up to 10 interests')
    .optional(),
  
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal(''))
  }).optional(),
  
  privacy: z.object({
    profileVisibility: z.enum(['public', 'friends', 'private']).optional(),
    showEmail: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    allowMessages: z.boolean().optional()
  }).optional()
})

// Types
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type IdVerificationData = z.infer<typeof idVerificationSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
export type NewPasswordData = z.infer<typeof newPasswordSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>

// University options
export const universityOptions = [
  'SRM University Sonipat',
  'Delhi University',
  'Jawaharlal Nehru University',
  'Jamia Millia Islamia',
  'Guru Gobind Singh Indraprastha University',
  'Amity University',
  'Bharati Vidyapeeth University',
  'Sharda University',
  'Bennett University',
  'Other'
]

// Stream/Course options
export const streamOptions = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Business Administration',
  'Commerce',
  'Economics',
  'English Literature',
  'Psychology',
  'Mass Communication',
  'Law',
  'Medicine',
  'Pharmacy',
  'Architecture',
  'Design',
  'Other'
]

// Interest options
export const interestOptions = [
  'Technology',
  'Programming',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Artificial Intelligence',
  'Machine Learning',
  'Cybersecurity',
  'Gaming',
  'Photography',
  'Music',
  'Dance',
  'Theatre',
  'Art',
  'Sports',
  'Cricket',
  'Football',
  'Basketball',
  'Badminton',
  'Reading',
  'Writing',
  'Blogging',
  'Travel',
  'Cooking',
  'Fitness',
  'Yoga',
  'Meditation',
  'Volunteering',
  'Environment',
  'Social Work',
  'Entrepreneurship',
  'Finance',
  'Marketing',
  'Design',
  'Fashion',
  'Movies',
  'Anime',
  'K-pop',
  'Podcasts'
]
