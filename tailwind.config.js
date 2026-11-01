/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fffdf7',
          100: '#fdf6e3',
          200: '#f8ecd0',
          300: '#f1deae',
          400: '#e7c981',
        },
        peach: {
          50: '#fff5f0',
          100: '#ffe4d6',
          200: '#ffcbb4',
          300: '#ffb094',
          400: '#ff8f6f',
          500: '#f5734f',
        },
        warmyellow: {
          50: '#fffbe9',
          100: '#fff2c4',
          200: '#ffe690',
          300: '#ffd35a',
          400: '#fbbf24',
        },
        mint: {
          50: '#f0fdf6',
          100: '#d9f9e6',
          200: '#b6f1cf',
          300: '#84e6b0',
          400: '#4fd293',
          500: '#2bb378',
        },
        lavender: {
          50: '#f8f5ff',
          100: '#ece4ff',
          200: '#d9c7ff',
          300: '#c0a3ff',
          400: '#a17fff',
          500: '#8757f5',
        },
        rose: {
          50: '#fff5f7',
          100: '#ffe0e8',
          200: '#ffc2d1',
          300: '#ff9ab6',
          400: '#ff6f96',
        },
        ink: {
          400: '#7a6b5a',
          500: '#5b4d3e',
          600: '#3d342a',
        },
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(91, 77, 62, 0.18)',
        glow: '0 0 0 4px rgba(255, 255, 255, 0.6), 0 12px 36px -8px rgba(135, 87, 245, 0.35)',
        page: '0 20px 60px -20px rgba(91, 77, 62, 0.28), 0 4px 14px -6px rgba(91, 77, 62, 0.15)',
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '70%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        jello: {
          '0%,100%': { transform: 'scale(1, 1)' },
          '25%': { transform: 'scale(0.9, 1.1)' },
          '50%': { transform: 'scale(1.1, 0.9)' },
          '75%': { transform: 'scale(0.95, 1.05)' },
        },
        sparkle: {
          '0%,100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pageFlip: {
          '0%': { transform: 'perspective(1400px) rotateY(0deg)', opacity: '1' },
          '50%': { transform: 'perspective(1400px) rotateY(-22deg)', opacity: '0.7' },
          '100%': { transform: 'perspective(1400px) rotateY(0deg)', opacity: '1' },
        },
        pageEnter: {
          '0%': { transform: 'perspective(1400px) rotateY(22deg) translateX(20px)', opacity: '0' },
          '100%': { transform: 'perspective(1400px) rotateY(0deg) translateX(0)', opacity: '1' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-6px) rotate(2deg)' },
        },
      },
      animation: {
        'float-y': 'floatY 4s ease-in-out infinite',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        'pop-in': 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        jello: 'jello 0.6s ease-in-out',
        sparkle: 'sparkle 1.6s ease-in-out infinite',
        'confetti-fall': 'confettiFall 2.2s linear forwards',
        shimmer: 'shimmer 3s linear infinite',
        'page-flip': 'pageFlip 0.55s ease-in-out',
        'page-enter': 'pageEnter 0.55s ease-out',
        bob: 'bob 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
