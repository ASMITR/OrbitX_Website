'use client'

import { motion } from 'framer-motion'
import { Settings, Clock, Mail } from 'lucide-react'

interface MaintenancePageProps {
  message?: string
}

export default function MaintenancePage({ message = 'We are currently performing scheduled maintenance. Please check back soon.' }: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-8 w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
        >
          <Settings className="h-10 w-10 text-white" />
        </motion.div>

        <h1 className="text-3xl font-bold text-white mb-4">Under Maintenance</h1>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-center space-x-2 text-gray-400 mb-8">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Expected downtime: 30 minutes</span>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-2">Need immediate assistance?</p>
          <a 
            href="mailto:Orbitx@zealeducation.com" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact Support
          </a>
        </div>
      </motion.div>
    </div>
  )
}