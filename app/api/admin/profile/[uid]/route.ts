import { NextRequest, NextResponse } from 'next/server'
import { getAdminProfile } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const profile = await getAdminProfile(params.uid)
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}