/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary-blue': '#4880FF',
        'brand-primary-black': '#202224',
        'brand-primary-white': '#fff',
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
}