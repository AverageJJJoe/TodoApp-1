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
        .maybeSingle();

      // Handle case where user doesn't exist yet (should be created by trigger, but handle gracefully)
      if (error?.code === 'PGRST116') {
        // PGRST116 = no rows returned, user doesn't exist yet
        // Use defaults - user will be created when they first interact with app
        set({
          preferences: {
            delivery_time: '06:00:00',
            timezone: 'UTC',
          },
          isLoading: false,
          loadError: null,
        });
        return;
      }

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
        .maybeSingle(); // Use maybeSingle() instead of single() to handle missing records gracefully

      // If user doesn't exist, create it (should be handled by trigger, but fallback here)
      let userId: number;
      if (userError?.code === 'PGRST116' || !user) {
        // PGRST116 = no rows returned, user doesn't exist yet
        if (__DEV__) {
          console.log('⚠️ User record not found in preferences store, creating one...');
        }
        
        // Create user record with preferences
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              auth_id: session.user.id,
              email: session.user.email || '',
              delivery_time,
              timezone,
              // Other fields use defaults from schema
            },
          ])
          .select('id')
          .single();

        if (createError || !newUser) {
          throw new Error(`Failed to create user record: ${createError?.message || 'Unknown error'}`);
        }
        
        userId = newUser.id;
      } else if (userError) {
        throw new Error(`User query error: ${userError.message}`);
      } else {
        userId = user.id;
      }

      // Update user preferences in Supabase (only if user already existed)
      if (user) {
        const { error } = await supabase
          .from('users')
          .update({ 
            delivery_time,
            timezone,
          })
          .eq('id', userId);

        if (error) {
          throw error;
        }
      }
      // If user was just created, preferences were set during creation

      // Update local store state with new preferences
      // (Only if we didn't create a new user - if we created, preferences are already set)
      if (user) {
        set({
          preferences: {
            delivery_time,
            timezone,
          },
        });
      } else {
        // User was just created, load preferences to update store
        await get().loadPreferences();
      }
    } catch (error: any) {
      throw error;
    }
  },
}));

