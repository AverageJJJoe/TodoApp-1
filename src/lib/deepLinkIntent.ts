/**
 * Native module for capturing deep link intents on Android
 * This solves the issue where Android consumes the intent before React Native initializes
 */

import { NativeModules, Platform } from 'react-native';

const { DeepLinkIntent } = NativeModules;

export async function getStoredDeepLink(): Promise<string | null> {
  if (Platform.OS !== 'android') {
    // On iOS, use standard Linking API
    return null;
  }

  if (!DeepLinkIntent) {
    if (__DEV__) {
      console.warn('⚠️ DeepLinkIntent native module not available');
    }
    return null;
  }

  try {
    const url = await DeepLinkIntent.getInitialURL();
    if (__DEV__ && url) {
      console.log('✅ [DeepLinkIntent] Found stored deep link:', url);
    }
    return url;
  } catch (error) {
    if (__DEV__) {
      console.error('❌ [DeepLinkIntent] Error getting stored deep link:', error);
    }
    return null;
  }
}

export function clearStoredDeepLink(): void {
  if (Platform.OS !== 'android' || !DeepLinkIntent) {
    return;
  }

  try {
    DeepLinkIntent.clearInitialURL();
    if (__DEV__) {
      console.log('🗑️ [DeepLinkIntent] Cleared stored deep link');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('❌ [DeepLinkIntent] Error clearing stored deep link:', error);
    }
  }
}

