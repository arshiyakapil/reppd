// Scaled mock data for 2000+ students pilot program

const universities = [
  'SRM University Sonipat',
  'SRM University Chennai', 
  'SRM University Amaravati',
  'SRM University Sikkim'
]

const departments = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Biotechnology',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Data Science & Analytics'
]

const sections = ['A', 'B', 'C', 'D', 'E', 'F']
const years = [1, 2, 3, 4]

const sampleNames = [
  'Arshiya Kapil', 'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Sneha Patel',
  'Vikram Gupta', 'Ananya Reddy', 'Rohan Mehta', 'Kavya Nair', 'Aditya Joshi',
  'Ishita Agarwal', 'Karan Malhotra', 'Riya Bansal', 'Harsh Verma', 'Pooja Yadav',
  'Siddharth Roy', 'Meera Iyer', 'Arjun Pillai', 'Divya Saxena', 'Nikhil Jain',
  'Aarav Patel', 'Diya Sharma', 'Vihaan Kumar', 'Saanvi Gupta', 'Reyansh Singh',
  'Anvi Reddy', 'Aryan Mehta', 'Kiara Nair', 'Vivaan Joshi', 'Navya Agarwal'
]

const postTemplates = [
  "Just finished my {subject} assignment! Anyone else struggling with {topic}? 🤔",
  "Great lecture on {topic} today! Prof. {professor} explained it so well 📚",
  "Study group for {subject} tomorrow at 3 PM in library. Who's in? 📖",
  "Can someone share notes for {subject}? Missed today's class 😅",
  "Placement season is here! Any tips for {company} interviews? 💼",
  "Amazing fest performance by {department} students! 🎭",
  "Food court has new menu items! The {food} is amazing 🍕",
  "Late night coding session for {project}. Coffee is life ☕",
  "Sports day was incredible! {sport} team killed it 🏆",
  "Anyone up for a movie night this weekend? 🎬",
  "Hackathon registration is open! Team up for {hackathon} 💻",
  "Library is packed today! Found a good spot on floor 3 📚",
  "Canteen uncle made the best {food} today! 😋",
  "Professor announced surprise quiz in {subject}! Study time 📝",
  "Campus wifi is down again... using mobile hotspot 📶",
  "Internship interview at {company} went well! Fingers crossed 🤞",
  "Anyone knows where I can find {subject} reference books? 📖",
  "Fest preparations are going great! {department} rocks 🎉",
  "Rainy day on campus... perfect for indoor study session ☔",
  "New semester, new goals! Let's ace {subject} this time 🎯"
]

const subjects = [
  'Data Structures', 'Database Management', 'Computer Networks', 'Operating Systems',
  'Software Engineering', 'Machine Learning', 'Web Development', 'Mobile App Development',
  'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'DevOps',
  'Digital Signal Processing', 'Microprocessors', 'Control Systems', 'Power Electronics'
]

const topics = [
  'Binary Trees', 'Normalization', 'TCP/IP', 'Process Scheduling',
  'Agile Methodology', 'Neural Networks', 'React.js', 'Flutter',
  'Deep Learning', 'Encryption', 'AWS', 'Docker', 'Fourier Transform',
  'Assembly Language', 'PID Controllers', 'MOSFET Circuits'
]

