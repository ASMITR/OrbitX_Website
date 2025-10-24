import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from './firebase'
import { User } from 'firebase/auth'

interface UserRole {
  email: string
  role: 'owner' | 'admin' | 'member'
  createdAt: string
}

// Initialize roles collection with owner
export const initializeOwner = async (ownerEmail: string) => {
  try {
    const rolesRef = doc(db, 'settings', 'roles')
    const rolesDoc = await getDoc(rolesRef)
    
    if (!rolesDoc.exists()) {
      await setDoc(rolesRef, {
        owner: ownerEmail.toLowerCase(),
        admins: [],
        createdAt: new Date().toISOString()
      })
    }
  } catch (error) {
    console.error('Error initializing owner:', error)
  }
}

// Get user role from Firestore
export const getUserRoleFromDB = async (user: User | null): Promise<'owner' | 'admin' | 'member'> => {
  if (!user?.email) return 'member'
  
  try {
    const rolesRef = doc(db, 'settings', 'roles')
    const rolesDoc = await getDoc(rolesRef)
    
    if (!rolesDoc.exists()) {
      return 'member'
    }
    
    const data = rolesDoc.data()
    const userEmail = user.email.toLowerCase()
    
    if (data.owner === userEmail) return 'owner'
    if (data.admins?.includes(userEmail)) return 'admin'
    return 'member'
  } catch (error) {
    console.error('Error getting user role:', error)
    return 'member'
  }
}

// Check if user is owner
export const isOwnerDB = async (user: User | null): Promise<boolean> => {
  const role = await getUserRoleFromDB(user)
  return role === 'owner'
}

// Check if user is admin or owner
export const isAdminDB = async (user: User | null): Promise<boolean> => {
  const role = await getUserRoleFromDB(user)
  return role === 'admin' || role === 'owner'
}

// Add admin to Firestore
export const addAdminToDB = async (email: string): Promise<boolean> => {
  try {
    const rolesRef = doc(db, 'settings', 'roles')
    await updateDoc(rolesRef, {
      admins: arrayUnion(email.toLowerCase())
    })
    return true
  } catch (error) {
    console.error('Error adding admin:', error)
    return false
  }
}

// Remove admin from Firestore
export const removeAdminFromDB = async (email: string): Promise<boolean> => {
  try {
    const rolesRef = doc(db, 'settings', 'roles')
    await updateDoc(rolesRef, {
      admins: arrayRemove(email.toLowerCase())
    })
    return true
  } catch (error) {
    console.error('Error removing admin:', error)
    return false
  }
}

// Get all admins
export const getAdminsFromDB = async (): Promise<string[]> => {
  try {
    const rolesRef = doc(db, 'settings', 'roles')
    const rolesDoc = await getDoc(rolesRef)
    
    if (rolesDoc.exists()) {
      return rolesDoc.data().admins || []
    }
    return []
  } catch (error) {
    console.error('Error getting admins:', error)
    return []
  }
}

// Get owner email
export const getOwnerFromDB = async (): Promise<string | null> => {
  try {
    const rolesRef = doc(db, 'settings', 'roles')
    const rolesDoc = await getDoc(rolesRef)
    
    if (rolesDoc.exists()) {
      return rolesDoc.data().owner || null
    }
    return null
  } catch (error) {
    console.error('Error getting owner:', error)
    return null
  }
}