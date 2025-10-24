import { NextRequest, NextResponse } from 'next/server'
import { saveMedia, initMediaDB } from '@/lib/mediaDB'

export async function POST(request: NextRequest) {
  try {
    await initMediaDB()
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const type = formData.get('type') as string
    
    if (!file || !category || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const buffer = Buffer.from(await file.arrayBuffer())
    const mediaItem = await saveMedia(buffer, file.name, category as any, type as any)
    
    return NextResponse.json({ success: true, media: mediaItem })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}