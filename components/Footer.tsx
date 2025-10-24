'use client'

import Link from 'next/link'
import { Rocket, Instagram, Linkedin, Youtube, Mail, MapPin } from 'lucide-react'

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
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'YouTube', href: '#', icon: Youtube }
  ]

  return (
    <footer className="relative bg-gray-900/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Rocket className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                OrbitX
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Exploring beyond horizons through innovation, collaboration, and space technology. 
              Join us in our mission to reach for the stars.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="h-5 w-5" />
              <span>ZCOER, Pune, Maharashtra</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200 group"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                </a>
              ))}
            </div>
            <div className="mt-4 flex items-center space-x-2 text-gray-400">
              <Mail className="h-5 w-5" />
              <span>orbitx@zcoer.edu.in</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 OrbitX | Developed by OrbitX Tech Team
          </p>
        </div>
      </div>
    </footer>
  )
}