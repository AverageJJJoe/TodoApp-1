/**
 * Design System Typography - Extracted from Lovable Actual Implementation
 * Based on lovable-reference/src/index.css typography scale
 */

export const typography = {
  // Font stack (system fonts)
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif",

  // Typography Hierarchy (matches Lovable CSS exactly)
  titleLarge: {
    fontSize: 34,
    lineHeight: 34 * 1.2, // 40.8px
    fontWeight: '700' as const,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif",
  },
  titleMedium: {
    fontSize: 28,
    lineHeight: 28 * 1.3, // 36.4px
    fontWeight: '600' as const,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif",
  },
  bodyLarge: {
    fontSize: 17,
    lineHeight: 17 * 1.5, // 25.5px
    fontWeight: '400' as const,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif",
  },
  body: {
    fontSize: 15,
    lineHeight: 15 * 1.4, // 21px
    fontWeight: '400' as const,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif",
  },
  caption: {
    fontSize: 13,
    lineHeight: 13 * 1.3, // 16.9px
    fontWeight: '400' as const,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif",
  },
  footnote: {
    fontSize: 11,
    lineHeight: 11 * 1.2, // 13.2px
    fontWeight: '400' as const,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif",
  },
} as const;

export type Typography = typeof typography;