/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F1E6',
        surface: '#FFFFFF',
        border: '#E5DFCF',
        'text-primary': '#201B16',
        'text-secondary': '#6B6255',
        brand: {
          DEFAULT: '#7A2A2A',
          dark: '#5E1F1F',
          light: '#9E3B3B',
          50: '#FDF7F7',
          100: '#F7E8E8',
          200: '#EFCACA',
          300: '#DF9B9B',
          400: '#C86464',
          500: '#7A2A2A',
          600: '#5E1F1F',
          700: '#461717',
          800: '#321010',
          900: '#1F0A0A',
        },
        'accent-gold': {
          DEFAULT: '#B9862F',
          light: '#D4A853',
          dark: '#8C621C',
          bg: '#FAF3E7',
        },
        success: {
          DEFAULT: '#2F6B4F',
          light: '#428E69',
          bg: '#EAF5EE',
        },
        'hero-bg': '#F0E8D8',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(32, 27, 22, 0.08), 0 1px 4px -1px rgba(32, 27, 22, 0.04)',
        cardHover: '0 6px 16px -2px rgba(122, 42, 42, 0.12), 0 2px 6px -1px rgba(32, 27, 22, 0.06)',
        button: '0 2px 4px rgba(122, 42, 42, 0.25)',
      }
    },
  },
  plugins: [],
}
