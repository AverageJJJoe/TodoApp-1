import { create } from 'zustand';
import { Appearance, ColorSchemeName } from 'react-native';
import { useUserPreferencesStore } from './userPreferencesStore';
import { getColors, Colors } from '../design-system/colors';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeStore {
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  isLoading: boolean;
  systemThemeListener: { remove: () => void } | null;
  initializeTheme: () => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  getColors: (theme?: ResolvedTheme) => Colors;
  updateResolvedTheme: () => void;
}

// Helper to get system theme
const getSystemTheme = (): ResolvedTheme => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
};

// Helper to resolve theme from preference and system theme
const resolveTheme = (preference: ThemePreference, systemTheme: ResolvedTheme): ResolvedTheme => {
  if (preference === 'system') {
    return systemTheme;
  }
  return preference;
};

// Initialize with system theme immediately
const initialSystemTheme = getSystemTheme();

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themePreference: 'system',
  resolvedTheme: initialSystemTheme, // Start with actual system theme
  systemTheme: initialSystemTheme,
  isLoading: true,
  systemThemeListener: null,

  initializeTheme: async () => {
    try {
      set({ isLoading: true });

      // Get system theme immediately
      const systemTheme = getSystemTheme();
      set({ systemTheme });

      // Load theme preference from user preferences store
      // If preferences aren't loaded yet, try loading them
      let preferences = useUserPreferencesStore.getState().preferences;
      if (!preferences) {
        try {
          await useUserPreferencesStore.getState().loadPreferences();
          preferences = useUserPreferencesStore.getState().preferences;
        } catch (error) {
          if (__DEV__) {
            console.warn('Could not load preferences during theme init:', error);
          }
        }
      }

      const themePreference = (preferences?.theme_preference || 'system') as ThemePreference;

      // Resolve theme based on preference and current system theme
      const resolvedTheme = resolveTheme(themePreference, systemTheme);

      set({
        themePreference,
        resolvedTheme,
        isLoading: false,
      });

      // Set up listener for system theme changes
      // Remove existing listener if any (to prevent duplicates)
      const existingListener = get().systemThemeListener;
      if (existingListener) {
        existingListener.remove();
      }

      // Add new listener for system theme changes
      // This listener will update the resolved theme when system theme changes
      // if the user's preference is 'system'
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        const newSystemTheme: ResolvedTheme = colorScheme === 'dark' ? 'dark' : 'light';
        const currentState = get();
        
        set({ systemTheme: newSystemTheme });

        // Update resolved theme if preference is 'system'
        if (currentState.themePreference === 'system') {
          const newResolvedTheme = resolveTheme('system', newSystemTheme);
          set({ resolvedTheme: newResolvedTheme });
        }
      });

      // Store subscription for cleanup
      set({ systemThemeListener: subscription });
    } catch (error) {
      if (__DEV__) {
        console.error('Error initializing theme:', error);
      }
      // Fallback to system theme on error
      const systemTheme = getSystemTheme();
      set({
        themePreference: 'system',
        resolvedTheme: systemTheme,
        systemTheme,
        isLoading: false,
      });
    }
  },

  setThemePreference: async (preference: ThemePreference) => {
    try {
      // Get current system theme
      const systemTheme = get().systemTheme;
      
      // Resolve theme
      const resolvedTheme = resolveTheme(preference, systemTheme);

      // Update local store immediately (optimistic update)
      set({
        themePreference: preference,
        resolvedTheme,
      });

      // Update in database via userPreferencesStore
      const preferences = useUserPreferencesStore.getState().preferences;
      if (preferences) {
        // Get current delivery_time and timezone
        const { delivery_time, timezone } = preferences;
        
        // Update preferences with new theme_preference
        await useUserPreferencesStore.getState().updatePreferences(
          delivery_time,
          timezone,
          preference
        );
      } else {
        // If preferences aren't loaded, try to load them first
        await useUserPreferencesStore.getState().loadPreferences();
        const updatedPreferences = useUserPreferencesStore.getState().preferences;
        if (updatedPreferences) {
          const { delivery_time, timezone } = updatedPreferences;
          await useUserPreferencesStore.getState().updatePreferences(
            delivery_time,
            timezone,
            preference
          );
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error setting theme preference:', error);
      }
      // Revert on error - reload preferences
      await useUserPreferencesStore.getState().loadPreferences();
      const preferences = useUserPreferencesStore.getState().preferences;
      const themePreference = (preferences?.theme_preference || 'system') as ThemePreference;
      const systemTheme = get().systemTheme;
      const resolvedTheme = resolveTheme(themePreference, systemTheme);
      set({
        themePreference,
        resolvedTheme,
      });
      throw error;
    }
  },

  getColors: (theme?: ResolvedTheme) => {
    const resolvedTheme = theme || get().resolvedTheme;
    return getColors(resolvedTheme);
  },

  updateResolvedTheme: () => {
    const { themePreference, systemTheme } = get();
    const resolvedTheme = resolveTheme(themePreference, systemTheme);
    set({ resolvedTheme });
  },
}));

