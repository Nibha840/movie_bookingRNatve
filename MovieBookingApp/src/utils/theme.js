// src/utils/theme.js
export const COLORS = {
  background: '#0A0A0F',
  surface: '#12121A',
  card: '#1A1A26',
  cardElevated: '#212133',
  primary: '#E50914',
  primaryDark: '#B00710',
  primaryGlow: 'rgba(229,9,20,0.15)',
  accent: '#F5A623',
  accentGlow: 'rgba(245,166,35,0.15)',
  gold: '#FFD700',
  text: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textMuted: '#5A5A78',
  border: '#2A2A3E',
  borderLight: '#3A3A50',
  success: '#00C896',
  successGlow: 'rgba(0,200,150,0.15)',
  error: '#FF4444',
  errorGlow: 'rgba(255,68,68,0.15)',
  warning: '#FFB800',
  seatAvailable: '#2A2A3E',
  seatSelected: '#E50914',
  seatBooked: '#3A3A50',
  overlay: 'rgba(0,0,0,0.85)',
};

export const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
    hero: 40,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
};
