'use client'

import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'

interface SpaceObject {
  id: number
  x: number
  y: number
  size: number
  type: 'star' | 'planet' | 'asteroid' | 'comet'
  color: string
  speed: number
}

function SpaceBackgroundComponent() {
  const shouldReduceMotion = useReducedMotion()
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>([])

  const starCount = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 50 : window.innerWidth < 1024 ? 100 : 150
    }
    return 100
  }, [])

  useEffect(() => {
    const objects: SpaceObject[] = []
    
    // Generate optimized stars based on device
    for (let i = 0; i < starCount; i++) {
      objects.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        type: 'star',
        color: '#ffffff',
        speed: Math.random() * 2 + 1
      })
    }
    
    setSpaceObjects(objects)
  }, [starCount])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Pure black universe background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Optimized stars */}
      {spaceObjects.map((obj) => (
        <motion.div
          key={`star-${obj.id}`}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: `${obj.size}px`,
            height: `${obj.size}px`,
            backgroundColor: obj.color,
            boxShadow: shouldReduceMotion ? 'none' : `0 0 ${obj.size}px ${obj.color}80`
          }}
          animate={shouldReduceMotion ? {} : {
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: obj.speed * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Optimized meteors - reduced for mobile */}
      {!shouldReduceMotion && Array.from({ length: window.innerWidth < 768 ? 2 : 3 }).map((_, i) => (
        <motion.div
          key={`meteor-${i}`}
          className="absolute will-change-transform"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
        >
          <motion.div
            className="w-2 h-0.5 bg-white rounded-full opacity-80"
            animate={{
              x: [0, 300],
              y: [0, 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 8 + Math.random() * 4,
              repeatDelay: 15,
            }}
          />
        </motion.div>
      ))}

      {/* Simplified comets - desktop only */}
      {!shouldReduceMotion && typeof window !== 'undefined' && window.innerWidth >= 768 && Array.from({ length: 2 }).map((_, i) => (
        <motion.div
          key={`comet-${i}`}
          className="absolute will-change-transform"
          style={{
            left: `${20 + i * 40}%`,
            top: `${30 + i * 20}%`,
          }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          />
        </motion.div>
      ))}

      {/* Simplified planets - desktop only */}
      {typeof window !== 'undefined' && window.innerWidth >= 1024 && (
        <>
          <motion.div
            className="absolute w-12 h-12 rounded-full bg-blue-500 will-change-transform"
            style={{ left: '15%', top: '30%' }}
            animate={shouldReduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          
          <motion.div
            className="absolute w-8 h-8 rounded-full bg-orange-500 will-change-transform"
            style={{ right: '20%', top: '60%' }}
            animate={shouldReduceMotion ? {} : { rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      {/* Minimal asteroids - desktop only */}
      {!shouldReduceMotion && typeof window !== 'undefined' && window.innerWidth >= 1024 && Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`asteroid-${i}`}
          className="absolute bg-gray-500 rounded-full will-change-transform"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '3px',
            height: '3px',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}

      {/* Simplified nebulae - desktop only */}
      {typeof window !== 'undefined' && window.innerWidth >= 1024 && (
        <>
          <motion.div
            className="absolute w-64 h-64 rounded-full bg-purple-500/10 blur-3xl will-change-transform"
            style={{ left: '10%', top: '50%' }}
            animate={shouldReduceMotion ? {} : { opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          
          <motion.div
            className="absolute w-48 h-48 rounded-full bg-cyan-500/8 blur-3xl will-change-transform"
            style={{ right: '15%', bottom: '30%' }}
            animate={shouldReduceMotion ? {} : { opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 18, repeat: Infinity }}
          />
        </>
      )}




    </div>
  )
}

const SpaceBackground = dynamic(() => Promise.resolve(SpaceBackgroundComponent), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black" />
    </div>
  )
})

export default SpaceBackground