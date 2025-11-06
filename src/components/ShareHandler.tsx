/**
 * Share Handler Component
 * Handles share intents from iOS Share Sheet and Android Share Menu
 * Captures shared content (URLs or text) and passes it to the app
 */

import { useEffect } from 'react';
import ShareMenu from 'react-native-share-menu';

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
    // Check for shared content on mount (when app opens from share)
    const checkInitialShare = async () => {
      try {
        const sharedData = await ShareMenu.getSharedText();
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
      } catch (error) {
        if (__DEV__) {
          console.warn('⚠️ [ShareHandler] Error checking initial share:', error);
        }
      }
    };

    checkInitialShare();

    // Listen for share intents while app is running (when app is in foreground/background)
    const listener = ShareMenu.addNewShareListener((sharedData) => {
      if (__DEV__) {
        console.log('📤 [ShareHandler] New share received:', sharedData);
      }
      
      // Normalize shared data format
      const normalizedData = normalizeSharedData(sharedData);
      if (normalizedData) {
        onShareReceived(normalizedData);
      }
    });

    return () => {
      listener.remove();
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

