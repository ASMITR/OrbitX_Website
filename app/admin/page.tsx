'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin dashboard
    router.push('/admin/dashboard')
  }, [router])

  return (
    <AdminLayout title="Loading">
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </motion.div>
      </div>
    </AdminLayout>
  )
}