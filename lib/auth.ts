import { User } from 'firebase/auth'

// Owner email - only one owner allowed
const OWNER_EMAIL = 'asmitrajaramkar.orbitX@gmail.com'

// Admin emails - managed by owner
let ADMIN_EMAILS: string[] = []

export const isOwner = (user: User | null): boolean => {
  if (!user?.email) return false
  return user.email.toLowerCase() === OWNER_EMAIL
}

export const isAdmin = (user: User | null): boolean => {
  if (!user?.email) return false
  return ADMIN_EMAILS.includes(user.email.toLowerCase()) || isOwner(user)
}

export const getUserRole = (user: User | null): 'owner' | 'admin' | 'member' => {
  if (isOwner(user)) return 'owner'
  if (isAdmin(user)) return 'admin'
  return 'member'
}

export const getRedirectPath = (user: User | null): string => {
  if (isOwner(user) || isAdmin(user)) return '/admin/dashboard'
  return '/member'
}

export const getAdminEmails = (): string[] => ADMIN_EMAILS

export const addAdmin = (email: string): void => {
  if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
    ADMIN_EMAILS.push(email.toLowerCase())
  }
}

export const removeAdmin = (email: string): void => {
  ADMIN_EMAILS = ADMIN_EMAILS.filter(adminEmail => adminEmail !== email.toLowerCase())
}