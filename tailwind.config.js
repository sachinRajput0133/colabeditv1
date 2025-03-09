/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './widgets/**/*.{js,ts,jsx,tsx}',
    './shared/**/*.{js,ts,jsx,tsx}',
    './utils/**/**/*.{js,ts,jsx,tsx}',
    './hook/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '360px',
        lg: '1064px',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'], // Adding Manrope
        tropical: ['TropicalJungle', 'sans-serif'],
      },
      boxShadow: {
        top: '0px -4px 8px rgba(0, 0, 0, 0.1)', // Custom shadow for top only
      },
      borderRadius: {
        10: '10px',
      },
      colors: {
        foreground: '#3A3A3A',
        primary: '#A5E8EC',
        'dark-blue': '#0E0C5C',
        'primary-light': '#C6E9F8',
        'primary-max-light': '#ecf8fd',
        'dark-primary': '#7ECED2',
        'primary-border': '#eee',
        'dark-border': '#e5e5e5',
        blue: '#02A2FF',
        secondary: '#F2F6F9',
        'light-gray': '#ddd',
        label: '#CECECE',
        green: '#00832D',
        'dark-green': '#01af5f',
        'light-green': '#35DF91',
        yellow: '#F0B826',
        'light-yellow': '#FAC762',
        red: '#ff3939',
        'light-pink': '#FFDAE1',
        pink: '#FF0030',
        'dark-gray': '#666666',
        'thin-gray': '#222222',
        'mid-gray': '#85888A',
        'gray-900': '#0B121580',
        'disabled-gray': '#A9A9A980',
        orange: '#FE9000',
        'b-gray': '#D1D5DB',
        'hover-dark': '#f8f8f8',
        teal: '#7ECED2',
        'error-red': '#dc2626',
        'error-bg': '#faf0f0',
      },
    },
  },
  plugins: [],
};

