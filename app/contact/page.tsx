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
            Join OrbitX
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-0 leading-relaxed">
            Ready to explore beyond horizons? Apply to join our team and be part of the space revolution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 items-start">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl order-2 lg:order-1"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Application Form</h2>
            
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
                  Email *
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
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="team" className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Team *
                </label>
                <select
                  id="team"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm sm:text-base text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="" className="bg-black text-white">Select a team</option>
                  <option value="design" className="bg-black text-white">Design & Innovation Team</option>
                  <option value="technical" className="bg-black text-white">Technical Team</option>
                  <option value="management" className="bg-black text-white">Management & Operations Team</option>
                  <option value="outreach" className="bg-black text-white">Public Outreach Team</option>
                  <option value="documentation" className="bg-black text-white">Documentation Team</option>
                  <option value="social" className="bg-black text-white">Social Media & Editing Team</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Why do you want to join OrbitX?
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', { required: 'Message is required' })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors resize-none min-h-[120px] sm:min-h-[140px]"
                  placeholder="Tell us about your interest in space technology and what you hope to contribute..."
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
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </motion.div>



          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2">
            {/* Enhanced Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-6 sm:p-8 lg:p-10 rounded-2xl border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Get In Touch</h2>
              
              <div className="space-y-6 sm:space-y-8">
                {contactInfo.map((info, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group p-4 sm:p-6 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4 sm:mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <info.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{info.title}</h3>
                        <a
                          href={info.link}
                          className="text-base sm:text-lg text-gray-300 hover:text-blue-400 transition-colors break-words font-medium"
                        >
                          {info.details}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-6 sm:p-8 lg:p-10 rounded-2xl border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Connect With Us</h2>
              <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed text-center">
                Join our community and stay updated with the latest space exploration adventures, cutting-edge projects, and exciting events.
              </p>
              
              <div className="flex justify-center space-x-4 sm:space-x-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                    className={`group relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10 transition-all duration-300 ${social.color} hover:scale-110 hover:rotate-6 border border-white/10 hover:border-white/30`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 group-hover:text-current transition-colors duration-300" />
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-medium text-gray-300 whitespace-nowrap">{social.name}</span>
                    </div>
                  </motion.a>
                ))}
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