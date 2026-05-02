import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/lib/theme'

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
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('lumi-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}})();` }} />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              className: 'dark:!bg-slate-800 dark:!text-slate-100 dark:!border-slate-700',
              style: {
                borderRadius: '16px',
                border: '2px solid #EDE9FE',
                fontWeight: 600,
                fontSize: '15px',
                fontFamily: 'var(--font-nunito)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
