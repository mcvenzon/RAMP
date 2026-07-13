/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mrf: {
          primary: '#0052cc',
          secondary: '#00a3ff',
          success: '#36b37e',
          warning: '#ffab00',
          danger: '#ff5652',
        }
      }
    },
  },
  plugins: [],
}