// Generate diverse mock post
function generateMockPost(index: number): any {
  const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)]
  const randomUniversity = universities[Math.floor(Math.random() * universities.length)]
  const randomDepartment = departments[Math.floor(Math.random() * departments.length)]
  const randomSection = sections[Math.floor(Math.random() * sections.length)]
  const randomYear = years[Math.floor(Math.random() * years.length)]
  const randomSubject = subjects[Math.floor(Math.random() * subjects.length)]
  const randomTopic = topics[Math.floor(Math.random() * topics.length)]
  
  let content = postTemplates[Math.floor(Math.random() * postTemplates.length)]
  content = content
    .replace('{subject}', randomSubject)
    .replace('{topic}', randomTopic)
    .replace('{professor}', 'Dr. ' + sampleNames[Math.floor(Math.random() * sampleNames.length)].split(' ')[1])
    .replace('{company}', ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Adobe', 'Salesforce'][Math.floor(Math.random() * 7)])
    .replace('{department}', randomDepartment)
    .replace('{food}', ['Pizza', 'Burger', 'Pasta', 'Sandwich', 'Biryani', 'Dosa', 'Samosa'][Math.floor(Math.random() * 7)])
    .replace('{project}', ['Final Year Project', 'Hackathon', 'Assignment', 'Research', 'Mini Project'][Math.floor(Math.random() * 5)])
    .replace('{sport}', ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Badminton', 'Tennis'][Math.floor(Math.random() * 6)])
    .replace('{hackathon}', ['Smart India Hackathon', 'TechFest 2024', 'CodeChef Contest', 'Google Hackathon'][Math.floor(Math.random() * 4)])

  const hoursAgo = Math.floor(Math.random() * 168) + 1 // Up to 1 week
  const timestamp = hoursAgo === 1 ? '1 hour ago' : 
                   hoursAgo < 24 ? `${hoursAgo} hours ago` : 
                   `${Math.floor(hoursAgo / 24)} days ago`

  return {
    id: `scaled-post-${index}-${Date.now()}`,
    content,
    author: {
      id: `user-${index}`,
      name: randomName,
      avatar: ['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '🧑‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬'][Math.floor(Math.random() * 8)],
      university: randomUniversity,
      year: randomYear,
      stream: randomDepartment,
      section: randomSection
    },
    timestamp,
    likes: Math.floor(Math.random() * 100), // Higher engagement for larger user base
    comments: Math.floor(Math.random() * 30),
    shares: Math.floor(Math.random() * 15),
    isLiked: Math.random() > 0.8,
    isBookmarked: Math.random() > 0.9,
    isAnonymous: Math.random() > 0.85,
    images: Math.random() > 0.7 ? [`https://picsum.photos/400/300?random=${index}`] : [],
    type: Math.random() > 0.7 ? 'media' : 'text',
    tags: [randomSubject, randomDepartment].slice(0, Math.floor(Math.random() * 3) + 1)
  }
}

// Scaled Mock API for 2000+ students
export const scaledMockAPI = {
  // Generate posts on demand for better performance
  async getPosts(page = 1, limit = 20) {
    console.log(`Generating ${limit} posts for page ${page}`)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const startIndex = (page - 1) * limit
    const posts = Array.from({ length: limit }, (_, index) => 
      generateMockPost(startIndex + index)
    )
    
    return {
      posts,
      hasMore: page < 50, // Simulate 1000 posts total (50 pages * 20 posts)
      totalPosts: 1000,
      currentPage: page
    }
  },

  async createPost(postData: any) {
    console.log('Scaled Mock API: Creating post with data:', postData)
    
    const newPost = {
      id: `user-post-${Date.now()}`,
      content: postData.content || '',
      author: {
        id: 'current-user',
        name: postData.isAnonymous ? 'Anonymous Student' : 'Current User',
        avatar: postData.isAnonymous ? '🕶️' : '👤',
        university: 'SRM University Sonipat',
        year: 3,
        stream: 'Computer Science Engineering',
        section: 'A'
      },
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      isAnonymous: postData.isAnonymous || false,
      images: postData.images || [],
      videos: postData.videos || [],
      type: postData.type || 'text',
      tags: postData.tags || []
    }
    
    console.log('Scaled Mock API: Created post:', newPost)
    return newPost
  },

  async likePost(postId: string) {
    console.log('Scaled Mock API: Liking post:', postId)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 100))
    return { success: true }
  },

  async getStudentStats() {
    return {
      totalStudents: 2000,
      activeToday: 1200,
      postsToday: 150,
      universitiesCount: 4,
      departmentsCount: 10
    }
  },

  // Generate classroom data for sections
  async getClassroomData(section: string) {
    const sectionStudents = Array.from({ length: 45 }, (_, index) => ({
      id: `student-${section}-${index}`,
      name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
      rollNumber: `${section}${String(index + 1).padStart(3, '0')}`,
      avatar: ['👨‍🎓', '👩‍🎓'][Math.floor(Math.random() * 2)]
    }))

    return {
      section,
      students: sectionStudents,
      totalStudents: 45,
      activeStudents: Math.floor(Math.random() * 10) + 35,
      assignments: Math.floor(Math.random() * 5) + 3,
      notes: Math.floor(Math.random() * 10) + 5
    }
  }
}

// Check if we should use scaled mock data
export function shouldUseScaledMockData() {
  if (typeof window === 'undefined') return true
  
  const mongoUri = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI
  return !mongoUri || mongoUri.includes('localhost') || mongoUri === 'mongodb://localhost:27017/reppd'
}
