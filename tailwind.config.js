/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";
import {fontFamily} from "tailwindcss/defaultTheme";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      colors : {
        color : {
          p : "var(--color-primary)",
          s : "var(--color-secondary)",
          a : "var(--color-accent)",
          l : "var(--color-light)",
          b : "var(--color-blue)"
        }
      },
      fontFamily : {
        sans:["var(--font-InterTight)", ...fontFamily.sans]
      }
    },
  },
  plugins: [plugin(function({ addUtilities, addComponents, addBase}) {
    addBase({});
    addComponents({
      ".container": {
          "@apply  max-w-[77.5rem] mx-auto px-5 md:px-10 xl:max-w-[87.5rem]":
          {},
      },

      ".input-box": {
        "@apply w-full rounded-md border-2 border-slate-800 bg-white py-2 px-6 text-sm active:border-color-p focus:border-color-p  outline-none":
        {},
      },

      ".label": {
        "@apply text-base font-medium text-slate-800 font-semibold tracking-normal body-1":
        {},
      },

      ".h1": {
        "@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]":
          {},
      },
      ".h2": {
        "@apply text-[1.75rem] leading-[2.5rem] md:text-[2rem] md:leading-[2.5rem] lg:text-[2.5rem] lg:leading-[3.5rem] xl:text-[3rem] xl:leading-tight":
          {},
      },
      ".h3": {
        "@apply text-[2rem] leading-normal md:text-[2.5rem]": {},
      },
      ".h4": {
        "@apply text-[2rem] leading-normal": {},
      },
      ".h5": {
        "@apply text-2xl leading-normal": {},
      },
      ".h6": {
        "@apply font-semibold text-lg leading-8": {},
      },

      ".body-1": {
        "@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8":
          {},
      },
      ".body-2": {
        "@apply font-light text-[0.875rem] leading-6 md:text-base": {},
      }
    })
    addUtilities({})
      
  }),],
}

