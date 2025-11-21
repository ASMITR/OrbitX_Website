'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'

export default function FirebaseSetup() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const setupFirebase = async () => {
    setLoading(true)
    setStatus('Setting up Firebase...')

    try {
      await addDoc(collection(db, 'events'), {
        title: 'Space Technology Workshop 2024',
        description: 'Learn about cutting-edge space technologies',
        date: '2024-03-15T10:00:00Z',
        location: 'ZCOER Auditorium',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
        createdAt: new Date().toISOString()
      })

      await addDoc(collection(db, 'projects'), {
        title: 'Mars Rover Simulation',
        description: 'Developing Mars rover operations simulation',
        status: 'Active',
        technologies: ['Python', 'ROS'],
        image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800',
        createdAt: new Date().toISOString()
      })

      await addDoc(collection(db, 'members'), {
        name: 'Asmit Rajaramkar',
        email: 'asmit@orbitx.com',
        position: 'Founder & President',
        team: 'Management',
        photo: 'https://ui-avatars.com/api/?name=Asmit+Rajaramkar&background=3b82f6&color=ffffff',
        approved: true,
        createdAt: new Date().toISOString()
      })

      await addDoc(collection(db, 'merchandise'), {
        name: 'OrbitX T-Shirt',
        description: 'Premium OrbitX branded t-shirt',
        price: 499,
        category: 'Apparel',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        inStock: true,
        stock: 50,
        createdAt: new Date().toISOString()
      })

      setStatus('✅ Firebase setup complete!')
    } catch (error) {
      setStatus(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Firebase Setup</h1>
        
        <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6">
          <button
            onClick={setupFirebase}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Setup Firebase'}
          </button>
        </div>

        {status && (
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <p className="text-gray-300">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}