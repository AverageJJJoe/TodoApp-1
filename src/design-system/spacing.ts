/**
 * Design System Spacing - Extracted from Lovable Actual Implementation
 * Based on lovable-reference/src/index.css spacing system (4pt base)
 */

export const spacing = {
  // Spacing values (4pt grid - matches Lovable CSS exactly)
  xs: 4,   // --space-xs
  sm: 8,   // --space-sm
  md: 12,  // --space-md
  lg: 16,  // --space-lg
  xl: 20,  // --space-xl
  '2xl': 24, // --space-2xl
  '3xl': 32, // --space-3xl

  // Border Radius (matches Lovable CSS)
  radiusSm: 8,   // --radius-sm
  radiusMd: 12,  // --radius-md
  radiusLg: 16,  // --radius-lg
  radiusXl: 20,  // --radius-xl
} as const;

export type Spacing = typeof spacing;