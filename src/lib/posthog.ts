import PostHog from 'posthog-react-native';
import { supabase } from './supabase';

/**
 * Initialize PostHog for product analytics and user behavior tracking
 * 
 * Configuration:
 * - API key from environment variable EXPO_PUBLIC_POSTHOG_KEY
 * - Host URL from environment variable EXPO_PUBLIC_POSTHOG_HOST (default: US)
 * - Autocapture enabled for automatic event tracking
 * - User identification via identifyUser() helper function
 */
export function initPostHog() {
  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  // If API key is not configured, log warning and skip initialization
  if (!apiKey) {
    if (__DEV__) {
      console.warn('⚠️ PostHog API key not configured. Analytics disabled.');
    }
    return;
  }

  try {
    PostHog.setup(apiKey, {
      host,
      autocapture: true, // Enable automatic event tracking (clicks, page views, etc.)
    });

    if (__DEV__) {
      console.log('✅ PostHog initialized successfully');
    }
  } catch (error) {
    // Don't crash app if PostHog initialization fails
    if (__DEV__) {
      console.error('❌ Failed to initialize PostHog:', error);
    }
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
      PostHog.identify(userId);
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
    PostHog.identify(userId, properties);

    if (__DEV__) {
      console.log('✅ PostHog user identified:', userId, properties);
    }
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
    PostHog.reset();
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
    if (!process.env.EXPO_PUBLIC_POSTHOG_KEY) {
      if (__DEV__) {
        console.warn('⚠️ PostHog not initialized, skipping event tracking:', eventName);
      }
      return;
    }

    // PostHog automatically includes user_id and timestamp if user is identified
    PostHog.capture(eventName, properties || {});

    if (__DEV__) {
      console.log('📊 PostHog event tracked:', eventName, properties);
    }
  } catch (error) {
    // Don't crash app if event tracking fails
    if (__DEV__) {
      console.error('❌ Failed to track event:', eventName, error);
    }
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

