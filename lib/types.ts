export interface Event {
  id: string
  title: string
  date: string
  description: string
  images: string[]
  coverImage?: string
  videoUrl?: string
  organizer: string
  createdAt: string
  likes?: number
  likedBy?: string[]
  comments?: Comment[]
}

export interface Project {
  id: string
  title: string
  description: string
  images: string[]
  coverImage?: string
  technologies: string[]
  contributors: string[]
  date: string
  createdAt: string
  likes?: number
  likedBy?: string[]
  comments?: Comment[]
}

export interface Member {
  id: string
  name: string
  branch: string
  year: string
  division: string
  rollNo: string
  zprnNo: string
  team: string
  position: string
  phone: string
  email: string
  photo: string
  dateOfBirth?: string
  socialLinks?: {
    linkedin?: string
    github?: string
    instagram?: string
  }
  badges?: Badge[]
  skills?: string[]
  eventsParticipated?: string[]
  projectsParticipated?: string[]
  approved?: boolean
  profileCompleted?: boolean
  submittedForApproval?: boolean
  submittedAt?: string
  approvedBy?: 'owner' | 'admin'
  approvedAt?: string
  createdAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  awardedAt: string
  awardedBy: string
}

export interface Team {
  id: string
  name: string
  description: string
  icon: string
  members: Member[]
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  createdAt: string
  replied?: boolean
}

export interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  coverImage?: string
  featuredImage?: string
  author: string
  tags: string[]
  category?: string
  readTime?: string
  likes?: number
  likedBy?: string[]
  publishedAt: string
  createdAt: string
  comments?: Comment[]
}

export interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
}

export interface Merchandise {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  coverImage?: string
  category: string
  sizes?: string[]
  colors?: string[]
  inStock: boolean
  stockQuantity?: number
  featured?: boolean
  createdAt: string
  updatedAt?: string
}

export interface Order {
  id: string
  orderNumber: string
  items: {
    id: string
    merchandiseId: string
    name: string
    price: number
    image: string
    size?: string
    color?: string
    quantity: number
  }[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  customerInfo: {
    name: string
    email: string
    phone: string
    address: string
    city?: string
    state?: string
    pincode?: string
    notes?: string
  }
  createdAt: string
  updatedAt?: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'member'
  name?: string
  photo?: string
}