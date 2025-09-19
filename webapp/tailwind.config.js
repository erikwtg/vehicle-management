/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      animation: {
        'dropdown-enter': 'dropdown-enter 0.1s ease-out',
        'dropdown-leave': 'dropdown-leave 0.075s ease-in',
        'modal-fade-in': 'modalFadeIn 0.3s ease-out',
        'modal-fade-out': 'modalFadeOut 0.3s ease-in',
        'shake': 'shake 0.5s ease-in-out',
        'fadeInUp': 'fadeInUp 0.3s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        'dropdown-enter': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'dropdown-leave': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        'modalFadeIn': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'modalFadeOut': {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'fadeInUp': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      scrollbar: {
        thin: {
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#a8a8a8'
          }
        }
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.dropdown-menu': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#cbd5e0 #f7fafc',
        },
        '.dropdown-menu::-webkit-scrollbar': {
          width: '6px',
        },
        '.dropdown-menu::-webkit-scrollbar-track': {
          '@apply bg-gray-100': {},
        },
        '.dropdown-menu::-webkit-scrollbar-thumb': {
          '@apply bg-gray-300 rounded-full': {},
        },
        '.dropdown-menu::-webkit-scrollbar-thumb:hover': {
          '@apply bg-gray-400': {},
        },
      }
      addUtilities(newUtilities)
    }
  ]
};
