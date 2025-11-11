import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerDetails, total, paymentMethod } = body

    const orderData = {
      items,
      customerDetails,
      total,
      paymentMethod,
      status: 'pending',
      createdAt: serverTimestamp(),
      orderId: `ORX${Date.now()}`
    }

    const docRef = await addDoc(collection(db, 'orders'), orderData)
    
    return NextResponse.json({ 
      success: true, 
      id: docRef.id,
      orderId: orderData.orderId
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}