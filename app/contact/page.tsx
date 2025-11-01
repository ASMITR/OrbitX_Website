'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Youtube } from 'lucide-react'
import { addContactMessage } from '@/lib/db'

interface ContactForm {
  name: string
  email: string
  message: string
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>()

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    try {
      await addContactMessage({
        ...data,
        createdAt: new Date().toISOString()
      })
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'orbitx@zcoer.edu.in',
      link: 'mailto:orbitx@zcoer.edu.in'
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+91 98765 43210',
      link: 'tel:+919876543210'
    },
    {
      icon: MapPin,
      title: 'Location',
      details: 'ZCOER, Pune, Maharashtra, India',
      link: 'https://maps.google.com'
    }
  ]

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: '#',
      color: 'hover:text-pink-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: '#',
      color: 'hover:text-blue-400'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: '#',
      color: 'hover:text-red-400'
    }
  ]

  return (
    <div className="pt-16 sm:pt-20 px-3 sm:px-4 lg:px-6 xl:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-0 leading-relaxed">
            Have questions about OrbitX? Want to join our team? We'd love to hear from you. 
            Reach out and let's explore the cosmos together!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl order-2 lg:order-1"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', { required: 'Message is required' })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none min-h-[120px] sm:min-h-[140px]"
                  placeholder="Tell us about your interest in OrbitX, questions, or how you'd like to get involved..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2">
            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Contact Information</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{info.title}</h3>
                      <a
                        href={info.link}
                        className="text-sm sm:text-base text-gray-300 hover:text-blue-400 transition-colors break-words"
                      >
                        {info.details}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Follow Us</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                Stay updated with our latest projects, events, and space exploration journey.
              </p>
              
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-200 group ${social.color} hover:scale-110`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-current" />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Visit Us</h2>
              <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center text-gray-300 p-4">
                  <MapPin className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm sm:text-base font-medium">Interactive Map</p>
                  <p className="text-xs sm:text-sm opacity-75">ZCOER Campus Location</p>
                </div>
              </div>
            </motion.div>

            {/* Join Us */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-card p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl sm:rounded-2xl"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Join OrbitX</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                Interested in becoming part of our space exploration journey? We're always 
                looking for passionate individuals to join our teams.
              </p>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center text-sm sm:text-base text-gray-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Open to all ZCOER students</span>
                </div>
                <div className="flex items-center text-sm sm:text-base text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>No prior experience required</span>
                </div>
                <div className="flex items-center text-sm sm:text-base text-gray-300">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3 flex-shrink-0"></div>
                  <span>Learn by doing real projects</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom Spacing */}
        <div className="h-8 sm:h-12 lg:h-16"></div>
      </div>
    </div>
  )
}