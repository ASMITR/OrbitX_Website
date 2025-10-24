// Image compression and upload utilities
export const compressImage = (file: File, maxWidth = 600, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    if (file.size < 500 * 1024) {
      resolve(file)
      return
    }
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const uploadToFirebase = async (
  file: File, 
  path: string, 
  onProgress?: (progress: number) => void
): Promise<string> => {
  const { ref, uploadBytesResumable, getDownloadURL } = await import('firebase/storage')
  const { storage } = await import('./firebase')
  
  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)
  
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(progress)
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}

export const generateUploadPath = (type: 'events' | 'projects' | 'blogs' | 'members', fileName: string): string => {
  const timestamp = Date.now()
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${type}/${timestamp}_${cleanFileName}`
}