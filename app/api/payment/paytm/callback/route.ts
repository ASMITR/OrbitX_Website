import { NextRequest, NextResponse } from 'next/server'
import { verifyPaytmCallback } from '@/lib/payment-gateways'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const params: Record<string, string> = {}
    
    formData.forEach((value, key) => {
      params[key] = value.toString()
    })

    if (!verifyPaytmCallback(params)) {
      return NextResponse.json(
        { error: 'Invalid callback signature' },
        { status: 400 }
      )
    }

    const { ORDERID, STATUS, TXNID, RESPCODE, RESPMSG } = params

    // Update order status in database
    if (STATUS === 'TXN_SUCCESS') {
      // Find and update order by transaction ID
      // You'll need to implement order lookup by transaction ID
      return NextResponse.json({ success: true, status: 'completed' })
    } else {
      return NextResponse.json({ success: false, status: 'failed', message: RESPMSG })
    }
  } catch (error) {
    console.error('Paytm callback error:', error)
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    )
  }
}