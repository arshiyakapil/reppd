// Optic API integration for university ID verification
// Note: This is a mock implementation as Optic API details weren't provided
// Replace with actual Optic API endpoints and authentication

interface OpticApiResponse {
  success: boolean
  data?: {
    extractedText: string
    frontFields: {
      // Front of ID data
      name?: string
      registerNumber?: string // University ID/Registration Number
      department?: string
      validity?: string // Validity date
      dateOfIssue?: string
    }
    backFields: {
      // Back of ID data
      bloodGroup?: string
      dateOfBirth?: string
      address?: string
      permanentAddress?: string
      contactNumber?: string
      email?: string
      emergencyContact?: string
    }
    confidence: number
    boundingBoxes?: Array<{
      field: string
      coordinates: [number, number, number, number]
      confidence: number
    }>
  }
  error?: string
  message?: string
}

interface IdVerificationResult {
  success: boolean
  extractedData?: {
    // Personal Information
    name: string
    registerNumber: string // University ID/Registration Number
    dateOfBirth?: string
    bloodGroup?: string

    // Academic Information
    department?: string
    course?: string
    year?: number // Calculated from validity
    validity?: string

    // Contact Information
    email?: string
    contactNumber?: string
    address?: string
    permanentAddress?: string
    emergencyContact?: string

    // Metadata
    university?: string
    dateOfIssue?: string
  }
  confidence?: number
  error?: string
  rawResponse?: any
}

// Mock university ID patterns for validation
const universityIdPatterns = {
  'SRM University Sonipat': {
    pattern: /^[0-9]{11}$/,
    format: '11 digits (e.g., 10324210279)'
  },
  'Delhi University': {
    pattern: /^[0-9]{8}$/,
    format: '8 digits'
  },
  'Jawaharlal Nehru University': {
    pattern: /^[0-9]{9}$/,
    format: '9 digits'
  },
  'Jamia Millia Islamia': {
    pattern: /^[0-9]{10}$/,
    format: '10 digits'
  },
  'Amity University': {
    pattern: /^[A-Z0-9]{10}$/,
    format: '10 alphanumeric characters'
  }
}

