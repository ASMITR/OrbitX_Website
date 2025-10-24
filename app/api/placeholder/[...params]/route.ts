import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  const [width = '200', height = '200'] = params.params || []
  
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <circle cx="50%" cy="35%" r="20%" fill="#374151"/>
      <path d="M 20% 80% Q 50% 60% 80% 80% L 80% 100% L 20% 100% Z" fill="#374151"/>
      <text x="50%" y="90%" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="12">
        ${width}x${height}
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}