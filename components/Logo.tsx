import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  admin?: boolean
}

export default function Logo({ className = "h-10 w-auto", showText = false, admin = false }: LogoProps) {
  return (
    <div className="flex items-center space-x-2">
      <Image 
        src="/Logo_without_background.png" 
        alt="OrbitX Logo" 
        width={120}
        height={40}
        className={`${className} object-contain`}
        priority
      />
      {showText && (
        <span className="text-lg font-bold text-white">
          {admin ? 'Admin' : ''}
        </span>
      )}
    </div>
  )
}