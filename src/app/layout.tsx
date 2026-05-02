import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LUMI – Apprends à ta façon',
  description: 'Application éducative adaptée pour les enfants avec TDAH, dyslexie et dyscalculie.',
  keywords: ['éducation', 'TDAH', 'dyslexie', 'apprentissage', 'numérique'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#2C3E50',
              borderRadius: '16px',
              border: '2px solid #EBF3FB',
              fontWeight: 600,
              fontSize: '15px',
            },
          }}
        />
      </body>
    </html>
  )
}
