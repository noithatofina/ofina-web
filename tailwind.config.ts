import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 3-color system: 1 xanh (#1877F2) + 1 đen (#111827) + grayscale
        brand: {
          50: '#EBF3FE',
          100: '#D7E7FE',
          200: '#1877F2',
          300: '#1877F2',
          400: '#1877F2',
          500: '#1877F2',
          600: '#1668D5',  // hover (subtle -5% lightness)
          700: '#1668D5',
          800: '#1668D5',
          900: '#1877F2',  // PRIMARY blue
          950: '#111827',  // ĐEN ĐẬM (replaces navy for dark bg/text)
        },
        accent: {
          50: '#EBF3FE',
          100: '#D7E7FE',
          200: '#1877F2',
          300: '#1877F2',
          400: '#1877F2',
          500: '#1877F2',  // unified to blue (no more yellow)
          600: '#1877F2',
          700: '#1877F2',
          800: '#1877F2',
          900: '#1877F2',
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
