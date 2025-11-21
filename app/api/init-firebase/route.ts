import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, setDoc, doc } from 'firebase/firestore'
// Real data inline
const realEvents = [{
  id: '1',
  title: 'Space Technology Workshop 2024',
  description: 'Learn about cutting-edge space technologies',
  date: '2024-03-15T10:00:00Z',
  location: 'ZCOER Auditorium',
  image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
  createdAt: '2024-01-15T00:00:00Z'
}]

const realProjects = [{
  id: '1',
  title: 'Mars Rover Simulation',
  description: 'Developing Mars rover operations simulation',
  status: 'Active',
  technologies: ['Python', 'ROS'],
  image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800',
  createdAt: '2024-01-01T00:00:00Z'
}]

const realMembers = [{
  id: '1',
  name: 'Asmit Rajaramkar',
  email: 'asmit@orbitx.com',
  position: 'Founder & President',
  team: 'Management',
  photo: 'https://ui-avatars.com/api/?name=Asmit+Rajaramkar&background=3b82f6&color=ffffff',
  approved: true,
  createdAt: '2024-01-01T00:00:00Z'
}]

const realMerchandise = [{
  id: '1',
  name: 'OrbitX T-Shirt',
  description: 'Premium OrbitX branded t-shirt',
  price: 499,
  category: 'Apparel',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  inStock: true,
  stock: 50,
  createdAt: '2024-01-01T00:00:00Z'
}]

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Using fallback data - Firebase permissions not configured' })
}