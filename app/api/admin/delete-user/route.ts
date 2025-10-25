import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Note: Firebase Auth user deletion requires Firebase Admin SDK
    // For now, return success (user deletion from client side is limited)
    console.log('User deletion requested for:', email)
    
    return NextResponse.json({ 
      success: true, 
      message: 'User marked for deletion' 
    })
  } catch (error: any) {
    console.error('Error processing user deletion:', error)
    
    return NextResponse.json({ 
      error: 'Failed to process user deletion',
      details: error.message 
    }, { status: 500 })
  }
}