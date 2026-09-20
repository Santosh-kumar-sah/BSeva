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
        },
        'accent-gold': '#B9862F',
        success: '#2F6B4F',
        'hero-bg': '#F0E8D8',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', 'system-ui', '-apple-system', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(32, 27, 22, 0.05), 0 1px 2px rgba(32, 27, 22, 0.03)',
        cardHover: '0 4px 12px rgba(32, 27, 22, 0.08), 0 2px 4px rgba(32, 27, 22, 0.04)',
      }
    },
  },
  plugins: [],
}
