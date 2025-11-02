'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signOut } from 'firebase/auth'
import { 
  LayoutDashboard, 
  Calendar, 
  FolderOpen, 
  Users, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  ChevronRight,
  Package,
  ShoppingCart
} from 'lucide-react'
import { auth } from '@/lib/firebase'
import { useAuth } from './AuthProvider'
import { getAdminProfile } from '@/lib/db'
import toast from 'react-hot-toast'
import SpaceBackground from '@/components/SpaceBackground'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminPhoto, setAdminPhoto] = useState('')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { getMember, getMemberByEmail } = await import('@/lib/db')
          let member = await getMember(user.uid)
          if (!member) {
            member = await getMemberByEmail(user.email!)
          }
          
          if (member) {
            setAdminName(member.name || user?.displayName || user?.email?.split('@')[0] || '')
            setAdminPhoto(member.photo || '')
          } else {
            const profile = await getAdminProfile(user.uid)
            if (profile) {
              setAdminName(profile.name || user?.displayName || user?.email?.split('@')[0] || '')
              setAdminPhoto(profile.photo || '')
            } else {
              setAdminName(user?.displayName || user?.email?.split('@')[0] || '')
              setAdminPhoto('')
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setAdminName(user?.displayName || user?.email?.split('@')[0] || '')
          setAdminPhoto('')
        }
      }
    }
    fetchUserProfile()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!user) {
    router.push('/admin')
    return null
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      router.push('/admin')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
    { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
    { name: 'Merchandise', href: '/admin/merchandise', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <SpaceBackground />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1">
        <header className="mt-20 mb-8 relative z-10">
          <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl mx-4">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 px-2 sm:px-3 py-1.5 sm:py-2 min-w-max">
                {navigation.map((item, index) => {
                  const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
                  const colors = [
                    'from-blue-500 to-cyan-500',
                    'from-green-500 to-emerald-500', 
                    'from-purple-500 to-pink-500',
                    'from-orange-500 to-red-500',
                    'from-indigo-500 to-blue-500',
                    'from-teal-500 to-green-500',
                    'from-rose-500 to-pink-500',
                    'from-amber-500 to-orange-500'
                  ]
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 30, rotateX: -90 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.08, y: -8, rotateZ: 2, rotateY: 8 }}
                      whileTap={{ scale: 0.95, rotateZ: -2 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex flex-col items-center space-y-0.5 sm:space-y-1 px-1.5 sm:px-2 md:px-2.5 py-1 sm:py-1.5 md:py-2 rounded-lg font-bold transition-all duration-200 group relative overflow-hidden transform-gpu ${
                          isActive 
                            ? `bg-gradient-to-br ${colors[index % colors.length]} text-white shadow-2xl` 
                            : 'text-gray-300 hover:text-white hover:shadow-xl'
                        }`}
                      >
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${colors[index % colors.length]} opacity-0 group-hover:opacity-100 rounded-2xl`}
                          initial={false}
                          whileHover={{ 
                            opacity: isActive ? 1 : 0.85,
                            scale: 1.02,
                            rotate: [0, 1, -1, 0],
                            transition: { duration: 0.3, ease: "easeInOut" }
                          }}
                        />
                        
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl"
                          animate={{ 
                            x: ['-150%', '150%'],
                            rotate: [0, 180, 360]
                          }}
                          transition={{ 
                            x: { duration: 1.2, ease: "easeInOut", repeat: Infinity },
                            rotate: { duration: 2, ease: "linear", repeat: Infinity }
                          }}
                        />
                        
                        <motion.div
                          className="relative z-10"
                          whileHover={{ 
                            rotate: [0, -10, 10, -5, 5, 0],
                            scale: [1, 1.2, 1.1],
                            y: [-2, 2, -1, 1, 0]
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4.5 md:w-4.5" />
                        </motion.div>
                        
                        <motion.span 
                          className="text-xs sm:text-xs md:text-sm relative z-10 whitespace-nowrap font-medium"
                          whileHover={{ 
                            scale: 1.1,
                            y: -1,
                            textShadow: "0 0 8px rgba(255,255,255,0.8)"
                          }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {item.name}
                        </motion.span>
                        
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-white/60"
                            animate={{ 
                              scale: [1, 1.08, 1.02, 1],
                              opacity: [0.6, 1, 0.8, 0.6],
                              rotate: [0, 2, -2, 0]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                        
                        <motion.div
                          className={`absolute -inset-2 bg-gradient-to-br ${colors[index % colors.length]} opacity-0 group-hover:opacity-40 rounded-2xl blur-md`}
                          whileHover={{ 
                            opacity: 0.6, 
                            scale: 1.15,
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 relative z-10 overflow-auto">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}