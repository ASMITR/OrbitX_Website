'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {

    
    if (!loading) {
      if (!user) {

        router.push('/auth')
        return
      }
      
      if (userRole !== 'owner' && userRole !== 'admin') {

        router.push('/member')
        return
      }
      

    }
  }, [user, loading, userRole, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  if (userRole !== 'owner' && userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Checking permissions...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}