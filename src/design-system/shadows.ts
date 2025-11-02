/**
 * Design System Shadows - Extracted from Lovable Actual Implementation
 * Based on docs/design-system-complete.md Part 10 (Shadow System)
 * React Native shadow format with iOS shadowOffset and Android elevation
 */

export const shadows = {
  // shadow-soft-sm: 0 1px 3px rgba(0, 0, 0, 0.08)
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1, // Android
  },
  
  // shadow-soft-md: 0 2px 8px rgba(0, 0, 0, 0.12)
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2, // Android
  },
  
  // shadow-soft-lg: 0 8px 24px rgba(0, 0, 0, 0.16)
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 4, // Android
  },
  
  // shadow-fab: 0 4px 16px rgba(0, 122, 255, 0.32) - Blue glow shadow
  shadowFab: {
    shadowColor: '#007AFF', // primary color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 8, // Android
  },
} as const;

export type Shadows = typeof shadows;

