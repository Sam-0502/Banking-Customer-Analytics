/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // enable class based dark mode
  theme: {
    extend: {
      colors: {
        spaceBlack: '#0a0a0a',
        nebulaBlue: '#1e3a8a',
        starWhite: '#f5f5f5',
        accentPurple: '#6d28d9',
      },
    },
  },
  plugins: [],
};
