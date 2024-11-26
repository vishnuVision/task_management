import daisyui from './node_modules/daisyui';
import tailwindscrollbar from "./node_modules/tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '375px',
        'xs':'450px',
      },
    },
  },
  plugins: [daisyui,tailwindscrollbar],
}