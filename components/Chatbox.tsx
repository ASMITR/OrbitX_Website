'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, Search, Sparkles, Rocket, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you search for information. Just type your question!',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const MAX_MESSAGE_LENGTH = 500
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isMounted])

  if (!isMounted) {
    return null
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I can help you search for information. Just type your question!',
        isUser: false,
        timestamp: new Date()
      }
    ])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getAnswer = async (query: string): Promise<string> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query.trim() }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      const data = await response.json()
      return data.response || 'I apologize, but I couldn\'t generate a proper response. Please try asking differently.'
      
    } catch (error: any) {
      console.error('Chat API error:', error)
      
      if (error.name === 'AbortError') {
        return 'Request timed out. Please try with a shorter question.'
      }
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
        return 'Connection issue. Please check your internet and try again.'
      }
      
      return error.message || 'Something went wrong. Please try again or contact us at orbitx@zcoer.edu.in'
    }
  }

  const handleSend = async () => {
    const trimmedInput = inputText.trim()
    if (!trimmedInput) return
    
    if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
      setError(`Message too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`)
      return
    }
    
    setError(null)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmedInput,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const answer = await getAnswer(trimmedInput)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answer,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Send message error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m having trouble right now. Please try again in a moment.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 ring-2 ring-cyan-400/30 hover:ring-cyan-400/60 relative overflow-hidden"
        style={{ position: 'fixed', bottom: '24px', right: '24px' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(6, 182, 212, 0.3)',
            '0 0 40px rgba(6, 182, 212, 0.6)',
            '0 0 20px rgba(6, 182, 212, 0.3)'
          ]
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
          scale: { type: 'spring', stiffness: 400, damping: 17 }
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${30 + i * 15}%`
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </motion.div>
      </motion.button>

      {/* Enhanced Chatbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-[9998] w-80 h-[28rem] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] glass-card border border-slate-600/40 rounded-xl shadow-2xl flex flex-col backdrop-blur-xl"
            style={{ position: 'fixed', bottom: '96px', right: '24px' }}
          >
          {/* Enhanced Header */}
          <motion.div 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-3 rounded-t-xl flex items-center gap-2 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Header particles */}
            <div className="absolute inset-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white/40 rounded-full"
                  style={{
                    left: `${10 + i * 20}%`,
                    top: `${20 + (i % 2) * 40}%`
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                />
              ))}
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles size={16} className="text-yellow-300" />
            </motion.div>
            <h3 className="font-semibold text-sm relative z-10 flex-1">OrbitX AI Assistant</h3>
            <motion.button
              onClick={clearChat}
              className="p-1 hover:bg-white/20 rounded transition-colors relative z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Clear Chat"
            >
              <Trash2 size={14} className="text-gray-300 hover:text-white" />
            </motion.button>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Rocket size={14} className="text-orange-300" />
            </motion.div>
          </motion.div>

          {/* Enhanced Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide bg-gradient-to-b from-slate-800/20 to-slate-900/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-xs shadow-lg ${
                    message.isUser
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-400/30'
                      : 'bg-slate-800/60 text-gray-100 backdrop-blur-sm border border-slate-600/40'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <motion.div 
                  className="bg-slate-800/60 text-gray-100 p-3 rounded-lg backdrop-blur-sm border border-slate-600/40"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span className="text-xs font-medium">AI thinking...</span>
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Sparkles size={12} className="text-cyan-400" />
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input */}
          <div className="p-3 border-t border-slate-600/30 bg-slate-800/20">
            {error && (
              <div className="mb-2 p-2 bg-red-500/20 border border-red-500/40 rounded text-xs text-red-300">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              <motion.input
                type="text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  if (error) setError(null)
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ask about space, OrbitX, or anything..."
                className="flex-1 bg-slate-800/60 text-gray-100 p-3 rounded-lg border border-slate-600/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-xs placeholder-gray-400 backdrop-blur-sm transition-all duration-200"
                disabled={isLoading}
                maxLength={MAX_MESSAGE_LENGTH}
                whileFocus={{ scale: 1.02 }}
              />
              <motion.button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim() || inputText.trim().length > MAX_MESSAGE_LENGTH}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-lg transition-all duration-200 shadow-lg relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
                >
                  <Send size={14} />
                </motion.div>
                {!isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-lg"
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-right">
              {inputText.length}/{MAX_MESSAGE_LENGTH}
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}