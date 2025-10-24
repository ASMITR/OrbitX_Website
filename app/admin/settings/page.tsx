'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, User, Shield, Database, Globe, Bell, Palette } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { auth } from '@/lib/firebase'
import { getAdminProfile, updateAdminProfile, createAdminProfile } from '@/lib/db'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState<any>(null)
  const [adminName, setAdminName] = useState('')
  const [settings, setSettings] = useState({
    siteName: 'OrbitX',
    siteDescription: 'Exploring Beyond Horizons',
    contactEmail: 'orbitx@zcoer.edu.in',
    location: 'ZCOER, Pune, Maharashtra',
    notifications: {
      emailNotifications: true,
      newMemberAlerts: true,
      eventReminders: true
    },
    theme: {
      primaryColor: '#3B82F6',
      accentColor: '#8B5CF6'
    }
  })

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user)
      if (user) {
        try {
          const profile = await getAdminProfile(user.uid)
          if (profile) {
            setAdminName(profile.name || '')
          }
        } catch (error) {
          console.error('Error fetching admin profile:', error)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const handleSave = async () => {
    if (user && adminName.trim()) {
      try {
        const profile = await getAdminProfile(user.uid)
        if (profile) {
          await updateAdminProfile(user.uid, { name: adminName.trim() })
        } else {
          await createAdminProfile(user.uid, { name: adminName.trim() })
        }
        toast.success('Profile updated successfully!')
      } catch (error) {
        console.error('Error saving profile:', error)
        toast.error('Failed to save profile')
      }
    } else {
      toast.success('Settings saved successfully!')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'site', name: 'Site Settings', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'database', name: 'Database', icon: Database }
  ]

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">Settings</h2>
          <p className="text-gray-400">Manage your admin preferences and site configuration</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Profile Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <input
                        type="text"
                        value="Administrator"
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Last Login</label>
                      <input
                        type="text"
                        value={user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'N/A'}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'site' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Site Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                    <textarea
                      rows={3}
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      type="text"
                      value={settings.location}
                      onChange={(e) => setSettings({...settings, location: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-gray-400 text-sm">Receive email notifications for important updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.emailNotifications}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, emailNotifications: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">New Member Alerts</h4>
                        <p className="text-gray-400 text-sm">Get notified when new members join</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.newMemberAlerts}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, newMemberAlerts: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Event Reminders</h4>
                        <p className="text-gray-400 text-sm">Receive reminders for upcoming events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications.eventReminders}
                          onChange={(e) => setSettings({
                            ...settings,
                            notifications: {...settings.notifications, eventReminders: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Appearance Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.theme.primaryColor}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: {...settings.theme, primaryColor: e.target.value}
                          })}
                          className="w-12 h-12 rounded-lg border border-white/20"
                        />
                        <input
                          type="text"
                          value={settings.theme.primaryColor}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: {...settings.theme, primaryColor: e.target.value}
                          })}
                          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.theme.accentColor}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: {...settings.theme, accentColor: e.target.value}
                          })}
                          className="w-12 h-12 rounded-lg border border-white/20"
                        />
                        <input
                          type="text"
                          value={settings.theme.accentColor}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: {...settings.theme, accentColor: e.target.value}
                          })}
                          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Security Settings</h3>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h4 className="text-yellow-300 font-medium mb-2">Password Security</h4>
                    <p className="text-yellow-200 text-sm">
                      Password changes are managed through Firebase Authentication. 
                      Contact your system administrator for password reset requests.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Account Information</h4>
                      <div className="bg-white/5 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Account Created:</span>
                          <span className="text-white">
                            {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email Verified:</span>
                          <span className={user?.emailVerified ? 'text-green-400' : 'text-red-400'}>
                            {user?.emailVerified ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'database' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Database Settings</h3>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2">Firebase Configuration</h4>
                    <p className="text-blue-200 text-sm">
                      Database settings are configured through environment variables. 
                      Contact your developer for configuration changes.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Database Status</h4>
                      <div className="bg-white/5 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Connection:</span>
                          <span className="text-green-400">Connected</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Provider:</span>
                          <span className="text-white">Firebase Firestore</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Region:</span>
                          <span className="text-white">asia-south1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={handleSave}
                  className="btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}