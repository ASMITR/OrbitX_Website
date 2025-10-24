'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SpaceObject {
  id: number
  x: number
  y: number
  size: number
  type: 'star' | 'planet' | 'asteroid' | 'comet'
  color: string
  speed: number
}

export default function SpaceBackground() {
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>([])

  useEffect(() => {
    const objects: SpaceObject[] = []
    
    // Generate bright stars
    for (let i = 0; i < 300; i++) {
      objects.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 0.5,
        type: 'star',
        color: ['#ffffff', '#f0f8ff', '#e6f3ff', '#cce7ff'][Math.floor(Math.random() * 4)],
        speed: Math.random() * 2 + 1
      })
    }
    
    setSpaceObjects(objects)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Pure black universe background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Bright stars with twinkling effect */}
      {spaceObjects.map((obj) => (
        <motion.div
          key={`star-${obj.id}`}
          className="absolute rounded-full"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: `${obj.size}px`,
            height: `${obj.size}px`,
            backgroundColor: obj.color,
            boxShadow: `0 0 ${obj.size * 2}px ${obj.color}, 0 0 ${obj.size * 4}px ${obj.color}40`
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: obj.speed,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Shooting stars/meteors */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`meteor-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
        >
          <motion.div
            className="w-2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
            style={{
              boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff80'
            }}
            animate={{
              x: [0, 400],
              y: [0, 200],
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 6 + Math.random() * 4,
              repeatDelay: 12,
            }}
          />
        </motion.div>
      ))}

      {/* Comets with bright tails */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`comet-${i}`}
          className="absolute"
          style={{
            left: `${15 + i * 35}%`,
            top: `${20 + i * 25}%`,
          }}
        >
          <motion.div
            className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
            style={{
              boxShadow: '0 0 15px #00bcd4, 0 0 30px #00bcd480'
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 2,
            }}
          />
          <motion.div
            className="absolute -left-12 top-1 w-12 h-1 bg-gradient-to-r from-cyan-300/80 via-blue-400/60 to-transparent rounded-full"
            style={{
              boxShadow: '0 0 8px #00bcd460'
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
              scaleX: [0.9, 1.3, 0.9],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 2,
            }}
          />
        </motion.div>
      ))}

      {/* Planets with glowing effects */}
      <motion.div
        className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"
        style={{ 
          left: '12%', 
          top: '25%',
          boxShadow: '0 0 30px #3b82f6, 0 0 60px #3b82f640, inset -5px -5px 10px #1e40af40'
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
          scale: { duration: 6, repeat: Infinity },
        }}
      />
      
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-orange-500"
        style={{ 
          right: '18%', 
          top: '55%',
          boxShadow: '0 0 25px #f97316, 0 0 50px #f9731640, inset -4px -4px 8px #dc262640'
        }}
        animate={{
          rotate: -360,
          y: [0, -15, 0],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
          y: { duration: 8, repeat: Infinity },
        }}
      />

      <motion.div
        className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500"
        style={{ 
          left: '75%', 
          bottom: '35%',
          boxShadow: '0 0 20px #a855f7, 0 0 40px #a855f740, inset -3px -3px 6px #7c2d1240'
        }}
        animate={{
          rotate: 360,
          x: [0, 25, 0],
        }}
        transition={{
          rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
          x: { duration: 10, repeat: Infinity },
        }}
      />

      {/* Asteroids */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`asteroid-${i}`}
          className="absolute bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            boxShadow: '0 0 8px #6b728040'
          }}
          animate={{
            rotate: 360,
            x: [0, Math.random() * 40 - 20],
            y: [0, Math.random() * 40 - 20],
          }}
          transition={{
            rotate: { duration: Math.random() * 20 + 10, repeat: Infinity, ease: 'linear' },
            x: { duration: Math.random() * 15 + 10, repeat: Infinity, repeatType: 'reverse' },
            y: { duration: Math.random() * 12 + 8, repeat: Infinity, repeatType: 'reverse' },
          }}
        />
      ))}

      {/* Distant galaxies/nebulae */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/15 to-blue-500/15 blur-3xl"
        style={{ left: '5%', top: '40%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.25, 0.1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
      />
      
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/12 to-teal-500/12 blur-3xl"
        style={{ right: '8%', bottom: '25%' }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.08, 0.15],
          rotate: [360, 180, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
        }}
      />

      {/* Space dust particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute w-0.5 h-0.5 bg-gray-300 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Pulsars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`pulsar-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`,
            boxShadow: '0 0 20px #ffffff, 0 0 40px #ffffff80'
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 2, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}