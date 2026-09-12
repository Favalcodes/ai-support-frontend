/**
 * rlayAi Color Palette — "The Blues"
 *
 * Four brand colours, plus white and black. Nothing else is used in the UI;
 * the numbered steps below are tints and shades of these same four hues. Kept in step with
 * tailwind.config.js; prefer the Tailwind classes in components and use these
 * values only where a raw hex is needed (inline SVG, canvas, the embeddable
 * widget, email templates).
 *
 * Accessibility notes, measured:
 *   - white on orion (4.69), indigo (8.31), midnight (16.63) all pass AA body
 *   - euphoria on white (2.06) FAILS; it is a fill/border/dark-ground accent,
 *     never body text on a light background
 */

export const brand = {
  orion: '#4563FF',
  euphoria: '#A1B0FF',
  indigo: '#3345A4',
  midnight: '#0E1752',
} as const;

export const colors = {
  // Orion Blue — primary actions, links, active states
  primary: {
    50: '#F6F7FF', 100: '#E9ECFF', 200: '#CFD6FF', 300: '#B1BDFF',
    400: '#8195FF', 500: '#4563FF', 600: '#3B55DB', 700: '#3045B2',
    800: '#25358A', 900: '#1A2661', 950: '#11183D',
  },

  // Euphoria Blue — badges, borders, gradient accents
  secondary: {
    50: '#FAFBFF', 100: '#F4F6FF', 200: '#E7EAFF', 300: '#D8DEFF',
    400: '#BFC9FF', 500: '#A1B0FF', 600: '#8A97DB', 700: '#717BB2',
    800: '#575F8A', 900: '#3D4361', 950: '#272A3D',
  },

  // Indigo — subheadings, icons, department active states
  ink: {
    50: '#F5F6FA', 100: '#E7E9F4', 200: '#CACFE7', 300: '#A9B1D9',
    400: '#7481C1', 500: '#3345A4', 600: '#2C3B8D', 700: '#243073',
    800: '#1C2559', 900: '#131A3E', 950: '#0C1127',
  },

  // Midnight Navy — headings, dark sections
  dark: {
    50: '#F3F3F6', 100: '#E2E3EA', 200: '#C0C3D2', 300: '#9A9EB6',
    400: '#5B6189', 500: '#0E1752', 600: '#0C1447', 700: '#0A1039',
    800: '#080C2C', 900: '#05091F', 950: '#030614',
  },

} as const;

/** Default accent for a newly created chat widget. */
export const DEFAULT_WIDGET_COLOR = brand.orion;

export default colors;
