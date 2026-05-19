import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'LUMI – Apprends à ta façon',
  description: 'Application éducative adaptée pour les enfants avec TDAH, dyslexie et dyscalculie.',
  keywords: ['éducation', 'TDAH', 'dyslexie', 'apprentissage', 'numérique'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={nunito.variable} suppressHydrationWarning>
      <head>
        {/* Inline script: apply dark class before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('lumi-theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#1E293B',
              borderRadius: '16px',
              border: '2px solid #DBEAFE',
              fontWeight: 600,
              fontSize: '15px',
            },
          }}
        />
      </body>
    </html>
  )
}
