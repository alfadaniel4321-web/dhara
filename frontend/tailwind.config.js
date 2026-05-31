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
        'deep-forest': '#0D5B43',
        'warm-gold': '#D9A441',
        'primary-green': '#0F5132',
        'dark-forest': '#0A3B2A',
        cream: '#F8F6F0',
        'light-beige': '#F4F1E8',
        'text-dark': '#1D2B1F',
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
        sans: ['Inter', 'DM Sans', 'Noto Sans Malayalam', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        malayalam: ['Noto Sans Malayalam', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'DM Sans', 'Noto Sans Malayalam', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
      },
      boxShadow: {
        'premium': '0 4px 24px rgba(0,0,0,0.06)',
        'premium-lg': '0 8px 40px rgba(0,0,0,0.08)',
        'premium-xl': '0 16px 60px rgba(0,0,0,0.1)',
        'card': '0 2px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.08)',
        'button': '0 4px 16px rgba(15,81,50,0.2)',
        'button-hover': '0 8px 28px rgba(15,81,50,0.3)',
        'nav': '0 -4px 20px rgba(0,0,0,0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-up-sm': 'slideUpSm 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUpSm: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
    },
  },
  plugins: [],
}
