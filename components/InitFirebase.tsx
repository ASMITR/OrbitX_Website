'use client'

import { useEffect, useState } from 'react'

export default function InitFirebase() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const initFirebase = async () => {
      try {
        const response = await fetch('/api/init-firebase', {
          method: 'POST'
        })
        const result = await response.json()
        console.log('Firebase init:', result.message)
        setInitialized(true)
      } catch (error) {
        console.error('Firebase init error:', error)
      }
    }

    if (!initialized) {
      initFirebase()
    }
  }, [initialized])

  return null
}