import { promises as fs } from 'fs'
import path from 'path'

export interface MediaItem {
  id: string
  type: 'image' | 'video' | 'reel'
  filename: string
  originalName: string
  size: number
  mimeType: string
  category: 'events' | 'projects' | 'blogs' | 'members'
  uploadedAt: string
  url: string
}

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const DB_FILE = path.join(process.cwd(), 'data', 'media.json')

// Ensure directories exist
export const initMediaDB = async () => {
  try {
    await fs.mkdir(path.join(MEDIA_DIR, 'events'), { recursive: true })
    await fs.mkdir(path.join(MEDIA_DIR, 'projects'), { recursive: true })
    await fs.mkdir(path.join(MEDIA_DIR, 'blogs'), { recursive: true })
    await fs.mkdir(path.join(MEDIA_DIR, 'members'), { recursive: true })
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true })
    
    try {
      await fs.access(DB_FILE)
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify([]))
    }
  } catch (error) {
    console.error('Failed to initialize media DB:', error)
  }
}

// Save media file
export const saveMedia = async (
  file: Buffer,
  originalName: string,
  category: MediaItem['category'],
  type: MediaItem['type']
): Promise<MediaItem> => {
  const id = Date.now().toString()
  const ext = path.extname(originalName)
  const filename = `${id}_${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const filePath = path.join(MEDIA_DIR, category, filename)
  
  await fs.writeFile(filePath, file)
  
  const mediaItem: MediaItem = {
    id,
    type,
    filename,
    originalName,
    size: file.length,
    mimeType: getMimeType(ext),
    category,
    uploadedAt: new Date().toISOString(),
    url: `/media/${category}/${filename}`
  }
  
  const db = await getMediaDB()
  db.push(mediaItem)
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2))
  
  return mediaItem
}

// Get all media
export const getMediaDB = async (): Promise<MediaItem[]> => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Get media by category
export const getMediaByCategory = async (category: MediaItem['category']): Promise<MediaItem[]> => {
  const db = await getMediaDB()
  return db.filter(item => item.category === category)
}

// Delete media
export const deleteMedia = async (id: string): Promise<boolean> => {
  const db = await getMediaDB()
  const item = db.find(m => m.id === id)
  if (!item) return false
  
  try {
    await fs.unlink(path.join(MEDIA_DIR, item.category, item.filename))
    const newDB = db.filter(m => m.id !== id)
    await fs.writeFile(DB_FILE, JSON.stringify(newDB, null, 2))
    return true
  } catch {
    return false
  }
}

const getMimeType = (ext: string): string => {
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime'
  }
  return types[ext.toLowerCase()] || 'application/octet-stream'
}