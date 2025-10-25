import { NextRequest, NextResponse } from 'next/server'
import { getAdminProfile, updateAdminProfile, createAdminProfile } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const profile = await getAdminProfile(params.uid)
    return NextResponse.json(profile || {})
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const body = await request.json()
    const { name, photo, socialLinks, email } = body
    
    console.log('Updating admin profile for UID:', params.uid)
    console.log('Update data:', { name, photo: photo ? 'has photo' : 'no photo', socialLinks })
    
    // Check if profile exists
    const existingProfile = await getAdminProfile(params.uid)
    console.log('Existing profile:', existingProfile ? 'found' : 'not found')
    
    // Build profile data, filtering out undefined values
    const profileData: any = {
      name,
      socialLinks,
      updatedAt: new Date().toISOString()
    }
    
    // Only add photo if it exists
    if (photo) {
      profileData.photo = photo
    }
    
    // Only add email if it exists (from existing profile or provided)
    const profileEmail = email || existingProfile?.email
    if (profileEmail) {
      profileData.email = profileEmail
    }
    
    if (existingProfile) {
      await updateAdminProfile(params.uid, profileData)
      console.log('Updated existing admin profile')
    } else {
      await createAdminProfile(params.uid, profileData)
      console.log('Created new admin profile')
    }
    
    return NextResponse.json({ success: true, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json({ 
      error: 'Failed to update profile', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}