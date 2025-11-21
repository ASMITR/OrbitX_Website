// Security utilities
export const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const rateLimit = new Map<string, number>()

export const checkRateLimit = (ip: string, limit: number = 5): boolean => {
  const now = Date.now()
  const userRequests = rateLimit.get(ip) || 0
  
  if (userRequests >= limit) {
    return false
  }
  
  rateLimit.set(ip, userRequests + 1)
  
  // Reset after 1 minute
  setTimeout(() => {
    rateLimit.delete(ip)
  }, 60000)
  
  return true
}