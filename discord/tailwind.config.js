/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./*.html"],
  theme: {
    extend: {
      colors: {
        discord_purple: "#5865f2",
        discord_green: "#3ba55c",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
}
