import { ReactNode } from 'react'

interface ResponsiveTextProps {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  className?: string
  clamp?: 1 | 2 | 3
}

export default function ResponsiveText({ 
  children, 
  as: Component = 'p', 
  size = 'base',
  className = '',
  clamp
}: ResponsiveTextProps) {
  const sizeClass = `text-responsive-${size}`
  const clampClass = clamp ? `line-clamp-${clamp}` : ''
  
  return (
    <Component className={`text-container ${sizeClass} ${clampClass} ${className}`}>
      {children}
    </Component>
  )
}