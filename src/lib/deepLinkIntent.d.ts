/**
 * TypeScript definitions for DeepLinkIntent native module
 */

export interface DeepLinkIntentModule {
  getInitialURL(): Promise<string | null>;
  clearInitialURL(): void;
}

declare module 'react-native' {
  interface NativeModulesStatic {
    DeepLinkIntent: DeepLinkIntentModule;
  }
}

