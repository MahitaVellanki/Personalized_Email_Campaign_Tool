/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      red: "#da3749",
      opaqueBlue: "#ecf4ff",
      blue: "#408cfc",
      darkBlue: "#2a5da7",
      white: "#ffffff",
      darkGreen: "#2e7d32",
      green: "#81c784",
      "gray-dark": "#273444",
      gray: "#8492a6",
      grayLight: "#eceff1",
    },

    borderRadius: {
      none: "0",
      sm: ".125rem",
      DEFAULT: ".25rem",
      lg: ".5rem",
      full: "9999px",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
      display: "Oswald, ui-serif",
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    extend: {
      spacing: {
        128: "32rem",
        144: "36rem",
        "2xl": "48rem",
      },
      fontSize: {
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      backgroundColor: {
        "blue-opaque": "var(--color-opaqueBlue)",
      },
    },
  },
  plugins: [],
};
