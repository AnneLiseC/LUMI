import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lumi: {
          blue: '#2563EB',
          'blue-light': '#DBEAFE',
          yellow: '#F59E0B',
          'yellow-light': '#FEF3C7',
          green: '#10B981',
          'green-light': '#D1FAE5',
          purple: '#7C3AED',
          'purple-light': '#EDE9FE',
          cream: '#F8FAFC',
          text: '#1E293B',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        dyslexia: ['OpenDyslexic', 'Comic Sans MS', 'cursive'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'blob-delay': 'blob 7s infinite 2s',
        'blob-delay2': 'blob 7s infinite 4s',
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'xp-fill': 'xpFill 1s ease-out forwards',
        'logo-glow': 'logoGlow 3s ease-in-out infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        logoGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.6), 0 0 40px rgba(37, 99, 235, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(37, 99, 235, 0.8), 0 0 60px rgba(6, 182, 212, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        xpFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
