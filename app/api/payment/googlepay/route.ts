import { NextRequest, NextResponse } from 'next/server'
import { generateUPILink } from '@/lib/payment-gateways'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json()

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Google Pay UPI ID (replace with your actual UPI ID)
    const upiId = process.env.UPI_ID || 'merchant@paytm'
    const merchantName = process.env.MERCHANT_NAME || 'OrbitX'
    
    const upiLink = generateUPILink(amount, upiId, merchantName, orderId)

    return NextResponse.json({
      success: true,
      upiLink,
      qrData: upiLink
    })
  } catch (error) {
    console.error('Google Pay payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}