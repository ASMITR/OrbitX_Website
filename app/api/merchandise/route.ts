import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Merchandise } from '@/lib/types'

export async function GET() {
  try {
    const merchandiseRef = collection(db, 'merchandise')
    const q = query(merchandiseRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    const merchandise: Merchandise[] = []
    snapshot.forEach((doc) => {
      merchandise.push({ id: doc.id, ...doc.data() } as Merchandise)
    })

    return NextResponse.json(merchandise)
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

    // Handle image uploads (simplified - in production, upload to cloud storage)
    const images: string[] = []
    let imageIndex = 0
    while (formData.get(`image${imageIndex}`)) {
      const imageFile = formData.get(`image${imageIndex}`) as File
      // In production, upload to cloud storage and get URL
      // For now, using placeholder
      images.push(`/placeholder-merchandise-${Date.now()}-${imageIndex}.jpg`)
      imageIndex++
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