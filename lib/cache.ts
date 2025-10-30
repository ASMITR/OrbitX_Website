// Simple in-memory cache for API responses
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const getCachedData = (key: string) => {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

export const setCachedData = (key: string, data: any, ttl: number = 300000) => { // 5 minutes default
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  })
}

export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}