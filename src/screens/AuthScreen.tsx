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
import { clearStoredDeepLink } from '../lib/deepLinkIntent';

interface AuthScreenProps {
  initialDeepLink?: string | null;
}

export const AuthScreen = ({ initialDeepLink }: AuthScreenProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestedEmail, setRequestedEmail] = useState<string | null>(null); // Store email when requesting magic link
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
    const handleDeepLinkEvent = (event: { url: string }) => {
      if (__DEV__) {
        console.log('🔗 Deep link event received (app running):', event.url);
      }
      handleDeepLink(event.url);
    };

    // Check if app was opened via deep link (app was closed, then opened via link)
    const getInitialURL = async () => {
      try {
        if (__DEV__) {
          console.log('🔍 Checking for initial URL...');
        }
        const initialUrl = await Linking.getInitialURL();
        if (__DEV__) {
          console.log('🔍 getInitialURL() returned:', initialUrl || 'null/undefined');
        }
        
        if (initialUrl) {
          if (__DEV__) {
            console.log('✅ App opened with initial URL:', initialUrl);
          }
          // Small delay to ensure component is fully mounted
          setTimeout(() => {
            handleDeepLink(initialUrl);
          }, 100);
        } else {
          if (__DEV__) {
            console.log('ℹ️ No initial URL - app opened normally (or URL already consumed)');
            console.log('🔍 This might still be a deep link - checking again in 500ms...');
          }
          // Sometimes getInitialURL() returns null even if app opened via deep link
          // Try checking again after a short delay
          setTimeout(async () => {
            const retryUrl = await Linking.getInitialURL();
            if (retryUrl) {
              if (__DEV__) {
                console.log('✅ Found URL on retry:', retryUrl);
              }
              handleDeepLink(retryUrl);
            } else {
              if (__DEV__) {
                console.log('ℹ️ Still no URL found on retry');
              }
            }
          }, 500);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('❌ Error getting initial URL:', error);
        }
      }
    };

    // Check initial URL first
    getInitialURL();

    // Also check if App.tsx captured a deep link
    if (initialDeepLink) {
      if (__DEV__) {
        console.log('✅ [AuthScreen] Received initial deep link from App.tsx:', initialDeepLink);
      }
      // Process it after a short delay to ensure component is ready
      setTimeout(() => {
        handleDeepLink(initialDeepLink);
      }, 200);
    }

    // Listen for deep links while app is running (app was already open, link clicked)
    const subscription = Linking.addEventListener('url', handleDeepLinkEvent);
    
    if (__DEV__) {
      console.log('👂 Deep link listener attached');
    }

    return () => {
      subscription.remove();
      if (__DEV__) {
        console.log('👂 Deep link listener removed');
      }
    };
  }, [initialDeepLink]);

  const handleDeepLink = async (url: string) => {
    if (__DEV__) {
      console.log('🔗 Deep link received:', url);
    }
    try {
      const parsedUrl = Linking.parse(url);
      if (__DEV__) {
        console.log('📦 Parsed URL:', JSON.stringify(parsedUrl, null, 2));
        console.log('🔍 URL scheme:', parsedUrl.scheme);
        console.log('🔍 URL path:', parsedUrl.path);
        console.log('🔍 URL hostname:', parsedUrl.hostname);
      }
      
      // Check if this is an auth callback
      // Support both custom scheme (todotomorrow://auth/callback) and Universal Links (https://todotomorrow.com/auth/callback)
      const isCustomScheme = parsedUrl.scheme === 'todotomorrow' && 
                            (parsedUrl.path === 'auth/callback' || parsedUrl.path?.includes('auth/callback'));
      const isUniversalLink = parsedUrl.hostname === 'todotomorrow.com' && 
                             (parsedUrl.path === '/auth/callback' || parsedUrl.path?.includes('/auth/callback'));
      const isAuthCallback = isCustomScheme || isUniversalLink || url.includes('auth/callback');
      
      if (isAuthCallback) {
        // Parse both query params (?) and fragments (#)
        const queryParams = parsedUrl.queryParams as {
          token?: string;
          token_hash?: string;
          type?: string;
        };
        
        // Extract fragment from URL (everything after #)
        const fragmentIndex = url.indexOf('#');
        let fragmentParams: { [key: string]: string } = {};
        
        if (fragmentIndex !== -1) {
          const fragment = url.substring(fragmentIndex + 1);
          if (__DEV__) {
            console.log('🔍 URL fragment found:', fragment.substring(0, 100) + '...');
          }
          
          // Parse fragment as key-value pairs (format: key1=value1&key2=value2)
          fragment.split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key && value) {
              fragmentParams[key] = decodeURIComponent(value);
            }
          });
          
          if (__DEV__) {
            console.log('🔑 Fragment params:', Object.keys(fragmentParams));
            console.log('🔑 Fragment param values:', JSON.stringify(fragmentParams, null, 2));
          }
        }
        
        if (__DEV__) {
          console.log('🔑 Query params:', queryParams);
          console.log('🔑 All query keys:', Object.keys(queryParams));
        }
        
        // Check if we have session tokens in fragment (Supabase redirect format)
        const accessToken = fragmentParams.access_token;
        const refreshToken = fragmentParams.refresh_token;
        const expiresAt = fragmentParams.expires_at;
        const fragmentType = fragmentParams.type;
        
        // Fallback: Extract token from query params (may be called 'token' or 'token_hash' in URL)
        // Also check for 't' parameter (Supabase sometimes uses shortened names)
        const token = queryParams.token || queryParams.token_hash || queryParams.t;
        const queryType = queryParams.type;
        
        // Use fragment type if available, otherwise query type
        const type = fragmentType || queryType;

        if (__DEV__) {
          console.log('🎫 Access token (fragment):', accessToken ? `Found (${accessToken.substring(0, 10)}...)` : 'Missing');
          console.log('🎫 Refresh token (fragment):', refreshToken ? `Found (${refreshToken.substring(0, 10)}...)` : 'Missing');
          console.log('🎫 Token (query params):', token ? `Found (${token.substring(0, 10)}...)` : 'Missing');
          console.log('🎫 Token type from URL:', type);
          console.log('🎫 Expires at:', expiresAt || 'Not provided');
          
          if (!accessToken && !token) {
            console.warn('⚠️ WARNING: No access token or verification token found in URL!');
            console.warn('⚠️ Available query params:', Object.keys(queryParams));
            console.warn('⚠️ Available fragment params:', Object.keys(fragmentParams));
          }
        }

        // Handle two scenarios:
        // 1. Session tokens in fragment (Supabase redirect with access_token) - use setSession
        // 2. Verification token in query params (legacy/fallback) - use verifyOtp
        const hasSessionTokens = accessToken && refreshToken;
        const hasVerificationToken = token && (type === 'email' || type === 'signup' || type === 'magiclink');
        
        if (hasSessionTokens) {
          // Scenario 1: Session tokens provided directly in fragment
          if (__DEV__) {
            console.log('✅ Processing authentication with session tokens (fragment)...');
            console.log('🔐 Access token type:', fragmentType);
          }
          setIsLoading(true);
          setErrorMessage('');
          setSuccessMessage(''); // Clear any previous messages
          
          try {
            // Set session directly from tokens
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (sessionError) {
              if (__DEV__) {
                console.error('❌ Session error:', sessionError);
              }
              setErrorMessage(`Session error: ${sessionError.message}`);
            } else if (sessionData?.session) {
              if (__DEV__) {
                console.log('🎉 Session set successfully!');
                console.log('👤 User email:', sessionData.session.user.email);
                console.log('🔑 Session expires at:', new Date(sessionData.session.expires_at! * 1000).toLocaleString());
              }
              // Update Zustand store with session to trigger navigation to MainScreen
              setSession(sessionData.session);
              setSuccessMessage('Successfully signed in!');
              // Clear stored deep link since we've successfully processed it
              clearStoredDeepLink();
              // Navigation to MainScreen happens automatically via App.tsx session check and onAuthStateChange
            } else {
              setErrorMessage('Session not created. Please try again.');
            }
          } catch (err: any) {
            console.error('❌ Deep link handling error:', err);
            setErrorMessage(`Error: ${err?.message || 'An unexpected error occurred'}`);
          } finally {
            setIsLoading(false);
          }
        } else if (hasVerificationToken) {
          // Scenario 2: Verification token in query params (legacy/fallback)
          if (__DEV__) {
            console.log('✅ Processing authentication with verification token (query params)...');
            console.log('🔐 Token type from URL:', type);
          }
          setIsLoading(true);
          setErrorMessage('');
          setSuccessMessage(''); // Clear any previous messages
          
          try {
            // Verify the magic link token
            // IMPORTANT: Supabase magic links use type 'email' for verifyOtp, NOT 'magiclink'
            // The URL might say 'magiclink' but verifyOtp expects 'email'
            if (__DEV__) {
              console.log('🔐 Verifying OTP with type: email (Supabase uses email type)');
            }
            
            // For magic link email redirects, try multiple verification methods
            // The token from URL redirects may need different parameter names
            // Determine the correct type to use
            const verifyType = type === 'signup' ? 'signup' : 'email';
            
            if (__DEV__) {
              console.log('🔐 Will try verification with type:', verifyType);
            }
            
            let verificationResult: any = null;
            let lastError: any = null;
            
            // Method 1: Try with token_hash (this is what Supabase uses for redirect tokens)
            if (__DEV__) {
              console.log('🔐 Method 1: Verifying with token_hash');
            }
            verificationResult = await supabase.auth.verifyOtp({
              token_hash: token,
              type: verifyType,
            });
            
            if (!verificationResult.error) {
              if (__DEV__) {
                console.log('✅ Method 1 succeeded: token_hash');
              }
            } else {
              lastError = verificationResult.error;
              
              // Method 2: Try with email + token (if we have email stored)
              if (requestedEmail) {
                if (__DEV__) {
                  console.log('❌ Method 1 failed, trying Method 2: email + token');
                }
                verificationResult = await supabase.auth.verifyOtp({
                  email: requestedEmail,
                  token: token,
                  type: verifyType,
                });
                
                if (!verificationResult.error) {
                  if (__DEV__) {
                    console.log('✅ Method 2 succeeded: email + token');
                  }
                } else {
                  lastError = verificationResult.error;
                }
              }
            }
            
            const { data: verifyData, error: verifyError } = verificationResult || { data: null, error: lastError };
            const finalError = verifyError || lastError;

            if (finalError) {
              if (__DEV__) {
                console.error('❌ All token verification methods failed');
                console.error('Last error:', finalError);
                console.error('Error details:', JSON.stringify(finalError, null, 2));
                console.error('Token used:', token.substring(0, 10) + '...');
                console.error('Type used:', type === 'signup' ? 'signup' : 'email');
                console.error('Email available:', requestedEmail || 'none');
              }
              setErrorMessage(`Authentication failed: ${finalError.message}`);
            } else {
              if (__DEV__) {
                console.log('✅ Token verified successfully');
                console.log('📦 Verification data:', verifyData ? 'Received' : 'No data');
              }
              
              // Session is automatically created by Supabase client after successful verifyOtp
              // Get the session to ensure it's loaded and update store
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError) {
                if (__DEV__) {
                  console.error('❌ Session error after verification:', sessionError);
                }
                setErrorMessage(`Session error: ${sessionError.message}`);
              } else if (sessionData?.session) {
                if (__DEV__) {
                  console.log('🎉 Session created successfully!');
                  console.log('👤 User email:', sessionData.session.user.email);
                  console.log('🔑 Session expires at:', new Date(sessionData.session.expires_at! * 1000).toLocaleString());
                }
                // Update Zustand store with session to trigger navigation to MainScreen
                setSession(sessionData.session);
                setSuccessMessage('Successfully signed in!');
                // Clear stored deep link since we've successfully processed it
                clearStoredDeepLink();
                // Navigation to MainScreen happens automatically via App.tsx session check and onAuthStateChange
              } else {
                if (__DEV__) {
                  console.warn('⚠️ No session found after verification');
                  console.warn('This might indicate a timing issue - session may be created shortly');
                }
                // Retry getting session after a short delay (race condition workaround)
                setTimeout(async () => {
                  const { data: retrySession } = await supabase.auth.getSession();
                  if (retrySession?.session) {
                    if (__DEV__) {
                      console.log('✅ Session found on retry');
                    }
                    setSession(retrySession.session);
                    setSuccessMessage('Successfully signed in!');
                    // Clear stored deep link since we've successfully processed it
                    clearStoredDeepLink();
                  } else {
                    setErrorMessage('Session not created. Please try again.');
                  }
                }, 500);
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
            console.warn('⚠️ Missing tokens. Has session tokens:', hasSessionTokens, 'Has verification token:', hasVerificationToken);
          }
          if (!hasSessionTokens && !hasVerificationToken) {
            setErrorMessage('Magic link tokens are missing. Please request a new link.');
          } else if (hasVerificationToken && type && type !== 'email' && type !== 'signup' && type !== 'magiclink') {
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

  const processPastedUrl = (cleanedText: string) => {
    // If it's the Supabase verification URL, extract token and construct deep link
    if (cleanedText.includes('supabase.co/auth/v1/verify') && cleanedText.includes('token=')) {
      if (__DEV__) {
        console.log('📋 Processing Supabase verification URL:', cleanedText);
      }
      try {
        // Extract token from Supabase URL
        const urlObj = new URL(cleanedText);
        const token = urlObj.searchParams.get('token');
        const type = urlObj.searchParams.get('type') || 'email';
        
        if (token) {
          const deepLinkUrl = `todotomorrow://auth/callback?token=${token}&type=${type}`;
          if (__DEV__) {
            console.log('🔨 Constructed deep link from Supabase URL:', deepLinkUrl);
          }
          handleDeepLink(deepLinkUrl);
        } else {
          setErrorMessage('Could not extract token from URL');
        }
      } catch (err: any) {
        if (__DEV__) {
          console.error('❌ Error parsing Supabase URL:', err);
        }
        setErrorMessage('Invalid URL format');
      }
    }
    // If pasted text is already a deep link URL
    else if (cleanedText.includes('todotomorrow://') || cleanedText.includes('token=')) {
      if (__DEV__) {
        console.log('📋 Processing pasted deep link URL:', cleanedText);
      }
      handleDeepLink(cleanedText);
    } 
    // If it's just a token (long string)
    else if (cleanedText.length > 20 && !cleanedText.includes('http')) {
      // Assume it's a token - construct URL
      const constructedUrl = `todotomorrow://auth/callback?token=${cleanedText}&type=email`;
      if (__DEV__) {
        console.log('🔨 Constructed URL from token:', constructedUrl);
      }
      handleDeepLink(constructedUrl);
    }
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
    const trimmedEmail = email.trim().toLowerCase();

    try {
      // Call Supabase magic link API
      // For development build: Use custom scheme (works immediately)
      // For production: Can switch to Universal Links after proper configuration
      const { error } = await supabase.auth.signInWithOtp({
        email: trimmedEmail,
        options: {
          emailRedirectTo: 'todotomorrow://auth/callback', // Custom scheme - works with development build
        },
      });

      if (error) {
        // Show error but don't reveal whether email exists (security best practice)
        setErrorMessage('Unable to send magic link. Please try again.');
        console.error('Magic link error:', error);
      } else {
        // Store email so we can use it during token verification
        setRequestedEmail(trimmedEmail);
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

      {/* Temporary test buttons for debugging - REMOVE AFTER TESTING */}
      {__DEV__ && (
        <>
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={async () => {
              // Test deep link handler with fake token
              const testUrl = 'todotomorrow://auth/callback?token=test123&type=email';
              if (__DEV__) {
                console.log('🧪 Testing deep link handler with:', testUrl);
              }
              handleDeepLink(testUrl);
            }}
          >
            <Text style={styles.buttonText}>🧪 Test Deep Link Handler</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { marginTop: 12, marginBottom: 8 }]}
            placeholder="Paste Supabase verify URL or todotomorrow:// URL here"
            placeholderTextColor="#999"
            onSubmitEditing={(event) => {
              // Also handle when user presses Enter/Submit
              const text = event.nativeEvent.text;
              if (text.trim()) {
                // Process the pasted URL
                const cleanedText = text.replace(/\s+/g, '');
                processPastedUrl(cleanedText);
              }
            }}
            onChangeText={(text) => {
              // Remove spaces (user might have added them for readability)
              const cleanedText = text.replace(/\s+/g, '');
              // Process when text looks complete (contains key indicators)
              if (cleanedText.includes('supabase.co') || cleanedText.includes('todotomorrow://') || cleanedText.includes('token=') || (cleanedText.length > 40 && !cleanedText.includes('http'))) {
                processPastedUrl(cleanedText);
              }
            }}
          />
          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={async () => {
              // Check if there's a session from browser auth
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
        </>
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

