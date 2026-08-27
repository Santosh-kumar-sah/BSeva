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
          saffron: '#FF671F',
          orange: '#FF8533',
          green: '#046A38',
          navy: '#06038D',
          dark: '#0f172a',
          surface: '#f8fafc',
          card: '#ffffff',
          primary: '#2563eb',
          accent: '#10b981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
