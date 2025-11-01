'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, Eye, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { getEvents, deleteEvent } from '@/lib/db'
import { Event } from '@/lib/types'
import toast from 'react-hot-toast'

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id)
        setEvents(events.filter(event => event.id !== id))
        toast.success('Event deleted successfully')
      } catch (error) {
        toast.error('Failed to delete event')
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Events Management">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Events Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Events</h2>
            <p className="text-gray-400">Manage your events and workshops</p>
          </div>
          <Link href="/admin/events/new" className="btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Event
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card-admin p-4 sm:p-6 hover:border-blue-400/50 transition-all duration-300 group"
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {event.title}
                  </h3>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    new Date(event.date) > new Date()
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past Event'}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-300 text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-blue-400 flex-shrink-0" />
                  <span className="truncate">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Users className="h-4 w-4 mr-2 text-purple-400 flex-shrink-0" />
                  <span className="truncate">{event.organizer}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {event.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <motion.button 
                    onClick={() => window.open(`/events/${event.id}`, '_blank')}
                    className="p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  <motion.button 
                    onClick={() => router.push(`/admin/events/${event.id}`)}
                    className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button 
                    onClick={() => handleDelete(event.id)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(event.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
            <p className="text-gray-400">Create your first event to get started.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}