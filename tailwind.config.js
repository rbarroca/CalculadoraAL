/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: '#FF5A5F',
        'coral-dark': '#E61E4D',
        teal: '#00A699',
        'warm-gray': '#767676',
        'dark-text': '#222222',
        'light-bg': '#F7F7F7',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0,0,0,0.08)',
        'md': '0 4px 16px rgba(0,0,0,0.12)',
        'lg': '0 8px 24px rgba(0,0,0,0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
