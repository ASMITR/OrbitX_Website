'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Trash2, Mail, Eye, Reply, X, Send } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { getContactMessages, deleteContactMessage } from '@/lib/db'
import { ContactMessage } from '@/lib/types'
import toast from 'react-hot-toast'

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const messagesData = await getContactMessages()
      setMessages(messagesData)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteContactMessage(id)
        setMessages(messages.filter(message => message.id !== id))
        if (selectedMessage?.id === id) {
          setSelectedMessage(null)
        }
        toast.success('Message deleted successfully')
      } catch (error) {
        toast.error('Failed to delete message')
      }
    }
  }

  const handleReply = (message: ContactMessage) => {
    const emailText = `Email: ${message.email}`
    const textArea = document.createElement('textarea')
    textArea.value = message.email
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    toast.success(`Copied: ${message.email}`)
  }



  if (loading) {
    return (
      <AdminLayout title="Messages">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
            <p className="text-gray-400">Manage contact form submissions and join requests</p>
          </div>
          <div className="text-sm text-gray-400">
            {messages.length} total messages
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4 max-h-[600px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Messages</h3>
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium truncate">{message.name}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate">{message.email}</p>
                    <p className="text-gray-400 text-sm truncate mt-1">
                      {message.message.substring(0, 50)}...
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedMessage.name}</h3>
                    <p className="text-gray-300 mb-1">{selectedMessage.email}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReply(selectedMessage)}
                      className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Reply via email"
                    >
                      <Reply className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-3">Message:</h4>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                  <h4 className="text-blue-300 font-medium mb-2">Reply Instructions:</h4>
                  <p className="text-gray-300 text-sm mb-2">1. Click "Copy Email" to copy the sender's email address</p>
                  <p className="text-gray-300 text-sm mb-2">2. Open your email client (Gmail, Outlook, etc.)</p>
                  <p className="text-gray-300 text-sm">3. Paste the email address and compose your reply</p>
                  <div className="mt-3 p-2 bg-white/5 rounded border border-gray-600">
                    <span className="text-xs text-gray-400">Email: </span>
                    <span className="text-white font-mono text-sm">{selectedMessage.email}</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => handleReply(selectedMessage)}
                    className="btn-primary flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Copy Email
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-12 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Select a message</h3>
                <p className="text-gray-400">Choose a message from the list to view details</p>
              </div>
            )}
          </div>
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No messages found</h3>
            <p className="text-gray-400">Contact form submissions will appear here.</p>
          </div>
        )}


      </div>
    </AdminLayout>
  )
}