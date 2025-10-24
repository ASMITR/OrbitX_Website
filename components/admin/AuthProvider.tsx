'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { getUserRoleFromDB } from '@/lib/roles'

interface AuthContextType {
  user: User | null
  loading: boolean
  userRole: 'owner' | 'admin' | 'member' | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userRole: null
})

export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<'owner' | 'admin' | 'member' | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Get user role from database
        const role = await getUserRoleFromDB(user)
        setUserRole(role)
        
        // If user is trying to access admin pages but doesn't have admin/owner role
        if (pathname?.startsWith('/admin') && role === 'member') {
          router.replace('/auth/login')
        }
      } else {
        setUserRole(null)
        // If user is not authenticated and trying to access admin pages
        if (pathname?.startsWith('/admin')) {
          router.replace('/auth/login')
        }
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, pathname])

  return (
    <AuthContext.Provider value={{ user, loading, userRole }}>
      {children}
    </AuthContext.Provider>
  )
}