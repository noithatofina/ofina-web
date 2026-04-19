import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 3-color system: 1 xanh trầm (#1A5FBF) + 1 đen (#111827) + grayscale
        brand: {
          50: '#EAF1F9',
          100: '#D2E0F1',
          200: '#1A5FBF',
          300: '#1A5FBF',
          400: '#1A5FBF',
          500: '#1A5FBF',
          600: '#154DA0',  // hover
          700: '#154DA0',
          800: '#154DA0',
          900: '#1A5FBF',  // PRIMARY blue (trầm hơn FB)
          950: '#111827',  // ĐEN ĐẬM
        },
        accent: {
          50: '#EAF1F9',
          100: '#D2E0F1',
          200: '#1A5FBF',
          300: '#1A5FBF',
          400: '#1A5FBF',
          500: '#1A5FBF',
          600: '#1A5FBF',
          700: '#1A5FBF',
          800: '#1A5FBF',
          900: '#1A5FBF',
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
