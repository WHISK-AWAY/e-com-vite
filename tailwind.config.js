/** @type {import('tailwindcss').Config} */


const plugin = require('tailwindcss/plugin');
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      chonburi: ['Chonburi', 'cursive'],
      grotesque: ['Darker Grotesque', 'monospace'],
      hubbali: ['Hubballi', 'cursive'],
      italiana: ['Italiana', 'serif'],
      aurora: ['La Belle Aurore', 'cursive'],
      marcellus: ['Marcellus', 'serif'],
      meddon: ['Meddon', 'cursive'],
      monserrat: ['Montserrat Subrayada', 'sans-serif'],
      notable: ['Notable', 'sans-serif'],
      yesYouCan: ['Nothing You Could Do', 'cursive'],
      paytone: ['Paytone One', 'sans-serif'],
      poiret: ['Poiret One', 'cursive'],
      yeseva: ['Yeseva One', 'cursive'],
      federo: ['Federo', 'sans-serif'],
      gayathri: ['Gayathri', 'sans-serif'],
      archivo: ['Archivo Black', 'sans-serif'],
      jamalhari: ['Jomolhari', 'serif'],
      'caslon-display': ['Libre Caslon Display', 'serif'],
      'caslon-text': ['Libre Caslon Text', 'serif'],
      raleway: ['Raleway', 'sans-serif'],
      yantramanav: ['Yantramanav', 'sans-serif'],
      'roboto-mono': ['Roboto Mono', 'monospace'],
      roboto: ['Roboto', 'sans-serif'],
      playfair: ['Playfair Display', 'serif'],
      abril: ['Abril Fatface', 'cursive'],
      lora: ['Lora', 'serif'],
      garamond: ['EB Garamond', 'serif'],
      bodoni: ['Bodoni Moda', 'serif'],
      antonio: ['Antonio', 'sans-serif'],
      jost: ['Jost', 'monospace']
    },
    fontWeight: {
      thin: 100,
      xtralight: 200,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      xbold: 800,
      xxbold: 900,
    },
    extend: {
      colors: {
        charcoal: '#4A4A4A',
        'light-brick': '#DA8E61',
        'primary-gray': '#262626',
      },
      screens: {
        xxs: '360px',
        xs: '375px',
        sm: '412px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
        '3xl': '1536px',
        '4xl': '1920px',
        '5xl': '2560px',
        '6xl': '3440px',
        short: { raw: '(max-height: 768px) and (min-width: 1440px)' },
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'hover'],
      borderColor: ['active'],
      textColor: ['active'],
    },
  },
  modules: {
    appearance: ['responsive', 'active'],
    backgroundAttachment: ['responsive'],
    backgroundColors: ['responsive', 'hover', 'active'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    // ...
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({ addVariant }) {
      addVariant('current', '&.active');
    }),
  ],
};

// font-family: 'Chonburi', cursive;
// font-family: 'Darker Grotesque', sans-serif;
// font-family: 'Hubballi', cursive;
// font-family: 'Italiana', serif;
// font-family: 'La Belle Aurore', cursive;
// font-family: 'Marcellus', serif;
// font-family: 'Meddon', cursive;
// font-family: 'Montserrat Subrayada', sans-serif;
// font-family: 'Notable', sans-serif;
// font-family: 'Nothing You Could Do', cursive;
// font-family: 'Paytone One', sans-serif;
// font-family: 'Poiret One', cursive;
// font-family: 'Yeseva One', cursive;
