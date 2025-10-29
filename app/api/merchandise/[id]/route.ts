import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Merchandise } from '@/lib/types'

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

    const merchandise = { id: docSnap.id, ...docSnap.data() } as Merchandise
    return NextResponse.json(merchandise)
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
      // In production, upload to cloud storage and get URL
      newImages.push(`/placeholder-merchandise-${Date.now()}-${imageIndex}.jpg`)
      imageIndex++
    }

    const allImages = [...existingImages, ...newImages]

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