import tailwindcssPrimeui from 'tailwindcss-primeui';
// Configurazione per tailwind
/** @type {import('tailwindcss').Config} */
const toExport  = {
  mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx,html,vue}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
      extend: {},
  },
  variants: {
      extend: {},
  },
  plugins: [tailwindcssPrimeui],
  prefix: 'tw-',
}

export default toExport;
