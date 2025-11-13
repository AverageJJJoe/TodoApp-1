import Constants from 'expo-constants';
import { supabase } from './supabase';

/**
 * Send welcome email via Loops API (non-blocking)
 * 
 * This function sends a welcome email to new users immediately after signup.
 * It's designed to be fire-and-forget - errors are logged but don't break the signup flow.
 * 
 * Configuration:
 * - API key from environment variable EXPO_PUBLIC_LOOPS_API_KEY
 * - Welcome email template ID: cmhw2qu2j07i94l0is7v0033v
 * - Endpoint: https://app.loops.so/api/v1/transactional
 * 
 * Note: Uses Constants.expoConfig?.extra to access env vars in production builds
 * 
 * @param email - User's email address to send welcome email to
 * @param userId - User's ID (from users table) to update welcome_email_sent flag
 */
export async function sendWelcomeEmail(email: string, userId: string): Promise<void> {
  // Log in production too for debugging
  console.log('📧 [Loops] sendWelcomeEmail called for:', email);
  
  // Try multiple ways to get the API key (for compatibility)
  const apiKeyFromEnv = process.env.EXPO_PUBLIC_LOOPS_API_KEY;
  const apiKeyFromConstants = Constants.expoConfig?.extra?.EXPO_PUBLIC_LOOPS_API_KEY;
  const apiKey = apiKeyFromEnv || apiKeyFromConstants;
  
  // Debug logging to diagnose API key access
  console.log('🔍 [Loops] API key check:', {
    hasEnvVar: !!apiKeyFromEnv,
    hasConstants: !!apiKeyFromConstants,
    hasApiKey: !!apiKey,
    constantsExtra: Constants.expoConfig?.extra ? Object.keys(Constants.expoConfig.extra) : 'no extra',
  });

  // If API key is not configured, log warning and skip sending
  if (!apiKey) {
    console.warn('⚠️ [Loops] API key not configured. Welcome email disabled.');
    console.warn('⚠️ [Loops] Check: .env file exists? EXPO_PUBLIC_LOOPS_API_KEY set?');
    return;
  }

  console.log('✅ [Loops] API key found, length:', apiKey.length);

  // Validate email
  if (!email || !email.includes('@')) {
    console.warn('⚠️ [Loops] Invalid email address provided to sendWelcomeEmail:', email);
    return;
  }

  try {
    console.log('📤 [Loops] Sending welcome email to:', email);
    const response = await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionalId: 'cmhw2qu2j07i94l0is7v0033v',
        email: email,
      }),
    });

    const responseText = await response.text();
    console.log('📥 [Loops] Response status:', response.status);
    console.log('📥 [Loops] Response body:', responseText);

    if (!response.ok) {
      throw new Error(`Loops API error: ${response.status} - ${responseText}`);
    }

    console.log('✅ [Loops] Welcome email sent successfully to:', email);
    
    // Update welcome_email_sent flag in database (non-blocking)
    if (userId) {
      try {
        const { error: updateError } = await supabase
          .from('users')
          .update({ welcome_email_sent: true })
          .eq('id', userId);
        
        if (updateError) {
          console.error('❌ [Loops] Failed to update welcome_email_sent flag:', updateError);
          // Don't throw - email was sent successfully, flag update is secondary
        } else {
          console.log('✅ [Loops] welcome_email_sent flag updated for user:', userId);
        }
      } catch (flagError) {
        console.error('❌ [Loops] Error updating welcome_email_sent flag:', flagError);
        // Don't throw - email was sent successfully
      }
    }
  } catch (error) {
    // Log error but don't break signup flow (welcome emails are nice-to-have)
    console.error('❌ [Loops] Failed to send welcome email:', error);
    if (error instanceof Error) {
      console.error('❌ [Loops] Error message:', error.message);
      console.error('❌ [Loops] Error stack:', error.stack);
    }
    // Don't throw - this is non-blocking
  }
}

