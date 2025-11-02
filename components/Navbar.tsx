'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, ChevronDown, User, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from './admin/AuthProvider'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserRoleFromDB } from '@/lib/roles'
import toast from 'react-hot-toast'
import { usePathname } from 'next/navigation'


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminPhoto, setAdminPhoto] = useState('')
  const [memberData, setMemberData] = useState<any>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member'>('member')
  const [scrolled, setScrolled] = useState(false)
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      setShowProfileMenu(false)
      window.location.href = '/'
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showProfileMenu && !target.closest('.profile-menu')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileMenu])

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const role = await getUserRoleFromDB(user)
        setUserRole(role)
      } else {
        setUserRole('member')
      }
    }
    checkUserRole()
  }, [user])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const role = await getUserRoleFromDB(user)
          
          if (role === 'owner') {
            // For owners, prioritize admin profile
            const adminResponse = await fetch(`/api/admin/profile/${user.uid}`)
            if (adminResponse.ok) {
              const profile = await adminResponse.json()
              setAdminName(profile?.name || user?.displayName || user?.email?.split('@')[0] || '')
              setAdminPhoto(profile?.photo || '')
            } else {
              setAdminName(user?.displayName || user?.email?.split('@')[0] || '')
              setAdminPhoto('')
            }
          } else {
            // For members and admins, prioritize member data
            const { getMember, getMemberByEmail } = await import('@/lib/db')
            let member = await getMember(user.uid)
            if (!member) {
              member = await getMemberByEmail(user.email!)
            }
            
            if (member) {
              setMemberData(member)
              setAdminName(member.name || user?.displayName || user?.email?.split('@')[0] || '')
              setAdminPhoto(member.photo || '')
            } else {
              // Fallback to admin profile
              const adminResponse = await fetch(`/api/admin/profile/${user.uid}`)
              if (adminResponse.ok) {
                const profile = await adminResponse.json()
                setAdminName(profile?.name || user?.displayName || user?.email?.split('@')[0] || '')
                setAdminPhoto(profile?.photo || '')
              } else {
                setAdminName(user?.displayName || user?.email?.split('@')[0] || '')
                setAdminPhoto('')
              }
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setAdminName(user?.displayName || user?.email?.split('@')[0] || '')
          setAdminPhoto('')
        }
      } else {
        setAdminName('')
        setAdminPhoto('')
        setMemberData(null)
      }
    }
    fetchUserProfile()
  }, [user])

  // Refresh user profile more frequently to catch updates
  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        try {
          if (userRole === 'owner') {
            // For owners, check admin profile
            const adminResponse = await fetch(`/api/admin/profile/${user.uid}`)
            if (adminResponse.ok) {
              const profile = await adminResponse.json()
              const newName = profile?.name || user?.displayName || user?.email?.split('@')[0] || ''
              if (newName !== adminName) {
                setAdminName(newName)
              }
              if (profile?.photo && profile.photo !== adminPhoto) {
                setAdminPhoto(profile.photo)
              }
            }
          } else {
            // For members and admins, check member data first
            const { getMember, getMemberByEmail } = await import('@/lib/db')
            let member = await getMember(user.uid)
            if (!member) {
              member = await getMemberByEmail(user.email!)
            }
            
            if (member) {
              const newName = member.name || user?.displayName || user?.email?.split('@')[0] || ''
              if (newName !== adminName) {
                setMemberData(member)
                setAdminName(newName)
                setAdminPhoto(member.photo || '')
              }
            } else {
              // Fallback to admin profile
              const adminResponse = await fetch(`/api/admin/profile/${user.uid}`)
              if (adminResponse.ok) {
                const profile = await adminResponse.json()
                const newName = profile?.name || user?.displayName || user?.email?.split('@')[0] || ''
                if (newName !== adminName) {
                  setAdminName(newName)
                }
                if (profile?.photo && profile.photo !== adminPhoto) {
                  setAdminPhoto(profile.photo)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error refreshing user profile:', error)
        }
      }, 5000) // Check every 5 seconds for faster updates

      return () => clearInterval(interval)
    }
  }, [user, adminName, adminPhoto, userRole])

  // Listen for storage events to refresh immediately when profile is updated
  useEffect(() => {
    const handleStorageChange = () => {
      if (user) {
        // Trigger immediate refresh
        const refreshProfile = async () => {
          try {
            const { getMember, getMemberByEmail } = await import('@/lib/db')
            let member = await getMember(user.uid)
            if (!member) {
              member = await getMemberByEmail(user.email!)
            }
            if (member) {
              setMemberData(member)
              setAdminName(member.name || user?.displayName || user?.email?.split('@')[0] || '')
              setAdminPhoto(member.photo || '')
            }
          } catch (error) {
            console.error('Error refreshing profile:', error)
          }
        }
        refreshProfile()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('profile-updated', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profile-updated', handleStorageChange)
    }
  }, [user])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Teams', href: '/teams' },
    { name: 'Projects', href: '/projects' },
    { name: 'Events', href: '/events' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Merchandise', href: '/merchandise' },
    { name: 'Members', href: '/members' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <>
      {/* Desktop Top Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 hidden lg:block ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-cyan-500/10' 
            : 'bg-black/20 backdrop-blur-xl border-b border-white/10'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center transition-all duration-500 ${
          scrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="relative"
          >
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Logo className={`transition-all duration-500 ${scrolled ? 'h-8 lg:h-10' : 'h-10 lg:h-12'} w-auto`} />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center ml-8">
            <div className="flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className="relative group px-2 py-2 rounded-lg font-medium text-base text-gray-300 hover:text-cyan-300 transition-all duration-200 overflow-hidden"
                >
                  <span className="relative z-20">{item.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-200"
                  />
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 bg-cyan-400 group-hover:w-full transition-all duration-200"
                  />
                </Link>
              </motion.div>
            ))}
            </div>
          </div>

          {/* Right Section - Auth/Profile */}
          <div className="hidden lg:flex items-center">
            {/* Auth Buttons - Show only when not logged in */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/auth"
                  className="relative group bg-gradient-to-r from-blue-500 to-purple-500 text-cyan-100 p-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            )}
            
            {/* Profile Section - Show only when logged in */}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative profile-menu"
              >
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={adminPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName || user?.displayName || user?.email?.split('@')[0] || 'User')}&background=3b82f6&color=ffffff&size=200`}
                      alt={adminName || user?.displayName || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                  <div className="flex flex-col text-left flex-1">
                    <motion.span 
                      className="text-white text-base font-semibold"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {adminName || user?.displayName || 'User'}
                    </motion.span>
                    <span className="text-xs text-blue-400">
                      {userRole === 'owner' ? 'Owner' : userRole === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showProfileMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-colors" />
                  </motion.div>
                </motion.button>
                
                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-3 w-56 bg-black/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-cyan-500/10 z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        {/* My Orders */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href="/orders"
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 transition-all duration-300 rounded-xl border-b border-white/10 mb-1 group"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">My Orders</span>
                              <motion.div
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                →
                              </motion.div>
                            </div>
                          </Link>
                        </motion.div>

                        {/* Member Dashboard - Show for members and admins, not owners */}
                        {userRole !== 'owner' && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href="/member"
                              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 rounded-xl border-b border-white/10 mb-1 group"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Member Dashboard</span>
                                <motion.div
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  →
                                </motion.div>
                              </div>
                            </Link>
                          </motion.div>
                        )}
                        
                        {/* Admin Dashboard - Only show for admins and owners */}
                        {(userRole === 'admin' || userRole === 'owner') && (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Link
                              href="/admin/dashboard"
                              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 rounded-xl border-b border-white/10 mb-1 group"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {userRole === 'owner' ? 'Owner Dashboard' : 'Admin Dashboard'}
                                </span>
                                <motion.div
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  animate={{ x: [0, 5, 0] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  →
                                </motion.div>
                              </div>
                            </Link>
                          </motion.div>
                        )}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-gray-300 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 flex items-center rounded-xl group"
                          >
                            <LogOut className="h-4 w-4 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
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
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Backdrop */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Side Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 h-full w-full bg-black/95 backdrop-blur-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/Logo_without_background.png" 
                    alt="OrbitX Logo" 
                    className="h-8 w-auto"
                  />
                  <div>
                    <span className="text-lg font-bold text-white">OrbitX</span>
                    <p className="text-xs text-gray-400">Space Exploration</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center py-3 px-4 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="text-base">{item.name}</span>
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* User Profile Section */}
              <div className="border-t border-white/10 p-4">
                {user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <motion.img
                        src={adminPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName || user?.displayName || 'User')}&background=3b82f6&color=ffffff&size=200`}
                        alt={adminName || user?.displayName || 'Profile'}
                        className="w-12 h-12 rounded-full object-cover"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold">{adminName || user?.displayName || 'User'}</p>
                        <p className="text-xs text-blue-400">{userRole === 'owner' ? 'Owner' : userRole === 'admin' ? 'Administrator' : 'Member'}</p>
                      </div>
                    </div>

                    {/* Dashboard Links */}
                    <div className="space-y-2">
                      {/* Member Dashboard */}
                      {userRole !== 'owner' && (
                        <Link
                          href="/member"
                          className="flex items-center py-3 px-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 rounded-xl group"
                          onClick={() => setIsOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3" />
                          <span className="font-medium">Member Dashboard</span>
                          <motion.div
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </Link>
                      )}

                      {/* Admin/Owner Dashboard */}
                      {(userRole === 'admin' || userRole === 'owner') && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center py-3 px-4 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 rounded-xl group"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings className="h-5 w-5 mr-3" />
                          <span className="font-medium">{userRole === 'owner' ? 'Owner Dashboard' : 'Admin Dashboard'}</span>
                          <motion.div
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </Link>
                      )}

                      {/* Logout */}
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full flex items-center py-3 px-4 text-gray-300 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 rounded-xl"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="block p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 rounded-lg font-medium text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </motion.nav>

      {/* Mobile/Tablet Side Menu Bar */}
      <AnimatePresence>
        {sidebarVisible && (
          <motion.nav
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ 
              x: sidebarMinimized ? -60 : 0, 
              opacity: 1 
            }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed left-0 top-0 h-full bg-black/95 backdrop-blur-2xl border-r border-white/20 z-40 lg:hidden flex flex-col py-4 transition-all duration-150 group mobile-nav-safe ${
              sidebarMinimized ? 'w-16 items-center' : 'w-72 sm:w-80 items-start px-4'
            }`}
      >
        {/* Close/Minimize Toggle */}
        <motion.button
          onClick={() => {
            if (sidebarMinimized) {
              setSidebarMinimized(false)
            } else {
              setSidebarVisible(false)
              setSidebarMinimized(false)
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 right-4 w-10 h-10 bg-black/90 border border-white/20 rounded-xl flex items-center justify-center transition-all duration-150 group touch-target"
          title={sidebarMinimized ? 'Expand Menu' : 'Close Menu'}
        >
          <motion.div
            animate={{ rotate: sidebarMinimized ? 180 : 0 }}
            transition={{ duration: 0.15 }}
          >
            {sidebarMinimized ? (
              <ChevronRight className="h-5 w-5 text-white" />
            ) : (
              <X className="h-5 w-5 text-white" />
            )}
          </motion.div>
        </motion.button>
        {/* Logo */}
        {!sidebarMinimized && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 sm:mb-8 flex items-center space-x-3 mt-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            <Link href="/" className="flex items-center space-x-3 touch-target">
              <img 
                src="/Logo_without_background.png" 
                alt="OrbitX Logo" 
                className="h-10 sm:h-12 w-auto"
              />
              <div>
                <span className="text-lg sm:text-xl font-bold text-white">OrbitX</span>
                <p className="text-xs sm:text-sm text-gray-400">Space Exploration</p>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Navigation Items */}
        <div className={`flex flex-col space-y-2 flex-1 ${sidebarMinimized ? 'mt-8 items-center' : 'w-full'}`}>
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              whileHover={{ scale: sidebarMinimized ? 1.1 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={sidebarMinimized ? '' : 'w-full'}
            >
              <Link
                href={item.href}
                onClick={() => {
                  setSidebarVisible(false)
                  setSidebarMinimized(false)
                }}
                className={`rounded-xl bg-white/10 hover:bg-white/20 flex items-center transition-all duration-150 group relative touch-target ${
                  sidebarMinimized 
                    ? 'w-10 h-10 justify-center' 
                    : 'w-full px-4 py-3 space-x-3'
                }`}
                title={sidebarMinimized ? item.name : ''}
              >
                {sidebarMinimized ? (
                  <span className="text-gray-300 group-hover:text-white font-bold text-sm">
                    {item.name.charAt(0)}
                  </span>
                ) : (
                  <>
                    <span className="text-gray-300 group-hover:text-white font-bold text-base sm:text-lg">
                      {item.name.charAt(0)}
                    </span>
                    <span className="text-gray-300 group-hover:text-white font-medium text-sm sm:text-base">
                      {item.name}
                    </span>
                    <motion.div
                      className="ml-auto opacity-100 transition-opacity"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* User Profile */}
        {user && (
          <div className={`mt-auto space-y-3 pb-4 ${sidebarMinimized ? '' : 'w-full'}`}>
            {/* Profile Photo */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
            >
              <img
                src={adminPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName || user?.displayName || 'User')}&background=3b82f6&color=ffffff&size=200`}
                alt={adminName || user?.displayName || 'Profile'}
                className={`rounded-full object-cover border-2 border-white/20 transition-all duration-300 touch-target ${
                  sidebarMinimized ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'
                }`}
              />

            </motion.div>

            {/* Dashboard Links */}
            {userRole !== 'owner' && (
              <motion.div
                whileHover={{ scale: sidebarMinimized ? 1.1 : 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={sidebarMinimized ? '' : 'w-full'}
              >
                <Link
                  href="/member"
                  onClick={() => {
                    setSidebarVisible(false)
                    setSidebarMinimized(false)
                  }}
                  className={`rounded-xl bg-blue-500/20 hover:bg-blue-500/30 flex items-center transition-all duration-300 group relative touch-target ${
                    sidebarMinimized 
                      ? 'w-10 h-10 justify-center' 
                      : 'w-full px-4 py-3 space-x-3'
                  }`}
                  title={sidebarMinimized ? 'Member Dashboard' : ''}
                >
                  <User className={`text-blue-300 ${
                    sidebarMinimized ? 'h-4 w-4' : 'h-5 w-5'
                  }`} />
                  {!sidebarMinimized && (
                    <span className="text-blue-300 font-medium text-sm sm:text-base">Member Dashboard</span>
                  )}
                </Link>
              </motion.div>
            )}

            {(userRole === 'admin' || userRole === 'owner') && (
              <motion.div
                whileHover={{ scale: sidebarMinimized ? 1.1 : 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={sidebarMinimized ? '' : 'w-full'}
              >
                <Link
                  href="/admin/dashboard"
                  onClick={() => {
                    setSidebarVisible(false)
                    setSidebarMinimized(false)
                  }}
                  className={`rounded-xl bg-purple-500/20 hover:bg-purple-500/30 flex items-center transition-all duration-300 group relative touch-target ${
                    sidebarMinimized 
                      ? 'w-10 h-10 justify-center' 
                      : 'w-full px-4 py-3 space-x-3'
                  }`}
                  title={sidebarMinimized ? (userRole === 'owner' ? 'Owner Dashboard' : 'Admin Dashboard') : ''}
                >
                  <Settings className={`text-purple-300 ${
                    sidebarMinimized ? 'h-4 w-4' : 'h-5 w-5'
                  }`} />
                  {!sidebarMinimized && (
                    <span className="text-purple-300 font-medium text-sm sm:text-base">
                      {userRole === 'owner' ? 'Owner Dashboard' : 'Admin Dashboard'}
                    </span>
                  )}
                </Link>
              </motion.div>
            )}

            {/* Logout */}
            <motion.div
              whileHover={{ scale: sidebarMinimized ? 1.1 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={sidebarMinimized ? '' : 'w-full'}
            >
              <button
                onClick={handleLogout}
                className={`rounded-xl bg-red-500/20 hover:bg-red-500/30 flex items-center transition-all duration-300 group relative touch-target ${
                  sidebarMinimized 
                    ? 'w-10 h-10 justify-center' 
                    : 'w-full px-4 py-3 space-x-3'
                }`}
                title={sidebarMinimized ? 'Logout' : ''}
              >
                <LogOut className={`text-red-300 ${
                  sidebarMinimized ? 'h-4 w-4' : 'h-5 w-5'
                }`} />
                {!sidebarMinimized && (
                  <span className="text-red-300 font-medium text-sm sm:text-base">Logout</span>
                )}
              </button>
            </motion.div>
          </div>
        )}

        {/* Auth Button for non-logged users */}
        {!user && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-auto pb-4"
          >
            <Link
              href="/auth"
              onClick={() => {
                setSidebarVisible(false)
                setSidebarMinimized(false)
              }}
              className={`rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center transition-all duration-300 group relative touch-target ${
                sidebarMinimized 
                  ? 'w-10 h-10 justify-center' 
                  : 'w-full p-2 space-x-3'
              }`}
              title="Get Started"
            >
              <span className={`text-white font-bold ${
                sidebarMinimized ? 'text-base' : 'text-lg'
              }`}>+</span>
              {!sidebarMinimized && (
                <span className="text-white font-medium text-sm sm:text-base">Get Started</span>
              )}
            </Link>
          </motion.div>
        )}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button for Opening Menu */}
      {!sidebarVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setSidebarVisible(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed top-4 left-4 w-12 h-12 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-xl flex items-center justify-center z-30 lg:hidden shadow-lg shadow-cyan-500/20 touch-target"
          title="Open Menu"
        >
          <Menu className="h-6 w-6 text-white" />
        </motion.button>
      )}

      {/* Minimize Button when sidebar is open but not minimized */}
      {sidebarVisible && !sidebarMinimized && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setSidebarMinimized(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed top-20 left-4 w-10 h-10 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-xl flex items-center justify-center z-30 lg:hidden shadow-lg shadow-cyan-500/20 touch-target"
          title="Minimize Menu"
        >
          <ChevronLeft className="h-5 w-5 text-white" />
        </motion.button>
      )}
    </>
  )
}