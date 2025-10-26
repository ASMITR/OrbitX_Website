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
        y: -10, 
        scale: 1.03,
        rotateY: 2,
        rotateX: -2
      }}
      className="group perspective-1000 h-full"
    >
      <Link href={href} className="block h-full">
        <div className="relative card-responsive glass-card h-full hover:bg-gradient-to-br hover:from-white/25 hover:to-white/10 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/25 overflow-hidden border-2 border-transparent group-hover:border-cyan-400/30 flex flex-col">
          {/* Optimized Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Glowing Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          
          {/* Enhanced Icon */}
          <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0`}>
            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow-lg" />
          </div>
          
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-yellow-300 transition-colors duration-300 leading-tight">
            {title}
          </h3>
          
          <p className="text-sm sm:text-base text-gray-300 group-hover:text-white mb-4 sm:mb-6 leading-relaxed transition-colors duration-300 flex-grow">
            {description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors font-semibold">
              <Sparkles className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-sm sm:text-base">Explore</span>
            </div>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-2 transition-all duration-300" />
          </div>

          {/* Hover Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-purple-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
        </div>
      </Link>
    </motion.div>
  )
}