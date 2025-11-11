import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { identifyUser, resetPostHog } from '../lib/posthog';

interface AuthStore {
  session: Session | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
  initializeSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  isLoading: true,
  setSession: (session: Session | null) => {
    set({ session });
    
    // Identify user in PostHog when session is set (async, non-blocking)
    if (session?.user?.id) {
      // Call identifyUser asynchronously (don't block session update)
      identifyUser(session.user.id).catch((error) => {
        if (__DEV__) {
          console.error('Error identifying user in PostHog:', error);
        }
      });
    } else {
      // Reset PostHog user when session is cleared
      resetPostHog();
    }
  },
  clearSession: () => {
    set({ session: null });
    // Reset PostHog user on sign out
    resetPostHog();
  },
  initializeSession: async () => {
    try {
      set({ isLoading: true });
      
      // Get session from Supabase (checks AsyncStorage automatically)
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        if (__DEV__) {
          console.error('Error retrieving session:', error);
        }
        set({ session: null, isLoading: false });
        return;
      }
      
      if (session) {
        if (__DEV__) {
          console.log('✅ Session found and restored');
        }
        set({ session, isLoading: false });
        
        // Identify user in PostHog when session is restored
        if (session.user?.id) {
          identifyUser(session.user.id).catch((error) => {
            if (__DEV__) {
              console.error('Error identifying user in PostHog:', error);
            }
          });
        }
      } else {
        if (__DEV__) {
          console.log('No existing session found');
        }
        set({ session: null, isLoading: false });
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error initializing session:', error);
      }
      set({ session: null, isLoading: false });
    }
  },
}));

