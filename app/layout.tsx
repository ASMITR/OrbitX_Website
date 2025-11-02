import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SpaceBackground from '@/components/SpaceBackground'
import AuthProvider from '@/components/admin/AuthProvider'
import Chatbox from '@/components/Chatbox'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { CartProvider } from '@/contexts/CartContext'
import { Suspense } from 'react'



const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'OrbitX – the Space Science & Astronomy Club',
  description: 'OrbitX is a student organization focused on learning, innovation, and collaboration in space technology and beyond.',
  keywords: 'space science, astronomy, OrbitX, student organization, space technology',
  robots: 'index, follow',
  icons: {
    icon: '/Logo_with_background.jpg',
    shortcut: '/Logo_with_background.jpg',
    apple: '/Logo_with_background.jpg',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<div className="fixed inset-0 bg-black" />}>
              <SpaceBackground />
            </Suspense>
            <div className="relative z-10">
              <Navbar />
              <main className="min-h-screen">
                <Suspense fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                  </div>
                }>
                  {children}
                </Suspense>
              </main>
              <Suspense fallback={null}>
                <Footer />
              </Suspense>
              <Suspense fallback={null}>
                <Chatbox />
              </Suspense>
            </div>
          </CartProvider>
          <Suspense fallback={null}>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #475569'
                }
              }}
            />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}