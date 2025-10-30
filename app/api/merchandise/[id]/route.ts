import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Merchandise } from '@/lib/types'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'merchandise', params.id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Merchandise not found' }, { status: 404 })
    }

    const data = docSnap.data()
    const merchandise = {
      id: docSnap.id,
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
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } as Merchandise
    
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const existingImages = formData.get('existingImages') ? JSON.parse(formData.get('existingImages') as string) : []

    // Handle new image uploads
    const newImages: string[] = []
    let imageIndex = 0
    
    while (formData.get(`image${imageIndex}`)) {
      const imageFile = formData.get(`image${imageIndex}`) as File
      
      try {
        // Try Cloudinary upload first
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          const result = await uploadToCloudinary(imageFile, 'merchandise') as any
          newImages.push(result.secure_url)
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
          newImages.push(`/media/merchandise/${filename}`)
        }
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        // Use placeholder as fallback
        newImages.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f2937&color=ffffff&size=400`)
      }
      
      imageIndex++
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImages]
    
    // Ensure at least one image
    if (allImages.length === 0) {
      allImages.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f2937&color=ffffff&size=400`)
    }

    const updateData: Partial<Merchandise> = {
      name,
      description,
      price,
      category,
      images: allImages,
      coverImage: allImages[0],
      sizes: sizes.length > 0 ? sizes : undefined,
      colors: colors.length > 0 ? colors : undefined,
      inStock,
      stockQuantity,
      featured,
      updatedAt: new Date().toISOString()
    }

    const docRef = doc(db, 'merchandise', params.id)
    await updateDoc(docRef, updateData)
    
    return NextResponse.json({ 
      id: params.id, 
      ...updateData 
    })
  } catch (error) {
    console.error('Error updating merchandise:', error)
    return NextResponse.json({ error: 'Failed to update merchandise' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'merchandise', params.id)
    await deleteDoc(docRef)
    
    return NextResponse.json({ message: 'Merchandise deleted successfully' })
  } catch (error) {
    console.error('Error deleting merchandise:', error)
    return NextResponse.json({ error: 'Failed to delete merchandise' }, { status: 500 })
  }
}