const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname);

// Ensure platform-specific extensions are resolved correctly
// Metro should handle this automatically, but we ensure the order is correct
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;