export const uploadToCustomDB = async (
  file: File,
  category: 'events' | 'projects' | 'blogs' | 'members',
  type: 'image' | 'video' | 'reel' = 'image'
): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', `orbitx/${category}`)
  
  const response = await fetch('/api/upload/cloudinary', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) {
    throw new Error('Upload failed')
  }
  
  const result = await response.json()
  return result.url
}