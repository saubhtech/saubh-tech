import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: '#13131A',
        surface2: '#1C1C27',
        primary: '#7C3AED',
        secondary: '#EC4899',
        accent: '#F97316',
        txt: '#F8F8FF',
        'txt-muted': '#6B7280',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        glass: '16px',
      },
      animation: {
        skeleton: 'skeleton 1.5s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: '0.05' },
          '50%': { opacity: '0.12' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
