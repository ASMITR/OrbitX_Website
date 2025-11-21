'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function TestFirebase() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState('')

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Firebase Auth
        console.log('Auth instance:', auth)
        
        // Test Firestore
        console.log('DB instance:', db)
        
        // Try to read from Firestore
        const testDoc = doc(db, 'settings', 'roles')
        const docSnap = await getDoc(testDoc)
        
        if (docSnap.exists()) {
          setStatus('Firebase connected successfully! Roles document exists.')
        } else {
          setStatus('Firebase connected! Roles document does not exist yet.')
        }
      } catch (err: any) {
        console.error('Firebase test error:', err)
        setError(err.message)
        setStatus('Firebase connection failed')
      }
    }

    testFirebase()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
      <div className="max-w-md w-full bg-white/10 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Firebase Test</h1>
        <p className="mb-4">{status}</p>
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        <div className="mt-4 text-sm text-gray-400">
          <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
          <p>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</p>
        </div>
      </div>
    </div>
  )
}