/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: {
          100: "#034595",
          900: "#012366",
        },  
      },
    },
  },
  plugins: [],
}