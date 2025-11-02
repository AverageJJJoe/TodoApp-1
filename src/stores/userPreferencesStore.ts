import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface UserPreferences {
  delivery_time: string; // Format: "06:00:00"
  timezone: string;       // Format: "America/New_York"
}

interface UserPreferencesStore {
  preferences: UserPreferences | null;
  isLoading: boolean;
  loadError: string | null;
  loadPreferences: () => Promise<void>;
  updatePreferences: (delivery_time: string, timezone: string) => Promise<void>;
}

export const useUserPreferencesStore = create<UserPreferencesStore>((set, get) => ({
  preferences: null,
  isLoading: false,
  loadError: null,
  loadPreferences: async () => {
    // Get session from auth store
    const session = useAuthStore.getState().session;
    
    if (!session?.user?.id) {
      set({ loadError: 'No authenticated session found', isLoading: false });
      return;
    }

    // Set loading state
    set({ isLoading: true, loadError: null });

    try {
      // Query user preferences from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('delivery_time, timezone')
        .eq('auth_id', session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Update store state with preferences
        set({
          preferences: {
            delivery_time: data.delivery_time || '06:00:00',
            timezone: data.timezone || 'UTC',
          },
          isLoading: false,
          loadError: null,
        });
      } else {
        // No preferences found, use defaults
        set({
          preferences: {
            delivery_time: '06:00:00',
            timezone: 'UTC',
          },
          isLoading: false,
          loadError: null,
        });
      }
    } catch (error: any) {
      set({
        loadError: error.message || 'Failed to load preferences',
        isLoading: false,
      });
      throw error;
    }
  },
  updatePreferences: async (delivery_time: string, timezone: string) => {
    // Get session from auth store
    const session = useAuthStore.getState().session;
    
    if (!session?.user?.id) {
      throw new Error('No authenticated session found');
    }

    try {
      // Get user_id from users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', session.user.id)
        .single();

      if (userError || !user) {
        throw new Error(`User not found: ${userError?.message || 'No user record'}`);
      }

      // Update user preferences in Supabase
      const { error } = await supabase
        .from('users')
        .update({ 
          delivery_time,
          timezone,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local store state with new preferences
      set({
        preferences: {
          delivery_time,
          timezone,
        },
      });
    } catch (error: any) {
      throw error;
    }
  },
}));

