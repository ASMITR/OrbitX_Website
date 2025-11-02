'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserRoleFromDB } from '@/lib/roles'
import { useAuth } from '@/components/admin/AuthProvider'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Auth() {
  const { user, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!loading && user) {
        const role = await getUserRoleFromDB(user)
        const redirectPath = (role === 'owner' || role === 'admin') ? '/admin/dashboard' : '/member'
        router.push(redirectPath)
      }
    }
    checkAndRedirect()
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let user
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, formData.email, formData.password)
        user = result.user
        toast.success('Login successful!')
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          return
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          return
        }
        const result = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        user = result.user
        toast.success('Account created successfully!')
      }
      
      const role = await getUserRoleFromDB(user)
      const redirectPath = (role === 'owner' || role === 'admin') ? '/admin/dashboard' : '/member'
      router.push(redirectPath)
    } catch (error: any) {
      toast.error(error.message || `${isLogin ? 'Login' : 'Signup'} failed`)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: '', email: '', password: '', confirmPassword: '' })
    setShowPassword(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_50%)] animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}} />
      
      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}

      <div className="relative max-w-md w-full space-y-6 z-10">
        <div className="text-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse" />
              <div className="text-3xl font-bold text-white relative z-10">🚀</div>
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse" />
            </div>
            {/* Orbital rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border border-cyan-400/30 rounded-full animate-spin" style={{animationDuration: '8s'}} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 border border-purple-400/20 rounded-full animate-spin" style={{animationDuration: '12s', animationDirection: 'reverse'}} />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-3 relative">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
              {isLogin ? 'Welcome Back' : 'Join OrbitX'}
            </span>
          </h2>
          <p className="text-gray-300 text-lg">
            {isLogin ? 'Sign in to explore the cosmos' : 'Begin your space exploration journey'}
          </p>
        </div>

        <div className="relative">
          <div className="flex bg-white/5 backdrop-blur-md rounded-xl p-1.5 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
            <button
              onClick={() => !isLogin && toggleMode()}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${
                isLogin 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => isLogin && toggleMode()}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 relative z-10 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-transparent to-purple-500/20 animate-pulse" />
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-200 backdrop-blur-sm"
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-200 backdrop-blur-sm"
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-200 backdrop-blur-sm"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white font-semibold py-4 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 animate-pulse" />
              <span className="relative z-10 flex items-center">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    {isLogin ? 'Launch Mission' : 'Join the Crew'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline"
            >
              {isLogin ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Secure Authentication</span>
          </div>
        </div>
      </div>
    </div>
  )
}