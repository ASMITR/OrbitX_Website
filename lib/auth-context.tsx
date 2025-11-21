'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase'
import { getMemberByEmail, createMemberFromAuth } from './db'

interface AuthContextType {
  user: User | null
  member: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [member, setMember] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        try {
          let memberData = await getMemberByEmail(user.email!)
          if (!memberData) {
            memberData = await createMemberFromAuth(user.uid, user.email!, user.displayName || 'New Member')
          }
          setMember(memberData)
        } catch (error) {
          console.error('Error fetching member data:', error)
        }
      } else {
        setMember(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await createMemberFromAuth(user.uid, email, name)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, member, loading, signIn, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}