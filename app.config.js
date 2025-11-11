// Expo App Configuration
// Uses environment variables for secrets - never commit .env file
// Copy .env.example to .env and fill in your values

export default {
  expo: {
    name: "TodoTomorrow",
    slug: "todotomorrow",
    scheme: "todotomorrow",
    version: "1.0.7",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      dark: {
        backgroundColor: "#121212"
      }
    },
    assetBundlePatterns: [
      "assets/**/*",
      "src/**/*.png",
      "src/**/*.jpg",
      "src/**/*.jpeg",
      "src/**/*.gif",
      "src/**/*.svg",
      "src/**/*.webp",
      "src/**/*.ttf",
      "src/**/*.otf",
      "src/**/*.woff",
      "src/**/*.woff2"
    ],
    updates: {
      url: "https://u.expo.dev/d9259efb-a198-4da8-9580-23e51504ac3b"
    },
    runtimeVersion: "1.0.7",
    extra: {
      // Supabase configuration - MUST be set via environment variables or EAS secrets
      // For local development: Set in .env file (gitignored)
      // For EAS Build: Set via EAS secrets (eas secret:create)
      // DO NOT hardcode values here - they will be committed to git!
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      launchDate: "2025-09-15T00:00:00Z",
      eas: {
        projectId: "d9259efb-a198-4da8-9580-23e51504ac3b"
      }
    },
    ios: {
      runtimeVersion: "1.0.7",
      supportsTablet: true,
      bundleIdentifier: "com.todotomorrow.app",
      associatedDomains: [
        "applinks:todotomorrow.com"
      ]
    },
    android: {
      versionCode: 9,
      runtimeVersion: "1.0.7",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
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
              pathPrefix: "/auth/callback"
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
      "expo-localization",
      [
        "@sentry/react-native/expo",
        {
          url: "https://sentry.io/",
          project: "react-native",
          organization: "todotomorrow"
        }
      ]
    ]
  }
};

