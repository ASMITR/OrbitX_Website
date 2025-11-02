// Performance optimization utilities
import React from 'react'

export const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false
  
  // Check for low-end device indicators
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
  const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')
  const isLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4
  const isLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
  
  return isSlowConnection || isLowMemory || isLowCores
}

export const shouldReduceAnimations = () => {
  if (typeof window === 'undefined') return true
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isLowEnd = isLowEndDevice()
  const isMobile = window.innerWidth < 768
  
  return prefersReducedMotion || isLowEnd || isMobile
}

export const getOptimalParticleCount = () => {
  if (typeof window === 'undefined') return 50
  
  const width = window.innerWidth
  const isLowEnd = isLowEndDevice()
  
  if (isLowEnd) return 20
  if (width < 768) return 30
  if (width < 1024) return 50
  return 80
}

export const createIntersectionObserver = (callback: IntersectionObserverCallback, options?: IntersectionObserverInit) => {
  if (typeof window === 'undefined') return null
  
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  }
  
  return new IntersectionObserver(callback, defaultOptions)
}

export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFunc)
  
  return React.forwardRef((props: any, ref: any) => 
    React.createElement(
      React.Suspense,
      { fallback: fallback ? React.createElement(fallback) : null },
      React.createElement(LazyComponent, { ...props, ref })
    )
  )
}

// Memoization helper for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// Viewport-based animation controls
export const getViewportAnimationConfig = () => {
  if (typeof window === 'undefined') return { duration: 0.3, stagger: 0.05 }
  
  const width = window.innerWidth
  const isLowEnd = isLowEndDevice()
  
  if (isLowEnd) return { duration: 0.2, stagger: 0.02 }
  if (width < 768) return { duration: 0.25, stagger: 0.03 }
  return { duration: 0.4, stagger: 0.1 }
}