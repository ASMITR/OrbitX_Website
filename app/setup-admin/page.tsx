'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { initializeOwner } from '@/lib/roles'
import { Crown, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import SpaceBackground from '@/components/SpaceBackground'

export default function SetupAdmin() {
  const [email, setEmail] = useState('asmitrajaramkar.orbitX@gmail.com')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    
    setIsLoading(true)

    try {
      // Try to sign in first
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        // Initialize owner role
        await initializeOwner(user.email!)
        
        toast.success('Admin setup successful!')
        router.push('/admin/dashboard')
      } catch (signInError: any) {
        // If sign in fails, try to create account
        if (signInError.code === 'auth/user-not-found') {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          const user = userCredential.user
          
          // Initialize owner role
          await initializeOwner(user.email!)
          
          toast.success('Admin account created and setup successful!')
          router.push('/admin/dashboard')
        } else {
          throw signInError
        }
      }
    } catch (error: any) {
      console.error('Setup error:', error)
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'Email already in use. Try signing in instead.'
        : error.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : error.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Setup failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      <SpaceBackground />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full space-y-6"
      >
        <div className="text-center">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">
            Admin Setup
          </h2>
          <p className="text-gray-400">
            Set up your OrbitX admin account
          </p>
        </div>

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <form onSubmit={handleSetup} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="admin@orbitx.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white font-semibold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  Setup Admin
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => router.push('/auth/login')}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}