# 4. Technical Assumptions

## 4.1 Technology Stack

**Frontend:**
- React Native (Expo) for native iOS/Android apps
- React (Next.js) for Progressive Web App (PWA)
- TypeScript for type safety
- TailwindCSS for styling
- React Native Gesture Handler for animations

**Backend:**
- Supabase for authentication, database, and serverless functions
- PostgreSQL database (Supabase-managed)
- Supabase Edge Functions for payment validation and email triggers

**Email Delivery:**
- SendGrid for transactional email sending
- Custom SMTP relay via Supabase Edge Functions

**Payment Processing:**
- Apple In-App Purchase (iOS)
- Google Play Billing (Android)
- Stripe (Web/PWA)
- Server-side receipt validation for all platforms

**Hosting:**
- Vercel for PWA hosting
- Apple App Store for iOS distribution
- Google Play Store for Android distribution

## 4.2 Third-Party Services

| Service | Purpose | Free Tier Limit | Cost After |
|---------|---------|----------------|------------|
| Supabase | Auth, DB, Edge Functions | 500 MB DB, 2 GB bandwidth | $25/mo |
| SendGrid | Email delivery | 100 emails/day | $19.95/mo for 40k |
| Vercel | PWA hosting | 100 GB bandwidth | $20/mo Pro |
| Apple Developer | App Store | N/A | $99/year |
| Google Play | Play Store | N/A | $25 one-time |
| Stripe | Web payments | No monthly fee | 2.9% + 30¢ per transaction |

**App Store Fees:**
- Apple IAP: 30% commission on all transactions
- Google Play: 30% commission on all transactions
- Stripe: 2.9% + $0.30 per transaction

**Pricing Impact:**
- $2.99 sale → $2.09 net (Apple/Google) or $2.60 net (Stripe)
- $4.99 sale → $3.49 net (Apple/Google) or $4.54 net (Stripe)

## 4.3 Development Environment

**IDE:** Cursor AI with Claude 3.5 Sonnet (agentic coding assistant)

**Version Control:** Git + GitHub

**Local Development:**
- Node.js 20+
- Expo CLI for React Native
- Supabase local development (Docker)

**Testing:**
- Jest for unit tests
- React Native Testing Library
- Expo Go for device testing
- TestFlight (iOS) and Internal Testing (Android) for beta

## 4.4 Platform Support

**Mobile:**
- iOS 14.0+ (React Native requirement)
- Android 8.0+ (API level 26+)

**Web:**
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

**PWA Features:**
- Installable to home screen
- Offline functionality (service worker)
- Push notifications (future consideration)

## 4.5 Assumptions

1. **Development velocity:** With Cursor AI, 1 developer can complete 15-20 hours of work per week
2. **App Store approval:** iOS and Android approvals will take 2-3 days (not blocking launch)
3. **Email deliverability:** SendGrid will achieve 95%+ inbox placement with proper domain configuration
4. **Payment integration:** Supabase Edge Functions can handle receipt validation for all 3 platforms
5. **User cohort assignment:** Cohort assignment happens on signup and never changes
6. **Trial tracking:** Trial expiration is based on `created_at` timestamp, not first task creation
7. **Grandfather enforcement:** `free_launch` cohort check happens on every paywall trigger
8. **Analytics:** Basic analytics via Supabase (queries on users table) sufficient for MVP

---
