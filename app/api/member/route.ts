import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (use database in production)
let memberData: { [key: string]: any } = {}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }
  
  const data = memberData[email] || {
    name: email.split('@')[0],
    bio: '',
    contact: '',
    joinedAt: new Date().toISOString(),
    badges: ['Explorer'],
    activities: [
      { action: 'Joined OrbitX Community', date: new Date().toISOString() }
    ],
    stats: {
      projectsJoined: 0,
      eventsAttended: 0,
      achievements: 1
    }
  }
  
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const { email, data } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    
    memberData[email] = { ...memberData[email], ...data }
    
    return NextResponse.json({ success: true, data: memberData[email] })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}