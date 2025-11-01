import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { supabase } from './src/lib/supabase';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainScreen } from './src/screens/MainScreen';
import { useAuthStore } from './src/stores/authStore';
import { getStoredDeepLink } from './src/lib/deepLinkIntent';

export default function App() {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeSession = useAuthStore((state) => state.initializeSession);
  const setSession = useAuthStore((state) => state.setSession);
  const [initialDeepLink, setInitialDeepLink] = useState<string | null>(null);

  // Capture deep link at App level (catches it before AuthScreen loads)
  useEffect(() => {
    const maxRetries = 3;
    
    const captureInitialURL = async () => {
      // FIRST: Check native module (catches intent stored before React Native initialized)
      try {
        if (__DEV__) {
          console.log('🔍 [App.tsx] Checking native module for stored deep link...');
        }
        const nativeUrl = await getStoredDeepLink();
        if (nativeUrl) {
          if (__DEV__) {
            console.log('✅ [App.tsx] Found deep link from native module:', nativeUrl);
          }
          setInitialDeepLink(nativeUrl);
          return; // Success, stop checking
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('⚠️ [App.tsx] Native module check failed (this is OK if not on Android):', error);
        }
      }

      // FALLBACK: Check standard Linking API
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            // Wait before retry (200ms, 400ms, 600ms)
            await new Promise(resolve => setTimeout(resolve, 200 * attempt));
          }
          
          if (__DEV__) {
            console.log(`🔍 [App.tsx] Checking Linking API for initial URL (attempt ${attempt + 1}/${maxRetries + 1})...`);
          }
          const url = await Linking.getInitialURL();
          if (url) {
            if (__DEV__) {
              console.log('✅ [App.tsx] Captured initial URL from Linking API:', url);
            }
            setInitialDeepLink(url);
            return; // Success, stop retrying
          } else {
            if (__DEV__ && attempt === maxRetries) {
              console.log('ℹ️ [App.tsx] No initial URL found after all checks');
            }
          }
        } catch (error) {
          if (__DEV__) {
            console.error('❌ [App.tsx] Error getting initial URL:', error);
          }
        }
      }
    };

    captureInitialURL();

    // Also listen for deep links while app is running (critical for when app is in background)
    const subscription = Linking.addEventListener('url', (event) => {
      if (__DEV__) {
        console.log('🔗 [App.tsx] Deep link event received (app running):', event.url);
      }
      setInitialDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Initialize session on app mount
    initializeSession();

    // Listen to auth state changes to keep store in sync
    // This is critical for detecting session changes after deep link auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (__DEV__) {
        console.log('🔄 Auth state changed:', event);
        console.log('👤 Session:', session ? `User: ${session.user.email}` : 'No session');
      }

      switch (event) {
        case 'SIGNED_IN':
          if (session) {
            if (__DEV__) {
              console.log('✅ SIGNED_IN event - updating session in store');
            }
            setSession(session);
          }
          break;
        case 'TOKEN_REFRESHED':
          if (session) {
            if (__DEV__) {
              console.log('🔄 TOKEN_REFRESHED event - updating session');
            }
            setSession(session);
          }
          break;
        case 'USER_UPDATED':
          if (session) {
            if (__DEV__) {
              console.log('👤 USER_UPDATED event - updating session');
            }
            setSession(session);
          }
          break;
        case 'SIGNED_OUT':
          if (__DEV__) {
            console.log('👋 SIGNED_OUT event - clearing session');
          }
          setSession(null);
          break;
        default:
          if (__DEV__) {
            console.log('ℹ️ Auth event (not handled):', event);
          }
          break;
      }
    });

    // Cleanup listener on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [initializeSession, setSession]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
        <StatusBar style="auto" />
      </>
    );
  }

  // TEMPORARY: Dev-only bypass for testing
  // Set to false to test real auth flow
  // TODO: Remove this bypass once auth is working properly
  const DEV_BYPASS_AUTH = __DEV__ && false; // Set to false to test real auth flow

  // Conditional rendering based on session state
  // Pass initial deep link to AuthScreen so it can process it
  return (
    <>
      {DEV_BYPASS_AUTH || session ? <MainScreen /> : <AuthScreen initialDeepLink={initialDeepLink} />}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
