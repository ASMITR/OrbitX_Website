'use client'

import { useEffect, useState } from 'react'
import MaintenancePage from '@/components/MaintenancePage'

export default function Maintenance() {
  const [message, setMessage] = useState('We are currently performing scheduled maintenance. Please check back soon.')

  useEffect(() => {
    const fetchMaintenanceMessage = async () => {
      try {
        const response = await fetch('/api/maintenance')
        if (response.ok) {
          const data = await response.json()
          setMessage(data.maintenanceMessage)
        }
      } catch (error) {
        console.error('Error fetching maintenance message:', error)
      }
    }

    fetchMaintenanceMessage()
  }, [])

  return <MaintenancePage message={message} />
}