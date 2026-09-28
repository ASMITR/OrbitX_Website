import { NextRequest, NextResponse } from 'next/server'
import { verifyPhonePeCallback } from '@/lib/payment-gateways'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const { response, checksum } = await request.json()
    
    if (!verifyPhonePeCallback(response, checksum)) {
      return NextResponse.json(
        { error: 'Invalid callback signature' },
        { status: 400 }
      )
    }

    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString())
    const { merchantTransactionId, code, message } = decodedResponse

    // Update order status in database
    if (code === 'PAYMENT_SUCCESS') {
      // Find and update order by transaction ID
      // You'll need to implement order lookup by transaction ID
      return NextResponse.json({ success: true, status: 'completed' })
    } else {
      return NextResponse.json({ success: false, status: 'failed', message })
    }
  } catch (error) {
    console.error('PhonePe callback error:', error)
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    )
  }
}