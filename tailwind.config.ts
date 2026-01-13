import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta corporativa MA-IN
        primary: {
          DEFAULT: '#138A6F',
          50: '#E6F5F1',
          100: '#CCEBE3',
          200: '#99D7C7',
          300: '#66C3AB',
          400: '#33AF8F',
          500: '#138A6F',
          600: '#0F6E59',
          700: '#0B5343',
          800: '#08372C',
          900: '#041C16',
        },
        accent: {
          DEFAULT: '#E1C357',
          50: '#FCF9EE',
          100: '#F9F3DD',
          200: '#F3E7BB',
          300: '#EDDB99',
          400: '#E7CF77',
          500: '#E1C357',
          600: '#D4B033',
          700: '#A38826',
          800: '#6D5B19',
          900: '#362D0D',
        },
        light: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-corporate': 'linear-gradient(135deg, #138A6F 0%, #0F6E59 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
