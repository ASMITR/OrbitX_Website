import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Order } from '@/lib/types'

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'orders'))
    
    const orders: any[] = []
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() })
    })

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    
    const completeOrder = {
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      orderNumber: `ORD-${Date.now()}`
    }

    const docRef = await addDoc(collection(db, 'orders'), completeOrder)
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...completeOrder 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}