import crypto from 'crypto'

// PhonePe Configuration
export const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT',
  saltKey: process.env.PHONEPE_SALT_KEY || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.phonepe.com/apis/hermes/pg/v1/pay'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
}

// Paytm Configuration
export const PAYTM_CONFIG = {
  merchantId: process.env.PAYTM_MERCHANT_ID || 'YOUR_MERCHANT_ID',
  merchantKey: process.env.PAYTM_MERCHANT_KEY || 'YOUR_MERCHANT_KEY',
  website: process.env.PAYTM_WEBSITE || 'WEBSTAGING',
  industryType: process.env.PAYTM_INDUSTRY_TYPE || 'Retail',
  channelId: process.env.PAYTM_CHANNEL_ID || 'WEB',
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://securegw.paytm.in/theia/processTransaction'
    : 'https://securegw-stage.paytm.in/theia/processTransaction'
}

// Generate PhonePe payment request
export function generatePhonePePayment(orderId: string, amount: number, customerPhone: string) {
  const transactionId = `TXN${Date.now()}`
  const payload = {
    merchantId: PHONEPE_CONFIG.merchantId,
    merchantTransactionId: transactionId,
    merchantUserId: `USER${Date.now()}`,
    amount: amount * 100, // Convert to paise
    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/callback/phonepe`,
    redirectMode: 'POST',
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/phonepe/callback`,
    mobileNumber: customerPhone,
    paymentInstrument: {
      type: 'PAY_PAGE'
    }
  }

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64')
  const string = base64Payload + '/pg/v1/pay' + PHONEPE_CONFIG.saltKey
  const sha256 = crypto.createHash('sha256').update(string).digest('hex')
  const checksum = sha256 + '###' + PHONEPE_CONFIG.saltIndex

  return {
    request: base64Payload,
    checksum,
    transactionId,
    url: PHONEPE_CONFIG.apiUrl
  }
}

// Generate Paytm checksum
export function generatePaytmChecksum(params: Record<string, string>) {
  const paramStr = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  return crypto
    .createHmac('sha256', PAYTM_CONFIG.merchantKey)
    .update(paramStr)
    .digest('hex')
}

// Generate Paytm payment request
export function generatePaytmPayment(orderId: string, amount: number, customerEmail: string, customerPhone: string) {
  const transactionId = `TXN${Date.now()}`
  const params = {
    MID: PAYTM_CONFIG.merchantId,
    WEBSITE: PAYTM_CONFIG.website,
    INDUSTRY_TYPE_ID: PAYTM_CONFIG.industryType,
    CHANNEL_ID: PAYTM_CONFIG.channelId,
    ORDER_ID: transactionId,
    CUST_ID: customerEmail,
    MOBILE_NO: customerPhone,
    EMAIL: customerEmail,
    TXN_AMOUNT: amount.toString(),
    CALLBACK_URL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/paytm/callback`
  }

  const checksum = generatePaytmChecksum(params)
  
  return {
    ...params,
    CHECKSUMHASH: checksum,
    transactionId,
    url: PAYTM_CONFIG.apiUrl
  }
}

// Generate UPI payment link
export function generateUPILink(amount: number, upiId: string, name: string, orderId: string) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: amount.toString(),
    cu: 'INR',
    tn: `Payment for Order ${orderId}`
  })
  
  return `upi://pay?${params.toString()}`
}

// Verify PhonePe callback
export function verifyPhonePeCallback(response: string, checksum: string) {
  const string = response + PHONEPE_CONFIG.saltKey
  const sha256 = crypto.createHash('sha256').update(string).digest('hex')
  const expectedChecksum = sha256 + '###' + PHONEPE_CONFIG.saltIndex
  
  return checksum === expectedChecksum
}

// Verify Paytm callback
export function verifyPaytmCallback(params: Record<string, string>) {
  const { CHECKSUMHASH, ...otherParams } = params
  const generatedChecksum = generatePaytmChecksum(otherParams)
  
  return CHECKSUMHASH === generatedChecksum
}