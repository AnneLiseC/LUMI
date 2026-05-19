import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'lumi-gradient': 'linear-gradient(135deg, #6C9FFF 0%, #A78BFA 50%, #22D3EE 100%)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(167,139,250,0.4)',
        'glow-blue': '0 0 20px rgba(108,159,255,0.4)',
        'glow-green': '0 0 20px rgba(52,211,153,0.35)',
        card: '0 4px 24px rgba(0,0,0,0.06)',
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
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
          '50%': { transform: 'translateY(-8px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(167,139,250,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(167,139,250,0.7)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
