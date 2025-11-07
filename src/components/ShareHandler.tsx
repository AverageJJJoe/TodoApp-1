/**
 * Share Handler Component
 * Handles share intents from iOS Share Sheet and Android Share Menu
 * Captures shared content (URLs or text) and passes it to the app
 */

import { useEffect } from 'react';
import { Platform, NativeModules } from 'react-native';

// Safely import ShareMenu - handle case where native module isn't available
let ShareMenu: any = null;
let isShareMenuAvailable = false;

try {
  const ShareMenuModule = require('react-native-share-menu');
  ShareMenu = ShareMenuModule.default;
  
  // Verify native module is actually available AND has required methods
  if (NativeModules.ShareMenu && 
      ShareMenu && 
      typeof ShareMenu.getInitialShare === 'function' &&
      typeof ShareMenu.addNewShareListener === 'function') {
    isShareMenuAvailable = true;
  } else {
    ShareMenu = null;
    isShareMenuAvailable = false;
  }
} catch (error) {
  // Module not available - this is OK, we'll handle gracefully
  ShareMenu = null;
  isShareMenuAvailable = false;
  if (__DEV__) {
    console.warn('⚠️ [ShareHandler] react-native-share-menu native module not available:', error);
  }
}

export interface SharedData {
  mimeType: string; // 'text/plain', 'text/html', 'text/url'
  data: string; // URL or text content
  extraData?: any; // Additional metadata
}

interface ShareHandlerProps {
  onShareReceived: (sharedData: SharedData) => void;
}

export const ShareHandler = ({ onShareReceived }: ShareHandlerProps) => {
  useEffect(() => {
    // If ShareMenu is not available, skip setup (graceful degradation)
    if (!isShareMenuAvailable || !ShareMenu) {
      if (__DEV__) {
        console.log('ℹ️ [ShareHandler] ShareMenu not available, skipping share handler setup');
      }
      return;
    }

    // Double-check methods exist before using them
    if (!ShareMenu.getInitialShare || !ShareMenu.addNewShareListener) {
      if (__DEV__) {
        console.warn('⚠️ [ShareHandler] ShareMenu methods not available, skipping setup');
      }
      return;
    }

    // Check for shared content on mount (when app opens from share)
    const checkInitialShare = () => {
      try {
        // Verify callback is valid before calling
        if (typeof ShareMenu.getInitialShare !== 'function') {
          return;
        }
        
        // Use callback-based API (library uses callbacks, not promises)
        ShareMenu.getInitialShare((error: any, sharedData: any) => {
          try {
            if (error) {
              // Silently handle errors - don't crash the app
              if (__DEV__) {
                console.warn('⚠️ [ShareHandler] Error checking initial share:', error);
              }
              return;
            }

            if (sharedData) {
              if (__DEV__) {
                console.log('📤 [ShareHandler] Found initial shared content:', sharedData);
              }
              
              // Normalize shared data format
              const normalizedData = normalizeSharedData(sharedData);
              if (normalizedData) {
                onShareReceived(normalizedData);
              }
            }
          } catch (callbackError) {
            // Prevent crashes from callback errors
            if (__DEV__) {
              console.warn('⚠️ [ShareHandler] Error in share callback:', callbackError);
            }
          }
        });
      } catch (error) {
        // Silently handle errors - don't crash the app
        if (__DEV__) {
          console.warn('⚠️ [ShareHandler] Error checking initial share:', error);
        }
      }
    };

    checkInitialShare();

    // Listen for share intents while app is running (when app is in foreground/background)
    let listener: any = null;
    try {
      if (typeof ShareMenu.addNewShareListener === 'function') {
        listener = ShareMenu.addNewShareListener((sharedData: any) => {
          try {
            if (__DEV__) {
              console.log('📤 [ShareHandler] New share received:', sharedData);
            }
            
            // Normalize shared data format
            const normalizedData = normalizeSharedData(sharedData);
            if (normalizedData) {
              onShareReceived(normalizedData);
            }
          } catch (callbackError) {
            // Prevent crashes from listener callback errors
            if (__DEV__) {
              console.warn('⚠️ [ShareHandler] Error in share listener callback:', callbackError);
            }
          }
        });
      }
    } catch (error) {
      // Silently handle listener setup errors
      if (__DEV__) {
        console.warn('⚠️ [ShareHandler] Error setting up share listener:', error);
      }
    }

    return () => {
      // Safely remove listener if it exists
      try {
        if (listener && typeof listener.remove === 'function') {
          listener.remove();
        }
      } catch (error) {
        // Ignore cleanup errors
        if (__DEV__) {
          console.warn('⚠️ [ShareHandler] Error removing listener:', error);
        }
      }
    };
  }, [onShareReceived]);

  return null; // This component doesn't render anything
};

/**
 * Normalize shared data from react-native-share-menu to our SharedData format
 * Handles different data formats from iOS and Android
 */
function normalizeSharedData(sharedData: any): SharedData | null {
  if (!sharedData) {
    return null;
  }

  // Handle different formats from react-native-share-menu
  // iOS format: { mimeType: string, data: string }
  // Android format: { mimeType: string, data: string } or { text: string }
  
  let mimeType = sharedData.mimeType || 'text/plain';
  let data = sharedData.data || sharedData.text || '';

  // If data is empty, skip
  if (!data || typeof data !== 'string') {
    if (__DEV__) {
      console.warn('⚠️ [ShareHandler] Invalid shared data format:', sharedData);
    }
    return null;
  }

  // Clean up HTML content - strip HTML tags if mimeType is text/html
  if (mimeType === 'text/html') {
    // Simple HTML tag stripping (basic implementation)
    data = data.replace(/<[^>]*>/g, '').trim();
    mimeType = 'text/plain'; // Convert to plain text after stripping
  }

  // Detect if data is a URL
  if (mimeType === 'text/plain' && isUrl(data)) {
    mimeType = 'text/url';
  }

  return {
    mimeType,
    data: data.trim(),
    extraData: sharedData.extraData,
  };
}

/**
 * Simple URL detection
 */
function isUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    // Try with http:// prefix if no protocol
    try {
      const url = new URL(`http://${str}`);
      return url.hostname.length > 0;
    } catch {
      return false;
    }
  }
}

