'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
  
      setUser(user)
      
      if (user) {
        try {
          const role = await getUserRoleFromDB(user)

          setUserRole(role)
        } catch (error) {

          setUserRole('member')
        }
      } else {
        setUserRole(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, userRole }}>
      {children}
    </AuthContext.Provider>
  )
}