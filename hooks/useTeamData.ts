'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface TeamMember {
  id: string
  name: string
  role: string
  team: string
  position: string
  image?: string
}

export function useTeamData() {
  const [leadership, setLeadership] = useState<TeamMember[]>([])
  const [teamLeaders, setTeamLeaders] = useState<TeamMember[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const leadershipQuery = query(
      collection(db, 'members'),
      where('position', 'in', ['President', 'Chairman', 'Secretary', 'Treasurer']),
      orderBy('name')
    )

    const teamLeadersQuery = query(
      collection(db, 'members'),
      where('role', '==', 'Team Leader'),
      orderBy('name')
    )

    const membersQuery = query(
      collection(db, 'members'),
      where('role', '==', 'Member'),
      orderBy('name')
    )

    const unsubscribeLeadership = onSnapshot(leadershipQuery, (snapshot) => {
      const leadershipData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[]
      setLeadership(leadershipData)
    })

    const unsubscribeTeamLeaders = onSnapshot(teamLeadersQuery, (snapshot) => {
      const teamLeadersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[]
      setTeamLeaders(teamLeadersData)
    })

    const unsubscribeMembers = onSnapshot(membersQuery, (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[]
      setMembers(membersData)
      setLoading(false)
    })

    return () => {
      unsubscribeLeadership()
      unsubscribeTeamLeaders()
      unsubscribeMembers()
    }
  }, [])

  return { leadership, teamLeaders, members, loading }
}