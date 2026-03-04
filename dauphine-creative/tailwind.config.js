/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E63946', 
        secondary: '#1D3557', 
        accent: '#457B9D', 
        light: '#F1FAEE', 
        dark: '#111111', 
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderWidth: {
        'comic': '3px', 
      },
      boxShadow: {
        'comic': '4px 4px 0px 0px rgba(17, 17, 17, 1)', 
      }
    },
  },
  plugins: [],
}