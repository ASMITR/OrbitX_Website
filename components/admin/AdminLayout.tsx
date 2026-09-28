'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, FolderOpen, Users, MessageSquare,
  Settings, BookOpen, Package, ShoppingCart, LogOut, Menu, X,
  ChevronRight, Rocket, Crown, Shield
} from 'lucide-react'
import { useAuth } from './AuthProvider'
import { usePathname } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { getUserRoleFromDB } from '@/lib/roles'
import toast from 'react-hot-toast'

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
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

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userPhoto, setUserPhoto] = useState('')
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member'>('admin')
  const { user, loading } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const role = await getUserRoleFromDB(user)
        setUserRole(role)
        if (role === 'owner') {
          const res = await fetch(`/api/admin/profile/${user.uid}`)
          const p = res.ok ? await res.json() : null
          setUserName(p?.name || user.displayName || user.email?.split('@')[0] || '')
          setUserPhoto(p?.photo || '')
        } else {
          const { getMember, getMemberByEmail } = await import('@/lib/db')
          const m = await getMember(user.uid) || await getMemberByEmail(user.email!)
          if (m) { setUserName(m.name || ''); setUserPhoto(m.photo || '') }
          else {
            const res = await fetch(`/api/admin/profile/${user.uid}`)
            const p = res.ok ? await res.json() : null
            setUserName(p?.name || user.displayName || user.email?.split('@')[0] || '')
            setUserPhoto(p?.photo || '')
          }
        }
      } catch {
        setUserName(user.displayName || user.email?.split('@')[0] || '')
      }
    }
    load()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Signed out successfully')
      window.location.href = '/auth'
    } catch {
      toast.error('Failed to sign out')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050508]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const avatarSrc = userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'Admin')}&background=7c3aed&color=ffffff&size=200`
  const isOwner = userRole === 'owner'

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-3 group" onClick={onNav}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">OrbitX</p>
            <p className="text-gray-600 text-[10px] mt-0.5">
              {isOwner ? 'Owner Panel' : 'Admin Panel'}
            </p>
          </div>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4 pb-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border ${
          isOwner
            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
        }`}>
          {isOwner ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
          {isOwner ? 'Owner Access' : 'Admin Access'}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navigation.map((item, i) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <motion.div key={item.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
              <Link
                href={item.href}
                onClick={onNav}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? isOwner
                      ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
                      : 'text-violet-300 bg-violet-500/10 border border-violet-500/20'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive
                    ? isOwner ? 'text-amber-400' : 'text-violet-400'
                    : 'text-gray-600 group-hover:text-gray-400'
                }`} />
                <span className="flex-1">{item.name}</span>
                {isActive && <ChevronRight className={`w-3 h-3 ${isOwner ? 'text-amber-500' : 'text-violet-500'}`} />}
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User */}
      <div className="flex-shrink-0 border-t border-white/[0.06] p-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="relative flex-shrink-0">
            <img src={avatarSrc} alt={userName} className="w-8 h-8 rounded-full object-cover" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0a0a12] ${isOwner ? 'bg-amber-400' : 'bg-violet-400'}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">{userName || 'Admin'}</p>
            <p className={`text-[10px] ${isOwner ? 'text-amber-500' : 'text-violet-500'}`}>
              {isOwner ? 'Owner' : 'Administrator'}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:text-red-400 hover:bg-red-500/8 rounded-xl text-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050508] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 flex-shrink-0 fixed top-0 left-0 h-full bg-[#0a0a12] border-r border-white/[0.06] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 w-full z-50 h-14 bg-[#0a0a12]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Rocket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-white font-bold text-sm">OrbitX</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs hidden sm:block">{title}</span>
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 left-0 h-full w-64 bg-[#0a0a12] border-r border-white/[0.06] z-50 lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setMobileOpen(false)} className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarContent onNav={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 xl:ml-60 flex flex-col min-h-screen">
        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-between h-14 px-6 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">OrbitX</span>
            <ChevronRight className="w-3 h-3 text-gray-700" />
            <span className="text-gray-300 text-sm font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOwner
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-violet-500/10 border-violet-500/20 text-violet-400'
            }`}>
              {isOwner ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
              {isOwner ? 'Owner' : 'Admin'}
            </div>
            <img src={avatarSrc} alt={userName} className="w-8 h-8 rounded-full object-cover border border-white/10" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 pt-20 lg:pt-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
