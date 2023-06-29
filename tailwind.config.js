/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      chonburi: ['Chonburi', 'cursive'],
      grotesque: ['Darker Grotesque', 'sans-serif'],
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
      },
      screens: {
        xs: '375px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
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
