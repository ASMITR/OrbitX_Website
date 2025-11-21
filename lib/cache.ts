// Simple in-memory cache for client-side data
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

export function getCache(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

export function setCache(key: string, data: any, duration: number = CACHE_DURATION) {
  cache.set(key, { data, timestamp: Date.now() })
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}