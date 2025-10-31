import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const setSession = useAuthStore((state) => state.setSession);
  const initializeSession = useAuthStore((state) => state.initializeSession);

  // Basic email validation regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check for existing session when AuthScreen mounts
  useEffect(() => {
    const checkExistingSession = async () => {
      // Only check if we don't already have a session (to avoid unnecessary checks)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        if (__DEV__) {
          console.log('✅ Existing session found, updating store');
        }
        setSession(session);
      }
    };
    checkExistingSession();
  }, [setSession]);

  // Handle deep link for magic link callback
  useEffect(() => {
    // Handle initial URL if app was opened via deep link
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    getInitialURL();

    // Listen for deep links while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = async (url: string) => {
    if (__DEV__) {
      console.log('🔗 Deep link received:', url);
    }
    try {
      const parsedUrl = Linking.parse(url);
      if (__DEV__) {
        console.log('📦 Parsed URL:', JSON.stringify(parsedUrl, null, 2));
      }
      
      // Check if this is an auth callback
      // Support both custom scheme (todotomorrow://auth/callback) and Universal Links (https://todotomorrow.com/auth/callback)
      const isCustomScheme = parsedUrl.scheme === 'todotomorrow' && 
                            (parsedUrl.path === 'auth/callback' || parsedUrl.path?.includes('auth/callback'));
      const isUniversalLink = parsedUrl.hostname === 'todotomorrow.com' && 
                             (parsedUrl.path === '/auth/callback' || parsedUrl.path?.includes('/auth/callback'));
      const isAuthCallback = isCustomScheme || isUniversalLink || url.includes('auth/callback');
      
      if (isAuthCallback) {
        const queryParams = parsedUrl.queryParams as {
          token?: string;
          token_hash?: string;
          type?: string;
        };
        
        if (__DEV__) {
          console.log('🔑 Query params:', queryParams);
        }
        
        // Extract token (may be called 'token' or 'token_hash' in URL)
        const token = queryParams.token || queryParams.token_hash;
        const type = queryParams.type;

        if (__DEV__) {
          console.log('🎫 Token:', token ? 'Found' : 'Missing', 'Type:', type);
        }

        // Accept 'email', 'signup', and 'magiclink' types (Supabase uses different types)
        if (token && (type === 'email' || type === 'signup' || type === 'magiclink')) {
          if (__DEV__) {
            console.log('✅ Processing authentication...');
          }
          setIsLoading(true);
          setErrorMessage('');
          setSuccessMessage(''); // Clear any previous messages
          
          try {
            // Verify the magic link token
            // Supabase verifyOtp expects token_hash parameter
            // For magiclink type, we need to extract the token differently
            // Supabase sends tokens in the URL, and verifyOtp needs the exact type
            if (__DEV__) {
              console.log('🔐 Verifying OTP with type:', type);
            }
            
            // Try with the actual type from URL first
            let verificationResult = await supabase.auth.verifyOtp({
              token_hash: token,
              type: type === 'magiclink' ? 'email' : (type as 'email' | 'signup'),
            });
            
            // If that fails and type is magiclink, try signup as fallback
            if (verificationResult.error && type === 'magiclink') {
              if (__DEV__) {
                console.log('🔄 Retrying with signup type...');
              }
              verificationResult = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'signup',
              });
            }
            
            const { data, error } = verificationResult;

            if (error) {
              console.error('❌ Token verification error:', error);
              setErrorMessage(`Authentication failed: ${error.message}`);
            } else {
              if (__DEV__) {
                console.log('✅ Token verified, getting session...');
              }
              // Session is automatically created by Supabase client
              // Refresh session to ensure it's loaded
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError) {
                console.error('❌ Session error:', sessionError);
                setErrorMessage(`Session error: ${sessionError.message}`);
              } else if (sessionData?.session) {
                if (__DEV__) {
                  console.log('🎉 Session created successfully!', sessionData.session.user.email);
                }
                // Update Zustand store with session to trigger navigation to MainScreen
                setSession(sessionData.session);
                setSuccessMessage('Successfully signed in!');
                // Navigation to MainScreen happens automatically via App.tsx session check
              } else {
                if (__DEV__) {
                  console.warn('⚠️ No session found after verification');
                }
                setErrorMessage('Session not created. Please try again.');
              }
            }
          } catch (err: any) {
            console.error('❌ Deep link handling error:', err);
            setErrorMessage(`Error: ${err?.message || 'An unexpected error occurred'}`);
          } finally {
            setIsLoading(false);
          }
        } else {
          if (__DEV__) {
            console.warn('⚠️ Missing token or unsupported type. Token:', !!token, 'Type:', type);
          }
          if (!token) {
            setErrorMessage('Magic link token is missing. Please request a new link.');
          } else if (type !== 'email' && type !== 'signup') {
            setErrorMessage(`Unsupported authentication type: ${type}`);
          }
        }
      } else {
        if (__DEV__) {
          console.log('ℹ️ Not an auth callback URL:', parsedUrl.path);
        }
      }
    } catch (err: any) {
      console.error('❌ Error parsing deep link:', err);
      setErrorMessage(`Error parsing link: ${err?.message || 'Unknown error'}`);
    }
  };

  const validateEmail = (emailToValidate: string): boolean => {
    return emailRegex.test(emailToValidate);
  };

  const handleSendMagicLink = async () => {
    // Reset messages
    setSuccessMessage('');
    setErrorMessage('');

    // Validate email format
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Call Supabase magic link API
      // Use web URL for Universal Links / App Links (primary)
      // Custom scheme will still work as fallback
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: 'https://todotomorrow.com/auth/callback',
        },
      });

      if (error) {
        // Show error but don't reveal whether email exists (security best practice)
        setErrorMessage('Unable to send magic link. Please try again.');
        console.error('Magic link error:', error);
      } else {
        setSuccessMessage('Check your email');
        setEmail(''); // Clear email input after successful send
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Enter your email to receive a magic link</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errorMessage && styles.inputError]}
          placeholder="Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrorMessage(''); // Clear error when user starts typing
            setSuccessMessage(''); // Clear success message when user starts typing
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSendMagicLink}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Magic Link</Text>
        )}
      </TouchableOpacity>

      {/* Temporary test button for Story 2.1 UI testing - REMOVE AFTER TESTING */}
      {__DEV__ && (
        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={async () => {
            // For Story 2.1 testing: Manually check if there's a session from browser auth
            // If user clicked magic link in browser, session might be in AsyncStorage
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              setSession(session);
              setSuccessMessage('Session found! Navigating to MainScreen...');
            } else {
              setErrorMessage('No session found. Complete authentication first, or the token may have expired.');
            }
          }}
        >
          <Text style={styles.buttonText}>🔧 Check for Session (Dev Only)</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#00C851',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#666',
    marginTop: 12,
  },
});

