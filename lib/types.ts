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
  eventsParticipated?: string[]
  projectsParticipated?: string[]
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

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'member'
  name?: string
  photo?: string
}