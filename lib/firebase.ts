import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error('Firebase configuration is incomplete. Please check your environment variables.')
}

let app
try {
  app = initializeApp(firebaseConfig)
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw new Error('Failed to initialize Firebase. Please check your configuration.')
}

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app