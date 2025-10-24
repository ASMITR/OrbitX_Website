'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Main Logo with Advanced Animations */}
          <motion.div 
            className="mb-12 relative"
            initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Glow effect behind logo */}
            <motion.div
              className="absolute inset-0 blur-2xl opacity-30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src="/Logo_without_background.png" 
                alt="OrbitX Logo Glow" 
                className="w-auto mx-auto h-60 md:h-70 lg:h-80"
              />
            </motion.div>
            
            {/* Main logo with hover effects */}
            <motion.img 
              src="/Logo_without_background.png" 
              alt="OrbitX Logo" 
              className="w-auto mx-auto relative z-10 cursor-pointer h-60 md:h-70 lg:h-80"
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
            
            {/* Floating particles around logo */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${30 + (i % 3) * 20}%`
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + (i * 0.2),
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
          
          {/* Tagline with typewriter effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="mb-12"
          >
            <motion.p 
              className="text-2xl md:text-4xl lg:text-5xl font-light bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-8"
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ delay: 2, duration: 2, ease: "easeOut" }}
            >
              Where Curiosity Meets The Cosmos
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
            >
              Join us in our mission to push the boundaries of space exploration, 
              innovation, and collaborative learning. Together, we reach for the stars.
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link href="/contact" className="relative group overflow-hidden block">
              {/* Animated gradient border */}
              <motion.div 
                className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
                animate={{
                  rotate: [0, 360]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <div className="h-full w-full rounded-full bg-black" />
              </motion.div>
              
              {/* Inner gradient background */}
              <motion.div 
                className="absolute inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-full"
                animate={{
                  background: [
                    "linear-gradient(45deg, #2563eb, #7c3aed, #06b6d4)",
                    "linear-gradient(135deg, #7c3aed, #06b6d4, #2563eb)",
                    "linear-gradient(225deg, #06b6d4, #2563eb, #7c3aed)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Floating micro particles */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-70"
                    style={{
                      left: `${20 + (i * 12)}%`,
                      top: `${30 + (i % 2) * 40}%`
                    }}
                    animate={{
                      y: [-5, 8, -5],
                      opacity: [0.4, 1, 0.4],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2 + (i * 0.3),
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                
                <span className="group-hover:text-yellow-300 transition-colors duration-300 font-extrabold">
                  Join Now
                </span>
                
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </div>
              
              {/* Outer glow */}
              <motion.div 
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50 rounded-full blur-lg opacity-60 group-hover:opacity-100 -z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="relative"
          >
            <Link href="/about" className="relative group block overflow-hidden">
              {/* Animated border */}
              <motion.div 
                className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-r from-gray-500 to-gray-400"
                whileHover={{ background: "linear-gradient(45deg, #6b7280, #9ca3af, #d1d5db)" }}
              >
                <div className="h-full w-full rounded-full bg-black" />
              </motion.div>
              
              {/* Inner background */}
              <motion.div 
                className="absolute inset-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full"
                whileHover={{ background: "linear-gradient(45deg, #374151, #4b5563)" }}
              />
              
              <div className="relative z-10 px-6 py-3 text-sm font-bold text-white text-center">
                <span className="group-hover:text-cyan-300 transition-colors duration-300">
                  Learn More
                </span>
              </div>
              
              {/* Subtle glow */}
              <motion.div 
                className="absolute -inset-1 bg-gray-500/30 rounded-full blur-md opacity-40 group-hover:opacity-70 -z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16"
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto">
              <div className="w-1 h-3 bg-white rounded-full mx-auto mt-2 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}