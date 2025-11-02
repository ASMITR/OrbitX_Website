export const getCloudinaryUrl = (publicId: string, transformations?: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`
  
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`
  }
  
  return `${baseUrl}/${publicId}`
}

export const getOptimizedImageUrl = (
  publicId: string, 
  width: number, 
  height: number, 
  quality: number = 80
) => {
  return getCloudinaryUrl(publicId, `w_${width},h_${height},c_fill,q_${quality}`)
}