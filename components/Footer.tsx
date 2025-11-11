'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Rocket, Instagram, Linkedin, Youtube, Mail, MapPin, Star, Sparkles, Globe, Zap } from 'lucide-react'

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Teams', href: '/teams' },
    { name: 'Projects', href: '/projects' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' }
  ]

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/orbitx_zcoer', icon: Instagram, color: 'hover:text-pink-400' },
    { name: 'LinkedIn', href: '#', icon: Linkedin, color: 'hover:text-blue-400' },
    { name: 'YouTube', href: '#', icon: Youtube, color: 'hover:text-red-400' }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-gray-900/60 via-slate-900/70 to-black/80 border-t border-white/20 mt-20 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-cyan-400/30 rounded-full`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Enhanced Logo and Description */}
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="relative"
              >
                <Rocket className="h-10 w-10 text-blue-400 drop-shadow-lg" />
                <motion.div
                  className="absolute inset-0 w-10 h-10 bg-blue-400/20 rounded-full blur-md"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <motion.span 
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 100%' }}
              >
                OrbitX
              </motion.span>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Exploring beyond horizons through innovation, collaboration, and space technology. 
              Join us in our mission to reach for the stars and unlock the mysteries of the cosmos.
            </motion.p>
            
            <motion.div 
              className="flex items-center space-x-3 text-gray-300 group cursor-pointer"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
              </motion.div>
              <span className="group-hover:text-white transition-colors">ZCOER, Pune, Maharashtra</span>
            </motion.div>
          </motion.div>

          {/* Enhanced Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-xl font-bold mb-6 text-white flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-5 w-5 text-yellow-400" />
              Quick Links
            </motion.h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ x: 5, scale: 1.05 }}
                >
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-300 transition-all duration-300 flex items-center group relative"
                  >
                    <motion.span
                      className="w-2 h-2 bg-cyan-400/50 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Enhanced Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.h3 
              className="text-xl font-bold mb-6 text-white flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Globe className="h-5 w-5 text-green-400" />
              Connect With Us
            </motion.h3>
            
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 transition-all duration-300 group border border-white/10 hover:border-white/30 ${social.color}`}
                  aria-label={social.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-6 w-6 text-gray-400 group-hover:text-current transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
            
            <motion.div 
              className="flex items-center space-x-3 text-gray-300 group cursor-pointer"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Mail className="h-6 w-6 text-blue-400 group-hover:text-blue-300" />
              </motion.div>
              <span className="group-hover:text-white transition-colors">orbitx@zcoer.edu.in</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Footer Bottom */}
        <motion.div 
          className="border-t border-white/20 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p 
              className="text-gray-400 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              © 2025 OrbitX | Developed with ❤️ by OrbitX Tech Team
            </motion.p>
            
            <motion.div 
              className="flex items-center gap-2 text-gray-400"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="h-4 w-4 text-cyan-400" />
              <span className="text-sm">Exploring Beyond Horizons</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}