import React, { useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider component
 * Initializes theme store and sets up system theme listener
 * Note: Theme is accessed via useTheme hook from design-system, not via context
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const initializeTheme = useThemeStore((state) => state.initializeTheme);
  const loadPreferences = useUserPreferencesStore((state) => state.loadPreferences);
  const preferences = useUserPreferencesStore((state) => state.preferences);

  useEffect(() => {
    // Initialize theme - it will handle loading preferences if needed
    // This ensures system theme is detected immediately
    initializeTheme();
  }, [initializeTheme]);

  // Update theme when preferences change (e.g., after login or theme preference update)
  useEffect(() => {
    if (preferences) {
      // Re-initialize theme when preferences are loaded or updated
      initializeTheme();
    }
  }, [preferences?.theme_preference, initializeTheme]);

  // Just render children - theme is accessed via Zustand store (useTheme hook)
  return <>{children}</>;
};

