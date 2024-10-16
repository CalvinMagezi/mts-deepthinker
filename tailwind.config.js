/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary_black: "#0D0F10",
        primary_bg: "#131619",
        brand_green: "#1DE52F",
        brand_blue: "#00C6FA",
        brand_black: "#231F20",
        brand_gray: "#dfdfdf",
        app_black: "#0D0F10",
        gray_text: "#828282",
      },
    },
  },
  plugins: [],
};