import { Event, Project, Member, ContactMessage, Blog } from './types'
import { db } from './firebase'
import { getCache, setCache } from './cache'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore'

// Events
export const getEvents = async (limitCount?: number) => {
  const cacheKey = `events_${limitCount || 'all'}`
  const cached = getCache(cacheKey)
  if (cached) return cached
  
  const q = limitCount 
    ? query(collection(db, 'events'), orderBy('date', 'desc'), limit(limitCount))
    : query(collection(db, 'events'), orderBy('date', 'desc'))
  
  const snapshot = await getDocs(q)
  const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event))
  
  setCache(cacheKey, events, 2)
  return events
}

export const getEvent = async (id: string) => {
  const docRef = doc(db, 'events', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Event : null
}

export const addEvent = async (event: Omit<Event, 'id'>) => {
  return await addDoc(collection(db, 'events'), event)
}

export const updateEvent = async (id: string, event: Partial<Event>) => {
  const docRef = doc(db, 'events', id)
  return await updateDoc(docRef, event)
}

export const deleteEvent = async (id: string) => {
  const docRef = doc(db, 'events', id)
  return await deleteDoc(docRef)
}

// Projects
export const getProjects = async (limitCount?: number) => {
  const cacheKey = `projects_${limitCount || 'all'}`
  const cached = getCache(cacheKey)
  if (cached) return cached
  
  const q = limitCount 
    ? query(collection(db, 'projects'), orderBy('createdAt', 'desc'), limit(limitCount))
    : query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
  
  const snapshot = await getDocs(q)
  const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project))
  
  setCache(cacheKey, projects, 2)
  return projects
}

export const getProject = async (id: string) => {
  const docRef = doc(db, 'projects', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Project : null
}

export const addProject = async (project: Omit<Project, 'id'>) => {
  return await addDoc(collection(db, 'projects'), project)
}

export const updateProject = async (id: string, project: Partial<Project>) => {
  const docRef = doc(db, 'projects', id)
  return await updateDoc(docRef, project)
}

export const deleteProject = async (id: string) => {
  const docRef = doc(db, 'projects', id)
  return await deleteDoc(docRef)
}

// Members
export const getMembers = async () => {
  const q = query(collection(db, 'members'), orderBy('name'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member))
}

export const getMembersByTeam = async (team: string) => {
  const q = query(collection(db, 'members'), where('team', '==', team), orderBy('name'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member))
}

export const getMember = async (id: string) => {
  const docRef = doc(db, 'members', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Member : null
}

export const addMember = async (member: Omit<Member, 'id'>) => {
  return await addDoc(collection(db, 'members'), member)
}

export const updateMember = async (id: string, member: Partial<Member>) => {
  const docRef = doc(db, 'members', id)
  return await updateDoc(docRef, member)
}

export const deleteMember = async (id: string) => {
  const docRef = doc(db, 'members', id)
  return await deleteDoc(docRef)
}

// Contact Messages
export const getContactMessages = async () => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage))
}

export const addContactMessage = async (message: Omit<ContactMessage, 'id'>) => {
  return await addDoc(collection(db, 'messages'), message)
}

export const deleteContactMessage = async (id: string) => {
  const docRef = doc(db, 'messages', id)
  return await deleteDoc(docRef)
}

// Blogs
export const getBlogs = async (limitCount?: number) => {
  const cacheKey = `blogs_${limitCount || 'all'}`
  const cached = getCache(cacheKey)
  if (cached) return cached
  
  const q = limitCount 
    ? query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'), limit(limitCount))
    : query(collection(db, 'blogs'), orderBy('publishedAt', 'desc'))
  
  const snapshot = await getDocs(q)
  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Blog))
  
  setCache(cacheKey, blogs, 2)
  return blogs
}

export const getBlog = async (id: string) => {
  const docRef = doc(db, 'blogs', id)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Blog : null
}

export const addBlog = async (blog: Omit<Blog, 'id'>) => {
  return await addDoc(collection(db, 'blogs'), blog)
}

