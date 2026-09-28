import { NextRequest, NextResponse } from 'next/server'
import { generatePhonePePayment } from '@/lib/payment-gateways'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, customerPhone } = await request.json()

    if (!orderId || !amount || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const paymentData = generatePhonePePayment(orderId, amount, customerPhone)

    const response = await fetch(paymentData.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': paymentData.checksum
      },
      body: JSON.stringify({
        request: paymentData.request
      })
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.data.instrumentResponse.redirectInfo.url,
        transactionId: paymentData.transactionId
      })
    } else {
      return NextResponse.json(
        { error: 'Payment initiation failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('PhonePe payment error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}