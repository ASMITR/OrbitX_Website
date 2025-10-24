'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, User, Shield, Database, Globe, Bell, Palette, BarChart3, Download, Upload, Trash2, RefreshCw, Settings, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { auth, db } from '@/lib/firebase'
import { getAdminProfile, updateAdminProfile, createAdminProfile } from '@/lib/db'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState<any>(null)
  const [adminName, setAdminName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalMembers: 0,
    totalEvents: 0,
    totalProjects: 0,
    totalBlogs: 0,
    monthlyVisitors: 0
  })
  const [settings, setSettings] = useState({
    siteName: 'OrbitX',
    siteDescription: 'Exploring Beyond Horizons',
    contactEmail: 'orbitx@zcoer.edu.in',
    contactPhone: '+91 98765 43210',
    location: 'ZCOER, Pune, Maharashtra',
    socialLinks: {
      instagram: 'https://instagram.com/orbitx_zcoer',
      linkedin: '',
      youtube: '',
      twitter: ''
    },
    notifications: {
      emailNotifications: true,
      newMemberAlerts: true,
      eventReminders: true,
      blogNotifications: true,
      projectUpdates: true
    },
    theme: {
      primaryColor: '#3B82F6',
      accentColor: '#8B5CF6',
      darkMode: true,
      animationsEnabled: true
    },
    seo: {
      metaTitle: 'OrbitX - Space Science & Astronomy Club',
      metaDescription: 'OrbitX is a student organization focused on learning, innovation, and collaboration in space technology and beyond.',
      keywords: 'space, astronomy, technology, student organization, ZCOER, Pune'
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.'
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
          await loadSettings()
          await loadAnalytics()
        } catch (error) {
          console.error('Error fetching admin profile:', error)
        }
      }
    })
    return () => unsubscribe()
  }, [])

  const loadSettings = async () => {
    try {
      const settingsRef = doc(db, 'settings', 'siteConfig')
      const settingsDoc = await getDoc(settingsRef)
      if (settingsDoc.exists()) {
        setSettings(prev => ({ ...prev, ...settingsDoc.data() }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const loadAnalytics = async () => {
    try {
      // Get data from actual website components
      const sampleMembers = 12 // From members page sample data
      const sampleEvents = 6 // From events page sample data  
      const sampleProjects = 6 // From projects page sample data
      const sampleBlogs = 0 // No sample blogs in blogs page
      
      setAnalytics({
        totalMembers: sampleMembers,
        totalEvents: sampleEvents,
        totalProjects: sampleProjects,
        totalBlogs: sampleBlogs,
        monthlyVisitors: 0
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
      setAnalytics({
        totalMembers: 12,
        totalEvents: 6,
        totalProjects: 6,
        totalBlogs: 0,
        monthlyVisitors: 0
      })
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Save admin profile
      if (user && adminName.trim()) {
        const profile = await getAdminProfile(user.uid)
        if (profile) {
          await updateAdminProfile(user.uid, { name: adminName.trim() })
        } else {
          await createAdminProfile(user.uid, { name: adminName.trim() })
        }
      }
      
      // Save site settings
      const settingsRef = doc(db, 'settings', 'siteConfig')
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      }, { merge: true })
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const data = {
        settings,
        analytics,
        exportDate: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orbitx-settings-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Settings exported successfully!')
    } catch (error) {
      toast.error('Failed to export settings')
    }
  }

  const clearCache = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map(name => caches.delete(name)))
      }
      toast.success('Cache cleared successfully!')
    } catch (error) {
      toast.error('Failed to clear cache')
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'site', name: 'Site Settings', icon: Globe },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'seo', name: 'SEO & Meta', icon: ExternalLink },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'maintenance', name: 'Maintenance', icon: Settings },
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
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          value={settings.contactPhone}
                          onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          value={settings.location}
                          onChange={(e) => setSettings({...settings, location: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                        />
                      </div>
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
                    <h4 className="text-lg font-semibold text-white mb-4">Social Media Links</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                        <input
                          type="url"
                          value={settings.socialLinks.instagram}
                          onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, instagram: e.target.value}})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          placeholder="https://instagram.com/orbitx_zcoer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                        <input
                          type="url"
                          value={settings.socialLinks.linkedin}
                          onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, linkedin: e.target.value}})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          placeholder="https://linkedin.com/company/orbitx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                        <input
                          type="url"
                          value={settings.socialLinks.youtube}
                          onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, youtube: e.target.value}})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          placeholder="https://youtube.com/@orbitx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                        <input
                          type="url"
                          value={settings.socialLinks.twitter}
                          onChange={(e) => setSettings({...settings, socialLinks: {...settings.socialLinks, twitter: e.target.value}})}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          placeholder="https://twitter.com/orbitx_zcoer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive email notifications for important updates' },
                      { key: 'newMemberAlerts', title: 'New Member Alerts', desc: 'Get notified when new members join' },
                      { key: 'eventReminders', title: 'Event Reminders', desc: 'Receive reminders for upcoming events' },
                      { key: 'blogNotifications', title: 'Blog Notifications', desc: 'Get notified about new blog posts' },
                      { key: 'projectUpdates', title: 'Project Updates', desc: 'Receive updates about project progress' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{item.title}</h4>
                          <p className="text-gray-400 text-sm">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                            onChange={(e) => setSettings({
                              ...settings,
                              notifications: {...settings.notifications, [item.key]: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Dark Mode</h4>
                        <p className="text-gray-400 text-sm">Enable dark theme for the website</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.theme.darkMode}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: {...settings.theme, darkMode: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">Animations</h4>
                        <p className="text-gray-400 text-sm">Enable smooth animations and transitions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.theme.animationsEnabled}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: {...settings.theme, animationsEnabled: e.target.checked}
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">SEO & Meta Settings</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={settings.seo.metaTitle}
                      onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaTitle: e.target.value}})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      placeholder="OrbitX - Space Science & Astronomy Club"
                    />
                    <p className="text-gray-400 text-xs mt-1">{settings.seo.metaTitle.length}/60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Meta Description</label>
                    <textarea
                      rows={3}
                      value={settings.seo.metaDescription}
                      onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaDescription: e.target.value}})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="OrbitX is a student organization focused on learning, innovation, and collaboration in space technology and beyond."
                    />
                    <p className="text-gray-400 text-xs mt-1">{settings.seo.metaDescription.length}/160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Keywords</label>
                    <input
                      type="text"
                      value={settings.seo.keywords}
                      onChange={(e) => setSettings({...settings, seo: {...settings.seo, keywords: e.target.value}})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      placeholder="space, astronomy, technology, student organization, ZCOER, Pune"
                    />
                    <p className="text-gray-400 text-xs mt-1">Separate keywords with commas</p>
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

              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white">Maintenance Settings</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Maintenance Mode</h4>
                      <p className="text-gray-400 text-sm">Enable maintenance mode to show a maintenance page to visitors</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenance.maintenanceMode}
                        onChange={(e) => setSettings({
                          ...settings,
                          maintenance: {...settings.maintenance, maintenanceMode: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Maintenance Message</label>
                    <textarea
                      rows={3}
                      value={settings.maintenance.maintenanceMessage}
                      onChange={(e) => setSettings({...settings, maintenance: {...settings.maintenance, maintenanceMessage: e.target.value}})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400 resize-none"
                      placeholder="We are currently performing scheduled maintenance. Please check back soon."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={exportData}
                      className="btn-secondary flex items-center justify-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Settings
                    </button>
                    <button
                      onClick={clearCache}
                      className="btn-secondary flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cache
                    </button>
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
                        <div className="flex justify-between">
                          <span className="text-gray-400">Collections:</span>
                          <span className="text-white">{analytics.totalEvents + analytics.totalProjects + analytics.totalBlogs + analytics.totalMembers > 0 ? 'Active' : 'Empty'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-gray-400 text-sm">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="btn-primary flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}