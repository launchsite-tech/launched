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
      },
    },
  },
  plugins: [],
};
