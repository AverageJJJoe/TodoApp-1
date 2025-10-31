# Technology Stack Rationale

| Layer | Technology | Why | Alternative Rejected |
|-------|-----------|-----|---------------------|
| **Mobile Framework** | React Native + Expo | Write once, deploy everywhere (iOS/Android/PWA); managed workflow; OTA updates; no native modules needed | Native Swift/Kotlin (higher dev cost); Flutter (team expertise) |
| **State Management** | Zustand | Lightweight, simple API, performant, perfect for offline-first | Redux (overkill for MVP); Jotai (less mature) |
| **Local Storage** | AsyncStorage | Works cross-platform, simple key-value, sufficient for MVP | SQLite (overkill); WatermelonDB (learning curve) |
| **UI Styling** | NativeWind | Tailwind CSS on React Native, consistent with web dev patterns | StyleSheet API (verbose); Styled Components (less mobile-friendly) |
| **Backend/DB** | Supabase | PostgreSQL, built-in auth, real-time subscriptions, Edge Functions, free tier | Firebase (less control); AWS (higher complexity) |
| **Email Service** | SendGrid | 100 emails/day free, reliable, excellent deliverability | AWS SES (more complex); Mailgun (higher cost) |
| **Payments** | Stripe + IAP | Stripe for PWA simplicity, IAP for native app standards | Gumroad (limited); Paddle (less flexible) |

---
