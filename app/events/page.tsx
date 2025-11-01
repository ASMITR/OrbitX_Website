'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react'
import CloudinaryImage from '@/components/CloudinaryImage'
import LikeComment from '@/components/LikeComment'
import { Event } from '@/lib/types'
import { getCache, setCache } from '@/lib/cache'
import { getEvents } from '@/lib/db'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

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
    }
  ]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const cacheKey = 'events_page_data'
        let eventsData = getCache(cacheKey)
        
        if (!eventsData) {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)
          
          try {
            eventsData = await getEvents()
            clearTimeout(timeoutId)
            setCache(cacheKey, eventsData, 300000)
          } catch (error) {
            clearTimeout(timeoutId)
            console.error('Error fetching events:', error)
            eventsData = sampleEvents
          }
        }
        
        setEvents(eventsData)
        setFilteredEvents(eventsData)
      } catch (error) {
        console.error('Error fetching events:', error)
        setEvents(sampleEvents)
        setFilteredEvents(sampleEvents)
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
    <div className="pt-16 sm:pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Events & Workshops
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Join our exciting events, workshops, and seminars to learn about space technology 
            and connect with fellow space enthusiasts.
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors text-sm"
              />
            </div>
            <div className="relative sm:w-40">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 transition-colors appearance-none text-sm"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {displayEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group hover:bg-white/10 transition-all duration-300 flex flex-col"
            >
              {/* Event Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden flex-shrink-0">
                {event.images && event.images.length > 0 ? (
                  <Image 
                    src={event.images[0]} 
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center ${event.images && event.images.length > 0 ? 'hidden' : ''}`}>
                  <div className="text-4xl opacity-20">🎯</div>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                    isUpcoming(event.date)
                      ? 'bg-green-500/30 text-green-200 border border-green-400/50'
                      : 'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                  }`}>
                    {isUpcoming(event.date) ? 'Upcoming' : 'Past Event'}
                  </span>
                </div>

                {/* Date Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-center border border-white/20">
                  <div className="text-white text-sm font-bold">
                    {new Date(event.date).getDate()}
                  </div>
                  <div className="text-gray-300 text-xs">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-sm text-gray-300 mb-4 line-clamp-2 leading-relaxed flex-1">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                    <span className="truncate">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-2 text-purple-400 flex-shrink-0" />
                    <span>
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Users className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                    <span className="truncate">{event.organizer}</span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto space-y-3">
                  {/* Action Button */}
                  <Link
                    href={`/events/${event.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors font-semibold text-sm border border-blue-500/30"
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
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && searchTerm && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-400 text-base sm:text-lg">
              No events found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}