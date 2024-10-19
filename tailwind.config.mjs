import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      background: "#282A36",
      current: "#44475A",
      foreground: "#F8F8F2",
      comment: "#6272A4",
      cyan: "#8BE9FD",
      green: "#50FA7B",
      orange: "#FFB86C",
      pink: "#FF79C6",
      purple: "#BD93F9",
      red: "#FF5555",
      yellow: "#F1FA8C",
    },
    extend: {
      fontFamily: {
        sans: ["Montserrat Variable", ...defaultTheme.fontFamily.sans],
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
};
