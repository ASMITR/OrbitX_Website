// Simple in-memory cache for better performance
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const setCache = (key: string, data: any, ttlMinutes = 5) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMinutes * 60 * 1000
  })
}

export const getCache = (key: string) => {
  const item = cache.get(key)
  if (!item) return null
  
  if (Date.now() - item.timestamp > item.ttl) {
    cache.delete(key)
    return null
  }
  
  return item.data
}

export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}