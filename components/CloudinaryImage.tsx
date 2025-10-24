'use client'

import Image from 'next/image'

interface CloudinaryImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  quality?: number
}

export default function CloudinaryImage({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className = '',
  quality = 80 
}: CloudinaryImageProps) {
  // Check if it's a Cloudinary URL
  const isCloudinaryUrl = src.includes('cloudinary.com')
  
  if (!isCloudinaryUrl) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    )
  }

  // Add Cloudinary transformations for optimization
  const optimizedSrc = src.replace('/upload/', `/upload/w_${width},h_${height},c_fill,q_${quality}/`)

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}