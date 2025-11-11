'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface AboutStats {
  members: number
  projects: number
  events: number
  achievements: number
}

export function useAboutData() {
  const [stats, setStats] = useState<AboutStats>({
    members: 0,
    projects: 0,
    events: 0,
    achievements: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInitialStats = async () => {
      try {
        const [membersSnap, projectsSnap, eventsSnap] = await Promise.all([
          getDocs(collection(db, 'members')),
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'events'))
        ])
        
        setStats({
          members: membersSnap.size,
          projects: projectsSnap.size,
          events: eventsSnap.size,
          achievements: 8
        })
      } catch (error) {
        setStats({ members: 50, projects: 25, events: 15, achievements: 8 })
      } finally {
        setLoading(false)
      }
    }

    fetchInitialStats()

    const unsubscribeMembers = onSnapshot(collection(db, 'members'), (snapshot) => {
      setStats(prev => ({ ...prev, members: snapshot.size }))
    })

    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setStats(prev => ({ ...prev, projects: snapshot.size }))
    })

    const unsubscribeEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      setStats(prev => ({ ...prev, events: snapshot.size }))
    })

    return () => {
      unsubscribeMembers()
      unsubscribeProjects()
      unsubscribeEvents()
    }
  }, [])

  return { stats, loading }
}