/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bandera: {
          rojo: "#d52b1e",
          azul: "#002776",
          blanco: "#ffffff",
        },
        grisintn: "#f7f7f7",
      },
    },
  },
  plugins: [],
}
