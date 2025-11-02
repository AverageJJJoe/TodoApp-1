/**
 * Design System Colors - Extracted from Lovable Actual Implementation
 * Based on lovable-reference/src/index.css
 * HSL color format for React Native compatibility
 */

// Convert HSL to hex for React Native (since RN doesn't support HSL directly)
// HSL values from Lovable: --primary: 211 100% 50% = hsl(211, 100%, 50%) = #007AFF
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const colors = {
  // Background & Foreground (HSL: 0 0% 100% = white)
  background: '#FFFFFF',
  foreground: '#000000',
  
  // Primary Colors (HSL: 211 100% 50% = Apple blue)
  primary: '#007AFF', // hsl(211, 100%, 50%)
  primaryHover: '#0051D5', // hsl(218, 100%, 42%)
  primaryLight: '#E5F1FF', // hsl(211, 100%, 95%)
  primaryForeground: '#FFFFFF',
  
  // Text Colors - iOS Gray Scale
  textPrimary: '#000000', // hsl(0, 0%, 0%)
  textSecondary: '#6E6E73', // hsl(240, 2%, 44%)
  textTertiary: '#8E8E93', // hsl(240, 2%, 56%)
  
  // Surfaces
  surface: '#F2F2F7', // hsl(240, 20%, 97%) - iOS grouped background
  separator: '#C6C6C8', // hsl(240, 5%, 78%)
  
  // Semantic Colors
  success: '#34C759', // hsl(145, 72%, 49%)
  destructive: '#FF3B30', // hsl(4, 90%, 58%)
  warning: '#FF9500', // hsl(32, 100%, 50%)
  
  // Priority Colors (Things 3 style)
  priorityHigh: '#FF3B30', // hsl(4, 90%, 58%)
  priorityMedium: '#FF9500', // hsl(32, 100%, 50%)
  priorityLow: '#007AFF', // hsl(211, 100%, 50%)
  
  // Carried Over Background
  carriedOver: '#FAFAFA', // hsl(0, 0%, 98%)
  
  // Card Colors
  card: '#FFFFFF',
  cardForeground: '#000000',
  
  // Input & Border
  input: '#C6C6C8', // hsl(240, 5%, 78%)
  border: '#C6C6C8',
  ring: '#007AFF', // primary for focus rings
  
  // Trial Badge Colors
  trialBg: '#FFF9E6', // hsl(48, 100%, 96%)
  trialText: '#FF9500', // hsl(32, 100%, 50%) - same as warning
  
  // Shadows (for React Native - using rgba format)
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1, // Android
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2, // Android
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 4, // Android
  },
  // FAB specific shadow (blue shadow)
  shadowFab: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8, // Android
  },
} as const;

export type Colors = typeof colors;