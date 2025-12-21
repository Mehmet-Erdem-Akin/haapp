/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002BE0',
          50: '#D4AEFF',
          100: '#B8DDF0',
          200: '#7BA3D1',
          300: '#002BE0',
          400: '#002BE0',
          500: '#002BE0',
          600: '#001FAD',
          700: '#00157A',
        },
        accent: {
          DEFAULT: '#D4AEFF',
          100: '#E8D4FF',
          200: '#D4AEFF',
          300: '#C088FF',
        },
        success: {
          DEFAULT: '#44BEA4',
          100: '#A8E6D4',
          200: '#7DD9C0',
          300: '#44BEA4',
          400: '#2A9B82',
        },
        dark: {
          DEFAULT: '#1D1927',
          100: '#3A344F',
          200: '#2D2538',
          300: '#1D1927',
        },
        danger: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}