// Extract text from university ID using Optic API
export async function extractIdData(
  frontImageUrl: string,
  backImageUrl?: string
): Promise<IdVerificationResult> {
  try {
    // Mock implementation - replace with actual Optic API call
    if (process.env.NODE_ENV === 'development') {
      return mockOpticApiResponse(frontImageUrl)
    }

    const apiKey = process.env.OPTIC_API_KEY
    const apiUrl = process.env.OPTIC_API_URL || 'https://api.optic.ai/v1'

    if (!apiKey) {
      throw new Error('Optic API key not configured')
    }

    // Prepare request payload
    const payload = {
      images: [frontImageUrl],
      document_type: 'university_id',
      extract_fields: {
        front: [
          'name',
          'register_number',
          'department',
          'validity',
          'date_of_issue'
        ],
        back: [
          'blood_group',
          'date_of_birth',
          'address',
          'permanent_address',
          'contact_number',
          'email',
          'emergency_contact'
        ]
      }
    }

    if (backImageUrl) {
      payload.images.push(backImageUrl)
    }

    // Make API request
    const response = await fetch(`${apiUrl}/extract`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Optic API error: ${response.status} ${response.statusText}`)
    }

    const result: OpticApiResponse = await response.json()

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to extract data from ID'
      }
    }

    // Process and validate extracted data
    const extractedData = processExtractedData(
      result.data?.frontFields || {},
      result.data?.backFields || {}
    )

    return {
      success: true,
      extractedData,
      confidence: result.data?.confidence || 0,
      rawResponse: result
    }

  } catch (error) {
    console.error('Optic API error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'ID verification failed'
    }
  }
}

// Process and clean extracted data
function processExtractedData(frontFields: any, backFields: any): IdVerificationResult['extractedData'] {
  const validity = cleanDate(frontFields.validity || '')
  const calculatedYear = calculateYearFromValidity(validity)

  return {
    // Personal Information
    name: cleanName(frontFields.name || ''),
    registerNumber: cleanUniversityId(frontFields.registerNumber || frontFields.register_number || ''),
    dateOfBirth: cleanDate(backFields.dateOfBirth || backFields.date_of_birth || ''),
    bloodGroup: cleanBloodGroup(backFields.bloodGroup || backFields.blood_group || ''),

    // Academic Information
    department: cleanDepartment(frontFields.department || ''),
    course: cleanCourse(frontFields.department || ''), // Map department to course
    year: calculatedYear,
    validity: validity,

    // Contact Information
    email: cleanEmail(backFields.email || ''),
    contactNumber: cleanPhone(backFields.contactNumber || backFields.contact_number || ''),
    address: cleanAddress(backFields.address || ''),
    permanentAddress: cleanAddress(backFields.permanentAddress || backFields.permanent_address || ''),
    emergencyContact: cleanPhone(backFields.emergencyContact || backFields.emergency_contact || ''),

    // Metadata
    dateOfIssue: cleanDate(frontFields.dateOfIssue || frontFields.date_of_issue || '')
  }
}

// Data cleaning functions
function cleanName(name: string): string {
  return name
    .replace(/[^a-zA-Z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, l => l.toUpperCase())
}

function cleanUniversityId(id: string): string {
  return id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

function cleanUniversity(university: string): string {
  const universityMappings: Record<string, string> = {
    'srm': 'SRM University Sonipat',
    'srm university': 'SRM University Sonipat',
    'srm sonipat': 'SRM University Sonipat',
    'delhi university': 'Delhi University',
    'du': 'Delhi University',
    'jnu': 'Jawaharlal Nehru University',
    'jamia': 'Jamia Millia Islamia',
    'amity': 'Amity University'
  }

  const normalized = university.toLowerCase().trim()
  return universityMappings[normalized] || university
}

function cleanCourse(course: string): string {
  const courseMappings: Record<string, string> = {
    'cse': 'Computer Science Engineering',
    'cs': 'Computer Science Engineering',
    'it': 'Information Technology',
    'ece': 'Electronics and Communication Engineering',
    'me': 'Mechanical Engineering',
    'ce': 'Civil Engineering',
    'ee': 'Electrical Engineering'
  }

  const normalized = course.toLowerCase().trim()
  return courseMappings[normalized] || course
}

function cleanYear(year: string): string {
  const yearMatch = year.match(/(\d+)/)
  return yearMatch ? yearMatch[1] : ''
}

function cleanSection(section: string): string {
  return section.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

function cleanDate(date: string): string {
  // Try to parse and format date
  const dateMatch = date.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
  if (dateMatch) {
    const [, day, month, year] = dateMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  return date
}

// Calculate academic year from validity date
function calculateYearFromValidity(validity: string): number {
  if (!validity) return 1

  try {
    const validityDate = new Date(validity)
    const currentDate = new Date()
    const yearsRemaining = Math.ceil((validityDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 365))

    // For B.Tech (4-year program)
    // If validity is 3 years from now → 2nd year
    // If validity is 2 years from now → 3rd year
    // If validity is 1 year from now → 4th year
    // If validity is 4 years from now → 1st year

    if (yearsRemaining >= 4) return 1
    if (yearsRemaining >= 3) return 2
    if (yearsRemaining >= 2) return 3
    if (yearsRemaining >= 1) return 4

    return 4 // Default to final year if expired
  } catch (error) {
    return 1 // Default to first year if parsing fails
  }
}

// Clean department and map to course
function cleanDepartment(department: string): string {
  const deptMappings: Record<string, string> = {
    'cse': 'Computer Science Engineering',
    'computer science': 'Computer Science Engineering',
    'cs': 'Computer Science Engineering',
    'it': 'Information Technology',
    'information technology': 'Information Technology',
    'ece': 'Electronics and Communication Engineering',
    'electronics': 'Electronics and Communication Engineering',
    'me': 'Mechanical Engineering',
    'mechanical': 'Mechanical Engineering',
    'ce': 'Civil Engineering',
    'civil': 'Civil Engineering',
    'ee': 'Electrical Engineering',
    'electrical': 'Electrical Engineering',
    'bba': 'Business Administration',
    'mba': 'Business Administration',
    'bcom': 'Commerce',
    'commerce': 'Commerce'
  }

  const normalized = department.toLowerCase().trim()
  return deptMappings[normalized] || department
}

// Clean blood group
function cleanBloodGroup(bloodGroup: string): string {
  const validGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const cleaned = bloodGroup.toUpperCase().replace(/[^ABO+-]/g, '')

  return validGroups.includes(cleaned) ? cleaned : bloodGroup
}

// Clean email
function cleanEmail(email: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const cleaned = email.toLowerCase().trim()

  return emailRegex.test(cleaned) ? cleaned : email
}

// Clean phone number
function cleanPhone(phone: string): string {
  // Remove all non-digits except +
  const cleaned = phone.replace(/[^\d+]/g, '')

  // Add +91 if it's a 10-digit Indian number
  if (cleaned.length === 10 && !cleaned.startsWith('+')) {
    return `+91${cleaned}`
  }

  return cleaned
}

// Clean address
function cleanAddress(address: string): string {
  return address
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^\w\s,.-]/g, '')
}

// Validate extracted university ID against known patterns
export function validateUniversityId(universityId: string, university: string): {
  isValid: boolean
  error?: string
  suggestedFormat?: string
} {
  const universityPattern = universityIdPatterns[university as keyof typeof universityIdPatterns]
  
  if (!universityPattern) {
    // For unknown universities, just check basic format
    if (universityId.length < 6 || universityId.length > 15) {
      return {
        isValid: false,
        error: 'University ID should be between 6-15 characters'
      }
    }
    return { isValid: true }
  }

  if (!universityPattern.pattern.test(universityId)) {
    return {
      isValid: false,
      error: `Invalid format for ${university}`,
      suggestedFormat: universityPattern.format
    }
  }

  return { isValid: true }
}

// Mock Optic API response for development
function mockOpticApiResponse(imageUrl: string): IdVerificationResult {
  // Simulate processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock data based on realistic university ID
      const mockData = {
        // Personal Information
        name: 'Arshiya Kapil',
        registerNumber: '10324210279',
        dateOfBirth: '2002-02-05',
        bloodGroup: 'O+',

        // Academic Information
        department: 'Computer Science Engineering',
        course: 'Computer Science Engineering',
        year: 3, // Calculated from validity (1 year remaining = 4th year, but this is 3rd)
        validity: '2025-06-30',

        // Contact Information
        email: 'arshiya.kapil@student.srm.edu',
        contactNumber: '+91-9876543210',
        address: 'Room 245, Hostel Block A, SRM University Sonipat',
        permanentAddress: 'House No. 123, Sector 15, Gurgaon, Haryana - 122001',
        emergencyContact: '+91-9876543211',

        // Metadata
        university: 'SRM University Sonipat',
        dateOfIssue: '2022-07-01'
      }

      resolve({
        success: true,
        extractedData: mockData,
        confidence: 0.95
      })
    }, 2000)
  })
}

// Verify extracted data against user input
export function verifyExtractedData(
  extractedData: IdVerificationResult['extractedData'],
  userInput: {
    name: string
    universityId: string
    university: string
    stream: string
    year: number
  }
): {
  isValid: boolean
  mismatches: string[]
  warnings: string[]
} {
  const mismatches: string[] = []
  const warnings: string[] = []

  if (!extractedData) {
    return {
      isValid: false,
      mismatches: ['No data extracted from ID'],
      warnings: []
    }
  }

  // Check name similarity
  const extractedNameNormalized = extractedData.name.toLowerCase().replace(/\s+/g, '')
  const userNameNormalized = userInput.name.toLowerCase().replace(/\s+/g, '')
  
  if (extractedNameNormalized !== userNameNormalized) {
    const similarity = calculateStringSimilarity(extractedNameNormalized, userNameNormalized)
    if (similarity < 0.8) {
      mismatches.push(`Name mismatch: ID shows "${extractedData.name}", you entered "${userInput.name}"`)
    } else {
      warnings.push(`Name slightly different: ID shows "${extractedData.name}", you entered "${userInput.name}"`)
    }
  }

  // Check university ID
  if (extractedData.universityId !== userInput.universityId) {
    mismatches.push(`University ID mismatch: ID shows "${extractedData.universityId}", you entered "${userInput.universityId}"`)
  }

  // Check university
  if (extractedData.university && extractedData.university !== userInput.university) {
    mismatches.push(`University mismatch: ID shows "${extractedData.university}", you selected "${userInput.university}"`)
  }

  // Check year
  if (extractedData.year && parseInt(extractedData.year) !== userInput.year) {
    warnings.push(`Year difference: ID shows year ${extractedData.year}, you selected year ${userInput.year}`)
  }

  return {
    isValid: mismatches.length === 0,
    mismatches,
    warnings
  }
}

// Calculate string similarity (simple implementation)
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  
  if (longer.length === 0) return 1.0
  
  const editDistance = levenshteinDistance(longer, shorter)
  return (longer.length - editDistance) / longer.length
}

// Levenshtein distance calculation
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = []
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  
  return matrix[str2.length][str1.length]
}