export const updateBlog = async (id: string, blog: Partial<Blog>) => {
  const docRef = doc(db, 'blogs', id)
  return await updateDoc(docRef, blog)
}

export const deleteBlog = async (id: string) => {
  const docRef = doc(db, 'blogs', id)
  return await deleteDoc(docRef)
}

// Admin Profile
export const getAdminProfile = async (uid: string) => {
  const docRef = doc(db, 'adminProfiles', uid)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const profile = docSnap.data()
    // Try to find matching member by email if photo not in profile
    if (!profile.photo && profile.email) {
      const membersQuery = query(collection(db, 'members'), where('email', '==', profile.email))
      const memberSnap = await getDocs(membersQuery)
      if (!memberSnap.empty) {
        const memberData = memberSnap.docs[0].data()
        return { ...profile, photo: memberData.photo }
      }
    }
    return profile
  }
  return null
}

export const updateAdminProfile = async (uid: string, profile: { name: string }) => {
  const docRef = doc(db, 'adminProfiles', uid)
  return await updateDoc(docRef, profile)
}

export const createAdminProfile = async (uid: string, profile: { name: string }) => {
  const docRef = doc(db, 'adminProfiles', uid)
  return await setDoc(docRef, profile)
}

// Member Badge Management
export const awardBadge = async (memberId: string, badge: Omit<Badge, 'id'>) => {
  const memberRef = doc(db, 'members', memberId)
  const memberSnap = await getDoc(memberRef)
  if (memberSnap.exists()) {
    const currentBadges = memberSnap.data().badges || []
    const newBadge = { ...badge, id: Date.now().toString() }
    await updateDoc(memberRef, { badges: [...currentBadges, newBadge] })
    return newBadge
  }
  return null
}

export const addMemberToEvent = async (memberId: string, eventId: string) => {
  const memberRef = doc(db, 'members', memberId)
  const memberSnap = await getDoc(memberRef)
  if (memberSnap.exists()) {
    const currentEvents = memberSnap.data().eventsParticipated || []
    if (!currentEvents.includes(eventId)) {
      await updateDoc(memberRef, { eventsParticipated: [...currentEvents, eventId] })
    }
  }
}

export const addMemberToProject = async (memberId: string, projectId: string) => {
  const memberRef = doc(db, 'members', memberId)
  const memberSnap = await getDoc(memberRef)
  if (memberSnap.exists()) {
    const currentProjects = memberSnap.data().projectsParticipated || []
    if (!currentProjects.includes(projectId)) {
      await updateDoc(memberRef, { projectsParticipated: [...currentProjects, projectId] })
    }
  }
}

// Likes and Comments
export const toggleLike = async (collection: string, id: string, userId: string) => {
  const docRef = doc(db, collection, id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const data = docSnap.data()
    const likedBy = data.likedBy || []
    const hasLiked = likedBy.includes(userId)
    
    if (hasLiked) {
      const newLikedBy = likedBy.filter((uid: string) => uid !== userId)
      await updateDoc(docRef, { 
        likes: Math.max(0, (data.likes || 0) - 1),
        likedBy: newLikedBy
      })
      return { likes: Math.max(0, (data.likes || 0) - 1), likedBy: newLikedBy }
    } else {
      const newLikedBy = [...likedBy, userId]
      await updateDoc(docRef, { 
        likes: (data.likes || 0) + 1,
        likedBy: newLikedBy
      })
      return { likes: (data.likes || 0) + 1, likedBy: newLikedBy }
    }
  }
  return { likes: 0, likedBy: [] }
}

export const addComment = async (collection: string, id: string, comment: { author: string, content: string }) => {
  const docRef = doc(db, collection, id)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const currentComments = docSnap.data().comments || []
    const newComment = {
      id: Date.now().toString(),
      ...comment,
      createdAt: new Date().toISOString()
    }
    await updateDoc(docRef, { comments: [...currentComments, newComment] })
    return newComment
  }
  return null
}