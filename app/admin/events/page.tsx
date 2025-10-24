'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, Eye } from 'lucide-react'
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

        {/* Events Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Organizer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {events.map((event) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-white font-medium">{event.title}</div>
                        <div className="text-gray-400 text-sm truncate max-w-xs">
                          {event.description.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {new Date(event.date).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{event.organizer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(event.date) > new Date()
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 relative z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`/events/${event.id}`, '_blank')
                          }}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                          type="button"
                        >
                          <Eye className="h-4 w-4 pointer-events-none" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/admin/events/${event.id}`)
                          }}
                          className="p-2 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer"
                          type="button"
                        >
                          <Edit className="h-4 w-4 pointer-events-none" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(event.id)
                          }}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4 pointer-events-none" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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