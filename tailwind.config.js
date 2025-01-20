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

    screens: {
      'sm': '412px',
      // => @media (min-width: 412px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        '16': 'repeat(16, minmax(0, 1fr))',

        // Complex site-specific column configuration
        'footer': '200px minmax(900px, 1fr) 100px',
      },

      backdropBlur: {
        // Add custom blur settings if needed
        'none': '0',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      
      colors : {
        color : {
          p : "var(--color-primary)",
          s : "var(--color-secondary)",
          a : "var(--color-accent)",
          l : "var(--color-light)",
          b : "var(--color-blue)",
          m : "var(--color-main)",
        }
      },
      fontFamily : {
        sans:["var(--font-InterTight)", ...fontFamily.sans]
      },
    },
  },
  
  variants: {
    backdropBlur: ['responsive', 'hover', 'focus'],
  },

  plugins: [plugin(function({ addUtilities, addComponents, addBase}) {
    addBase({});
    addComponents({

      ".container": {
          "@apply  max-w-[77.5rem] mx-auto px-5 md:px-10 xl:max-w-[87.5rem]":
          {},
      },

      ".input-box": {
        "@apply flex w-full border border-gray-300 rounded-md bg-white py-2 pl-4  text-sm active:border-blue-500 active:border focus:border focus:border-blue-500 outline-none":
        {},
      },

      ".input-box-2": {
        "@apply flex w-full border border-gray-300 rounded-md bg-white py-2 pl-10 text-sm active:border-blue-500 active:border focus:border focus:border-blue-500 outline-none":
        {},
      },

      ".label": {
        "@apply text-gray-700 font-medium":
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
      },
    })
    addUtilities({})
  }),],
}

