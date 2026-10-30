/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Trail" palette — editorial/journal feel for a story-sharing platform.
        ink: {
          950: '#0F151C',
          900: '#12181F',
          800: '#1B2430',
          700: '#28333F',
          500: '#4B5A68',
          300: '#8C97A3',
        },
        paper: {
          DEFAULT: '#F1F0EA',
          muted: '#E7E4DA',
        },
        trailmark: {
          DEFAULT: '#E0A458',
          dark: '#B8823E',
          light: '#F0C98B',
        },
        pine: {
          DEFAULT: '#2F6F5E',
          dark: '#234F42',
          light: '#5A9683',
        },
        brick: {
          DEFAULT: '#C4573B',
          dark: '#9C4230',
        },
      },
      fontFamily: {
        display: ['"Newsreader"', 'serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '14px',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
