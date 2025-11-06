// Expo App Configuration
// Uses environment variables for secrets - never commit .env file
// Copy .env.example to .env and fill in your values

export default {
  expo: {
    name: "TodoTomorrow",
    slug: "todotomorrow",
    scheme: "todotomorrow",
    version: "1.0.0",
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
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      launchDate: "2025-09-15T00:00:00Z",
      eas: {
        projectId: "d9259efb-a198-4da8-9580-23e51504ac3b"
      }
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.todotomorrow.app",
      associatedDomains: [
        "applinks:todotomorrow.com"
      ]
    },
    android: {
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

