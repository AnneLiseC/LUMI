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
          blue: '#6C9FFF',
          'blue-light': '#EEF2FF',
          yellow: '#FBBF24',
          'yellow-light': '#FEF3C7',
          green: '#34D399',
          'green-light': '#D1FAE5',
          purple: '#A78BFA',
          'purple-light': '#EDE9FE',
          cyan: '#22D3EE',
          cream: '#F0F2FF',
          text: '#1A1A2E',
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
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        float: 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
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
