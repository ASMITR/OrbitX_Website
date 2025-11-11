'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { LucideIcon, ArrowRight, Sparkles } from 'lucide-react'

interface PreviewCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: string
  index: number
}

export default function PreviewCard({ title, description, icon: Icon, href, color, index }: PreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 45 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, type: 'spring', stiffness: 100 }}
      whileHover={{ 
        y: -15, 
        scale: 1.05,
        rotateY: 3,
        rotateX: -3
      }}
      className="group perspective-1000 h-full"
    >
      <Link href={href} className="block h-full">
        <div className="relative glass-card h-full min-h-[150px] sm:min-h-[170px] hover:bg-gradient-to-br hover:from-white/25 hover:to-white/10 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/25 overflow-hidden border-2 border-transparent group-hover:border-cyan-400/30 flex flex-col p-6 sm:p-8">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.2, 0.5]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Optimized Background Effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(6,182,212,0.05), rgba(59,130,246,0.05))',
                'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))',
                'linear-gradient(225deg, rgba(139,92,246,0.05), rgba(6,182,212,0.05))'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Glowing Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          
          {/* Enhanced Icon with Pulse Effect */}
          <motion.div 
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" />
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          
          <h3 className="text-base sm:text-lg font-bold mb-3 text-white group-hover:text-yellow-300 transition-colors duration-300 leading-tight relative z-10">
            {title}
          </h3>
          
          <p className="text-sm sm:text-base text-gray-300 group-hover:text-white mb-4 leading-relaxed transition-colors duration-300 flex-grow relative z-10">
            {description}
          </p>
          
          <motion.div 
            className="flex items-center justify-between mt-auto relative z-10"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors font-semibold">
              <Sparkles className="mr-1 h-3 w-3" />
              <span className="text-sm font-bold">Explore</span>
            </div>
            <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all duration-300" />
          </motion.div>

          {/* Enhanced Hover Glow Effect */}
          <motion.div 
            className="absolute -inset-2 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(6,182,212,0.5), rgba(59,130,246,0.5), rgba(139,92,246,0.5))',
                'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(6,182,212,0.5))',
                'linear-gradient(225deg, rgba(139,92,246,0.5), rgba(6,182,212,0.5), rgba(59,130,246,0.5))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </Link>
    </motion.div>
  )
}