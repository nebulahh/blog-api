/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/components/SinglePost/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      max: '767px',
    },
    extend: {
      colors: {
        wheat: '#F5DEB3',
      },
    },
  },
  plugins: [],
};
