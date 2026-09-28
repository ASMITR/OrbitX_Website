'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Trash2, Bot, User, Sparkles, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const WELCOME = 'Hi! I\'m OrbitX AI. Ask me anything about our space science club, teams, events, or space in general 🚀'
const MAX_LEN = 500

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMounted(true)
    setMessages([{ id: '1', text: WELCOME, isUser: false, timestamp: new Date() }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  if (!isMounted) return null

  const clearChat = () => setMessages([{ id: '1', text: WELCOME, isUser: false, timestamp: new Date() }])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    if (trimmed.length > MAX_LEN) { setError(`Max ${MAX_LEN} characters`); return }
    setError(null)

    const userMsg: Message = { id: Date.now().toString(), text: trimmed, isUser: true, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, conversationHistory: messages.slice(-6) }),
        signal: controller.signal
      })
      clearTimeout(timeout)
      const data = await res.json()
      const text = res.ok
        ? (data.response || 'Sorry, I couldn\'t generate a response.')
        : (data.error || 'Something went wrong.')
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text, isUser: false, timestamp: new Date() }])
    } catch (err: any) {
      const text = err.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : 'Connection error. Please check your internet.'
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text, isUser: false, timestamp: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <motion.button
          onClick={() => setIsOpen(o => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 flex items-center justify-center overflow-hidden"
        >
          {/* pulse ring */}
          {!isOpen && (
            <motion.span
              className="absolute inset-0 rounded-2xl border-2 border-cyan-400/50"
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          )}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <MessageCircle className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9997]"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed bottom-24 right-6 z-[9998] w-[340px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
              style={{ background: '#0c0c14', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/6 flex-shrink-0">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#0c0c14]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-tight">OrbitX AI</p>
                  <p className="text-green-400 text-[11px]">Online · Space Assistant</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearChat}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Clear chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/8 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-end gap-2 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!msg.isUser && (
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 mb-0.5">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.isUser
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm'
                        : 'bg-white/6 text-gray-200 border border-white/8 rounded-bl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-[10px] mt-1.5 ${msg.isUser ? 'text-cyan-200/70 text-right' : 'text-gray-500'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.isUser && (
                      <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mb-0.5">
                        <User className="w-3 h-3 text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-white/6 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 bg-cyan-400 rounded-full block"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/6 flex-shrink-0">
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs mb-2 px-1"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => { setInput(e.target.value); if (error) setError(null) }}
                    onKeyDown={handleKey}
                    placeholder="Ask me anything..."
                    maxLength={MAX_LEN}
                    disabled={isLoading}
                    className="flex-1 bg-white/5 border border-white/10 text-gray-100 text-sm px-4 py-2.5 rounded-xl placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-all disabled:opacity-50"
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-opacity"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-600" /> Powered by Gemini AI
                  </span>
                  <span className={`text-[10px] ${input.length > MAX_LEN * 0.9 ? 'text-red-400' : 'text-gray-600'}`}>
                    {input.length}/{MAX_LEN}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
