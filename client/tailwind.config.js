const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a"},
        blueGray: { "50": "rgba(248, 250, 252)", "100": "rgba(241, 245, 249)", "200": " rgba(226, 232, 240)", "300": " rgba(203, 213, 225)", "400": "rgba(148, 163, 184)", "500": "rgba(100, 116, 139)", "600": "rgba(71, 85, 105)", "700": "rgba(51, 65, 85)", "800": "rgba(30, 41, 59)" }
      },
      fontFamily: {
        body: ['Inter', ...defaultTheme.fontFamily.sans],
        'poppins': [
          'Poppins', ...defaultTheme.fontFamily.sans
        ],
        'dm_sans': [
          'DM Sans', ...defaultTheme.fontFamily.sans
        ],
      }
    },
  },
  plugins: []
}
