/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bihar: {
          terracotta: '#C2410C', // Madhubani warm terracotta primary
          saffron: '#EA580C',    // Vibrant action saffron
          amber: '#D97706',      // Nalanda ochre/gold
          emerald: '#047857',    // Gangetic forest green
          navy: '#0F172A',       // Deep mithila midnight
          surface: '#F8FAFC',    // Clean neutral surface
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Hind', 'system-ui', '-apple-system', 'sans-serif'],
        hindi: ['Hind', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
