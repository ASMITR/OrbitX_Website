// Simple in-memory cache for performance
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const setCache = (key: string, data: any, ttlMs: number = 300000) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs
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

export const clearCache = () => {
  cache.clear()
}