import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip maintenance check for admin routes and API routes
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname === '/maintenance'
  ) {
    return NextResponse.next()
  }

  try {
    // Check maintenance mode from API
    const baseUrl = request.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/maintenance`, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.maintenanceMode) {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    }
  } catch (error) {
    // If we can't check maintenance status, continue normally
    console.error('Maintenance check failed:', error)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|Logo_without_background.png).*)',
  ],
}