'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, Sparkles, Rocket, Trash2, Bot, User, Zap, Stars } from 'lucide-react'
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
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const MAX_MESSAGE_LENGTH = 500
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    setMessages([
      {
        id: '1',
        text: 'Hello! I can help you search for information. Just type your question!',
        isUser: false,
        timestamp: new Date()
      }
    ])
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
    if (isMounted) {
      setMessages([
        {
          id: '1',
          text: 'Hello! I can help you search for information. Just type your question!',
          isUser: false,
          timestamp: new Date()
        }
      ])
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getAnswer = async (query: string): Promise<string> => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: query.trim(),
          conversationHistory: messages.slice(-6)
        }),
        signal: controller.signal
      })
      
      if (response.status === 404) {
        throw new Error('Chat service is currently unavailable. Please try again later.')
      }
      
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
        return '⏰ Request timed out. Please try with a shorter question or check your connection.'
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
      <motion.div
        className="fixed bottom-6 right-6 z-[9999]"
        style={{ position: 'fixed', bottom: '24px', right: '24px' }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            background: 'conic-gradient(from 0deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
            filter: 'blur(8px)'
          }}
        />
        
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl overflow-hidden"
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -3, 0],
            rotate: isOpen ? 0 : [0, 5, -5, 0]
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4, repeat: isOpen ? 0 : Infinity }
          }}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-50"
            animate={{
              background: [
                'linear-gradient(45deg, #06b6d4, #3b82f6)',
                'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                'linear-gradient(225deg, #8b5cf6, #06b6d4)',
                'linear-gradient(315deg, #06b6d4, #3b82f6)'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${15 + (i * 12)}%`,
                  top: `${20 + ((i % 3) * 20)}%`
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2 + (i * 0.2),
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
          
          {/* Icon with smooth transition */}
          <motion.div
            className="relative z-10"
            animate={{ 
              rotate: isOpen ? 180 : 0,
              scale: isOpen ? 0.9 : 1
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageCircle size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        </motion.button>
      </motion.div>

      {/* Enhanced Chatbox with Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Fast Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 bg-gradient-to-br from-black/60 via-cyan-900/20 to-blue-900/30 backdrop-blur-lg z-[9997]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Enhanced Chatbox */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 50, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 50, rotateX: 15 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.25, 0.46, 0.45, 0.94],
                staggerChildren: 0.1
              }}
              className="fixed bottom-24 right-6 z-[9998] w-80 h-[32rem] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-8rem)] rounded-3xl shadow-2xl flex flex-col backdrop-blur-2xl transform-gpu overflow-hidden"
              style={{ 
                position: 'fixed', 
                bottom: '96px', 
                right: '24px',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.85) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                animate={{
                  background: [
                    'conic-gradient(from 0deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
                    'conic-gradient(from 180deg, transparent, rgba(6, 182, 212, 0.3), transparent)',
                    'conic-gradient(from 360deg, transparent, rgba(6, 182, 212, 0.3), transparent)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ padding: '1px' }}
              >
                <div className="w-full h-full rounded-3xl bg-slate-900/50" />
              </motion.div>
              {/* Enhanced Header */}
              <motion.div 
                className="relative p-4 flex items-center gap-3 z-10"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {/* Header background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-sm" />
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
                
                {/* AI Avatar */}
                <motion.div
                  className="relative"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <Bot size={20} className="text-white" />
                    </motion.div>
                    {/* Avatar glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-cyan-300/50 to-blue-500/50 rounded-full"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  {/* Status indicator */}
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
                
                {/* Title */}
                <div className="flex-1 relative z-10">
                  <motion.h3 
                    className="font-bold text-white text-lg"
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{
                      background: 'linear-gradient(90deg, #ffffff, #06b6d4, #3b82f6, #ffffff)',
                      backgroundSize: '200% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    OrbitX AI
                  </motion.h3>
                  <motion.p 
                    className="text-xs text-cyan-300"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Space Explorer Assistant
                  </motion.p>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2 relative z-10">
                  <motion.button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    title="Clear Chat"
                  >
                    <Trash2 size={16} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                  </motion.button>
                  
                  <motion.div
                    animate={{ 
                      x: [0, 2, 0],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Rocket size={16} className="text-orange-400" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Messages */}
              <motion.div 
                className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(6, 182, 212, 0.3) transparent'
                }}
              >
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: 'easeOut'
                    }}
                    className={`flex items-end gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Avatar for bot messages */}
                    {!message.isUser && (
                      <motion.div
                        className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mb-1"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Bot size={14} className="text-white" />
                      </motion.div>
                    )}
                    
                    {/* Message bubble */}
                    <motion.div
                      className={`max-w-[75%] relative ${
                        message.isUser ? 'order-1' : 'order-2'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`p-3 rounded-2xl text-sm shadow-lg relative overflow-hidden ${
                          message.isUser
                            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white ml-auto'
                            : 'bg-slate-800/80 text-gray-100 backdrop-blur-sm border border-slate-600/40'
                        }`}
                        style={{
                          borderRadius: message.isUser 
                            ? '20px 20px 5px 20px' 
                            : '20px 20px 20px 5px'
                        }}
                      >
                        {/* Message background animation */}
                        {message.isUser && (
                          <motion.div
                            className="absolute inset-0 opacity-20"
                            animate={{
                              background: [
                                'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                                'linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent)'
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        
                        <p className="whitespace-pre-wrap leading-relaxed relative z-10">
                          {message.text}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2 relative z-10">
                          <span className="text-xs opacity-60">
                            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          
                          {!message.isUser && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            >
                              <Sparkles size={12} className="text-cyan-400" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Avatar for user messages */}
                    {message.isUser && (
                      <motion.div
                        className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        <User size={14} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
            
                {/* Enhanced loading indicator */}
                {isLoading && (
                  <motion.div 
                    className="flex items-end gap-2 justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {/* Bot avatar */}
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mb-1"
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                    >
                      <Bot size={14} className="text-white" />
                    </motion.div>
                    
                    {/* Typing indicator */}
                    <motion.div 
                      className="bg-slate-800/80 text-gray-100 p-4 rounded-2xl backdrop-blur-sm border border-slate-600/40 relative overflow-hidden"
                      style={{ borderRadius: '20px 20px 20px 5px' }}
                    >
                      {/* Background pulse */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      
                      <div className="flex items-center gap-3 relative z-10">
                        {/* Animated dots */}
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{
                                y: [0, -8, 0],
                                opacity: [0.4, 1, 0.4]
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                        
                        <span className="text-sm font-medium text-cyan-300">AI is thinking</span>
                        
                        <motion.div
                          animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                            scale: { duration: 1, repeat: Infinity }
                          }}
                        >
                          <Zap size={14} className="text-yellow-400" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
            
            <div ref={messagesEndRef} />
          </motion.div>

              {/* Enhanced Input Section */}
              <motion.div 
                className="p-4 relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                
                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="mb-3 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-sm text-red-300 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-red-500/10"
                        animate={{ opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="relative z-10">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Input container */}
                <div className="relative">
                  {/* Input field */}
                  <motion.div
                    className="relative"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value)
                        if (error) setError(null)
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about space, OrbitX, or anything cosmic..."
                      className="w-full bg-slate-800/60 text-gray-100 p-4 pr-16 rounded-2xl border border-slate-600/40 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 text-sm placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                      disabled={isLoading}
                      maxLength={MAX_MESSAGE_LENGTH}
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.6) 100%)'
                      }}
                    />
                    
                    {/* Send button */}
                    <motion.button
                      onClick={handleSend}
                      disabled={isLoading || !inputText.trim() || inputText.trim().length > MAX_MESSAGE_LENGTH}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl transition-all duration-200 shadow-lg relative overflow-hidden flex items-center justify-center"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button background animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-500/30"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      <motion.div
                        className="relative z-10"
                        animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
                      >
                        <Send size={16} />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                  
                  {/* Character counter */}
                  <motion.div 
                    className="flex justify-between items-center mt-2 text-xs relative z-10"
                    animate={{ opacity: inputText.length > 0 ? 1 : 0.5 }}
                  >
                    <span className="text-gray-500 flex items-center gap-1">
                      <Stars size={12} className="text-cyan-400" />
                      Powered by OrbitX AI
                    </span>
                    <span className={`transition-colors ${
                      inputText.length > MAX_MESSAGE_LENGTH * 0.8 
                        ? 'text-orange-400' 
                        : inputText.length > MAX_MESSAGE_LENGTH * 0.9 
                        ? 'text-red-400' 
                        : 'text-gray-500'
                    }`}>
                      {inputText.length}/{MAX_MESSAGE_LENGTH}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}