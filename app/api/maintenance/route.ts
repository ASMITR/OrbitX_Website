import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const settingsRef = doc(db, 'settings', 'siteConfig')
    const settingsDoc = await getDoc(settingsRef)
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data()
      return NextResponse.json({
        maintenanceMode: data.maintenance?.maintenanceMode || false,
        maintenanceMessage: data.maintenance?.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon.'
      })
    }
    
    return NextResponse.json({
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.'
    })
  } catch (error) {
    console.error('Error checking maintenance status:', error)
    return NextResponse.json({
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.'
    })
  }
}