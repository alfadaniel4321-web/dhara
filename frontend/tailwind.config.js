/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#2D6A4F',
        lime: '#95D5B2',
        ivory: '#FFFDF5',
        earth: '#8D6E63',
        gold: '#C8A951',
        farmgreen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#042f1a',
        },
        accentgold: {
          50: '#fdfbeb',
          100: '#fcf6c5',
          200: '#f9ea8d',
          300: '#f6d54d',
          400: '#f3be1c',
          500: '#dca310',
          600: '#b77c0b',
          700: '#92580c',
          800: '#76450f',
          950: '#271103',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'Noto Sans Malayalam', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        malayalam: ['Noto Sans Malayalam', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
