import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export interface SiteSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  location: string
  socialLinks: {
    instagram: string
    linkedin: string
    youtube: string
    twitter: string
  }
}

let cachedSettings: SiteSettings | null = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const now = Date.now()
  
  // Return cached settings if still valid
  if (cachedSettings && (now - lastFetch) < CACHE_DURATION) {
    return cachedSettings
  }

  try {
    const settingsRef = doc(db, 'settings', 'siteConfig')
    const settingsDoc = await getDoc(settingsRef)
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data()
      cachedSettings = {
        siteName: data.siteName || 'OrbitX',
        siteDescription: data.siteDescription || 'Exploring Beyond Horizons',
        contactEmail: data.contactEmail || 'orbitx@zcoer.edu.in',
        contactPhone: data.contactPhone || '+91 98765 43210',
        location: data.location || 'ZCOER, Pune, Maharashtra',
        socialLinks: {
          instagram: data.socialLinks?.instagram || 'https://instagram.com/orbitx_zcoer',
          linkedin: data.socialLinks?.linkedin || 'https://linkedin.com/company/orbitx',
          youtube: data.socialLinks?.youtube || 'https://youtube.com/@orbitx',
          twitter: data.socialLinks?.twitter || ''
        }
      }
      lastFetch = now
      return cachedSettings
    }
  } catch (error) {
    console.error('Error fetching site settings:', error)
  }

  // Return default settings if fetch fails
  const defaultSettings: SiteSettings = {
    siteName: 'OrbitX',
    siteDescription: 'Exploring Beyond Horizons',
    contactEmail: 'Orbitx@zealeducation.com',
    contactPhone: '+91 8767576542',
    location: 'ZCOER, Pune, Maharashtra',
    socialLinks: {
      instagram: 'https://instagram.com/orbitx_zcoer',
      linkedin: 'https://linkedin.com/company/orbitx',
      youtube: 'https://youtube.com/@orbitx',
      twitter: ''
    }
  }

  cachedSettings = defaultSettings
  lastFetch = now
  return defaultSettings
}

// Clear cache when settings are updated
export const clearSettingsCache = () => {
  cachedSettings = null
  lastFetch = 0
}