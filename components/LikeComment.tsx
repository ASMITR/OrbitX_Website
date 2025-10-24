'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { Comment } from '@/lib/types'
import { toggleLike, addComment } from '@/lib/db'
import toast from 'react-hot-toast'

interface Props {
  collection: 'events' | 'projects' | 'blogs'
  id: string
  likes: number
  likedBy: string[]
  comments: Comment[]
  onUpdate: (likes: number, likedBy: string[], comments: Comment[]) => void
}

export default function LikeComment({ collection, id, likes, likedBy, comments, onUpdate }: Props) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [author, setAuthor] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userId] = useState(() => localStorage.getItem('userId') || `user_${Date.now()}`)
  
  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId)
    }
  }, [userId])

  const handleLike = async () => {
    try {
      const result = await toggleLike(collection, id, userId)
      onUpdate(result.likes, result.likedBy, comments)
      toast.success(likedBy.includes(userId) ? 'Unliked!' : 'Liked!')
    } catch (error) {
      toast.error('Failed to update like')
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !newComment.trim()) return

    setIsSubmitting(true)
    try {
      const comment = await addComment(collection, id, { author: author.trim(), content: newComment.trim() })
      if (comment) {
        onUpdate(likes, likedBy, [...comments, comment])
        setNewComment('')
        toast.success('Comment added!')
      }
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-t border-white/10 pt-4">
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-colors ${
            likedBy.includes(userId) 
              ? 'text-red-400 hover:text-red-300' 
              : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`h-5 w-5 ${likedBy.includes(userId) ? 'fill-current' : ''}`} />
          <span>{likes || 0}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{comments?.length || 0}</span>
        </button>
      </div>

      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <form onSubmit={handleComment} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting || !author.trim() || !newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments?.map((comment) => (
              <div key={comment.id} className="bg-white/5 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{comment.author}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{comment.content}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}