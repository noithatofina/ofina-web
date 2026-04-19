import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // OFINA Brand Colors — Facebook-blue palette (#1877F2 canonical)
        brand: {
          50: '#EBF3FE',
          100: '#D7E7FE',
          200: '#AECFFC',
          300: '#7EB1FA',
          400: '#4F95F8',
          500: '#1877F2',
          600: '#1568D5',
          700: '#1356B0',
          800: '#154FA0',
          900: '#1877F2',  // PRIMARY — Facebook blue
          950: '#0E4794',  // Deep navy (footer / hero gradient depth)
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',  // CTA vàng đồng
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        sale: {
          DEFAULT: '#DC2626',
          light: '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8vw, 5rem)', { lineHeight: '1.1' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      aspectRatio: {
        'product': '4/5',
        'banner': '21/9',
      },
    },
  },
  plugins: [],
}

export default config
