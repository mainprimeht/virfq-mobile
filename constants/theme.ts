// ViRFQ Design System - Colors & Theme
// Based on DESIGN_SYSTEM.md

export const Colors = {
  // Primary (Trust Blue)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB', // Main
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // CTA (Orange)
  cta: {
    DEFAULT: '#F97316',
    hover: '#EA580C',
  },

  // Navy (Secondary)
  navy: {
    DEFAULT: '#0F3460',
    dark: '#0A2540',
  },

  // Success (Green)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },

  // Warning (Amber)
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },

  // Error (Red)
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  // Neutral (Slate)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  white: '#FFFFFF',
  black: '#000000',
};

// Quality Score Colors
export const QualityScoreColors = {
  excellent: '#16A34A', // 90-100
  good: '#059669',      // 80-89
  average: '#F59E0B',   // 70-79
  low: '#64748B',       // <70
};

export const getQualityScoreColor = (score: number): string => {
  if (score >= 90) return QualityScoreColors.excellent;
  if (score >= 80) return QualityScoreColors.good;
  if (score >= 70) return QualityScoreColors.average;
  return QualityScoreColors.low;
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
};

// Font Sizes
export const FontSize = {
  tiny: 10,
  caption: 12,
  body: 14,
  bodyLarge: 16,
  h3: 18,
  h2: 20,
  h1: 24,
  display: 32,
};

// Font Weights
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

// Border Radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Light Theme (default)
export const LightTheme = {
  background: Colors.slate[50],
  surface: Colors.white,
  surfaceSecondary: Colors.slate[100],
  text: Colors.slate[900],
  textSecondary: Colors.slate[600],
  textMuted: Colors.slate[500],
  textDisabled: Colors.slate[300],
  border: Colors.slate[200],
  borderLight: Colors.slate[100],
  primary: Colors.primary[600],
  primaryLight: Colors.primary[50],
  cta: Colors.cta.DEFAULT,
  success: Colors.success[600],
  warning: Colors.warning[500],
  error: Colors.error[600],
};

// Dark Theme
export const DarkTheme = {
  background: Colors.slate[900],
  surface: Colors.slate[800],
  surfaceSecondary: Colors.slate[700],
  text: Colors.slate[50],
  textSecondary: Colors.slate[300],
  textMuted: Colors.slate[400],
  textDisabled: Colors.slate[600],
  border: Colors.slate[700],
  borderLight: Colors.slate[800],
  primary: Colors.primary[500],
  primaryLight: Colors.primary[900],
  cta: Colors.cta.DEFAULT,
  success: Colors.success[500],
  warning: Colors.warning[500],
  error: Colors.error[500],
};

export type Theme = typeof LightTheme;

// Export default theme
export const theme = LightTheme;
