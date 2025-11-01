'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Rocket } from 'lucide-react'
import { useMemo } from 'react'

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion()
  
  const fastVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }), [])

  return (
    <section className="relative min-h-screen flex items-center justify-center container-tight pt-20 pb-8 gpu-accelerated overflow-x-hidden">
      {/* Optimized background elements */}
      <div className="absolute inset-0 overflow-hidden will-change-transform">
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 blur-3xl will-change-transform"
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-3xl will-change-transform"
        />
        
        {/* Advanced floating particles - reduced for mobile */}
        {!shouldReduceMotion && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        <motion.div
          variants={fastVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8"
        >
          {/* Advanced Logo Section */}
          <motion.div 
            className="mb-8 sm:mb-12 relative will-change-transform"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Dynamic glow effect */}
            <motion.div
              className="absolute inset-0 blur-2xl opacity-40 will-change-transform"
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src="/Logo_without_background.png" 
                alt="OrbitX Logo Glow" 
                className="w-auto mx-auto h-40 sm:h-52 md:h-64 lg:h-80 max-w-full"
                loading="eager"
              />
            </motion.div>
            
            {/* Main logo with advanced hover */}
            <motion.img 
              src="/Logo_without_background.png" 
              alt="OrbitX Logo" 
              className="w-auto mx-auto relative z-10 cursor-pointer h-40 sm:h-52 md:h-64 lg:h-80 max-w-full will-change-transform"
              loading="eager"
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.05,
                rotateY: 4,
                rotateX: 2,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.96 }}
              animate={shouldReduceMotion ? {} : {
                y: [0, -4, 0],
                rotateZ: [0, 0.5, -0.5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Enhanced orbital particles - mobile optimized */}
            {!shouldReduceMotion && Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full will-change-transform hidden sm:block"
                style={{
                  background: `linear-gradient(45deg, ${i % 2 ? '#3b82f6' : '#8b5cf6'}, ${i % 2 ? '#06b6d4' : '#ec4899'})`,
                  left: `${35 + (i * 8)}%`,
                  top: `${30 + (i % 2) * 20}%`
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, Math.sin(i) * 10, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.6, 1.2, 0.6],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2.5 + (i * 0.3),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Rocket trail effect - mobile optimized */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block"
              animate={shouldReduceMotion ? {} : {
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400/60" />
            </motion.div>
          </motion.div>
          
          {/* Enhanced tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 sm:mb-12 px-2"
          >
            <motion.h1 
              className="heading-lg font-bold mb-6 sm:mb-8 will-change-transform"
              animate={shouldReduceMotion ? {} : {
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Where Curiosity Meets The Cosmos
            </motion.h1>
            
            <motion.p 
              className="text-lg-responsive text-gray-300 max-w-2xl mx-auto leading-relaxed px-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Join us in pushing the boundaries of space exploration, innovation, and collaborative learning. Together, we reach for the stars.
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
        >
          <motion.div
            className="relative will-change-transform"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Link href="/contact" className="relative group overflow-hidden block">
              {/* Optimized gradient border */}
              <motion.div 
                className="absolute inset-0 rounded-full p-0.5 will-change-transform"
                style={{
                  background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)'
                }}
                animate={shouldReduceMotion ? {} : { rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <div className="h-full w-full rounded-full bg-black" />
              </motion.div>
              
              {/* Enhanced inner background */}
              <motion.div 
                className="absolute inset-1 rounded-full will-change-transform"
                style={{
                  background: 'linear-gradient(45deg, #2563eb, #7c3aed, #06b6d4)'
                }}
                animate={shouldReduceMotion ? {} : {
                  background: [
                    'linear-gradient(45deg, #2563eb, #7c3aed, #06b6d4)',
                    'linear-gradient(135deg, #7c3aed, #06b6d4, #2563eb)',
                    'linear-gradient(225deg, #06b6d4, #2563eb, #7c3aed)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white">
                <motion.div
                  animate={shouldReduceMotion ? {} : { rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
                
                <span className="group-hover:text-yellow-300 transition-colors duration-200 font-extrabold">
                  Join Now
                </span>
                
                <motion.div
                  animate={shouldReduceMotion ? {} : { x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.div>
              </div>
              
              {/* Optimized glow */}
              <motion.div 
                className="absolute -inset-2 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-cyan-500/40 rounded-full blur-lg opacity-50 group-hover:opacity-80 -z-10 will-change-transform"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="relative will-change-transform"
          >
            <Link href="/about" className="relative group block overflow-hidden">
              <div className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-r from-gray-500 to-gray-400">
                <div className="h-full w-full rounded-full bg-black" />
              </div>
              
              <div className="absolute inset-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full group-hover:from-gray-600 group-hover:to-gray-500 transition-all duration-200" />
              
              <div className="relative z-10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white text-center">
                <span className="group-hover:text-cyan-300 transition-colors duration-200">
                  Learn More
                </span>
              </div>
            </Link>
          </motion.div>
          
          <motion.div
            whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="relative will-change-transform"
          >
            <Link href="/auth" className="relative group block overflow-hidden">
              <div className="absolute inset-0 rounded-full p-0.5 bg-gradient-to-r from-orange-500 to-red-400">
                <div className="h-full w-full rounded-full bg-black" />
              </div>
              
              <div className="absolute inset-1 bg-gradient-to-r from-orange-700 to-red-600 rounded-full group-hover:from-orange-600 group-hover:to-red-500 transition-all duration-200" />
              
              <div className="relative z-10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-white text-center">
                <span className="group-hover:text-orange-300 transition-colors duration-200">
                  Get Started
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="mt-12 sm:mt-16 hidden sm:block"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="cursor-pointer"
          >
            <div className="w-6 h-10 border-2 border-white/40 rounded-full mx-auto relative overflow-hidden">
              <motion.div 
                className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mx-auto mt-2"
                animate={shouldReduceMotion ? {} : {
                  y: [0, 12, 0],
                  opacity: [1, 0.3, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}