import PostHog from 'posthog-react-native';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// PostHog instance - initialized in initPostHog()
let posthogInstance: PostHog | null = null;

/**
 * Initialize PostHog for product analytics and user behavior tracking
 * 
 * Configuration:
 * - API key from environment variable EXPO_PUBLIC_POSTHOG_KEY
 * - Host URL from environment variable EXPO_PUBLIC_POSTHOG_HOST (default: US)
 * - Autocapture enabled for automatic event tracking
 * - User identification via identifyUser() helper function
 * 
 * Note: Uses Constants.expoConfig?.extra to access env vars in production builds
 */
export function initPostHog() {
  // Try multiple ways to get the API key (for compatibility)
  const apiKey = 
    process.env.EXPO_PUBLIC_POSTHOG_KEY || 
    Constants.expoConfig?.extra?.posthogKey ||
    Constants.expoConfig?.extra?.EXPO_PUBLIC_POSTHOG_KEY;
  
  const host = 
    process.env.EXPO_PUBLIC_POSTHOG_HOST || 
    Constants.expoConfig?.extra?.posthogHost ||
    Constants.expoConfig?.extra?.EXPO_PUBLIC_POSTHOG_HOST ||
    'https://us.i.posthog.com';

  // TEMPORARY DEBUG: Log even in production to help diagnose issue
  // TODO: Remove production logging after PostHog is verified working
  console.log('🔍 [PostHog Debug] Initializing PostHog...');
  console.log('🔍 [PostHog Debug] API Key exists:', !!apiKey);
  console.log('🔍 [PostHog Debug] API Key length:', apiKey ? apiKey.length : 0);
  console.log('🔍 [PostHog Debug] API Key preview:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');
  console.log('🔍 [PostHog Debug] Host:', host);
  console.log('🔍 [PostHog Debug] process.env.EXPO_PUBLIC_POSTHOG_KEY:', !!process.env.EXPO_PUBLIC_POSTHOG_KEY);
  console.log('🔍 [PostHog Debug] Constants.expoConfig?.extra:', !!Constants.expoConfig?.extra);

  // If API key is not configured, log warning and skip initialization
  if (!apiKey) {
    console.warn('⚠️ PostHog API key not configured. Analytics disabled.');
    console.warn('⚠️ [PostHog Debug] Checked: process.env, Constants.expoConfig.extra');
    return;
  }

  try {
    // Create PostHog instance using constructor (not setup method)
    posthogInstance = new PostHog(apiKey, {
      host,
      autocapture: true, // Enable automatic event tracking (clicks, page views, etc.)
      debug: true, // Enable debug mode to see what's happening
    });

    console.log('✅ PostHog initialized successfully');
    console.log('🔍 [PostHog Debug] PostHog instance created:', !!posthogInstance);
    
    // Test capture immediately to verify it works
    try {
      posthogInstance.capture('posthog_initialized', {
        timestamp: new Date().toISOString(),
        build_version: Constants.expoConfig?.version || 'unknown',
      });
      console.log('✅ PostHog test event sent');
    } catch (testError) {
      console.error('❌ PostHog test capture failed:', testError);
    }
  } catch (error) {
    // Don't crash app if PostHog initialization fails
    console.error('❌ Failed to initialize PostHog:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
  }
}

/**
 * Identify user in PostHog for linking events to users
 * 
 * Fetches user data from users table and calls PostHog identify() with:
 * - userId: User's auth_id (UUID from Supabase)
 * - properties: email, cohort (from users table)
 * 
 * Should be called when user signs up or logs in (in authStore.setSession)
 * 
 * @param userId - User's auth_id from Supabase session
 */
export async function identifyUser(userId: string) {
  try {
    // Check if PostHog is initialized
    if (!process.env.EXPO_PUBLIC_POSTHOG_KEY) {
      if (__DEV__) {
        console.warn('⚠️ PostHog not initialized, skipping user identification');
      }
      return;
    }

    // Fetch user data from users table
    const { data: user, error } = await supabase
      .from('users')
      .select('email, cohort')
      .eq('auth_id', userId)
      .maybeSingle();

    if (error) {
      if (__DEV__) {
        console.error('Error fetching user data for PostHog identification:', error);
      }
      // Still identify user with minimal data (userId only)
      posthogInstance.identify(userId);
      return;
    }

    // Build user properties
    const properties: Record<string, string> = {};
    
    if (user?.email) {
      properties.email = user.email;
    }
    
    if (user?.cohort) {
      properties.cohort = user.cohort;
    }

    // Identify user in PostHog
    posthogInstance.identify(userId, properties);

    // TEMPORARY DEBUG: Log even in production to help diagnose issue
    console.log('✅ PostHog user identified:', userId, properties);
  } catch (error) {
    // Don't crash app if user identification fails
    if (__DEV__) {
      console.error('❌ Failed to identify user in PostHog:', error);
    }
  }
}

/**
 * Reset user identification (call on sign out)
 */
export function resetPostHog() {
  try {
    if (!posthogInstance) {
      return;
    }
    posthogInstance.reset();
    if (__DEV__) {
      console.log('✅ PostHog user reset');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('❌ Failed to reset PostHog user:', error);
    }
  }
}

// Export PostHog instance for use throughout app
// Use getPostHog() to get the initialized instance
export function getPostHog(): PostHog | null {
  return posthogInstance;
}

// Export PostHog class for type references
export { PostHog };

/**
 * Generic event tracking wrapper
 * 
 * @param eventName - Name of the event to track
 * @param properties - Optional properties to include with the event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  try {
    // Check if PostHog is initialized
    if (!posthogInstance) {
      console.warn('⚠️ PostHog not initialized, skipping event tracking:', eventName);
      return;
    }

    // PostHog automatically includes user_id and timestamp if user is identified
    posthogInstance.capture(eventName, properties || {});

    // TEMPORARY DEBUG: Log even in production to help diagnose issue
    console.log('📊 PostHog event tracked:', eventName, properties);
  } catch (error) {
    // Don't crash app if event tracking fails
    console.error('❌ Failed to track event:', eventName, error);
  }
}

/**
 * Track task_added event
 * 
 * @param taskId - ID of the task that was added
 * @param properties - Optional additional properties (e.g., workflow_mode)
 */
export function trackTaskAdded(taskId: string, properties?: Record<string, any>) {
  trackEvent('task_added', {
    task_id: taskId,
    ...properties,
  });
}

/**
 * Track task_completed event
 * 
 * @param taskId - ID of the task that was completed
 * @param properties - Optional additional properties
 */
export function trackTaskCompleted(taskId: string, properties?: Record<string, any>) {
  trackEvent('task_completed', {
    task_id: taskId,
    ...properties,
  });
}

/**
 * Track task_deleted event
 * 
 * @param taskId - ID of the task that was deleted
 * @param properties - Optional additional properties
 */
export function trackTaskDeleted(taskId: string, properties?: Record<string, any>) {
  trackEvent('task_deleted', {
    task_id: taskId,
    ...properties,
  });
}

/**
 * Track user_signed_up event
 * 
 * @param userId - User's auth_id (UUID from Supabase)
 * @param properties - Optional properties (e.g., email, cohort)
 */
export function trackUserSignedUp(userId: string, properties?: Record<string, any>) {
  trackEvent('user_signed_up', {
    user_id: userId,
    ...properties,
  });
}

/**
 * Track user_logged_in event
 * 
 * @param userId - User's auth_id (UUID from Supabase)
 * @param properties - Optional properties (e.g., email)
 */
export function trackUserLoggedIn(userId: string, properties?: Record<string, any>) {
  trackEvent('user_logged_in', {
    user_id: userId,
    ...properties,
  });
}

/**
 * Track paywall_viewed event
 * 
 * @param properties - Optional properties (e.g., cohort, days_remaining, tasks_remaining)
 */
export function trackPaywallViewed(properties?: Record<string, any>) {
  trackEvent('paywall_viewed', properties || {});
}

/**
 * Track purchase_completed event
 * 
 * @param userId - User's auth_id (UUID from Supabase)
 * @param properties - Optional properties (e.g., cohort, price_cents, platform, unlock_method)
 */
export function trackPurchaseCompleted(userId: string, properties?: Record<string, any>) {
  trackEvent('purchase_completed', {
    user_id: userId,
    ...properties,
  });
}

