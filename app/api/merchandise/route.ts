import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, getDocs, orderBy, query, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Merchandise } from '@/lib/types'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getCache, setCache } from '@/lib/cache'

export async function GET() {
  try {
    const cacheKey = 'merchandise-list'
    const cached = getCache(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      })
    }

    const merchandiseRef = collection(db, 'merchandise')
    const snapshot = await getDocs(merchandiseRef)
    
    const merchandise: Merchandise[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      merchandise.push({ 
        id: doc.id, 
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        images: data.images || [],
        coverImage: data.coverImage,
        sizes: data.sizes,
        colors: data.colors,
        inStock: data.inStock,
        stockQuantity: data.stockQuantity,
        featured: data.featured,
        createdAt: data.createdAt
      } as Merchandise)
    })

    setCache(cacheKey, merchandise, 300000)
    return NextResponse.json(merchandise, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    console.error('Error fetching merchandise:', error)
    return NextResponse.json({ error: 'Failed to fetch merchandise' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const category = formData.get('category') as string
    const inStock = formData.get('inStock') === 'true'
    const featured = formData.get('featured') === 'true'
    const stockQuantity = formData.get('stockQuantity') ? parseInt(formData.get('stockQuantity') as string) : undefined
    const sizes = formData.get('sizes') ? JSON.parse(formData.get('sizes') as string) : []
    const colors = formData.get('colors') ? JSON.parse(formData.get('colors') as string) : []

    // Handle image uploads
    const images: string[] = []
    let imageIndex = 0
    
    while (formData.get(`image${imageIndex}`)) {
      const imageFile = formData.get(`image${imageIndex}`) as File
      
      try {
        // Try Cloudinary upload first
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          const result = await uploadToCloudinary(imageFile, 'merchandise') as any
          images.push(result.secure_url)
        } else {
          // Fallback to local upload
          const bytes = await imageFile.arrayBuffer()
          const buffer = Buffer.from(bytes)
          
          const timestamp = Date.now()
          const filename = `${timestamp}_${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          const uploadDir = path.join(process.cwd(), 'public', 'media', 'merchandise')
          const filePath = path.join(uploadDir, filename)
          
          // Ensure directory exists
          const fs = require('fs')
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
          }
          
          await writeFile(filePath, buffer)
          images.push(`/media/merchandise/${filename}`)
        }
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        // Use placeholder as fallback
        images.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f2937&color=ffffff&size=400`)
      }
      
      imageIndex++
    }
    
    // Ensure at least one image
    if (images.length === 0) {
      images.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f2937&color=ffffff&size=400`)
    }

    const merchandiseData: Omit<Merchandise, 'id'> = {
      name,
      description,
      price,
      category,
      images,
      coverImage: images[0],
      sizes: sizes.length > 0 ? sizes : undefined,
      colors: colors.length > 0 ? colors : undefined,
      inStock,
      stockQuantity,
      featured,
      createdAt: new Date().toISOString()
    }

    const docRef = await addDoc(collection(db, 'merchandise'), merchandiseData)
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...merchandiseData 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating merchandise:', error)
    return NextResponse.json({ error: 'Failed to create merchandise' }, { status: 500 })
  }
}