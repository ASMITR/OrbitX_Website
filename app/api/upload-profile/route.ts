import { NextRequest, NextResponse } from 'next/server'
import { storage, db } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const storageRef = ref(storage, `profiles/${userId}/${Date.now()}_${file.name}`)
    await uploadBytes(storageRef, buffer)
    const photoURL = await getDownloadURL(storageRef)

    const adminRef = doc(db, 'admins', userId)
    await updateDoc(adminRef, { photo: photoURL })

    return NextResponse.json({ photoURL })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}