'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogOut, ChevronDown, User } from 'lucide-react'
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
          // Try to fetch admin profile first
          const adminResponse = await fetch(`/api/admin/profile/${user.uid}`)
          if (adminResponse.ok) {
            const profile = await adminResponse.json()
            setAdminName(profile?.name || '')
            setAdminPhoto(profile?.photo || '')
          } else {
            // If not admin, try to fetch member data
            const { getMembers } = await import('@/lib/db')
            const members = await getMembers()
            const member = members.find((m: any) => m.email === user.email)
            if (member) {
              setMemberData(member)
              setAdminName(member.name)
              setAdminPhoto(member.photo)
            } else {
              setAdminName('')
              setAdminPhoto('')
            }
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
          setAdminName('')
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
          const adminResponse = await fetch(`/api/admin/profile/${user.uid}`)
          if (adminResponse.ok) {
            const profile = await adminResponse.json()
            if (profile?.name && profile.name !== adminName) {
              setAdminName(profile.name)
            }
            if (profile?.photo && profile.photo !== adminPhoto) {
              setAdminPhoto(profile.photo)
            }
          } else {
            // Check member data by UID first, then by email
            const { getMember, getMemberByEmail } = await import('@/lib/db')
            let member = await getMember(user.uid)
            if (!member) {
              member = await getMemberByEmail(user.email!)
            }
            if (member && member.name !== adminName) {
              setMemberData(member)
              setAdminName(member.name)
              setAdminPhoto(member.photo)
            }
          }
        } catch (error) {
          console.error('Error refreshing user profile:', error)
        }
      }, 5000) // Check every 5 seconds for faster updates

      return () => clearInterval(interval)
    }
  }, [user, adminName, adminPhoto])

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
              setAdminName(member.name)
              setAdminPhoto(member.photo)
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
    { name: 'Members', href: '/members' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-cyan-500/10' 
          : 'bg-black/20 backdrop-blur-xl border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${
          scrolled ? 'h-12 sm:h-14 lg:h-16' : 'h-14 sm:h-16 lg:h-18'
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
                <Logo className={`transition-all duration-500 ${scrolled ? 'h-6 sm:h-8 md:h-10 lg:h-12' : 'h-8 sm:h-10 md:h-12 lg:h-14'} w-auto`} />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ scale: 1.08, y: -3 }}
                whileTap={{ scale: 0.92 }}
              >
                <Link
                  href={item.href}
                  className="relative group px-4 py-2.5 rounded-2xl font-medium text-sm lg:text-base text-gray-300 hover:text-cyan-300 transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-20">{item.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/15 group-hover:to-purple-500/10 rounded-2xl transition-all duration-500"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-cyan-400/30 transition-all duration-500"
                  />
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:w-full transition-all duration-500"
                  />
                </Link>
              </motion.div>
            ))}
            
            {/* Auth Buttons - Show only when not logged in */}
            {!user && (
              <div className="flex items-center space-x-3 ml-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth"
                    className="relative group bg-gradient-to-r from-blue-500 to-purple-500 text-cyan-100 px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 overflow-hidden"
                  >
                    <span className="relative z-10">Get Started</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              </div>
            )}
            
            {/* Profile Section - Show only when logged in */}
            {user && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="relative ml-4 lg:ml-6 profile-menu"
              >
                <motion.button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group border border-white/10 hover:border-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full ring-2 ring-cyan-400/30 group-hover:ring-cyan-400/60 transition-all duration-300 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                      {adminPhoto ? (
                        <img 
                          src={adminPhoto} 
                          alt={adminName || 'Profile'}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <User className={`h-4 w-4 lg:h-5 lg:w-5 text-white ${adminPhoto ? 'hidden' : ''}`} />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-gray-300 group-hover:text-white text-sm lg:text-base font-medium transition-colors duration-300">
                      {adminName || user.email?.split('@')[0] || 'User'}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {userRole === 'owner' ? 'Owner' : userRole === 'admin' ? 'Administrator' : 'Member'}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: showProfileMenu ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
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
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            href={userRole === 'owner' || userRole === 'admin' ? '/admin/dashboard' : '/member'}
                            className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 transition-all duration-300 rounded-xl border-b border-white/10 mb-1 group"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {userRole === 'owner' ? 'Owner Dashboard' : userRole === 'admin' ? 'Admin Dashboard' : 'Member Portal'}
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
          <div className="md:hidden">
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="md:hidden py-6 border-t border-white/20 bg-black/20 backdrop-blur-xl rounded-b-2xl mx-4 mt-2"
            >
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="block py-4 px-6 mx-4 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="px-2 pt-2 space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                >
                  <Link
                    href={userRole === 'owner' || userRole === 'admin' ? '/admin/dashboard' : '/member'}
                    className="block py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                        {adminPhoto ? (
                          <img 
                            src={adminPhoto} 
                            alt={adminName || 'Profile'}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <User className={`h-3 w-3 text-white ${adminPhoto ? 'hidden' : ''}`} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{adminName || user.email?.split('@')[0] || 'User'}</span>
                        <span className="text-xs text-gray-400">{userRole === 'owner' ? 'Owner' : userRole === 'admin' ? 'Administrator' : 'Member'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.05 }}
                >
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg font-medium flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </motion.div>
              </div>
            ) : (
              <div className="px-2 pt-2 space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                >
                  <Link
                    href="/auth"
                    className="block py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-cyan-100 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 rounded-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}