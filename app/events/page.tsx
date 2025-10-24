'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react'
import CloudinaryImage from '@/components/CloudinaryImage'
import LikeComment from '@/components/LikeComment'
import { Event } from '@/lib/types'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const eventsData = await response.json()
          setEvents(eventsData)
          setFilteredEvents(eventsData)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    let filtered = events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (filterType !== 'all') {
      const now = new Date()
      if (filterType === 'upcoming') {
        filtered = filtered.filter(event => new Date(event.date) >= now)
      } else if (filterType === 'past') {
        filtered = filtered.filter(event => new Date(event.date) < now)
      }
    }

    setFilteredEvents(filtered)
  }, [searchTerm, filterType, events])

  // Sample events for demonstration
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'Space Technology Workshop',
      date: '2024-04-15T10:00:00',
      description: 'Join us for an intensive workshop on satellite technology, covering design principles, communication systems, and mission planning. Perfect for beginners and intermediate learners.',
      images: ['https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop'],
      organizer: 'OrbitX Education Team',
      createdAt: '2024-03-01'
    },
    {
      id: '2',
      title: 'CubeSat Launch Viewing Party',
      date: '2024-05-20T06:30:00',
      description: 'Celebrate the launch of our CubeSat-1 mission! Join us for a live viewing party with refreshments, technical presentations, and Q&A with the development team.',
      images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop'],
      organizer: 'Satellite Development Team',
      createdAt: '2024-03-15'
    },
    {
      id: '3',
      title: 'Rocket Propulsion Seminar',
      date: '2024-03-10T14:00:00',
      description: 'Deep dive into rocket propulsion systems with industry experts. Learn about different types of engines, fuel systems, and the future of space propulsion.',
      images: ['https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&h=400&fit=crop'],
      organizer: 'Propulsion Systems Team',
      createdAt: '2024-02-20'
    },
    {
      id: '4',
      title: 'Annual Space Expo 2024',
      date: '2024-06-10T09:00:00',
      description: 'Our biggest event of the year! Showcase of all team projects, guest speakers from ISRO, interactive demonstrations, and networking opportunities.',
      images: ['https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&h=400&fit=crop'],
      organizer: 'OrbitX Executive Committee',
      createdAt: '2024-04-01'
    },
    {
      id: '5',
      title: 'Arduino for Space Applications',
      date: '2024-02-25T15:30:00',
      description: 'Hands-on workshop teaching Arduino programming specifically for space applications. Build your own satellite communication module.',
      images: ['https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=600&h=400&fit=crop'],
      organizer: 'Electronics & Hardware Team',
      createdAt: '2024-02-01'
    },
    {
      id: '6',
      title: 'Mission Control Simulation',
      date: '2024-07-05T11:00:00',
      description: 'Experience what it\'s like to be in mission control! Participate in a realistic satellite mission simulation with real-time problem solving.',
      images: ['https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop'],
      organizer: 'Software Development Team',
      createdAt: '2024-05-01'
    }
  ]

  const displayEvents = filteredEvents.length > 0 ? filteredEvents : sampleEvents

  const isUpcoming = (date: string) => new Date(date) >= new Date()

  if (loading) {
    return (
      <div className="pt-20 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Events & Workshops
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join our exciting events, workshops, and seminars to learn about space technology 
            and connect with fellow space enthusiasts.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card overflow-hidden group"
            >
              {/* Event Image */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                {event.images && event.images.length > 0 ? (
                  <Image 
                    src={event.images[0]} 
                    alt={event.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-contain bg-gray-900/50"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center ${event.images && event.images.length > 0 ? 'hidden' : ''}`}>
                  <div className="text-6xl opacity-20">🎯</div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isUpcoming(event.date)
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {isUpcoming(event.date) ? 'Upcoming' : 'Past Event'}
                  </span>
                </div>

                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-black/50 rounded-lg p-2 text-center">
                  <div className="text-white text-sm font-bold">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="text-gray-300 text-xs">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.organizer}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-semibold mb-4"
                >
                  Learn More
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* Like and Comment */}
                <LikeComment
                  collection="events"
                  id={event.id}
                  likes={event.likes || 0}
                  likedBy={event.likedBy || []}
                  comments={event.comments || []}
                  onUpdate={(likes, likedBy, comments) => {
                    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, likes, likedBy, comments } : e))
                    setFilteredEvents(prev => prev.map(e => e.id === event.id ? { ...e, likes, likedBy, comments } : e))
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">
              No events found matching "{searchTerm}"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}