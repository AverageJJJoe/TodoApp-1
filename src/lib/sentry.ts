import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

/**
 * Initialize Sentry for crash reporting and error tracking
 * 
 * Configuration:
 * - DSN from environment variable EXPO_PUBLIC_SENTRY_DSN
 * - Only enabled in production builds (not in Expo development)
 * - 100% trace sampling for MVP (adjust later for cost optimization)
 * - Native crash handling enabled for iOS and Android
 * - Release tracking with app version from app.config.js
 */
export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  // If DSN is not configured, log warning and skip initialization
  if (!dsn) {
    if (__DEV__) {
      console.warn('⚠️ Sentry DSN not configured. Crash reporting disabled.');
    }
    return;
  }

  // Get app version from app.config.js via expo-constants
  const appVersion = Constants.expoConfig?.version || '1.0.12';

  try {
    Sentry.init({
      dsn,
      
      // Only capture errors in production builds, not in Expo development
      enableInExpoDevelopment: false,
      
      // Performance monitoring: 100% sampling for MVP (adjust later)
      tracesSampleRate: 1.0,
      
      // Enable native crash handling for iOS and Android
      enableNativeCrashHandling: true,
      
      // Release tracking: associate crashes with app version
      release: appVersion,
      dist: appVersion,
      
      // Environment: distinguish between dev and production
      environment: __DEV__ ? 'development' : 'production',
      
      // Additional context data (IP address, user info, etc.)
      // Note: Sentry automatically filters sensitive data (passwords, tokens)
      sendDefaultPii: true,
      
      // Enable Logs
      enableLogs: true,
      
      // Configure Session Replay (optional, can be disabled if not needed)
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1,
      integrations: [
        Sentry.mobileReplayIntegration(),
        Sentry.feedbackIntegration(),
      ],
    });

    if (__DEV__) {
      console.log('✅ Sentry initialized successfully');
    }
  } catch (error) {
    // Don't crash app if Sentry initialization fails
    if (__DEV__) {
      console.error('❌ Failed to initialize Sentry:', error);
    }
  }
}

// Export Sentry instance for use in Error Boundary and other components
export { Sentry };

