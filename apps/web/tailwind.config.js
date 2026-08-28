/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: 'class',
    theme: {
      extend: {
        screens: {
        '2.5xl': '1750px',
        '3xl': '1922px',
        '4xl': '2562px',
      },
        colors: {
          primary: '#0D1A2A',
          hoverPrimary: '#102136',
          bgDark: '#00070F',
          gradient1: '#142544',
          gradient2: '#1d396b',
          gradientHover: '#3c93ff',
          light: '#FFFFFF',
          muted: 'rgba(255, 255, 255, 0.6)'
        },
        backgroundImage: {
          'radial-server': 'radial-gradient(circle at top right, #0b1f35, #010407)',
          'radial-dedicated': 'radial-gradient(73.11% 70.68% at 96% 0%, rgb(18, 42, 86), rgb(3, 22, 46))',
          'radial-hover': 'radial-gradient(77.11% 70.68% at 96% 0%, rgb(35, 58, 100), rgb(5, 30, 59))',
        },
        fontFamily: {
          en: ['Kanit', 'sans-serif'],
          ru: ['Rubik', 'sans-serif']
        },
        animation: {
          scroll: "scroll 25s linear infinite",
        },
        keyframes: {
          scroll: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          }
        }
      },
    },
    plugins: [],
  };