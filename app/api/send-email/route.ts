import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json()

    // Create Gmail compose URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    
    return NextResponse.json({ 
      success: true, 
      gmailUrl,
      mailtoUrl: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process email' },
      { status: 500 }
    )
  }
}