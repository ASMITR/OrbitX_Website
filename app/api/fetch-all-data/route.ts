import { NextResponse } from 'next/server'
import { 
  getEvents, 
  getProjects, 
  getMembers, 
  getContactMessages, 
  getBlogs, 
  getMerchandise 
} from '@/lib/db'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { cookies } from 'next/headers'

export async function GET() {
  // Check for admin session
  const cookieStore = cookies()
  const session = cookieStore.get('session')
  
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }
  try {
    const [
      events,
      projects,
      members,
      messages,
      blogs,
      merchandise
    ] = await Promise.all([
      getEvents(),
      getProjects(),
      getMembers(),
      getContactMessages(),
      getBlogs(),
      getMerchandise()
    ])

    // Fetch additional collections
    const ordersSnapshot = await getDocs(collection(db, 'orders'))
    const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const settingsSnapshot = await getDocs(collection(db, 'settings'))
    const settings = settingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const adminProfilesSnapshot = await getDocs(collection(db, 'adminProfiles'))
    const adminProfiles = adminProfilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const allData = {
      events,
      projects,
      members,
      messages,
      blogs,
      merchandise,
      orders,
      settings,
      adminProfiles,
      summary: {
        events: events.length,
        projects: projects.length,
        members: members.length,
        messages: messages.length,
        blogs: blogs.length,
        merchandise: merchandise.length,
        orders: orders.length,
        settings: settings.length,
        adminProfiles: adminProfiles.length
      }
    }

    return NextResponse.json(allData)
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}