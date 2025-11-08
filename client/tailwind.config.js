const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#E59500",
        "background-light": "#F9F9F9",
        "background-dark": "#1C1C1C",
        "text-light": "#222222",
        "text-dark": "#EAEAEA",
        "text-muted-light": "#555555",
        "text-muted-dark": "#AAAAAA",
        "surface-light": "#FFFFFF",
        "surface-dark": "#282828",
        "border-light": "#E0E0E0",
        "border-dark": "#3A3A3A",
        prim: {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
        },
        blueGray: {
          "50": "rgba(248, 250, 252)",
          "100": "rgba(241, 245, 249)",
          "200": " rgba(226, 232, 240)",
          "300": " rgba(203, 213, 225)",
          "400": "rgba(148, 163, 184)",
          "500": "rgba(100, 116, 139)",
          "600": "rgba(71, 85, 105)",
          "700": "rgba(51, 65, 85)",
          "800": "rgba(30, 41, 59)",
        },
      },
      fontFamily: {
        display: ["Newsreader", "serif"],
        body: ["Inter", ...defaultTheme.fontFamily.sans],
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
        dm_sans: ["DM Sans", ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
	  animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
  ],
};
