// Expo App Configuration
// Uses environment variables for secrets - never commit .env file
// Copy .env.example to .env and fill in your values

export default {
  expo: {
    name: "TodoTomorrow",
    slug: "todotomorrow",
    scheme: "todotomorrow",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    updates: {
      url: "https://u.expo.dev/d9259efb-a198-4da8-9580-23e51504ac3b"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://zrnjxrtgrommlhexbpde.supabase.co",
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybmp4cnRncm9tbWxoZXhicGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc2OTQsImV4cCI6MjA3NzQ2MzY5NH0.8Ci--doOpAqx9FRGLH_cIF4E4xPHIKszlwp0DorSvOo",
      launchDate: "2025-09-15T00:00:00Z",
      eas: {
        projectId: "d9259efb-a198-4da8-9580-23e51504ac3b"
      }
    },
    ios: {
      runtimeVersion: {
        policy: "appVersion"
      },
      supportsTablet: true,
      bundleIdentifier: "com.todotomorrow.app",
      associatedDomains: [
        "applinks:todotomorrow.com"
      ]
    },
    android: {
      versionCode: 2,
      runtimeVersion: "1.0.0",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.todotomorrow.app",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: "todotomorrow.com",
              pathPrefix: "/auth/callback"
            },
            {
              scheme: "todotomorrow",
              host: "auth",
              pathPrefix: "/callback"
            }
          ],
          category: [
            "BROWSABLE",
            "DEFAULT"
          ]
        },
        {
          action: "SEND",
          category: ["DEFAULT"],
          data: [
            {
              mimeType: "text/plain"
            },
            {
              mimeType: "text/html"
            }
          ]
        },
        {
          action: "SEND",
          category: ["DEFAULT"],
          data: [
            {
              scheme: "http"
            },
            {
              scheme: "https"
            }
          ]
        }
      ]
    },
    plugins: [
      "expo-localization"
    ]
  }
};

