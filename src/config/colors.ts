/**
 * getLync Color Palette - Chocolate Truffle Theme
 *
 * A rich, warm color scheme inspired by chocolate truffles
 * Perfect for food brands, lifestyle apps, and premium services
 */

export const colors = {
  // Primary chocolate brown tones
  primary: {
    50: '#F5EBE0',
    100: '#E8D5C4',
    200: '#D4B59E',
    300: '#C09578',
    400: '#AC7552',
    500: '#713600',  // Main dark brown
    600: '#5A2B00',
    700: '#432000',
    800: '#2C1600',
    900: '#1A0D00',
  },

  // Secondary caramel/burnt orange tones
  secondary: {
    50: '#FDF5ED',
    100: '#FAE6D2',
    200: '#F5D4AD',
    300: '#F0C288',
    400: '#EBB063',
    500: '#C05800',  // Caramel
    600: '#994600',
    700: '#733400',
    800: '#4D2300',
    900: '#261100',
  },

  // Accent cream tones
  accent: {
    50: '#FFFEF9',
    100: '#FFFEF5',
    200: '#FFFDF0',
    300: '#FFFCE8',
    400: '#FFFBDC',
    500: '#FDFBD4',  // Cream
    600: '#F5F3CC',
    700: '#EDEBC4',
    800: '#E5E3BC',
    900: '#DDDBB4',
  },

  // Dark chocolate for text and headers
  dark: {
    50: '#D4C8BF',
    100: '#B8A89B',
    200: '#9C8877',
    300: '#806853',
    400: '#64482F',
    500: '#38240D',  // Very dark chocolate
    600: '#2D1D0A',
    700: '#221608',
    800: '#170F05',
    900: '#0C0803',
  },

  // Neutral grays with warm tint
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },

  // Status colors (adjusted to match theme)
  success: {
    light: '#D4E8D7',
    main: '#4C7C54',
    dark: '#2E5A36',
  },

  warning: {
    light: '#F5E6D2',
    main: '#C05800',
    dark: '#994600',
  },

  error: {
    light: '#F5D2D2',
    main: '#C05454',
    dark: '#994343',
  },

  info: {
    light: '#E0D8CC',
    main: '#713600',
    dark: '#5A2B00',
  },
};

/**
 * Gradient definitions
 */
export const gradients = {
  primary: 'from-primary-500 to-secondary-500',
  dark: 'from-dark-500 to-primary-500',
  light: 'from-accent-500 to-accent-300',
  warm: 'from-secondary-400 to-secondary-600',
};

/**
 * Color usage guide
 */
export const colorUsage = {
  // Backgrounds
  bgPrimary: 'bg-white',
  bgSecondary: 'bg-neutral-50',
  bgDark: 'bg-dark-500',

  // Text
  textPrimary: 'text-dark-500',
  textSecondary: 'text-neutral-600',
  textLight: 'text-neutral-400',
  textInverse: 'text-white',

  // Borders
  borderPrimary: 'border-neutral-200',
  borderSecondary: 'border-neutral-300',
  borderDark: 'border-dark-500',

  // Buttons
  btnPrimary: 'bg-primary-500 hover:bg-primary-600 text-white',
  btnSecondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
  btnOutline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',

  // Links
  linkPrimary: 'text-primary-500 hover:text-primary-600',
  linkSecondary: 'text-secondary-500 hover:text-secondary-600',
};

export default colors;
