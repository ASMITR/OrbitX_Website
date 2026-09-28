'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, LogOut, User, Settings, Home, Users, Calendar,
  FolderOpen, PenTool, ShoppingBag, Mail, Info, ChevronRight,
  Rocket, ArrowUpRight
} from 'lucide-react'
import Logo from './Logo'
import { useAuth } from './admin/AuthProvider'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserRoleFromDB } from '@/lib/roles'
import toast from 'react-hot-toast'
import { usePathname } from 'next/navigation'

const navGroups = [
  {
    label: 'Explore',
    items: [
      { name: 'Home', href: '/', icon: Home },
      { name: 'About', href: '/about', icon: Info },
      { name: 'Teams', href: '/teams', icon: Users },
    ]
  },
  {
    label: 'Content',
    items: [
      { name: 'Events', href: '/events', icon: Calendar },
      { name: 'Projects', href: '/projects', icon: FolderOpen },
      { name: 'Blogs', href: '/blogs', icon: PenTool },
      { name: 'Members', href: '/members', icon: Users },
    ]
  },
  {
    label: 'Connect',
    items: [
      { name: 'Merchandise', href: '/merchandise', icon: ShoppingBag },
      { name: 'Contact', href: '/contact', icon: Mail },
    ]
  },
]

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [adminName, setAdminName] = useState('')
  const [adminPhoto, setAdminPhoto] = useState('')
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member'>('member')
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  useEffect(() => {
    if (!user) { setUserRole('member'); return }
    getUserRoleFromDB(user).then(setUserRole)
  }, [user])

  useEffect(() => {
    if (!user) { setAdminName(''); setAdminPhoto(''); return }
    const load = async () => {
      try {
        const role = await getUserRoleFromDB(user)
        if (role === 'owner') {
          const res = await fetch(`/api/admin/profile/${user.uid}`)
          const p = res.ok ? await res.json() : null
          setAdminName(p?.name || user.displayName || user.email?.split('@')[0] || '')
          setAdminPhoto(p?.photo || '')
        } else {
          const { getMember, getMemberByEmail } = await import('@/lib/db')
          const m = await getMember(user.uid) || await getMemberByEmail(user.email!)
          if (m) { setAdminName(m.name || ''); setAdminPhoto(m.photo || '') }
          else {
            const res = await fetch(`/api/admin/profile/${user.uid}`)
            const p = res.ok ? await res.json() : null
            setAdminName(p?.name || user.displayName || user.email?.split('@')[0] || '')
            setAdminPhoto(p?.photo || '')
          }
        }
      } catch { setAdminName(user.displayName || user.email?.split('@')[0] || '') }
    }
    load()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      setDrawerOpen(false)
      window.location.href = '/auth'
    } catch { toast.error('Failed to logout') }
  }

  const avatarSrc = adminPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName || user?.displayName || 'User')}&background=3b82f6&color=ffffff&size=200`
  const displayName = adminName || user?.displayName || 'User'
  const roleLabel = userRole === 'owner' ? 'Owner' : userRole === 'admin' ? 'Administrator' : 'Member'
  const roleBadgeColor = userRole === 'owner' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : userRole === 'admin' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      {/* Top Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-cyan-500/10'
            : 'bg-black/20 backdrop-blur-xl border-b border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-16'}`}>
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <Logo className={`transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'} w-auto`} />
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 h-full w-[85vw] sm:w-[360px] bg-[#080810] border-l border-white/8 z-50 flex flex-col"
            >
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">OrbitX</p>
                    <p className="text-gray-500 text-xs">Space Exploration</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav groups */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5 space-y-6">
                {navGroups.map((group, gi) => (
                  <div key={group.label}>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-3 mb-2">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item, i) => {
                        const isActive = pathname === item.href
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: (gi * 4 + i) * 0.03 }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setDrawerOpen(false)}
                              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                                isActive
                                  ? 'text-white bg-white/8 border border-white/10'
                                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                                isActive ? 'bg-cyan-500/20' : 'bg-white/5 group-hover:bg-white/8'
                              }`}>
                                <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                              </div>
                              <span className="flex-1">{item.name}</span>
                              {isActive
                                ? <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                : <ChevronRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-500 transition-colors" />
                              }
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="relative flex-shrink-0 border-t border-white/6 px-4 py-4 space-y-2">
                {user ? (
                  <>
                    {/* Profile card */}
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/8 mb-3">
                      <img src={avatarSrc} alt={displayName} className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-white/10" />
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate leading-tight">{displayName}</p>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border mt-0.5 ${roleBadgeColor}`}>
                          {roleLabel}
                        </span>
                      </div>
                    </div>

                    {/* Action links */}
                    <Link href="/orders" onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all group">
                      <ShoppingBag className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                      <span className="flex-1">My Orders</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-500" />
                    </Link>

                    {userRole !== 'owner' && (
                      <Link href="/member" onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-cyan-500/8 rounded-lg text-sm transition-all group">
                        <User className="w-4 h-4 text-cyan-600 group-hover:text-cyan-400" />
                        <span className="flex-1">Member Dashboard</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-500" />
                      </Link>
                    )}

                    {(userRole === 'admin' || userRole === 'owner') && (
                      <Link href="/admin/dashboard" onClick={() => setDrawerOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-purple-500/8 rounded-lg text-sm transition-all group">
                        <Settings className="w-4 h-4 text-purple-600 group-hover:text-purple-400" />
                        <span className="flex-1">{userRole === 'owner' ? 'Owner' : 'Admin'} Dashboard</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-500" />
                      </Link>
                    )}

                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500/80 hover:text-red-400 hover:bg-red-500/8 rounded-lg text-sm transition-all group">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link href="/auth" onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
                    <Rocket className="w-4 h-4" />
                    Get Started
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
