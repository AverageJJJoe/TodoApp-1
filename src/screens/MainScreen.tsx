import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export const MainScreen = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Sign out from Supabase (clears AsyncStorage automatically)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (__DEV__) {
          console.error('Error signing out:', error);
        }
        Alert.alert('Error', 'Failed to sign out. Please try again.');
        setIsSigningOut(false);
        return;
      }
      
      // Clear session from Zustand store
      clearSession();
      
      if (__DEV__) {
        console.log('✅ Successfully signed out');
      }
      
      // Navigation back to AuthScreen happens automatically via App.tsx session check
    } catch (error: any) {
      if (__DEV__) {
        console.error('Error during sign out:', error);
      }
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setIsSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Main Screen</Text>
        <Text style={styles.subtitle}>Welcome!</Text>
        {session?.user?.email && (
          <Text style={styles.email}>Signed in as: {session.user.email}</Text>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          This is the main screen placeholder. It will be replaced with the Tasks Screen in Story 2.1.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.signOutButton, isSigningOut && styles.signOutButtonDisabled]}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    marginBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

