/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./*.html"],
  mode: "jit",
  theme: {
    extend: {
      colors: {
        text: {
          primary: "#FFFFFF",
          secondary: "#E0EBFF",
        },
        brand: {
          light: "#FF9524",
          mid: "#FF7F24",
          dark: "#FF6924",
        },
        bg: "#2F3C54",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
