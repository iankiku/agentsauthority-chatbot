/**
 * V2 Design System Constants
 * Perplexity-inspired color palette and design tokens
 */

export const V2_COLORS = {
  // Base colors
  background: '#0A0A0A',
  foreground: '#E5E5E5',
  
  // Card colors
  card: '#111111',
  cardForeground: '#E5E5E5',
  
  // Primary colors (purple accent)
  primary: '#8B5CF6',
  primaryForeground: '#FFFFFF',
  
  // Muted colors
  muted: '#1A1A1A',
  mutedForeground: '#A1A1AA',
  
  // Border and input
  border: '#27272A',
  input: '#18181B',
  
  // Additional semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const V2_SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const V2_RADIUS = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
} as const;

export const V2_BREAKPOINTS = {
  mobile: '375px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1920px',
} as const;

export const V2_FONTS = {
  sans: 'var(--font-ibm-plex-sans)',
  mono: 'var(--font-ibm-plex-mono)',
} as const;

export const V2_ANIMATIONS = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;
