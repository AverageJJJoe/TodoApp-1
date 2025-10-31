import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
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

