/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./dist/**/*.html",
    "./src/**/*.{html,js}"],
  theme: {
    extend: {
      width:{
        '100' : "15rem"
      },
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
      },
      
    },
  },
  plugins: [],
};
