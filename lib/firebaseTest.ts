import { db } from './firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'

export const testFirebaseConnection = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Try to read a small amount of data from any collection
    const testQuery = query(collection(db, 'members'), limit(1))
    await getDocs(testQuery)
    return { success: true }
  } catch (error: any) {
    console.error('Firebase connection test failed:', error)
    return { 
      success: false, 
      error: error.message || 'Unknown Firebase connection error' 
    }
  }
}

export const getFirebaseStatus = async () => {
  const connectionTest = await testFirebaseConnection()
  
  return {
    connected: connectionTest.success,
    error: connectionTest.error,
    timestamp: new Date().toISOString()
  }
}