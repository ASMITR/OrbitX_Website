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
  Package
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminPhoto, setAdminPhoto] = useState('')
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          // Try to fetch member data first
          const { getMember, getMemberByEmail } = await import('@/lib/db')
          let member = await getMember(user.uid)
          if (!member) {
            member = await getMemberByEmail(user.email!)
          }
          
          if (member) {
            setAdminName(member.name || user?.displayName || user?.email?.split('@')[0] || '')
            setAdminPhoto(member.photo || '')
          } else {
            // Fallback to admin profile
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
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <SpaceBackground />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 glass-card border-r border-slate-600/30 transition-all duration-300 ease-in-out flex flex-col overflow-hidden ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <img 
                  src="/Logo_without_background.png" 
                  alt="OrbitX Logo" 
                  className="h-8 w-auto group-hover:drop-shadow-lg transition-all duration-300"
                />
              </motion.div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                    OrbitX
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    Admin Panel
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto scrollbar-hide">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? item.name : ''}
              >
                <item.icon className="h-5 w-5 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* User info and logout */}
          <div className="p-3 border-t border-white/10">
            {sidebarCollapsed ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center w-full p-2 text-gray-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors mb-3"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="mr-3"
                  >
                    <motion.img 
                      src={adminPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName || user?.displayName || user?.email?.split('@')[0] || 'Admin')}&background=6366f1&color=ffffff&size=40&rounded=true`}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {adminName || user?.displayName || user?.email?.split('@')[0] || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors mb-3"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </>
            )}
            
            <motion.button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center justify-center w-full p-3 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg transition-all duration-300 group relative overflow-hidden"
              title={sidebarCollapsed ? 'Expand Menu' : 'Collapse Menu'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <motion.div
                animate={{ rotate: sidebarCollapsed ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ChevronRight className="h-5 w-5 relative z-10" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </aside>



      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Top bar */}
        <header className="glass-card border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 relative z-10 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded mr-3 sm:mr-4 transition-colors ${
                  sidebarCollapsed ? 'block' : 'lg:hidden'
                }`}
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
              >
                <span className="hidden sm:inline">View Site</span>
                <span className="sm:hidden">Site</span>
              </Link>
              
              {/* Profile in top navbar */}
              <div className="flex items-center space-x-2 ml-2">
                <motion.img 
                  src={adminPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName || user?.displayName || user?.email?.split('@')[0] || 'Admin')}&background=6366f1&color=ffffff&size=32&rounded=true`}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white truncate">
                    {adminName || user?.displayName || user?.email?.split('@')[0] || 'Admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 relative z-10 overflow-auto">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}