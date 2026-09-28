import { NextRequest, NextResponse } from 'next/server'
import { generatePaytmPayment } from '@/lib/payment-gateways'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, customerEmail, customerPhone } = await request.json()

    if (!orderId || !amount || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const paymentData = generatePaytmPayment(orderId, amount, customerEmail, customerPhone)

    return NextResponse.json({
      success: true,
      paymentData,
      transactionId: paymentData.transactionId
    })
  } catch (error) {
    console.error('Paytm payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}