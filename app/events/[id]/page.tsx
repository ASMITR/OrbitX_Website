'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, Users, Play } from 'lucide-react'
import { getEvent } from '@/lib/db'
import { Event } from '@/lib/types'

export default function EventDetail() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEvent(params.id as string)
        setEvent(eventData)
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  // Sample event data for demonstration
  const sampleEvent: Event = {
    id: '1',
    title: 'Space Technology Workshop',
    date: '2024-04-15T10:00:00',
    description: `Join us for an intensive workshop on satellite technology, covering design principles, communication systems, and mission planning. This comprehensive workshop is designed for students and professionals interested in space technology.

Workshop Agenda:
• Introduction to Satellite Systems (10:00 - 11:00 AM)
• Communication Systems and Protocols (11:15 AM - 12:15 PM)
• Hands-on CubeSat Assembly (1:15 - 3:00 PM)
• Mission Planning and Operations (3:15 - 4:15 PM)
• Q&A and Networking (4:15 - 5:00 PM)

What You'll Learn:
• Fundamentals of satellite design and architecture
• Communication protocols used in space missions
• Hands-on experience with CubeSat components
• Mission planning and operational considerations
• Current trends and future of space technology

Prerequisites:
• Basic understanding of electronics (helpful but not required)
• Interest in space technology and engineering
• Laptop for simulation exercises

What's Included:
• Workshop materials and handouts
• Lunch and refreshments
• Certificate of participation
• Access to OrbitX community resources

This workshop is perfect for engineering students, professionals looking to transition into the space industry, and anyone passionate about space exploration. Our experienced team members will guide you through practical exercises and real-world examples from our ongoing projects.`,
    images: ['https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&h=600&fit=crop'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    organizer: 'OrbitX Education Team',
    createdAt: '2024-03-01'
  }

  const displayEvent = event || sampleEvent

  if (loading) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!displayEvent) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
          <Link href="/events" className="btn-primary">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  const isUpcoming = new Date(displayEvent.date) >= new Date()

  return (
    <div className="pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/events"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Events
          </Link>
        </motion.div>

        {/* Event Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isUpcoming
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}>
              {isUpcoming ? 'Upcoming Event' : 'Past Event'}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {displayEvent.title}
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6 text-gray-300">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-blue-400" />
              <div>
                <div className="font-semibold">
                  {new Date(displayEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-3 text-purple-400" />
              <div>
                <div className="font-semibold">
                  {new Date(displayEvent.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3 text-green-400" />
              <div>
                <div className="font-semibold">{displayEvent.organizer}</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="glass-card p-4 mb-4">
                <div className="relative min-h-64 max-h-[80vh] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden group flex items-center justify-center">
                  {displayEvent.images && displayEvent.images[selectedImage] ? (
                    <img 
                      src={displayEvent.images[selectedImage]} 
                      alt={displayEvent.title}
                      className="max-w-full max-h-full object-contain bg-gray-900/50"
                      style={{ width: 'auto', height: 'auto' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl opacity-20">🎯</div>
                    </div>
                  )}
                  
                  {/* Image Navigation */}
                  {displayEvent.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : displayEvent.images.length - 1)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setSelectedImage(selectedImage < displayEvent.images.length - 1 ? selectedImage + 1 : 0)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      >
                        →
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImage + 1} / {displayEvent.images.length}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {displayEvent.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {displayEvent.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImage === index ? 'border-blue-400 ring-2 ring-blue-400/50' : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      {displayEvent.images[index] ? (
                        <img 
                          src={displayEvent.images[index]} 
                          alt={`${displayEvent.title} ${index + 1}`}
                          className="w-full h-full object-contain bg-gray-900/50"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <span className="text-lg opacity-50">🎯</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Lightbox Modal */}
              <div className="hidden">
                {/* This would be implemented for full-screen image viewing */}
              </div>
            </motion.div>

            {/* Video */}
            {displayEvent.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="glass-card p-6 mb-8"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Event Video
                </h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={displayEvent.videoUrl}
                    title="Event Video"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glass-card p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Event Details</h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                {displayEvent.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Event Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">Date & Time</div>
                    <div className="text-gray-300 text-sm">
                      {new Date(displayEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {new Date(displayEvent.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">Location</div>
                    <div className="text-gray-300 text-sm">
                      ZCOER Campus<br />
                      Pune, Maharashtra
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">Organizer</div>
                    <div className="text-gray-300 text-sm">{displayEvent.organizer}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Registration */}
            {isUpcoming && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Registration</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Secure your spot at this exciting event. Registration is free for all students.
                </p>
                <Link
                  href="/contact"
                  className="btn-primary w-full text-center block"
                >
                  Register Now
                </Link>
              </motion.div>
            )}

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">Questions?</h3>
              <p className="text-gray-300 mb-4 text-sm">
                Have questions about this event? Get in touch with our team.
              </p>
              <Link
                href="/contact"
                className="btn-secondary w-full text-center block"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}