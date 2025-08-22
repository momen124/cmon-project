import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#fefcfb', // Lighter off-white, close to #f8f5f1
          100: '#fbf8f4',
          200: '#f8f5f1', // Primary background (cleaner off-white)
          300: '#f4efea',
          400: '#efe8e2',
          500: '#e9e0d8',
          600: '#d0c8c0',
          700: '#b7b0a8',
          800: '#9e9990',
          900: '#858178',
          950: '#6c6a60',
        },
        secondary: {
          50: '#f9f4ed', // Lighter beige, close to #e6d5bd
          100: '#f4ece2',
          200: '#e6d5bd', // Secondary background (softer beige)
          300: '#dbc6a7',
          400: '#d1b691',
          500: '#c6a77b',
          600: '#b0956c',
          700: '#9a835d',
          800: '#83714e',
          900: '#6d5f3f',
          950: '#564c30',
        },
        neutral: {
          50: '#f6f5f4', // Lighter warm gray, close to #6e625b
          100: '#edeae9',
          200: '#d7d2cf',
          300: '#c0bab6',
          400: '#aaa29e',
          500: '#938b86', // Neutral text (balanced warm gray)
          600: '#6e625b', // Exact match
          700: '#5b514c',
          800: '#49403e',
          900: '#363030',
          950: '#242121',
        },
        'text-primary': {
          50: '#f3f0ef', // Lighter brown-gray, close to #3e2f28
          100: '#e7e0de',
          200: '#d0c8c4',
          300: '#b8b0ab',
          400: '#a09892',
          500: '#888078', // Primary text (deeper brown-gray)
          600: '#3e2f28', // Exact match
          700: '#342722',
          800: '#2a201c',
          900: '#201816',
          950: '#161110',
        },
        accent: {
          50: '#f9ece5', // Lighter orange-brown, close to #c07d4f
          100: '#f3d9cc',
          200: '#e8b89a',
          300: '#dd9668',
          400: '#d27536',
          500: '#c07d4f', // Accent (warm orange-brown)
          600: '#ab6f46',
          700: '#96613c',
          800: '#805233',
          900: '#6b442a',
          950: '#563621',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(192, 125, 79, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(192, 125, 79, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(192, 125, 79, 0)' },
        },
        lift: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'pulse-glow': 'pulse-glow 1.5s infinite',
        'hover-lift': 'lift 0.2s ease-out forwards',
      },
      fontFamily: {
        arabic: ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
        english: ['Inter', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [animate, forms, typography, aspectRatio],
};

export default config;