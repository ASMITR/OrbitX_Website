'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { LucideIcon, ArrowRight } from 'lucide-react'

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link href={href}>
        <div className="glass-card p-8 h-full hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mb-6 group-hover:animate-pulse`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
            <span className="font-semibold">Explore</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}