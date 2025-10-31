import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { supabase } from './src/lib/supabase';
import { AuthScreen } from './src/screens/AuthScreen';
import { MainScreen } from './src/screens/MainScreen';
import { useAuthStore } from './src/stores/authStore';

export default function App() {
  const session = useAuthStore((state) => state.session);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initializeSession = useAuthStore((state) => state.initializeSession);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    // Initialize session on app mount
    initializeSession();

    // Listen to auth state changes to keep store in sync
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (__DEV__) {
        console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      }

      switch (event) {
        case 'SIGNED_IN':
        case 'TOKEN_REFRESHED':
        case 'USER_UPDATED':
          if (session) {
            setSession(session);
          }
          break;
        case 'SIGNED_OUT':
          setSession(null);
          break;
        default:
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

  // TEMPORARY: Dev-only bypass for Story 2.2 testing
  // Set to true to bypass auth and show MainScreen directly
  // TODO: Set to false after Story 2.2 testing is complete and auth issue is fixed
  const DEV_BYPASS_AUTH = __DEV__ && true; // Enabled for Story 2.2 testing - auth flow needs fixing

  // Conditional rendering based on session state
  return (
    <>
      {DEV_BYPASS_AUTH || session ? <MainScreen /> : <AuthScreen />}
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
