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



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OrbitX – the Space Science & Astronomy Club',
  description: 'OrbitX is a student organization focused on learning, innovation, and collaboration in space technology and beyond.',
  icons: {
    icon: '/Logo_with_background.jpg',
    shortcut: '/Logo_with_background.jpg',
    apple: '/Logo_with_background.jpg',
  },
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
          <SpaceBackground />
          <div className="relative z-10">
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Chatbox />
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #475569'
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}