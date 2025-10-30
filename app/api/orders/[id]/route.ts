import { NextRequest, NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Order } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'orders', params.id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const data = docSnap.data()
    const order = {
      id: docSnap.id,
      orderNumber: data.orderNumber,
      items: data.items,
      total: data.total,
      status: data.status,
      customerInfo: data.customerInfo,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    } as Order
    
    return NextResponse.json(order, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    
    const docRef = doc(db, 'orders', params.id)
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    })
    
    return NextResponse.json({ message: 'Order updated successfully' })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docRef = doc(db, 'orders', params.id)
    await deleteDoc(docRef)
    
    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}