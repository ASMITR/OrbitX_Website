'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/admin/AuthProvider'
import { isOwnerDB, isAdminDB, getAdminsFromDB, addAdminToDB, removeAdminFromDB } from '@/lib/roles'
import { UserPlus, Trash2, Shield, Crown } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'

export default function ManageAdmins() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  const [isOwnerUser, setIsOwnerUser] = useState(false)
  const [checkingRole, setCheckingRole] = useState(true)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const ownerStatus = await isOwnerDB(user)
        const adminStatus = await isAdminDB(user)
        
        setIsOwnerUser(ownerStatus)
        
        if (!adminStatus) {
          router.push('/member')
          return
        }
        
        if (ownerStatus) {
          const admins = await getAdminsFromDB()
          setAdminEmails(admins)
        }
      } else {
        router.push('/auth')
      }
      setCheckingRole(false)
    }
    
    if (!loading) {
      checkUserRole()
    }
  }, [user, loading, router])

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!isOwnerUser) {
    return (
      <AdminLayout title="Access Denied">
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Only the owner can manage administrators.</p>
        </div>
      </AdminLayout>
    )
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail.trim()) return

    if (newAdminEmail.toLowerCase() === user?.email?.toLowerCase()) {
      toast.error('You are already the owner')
      return
    }

    const success = await addAdminToDB(newAdminEmail)
    if (success) {
      const updatedAdmins = await getAdminsFromDB()
      setAdminEmails(updatedAdmins)
      setNewAdminEmail('')
      toast.success('Admin added successfully')
    } else {
      toast.error('Failed to add admin')
    }
  }

  const handleRemoveAdmin = async (email: string) => {
    const success = await removeAdminFromDB(email)
    if (success) {
      const updatedAdmins = await getAdminsFromDB()
      setAdminEmails(updatedAdmins)
      toast.success('Admin removed successfully')
    } else {
      toast.error('Failed to remove admin')
    }
  }

  return (
    <AdminLayout title="Manage Administrators">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-admin p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Crown className="h-6 w-6 mr-3 text-yellow-400" />
            Owner Panel - Manage Administrators
          </h2>

          {/* Add Admin Form */}
          <form onSubmit={handleAddAdmin} className="mb-8">
            <div className="flex gap-4">
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="Enter email to make admin"
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add Admin
              </button>
            </div>
          </form>

          {/* Current Owner */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Website Owner</h3>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Crown className="h-5 w-5 text-yellow-400 mr-3" />
                  <span className="text-white font-medium">{user?.email}</span>
                </div>
                <span className="text-yellow-400 text-sm font-medium">OWNER</span>
              </div>
            </div>
          </div>

          {/* Admin List */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Administrators ({adminEmails.length})
            </h3>
            {adminEmails.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No administrators added yet
              </div>
            ) : (
              <div className="space-y-3">
                {adminEmails.map((email) => (
                  <motion.div
                    key={email}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 border border-white/20 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-blue-400 mr-3" />
                        <span className="text-white font-medium">{email}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAdmin(email)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}