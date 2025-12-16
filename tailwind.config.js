/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Chocolate Truffle Theme
        primary: {
          DEFAULT: '#713600',
          50: '#F5EBE0',
          100: '#E8D5C4',
          200: '#D4B59E',
          300: '#C09578',
          400: '#AC7552',
          500: '#713600',
          600: '#5A2B00',
          700: '#432000',
          800: '#2C1600',
          900: '#1A0D00',
        },
        secondary: {
          DEFAULT: '#C05800',
          50: '#FDF5ED',
          100: '#FAE6D2',
          200: '#F5D4AD',
          300: '#F0C288',
          400: '#EBB063',
          500: '#C05800',
          600: '#994600',
          700: '#733400',
          800: '#4D2300',
          900: '#261100',
        },
        accent: {
          DEFAULT: '#FDFBD4',
          50: '#FFFEF9',
          100: '#FFFEF5',
          200: '#FFFDF0',
          300: '#FFFCE8',
          400: '#FFFBDC',
          500: '#FDFBD4',
          600: '#F5F3CC',
          700: '#EDEBC4',
          800: '#E5E3BC',
          900: '#DDDBB4',
        },
        dark: {
          DEFAULT: '#38240D',
          50: '#D4C8BF',
          100: '#B8A89B',
          200: '#9C8877',
          300: '#806853',
          400: '#64482F',
          500: '#38240D',
          600: '#2D1D0A',
          700: '#221608',
          800: '#170F05',
          900: '#0C0803',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow-primary': '0 0 20px rgba(113, 54, 0, 0.3)',
        'glow-secondary': '0 0 20px rgba(192, 88, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #713600 0%, #C05800 100%)',
        'gradient-dark': 'linear-gradient(135deg, #38240D 0%, #713600 100%)',
        'gradient-warm': 'linear-gradient(135deg, #C05800 0%, #EBB063 100%)',
        'gradient-light': 'linear-gradient(135deg, #FDFBD4 0%, #FFFCE8 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}