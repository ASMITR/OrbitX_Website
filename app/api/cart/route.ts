import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const cartItem = await request.json()
    
    const orderData = {
      ...cartItem,
      status: 'pending',
      customerInfo: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      createdAt: new Date().toISOString(),
      orderNumber: `ORD-${Date.now()}`
    }

    const docRef = await addDoc(collection(db, 'orders'), orderData)
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...orderData 
    }, { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    const orders: any[] = []
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() })
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}