import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { clearStoredDeepLink } from '../lib/deepLinkIntent';
import { useTheme, typography, spacing } from '../design-system';

interface AuthScreenProps {
  initialDeepLink?: string | null;
}

export const AuthScreen = ({ initialDeepLink }: AuthScreenProps) => {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestedEmail, setRequestedEmail] = useState<string | null>(null); // Store email when requesting magic link
  const [isInputFocused, setIsInputFocused] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);
  const initializeSession = useAuthStore((state) => state.initializeSession);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing['2xl'] as number,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      marginBottom: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImage: {
      width: 100,
      height: 100,
    },
    title: {
      ...typography.titleLarge,
      textAlign: 'center',
      color: colors.textPrimary,
      marginBottom: spacing.md,
      maxWidth: 400,
    },
    subtitle: {
      ...typography.bodyLarge,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing['3xl'],
      maxWidth: 400,
    },
    inputWrapper: {
      width: '100%',
      maxWidth: 400,
      marginBottom: spacing.lg,
    },
    input: {
      width: '100%',
      height: 50,
      paddingHorizontal: spacing.lg,
      ...typography.bodyLarge,
      backgroundColor: colors.background,
      borderRadius: spacing.radiusMd,
      borderWidth: 2,
      borderColor: colors.separator,
      color: colors.textPrimary,
    },
    inputFocused: {
      borderColor: colors.primary,
    },
    inputValid: {
      borderColor: colors.primary,
    },
    inputError: {
      borderColor: colors.destructive,
    },
    errorText: {
      ...typography.caption,
      color: colors.destructive,
      textAlign: 'center',
      marginBottom: spacing.md,
      maxWidth: 400,
    },
    button: {
      width: '100%',
      maxWidth: 400,
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: spacing.radiusSm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      ...colors.shadowSm,
      marginBottom: spacing.lg,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonIcon: {
      fontSize: 20,
      color: colors.background,
    },
    buttonText: {
      ...typography.bodyLarge,
      color: colors.background,
      fontWeight: '500',
    },
    helperText: {
      ...typography.caption,
      color: colors.textTertiary,
      textAlign: 'center',
      maxWidth: 400,
    },
    successContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing['2xl'] as number,
    },
    successIconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    successIconBackground: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: `${colors.success}1A`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    successCheckmark: {
      fontSize: 36,
      color: colors.success,
    },
    successTitle: {
      ...typography.titleMedium,
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.md,
      maxWidth: 400,
    },
    successMessage: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 400,
    },
    successEmail: {
      fontWeight: '600',
      color: colors.textPrimary,
    },
  }), [colors]);

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
              // Note: Session might not be immediately available, so we'll check multiple times
              let sessionData: any = null;
              let sessionError: any = null;
              let attempts = 0;
              const maxAttempts = 3;
              
              while (attempts < maxAttempts && !sessionData?.session && !sessionError) {
                const result = await supabase.auth.getSession();
                sessionData = result.data;
                sessionError = result.error;
                
                if (!sessionData?.session && !sessionError) {
                  attempts++;
                  if (attempts < maxAttempts) {
                    // Wait a bit before retrying (session might be created asynchronously)
                    await new Promise(resolve => setTimeout(resolve, 300 * attempts));
                  }
                }
              }
              
              if (sessionError) {
                if (__DEV__) {
                  console.error('❌ Session error after verification:', sessionError);
                }
                // Check if it's the specific "Auth session missing" error
                if (sessionError.message?.includes('Auth session missing')) {
                  setErrorMessage('Authentication session expired. Please request a new magic link.');
                } else {
                  setErrorMessage(`Session error: ${sessionError.message}`);
                }
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

  // Show success state if magic link sent successfully
  if (successMessage && successMessage.includes('Check your email')) {
    return (
      <View style={styles.container}>
        <View style={styles.successContent}>
          <View style={styles.successIconContainer}>
            <View style={styles.successIconBackground}>
              <Text style={styles.successCheckmark}>✓</Text>
            </View>
          </View>
          
          <Text style={styles.successTitle}>Check your email!</Text>
          
          <Text style={styles.successMessage}>
            We sent a magic link to {'\n'}
            <Text style={styles.successEmail}>{requestedEmail || email}</Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <View style={styles.content}>
        {/* Logo/Icon - Use new icon.png instead of old logo.png */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Title - Match Lovable exactly */}
        <Text style={styles.title}>TodoTomorrow</Text>

        {/* Subtitle - Match Lovable line breaks */}
        <Text style={styles.subtitle}>
          Capture on the go
        </Text>

        {/* Email Input - Match Lovable: 2px border, proper focus states */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              email && !validateEmail(email) && styles.inputError,
              email && validateEmail(email) && styles.inputValid,
              isInputFocused && !email && styles.inputFocused,
            ]}
            placeholder="name@email.com"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMessage('');
              setSuccessMessage('');
            }}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            editable={!isLoading}
          />
        </View>

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* Submit Button - Match Lovable with icon space */}
        <TouchableOpacity
          style={[
            styles.button,
            (!validateEmail(email) || isLoading) && styles.buttonDisabled,
          ]}
          onPress={handleSendMagicLink}
          disabled={!validateEmail(email) || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <>
              <ActivityIndicator size="small" color={colors.background} style={{ marginRight: spacing.sm }} />
              <Text style={styles.buttonText}>Sending...</Text>
            </>
          ) : (
            <>
              <Text style={styles.buttonIcon}>✉</Text>
              <Text style={styles.buttonText}>Send Magic Link</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Helper Text - Match Lovable exactly */}
        <Text style={styles.helperText}>
          We'll email you a secure login link.{'\n'}
          No password needed.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

