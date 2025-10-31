# System Architecture Overview

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER DEVICES                               │
│  ┌──────────────┬──────────────┬──────────────┐                    │
│  │   iOS App    │  Android App │     PWA      │ (React Native/Expo)│
│  │  (Expo EAS)  │  (Expo EAS)  │  (Vercel)    │                    │
│  └──────────────┴──────────────┴──────────────┘                    │
│         │                  │                        │               │
│         └──────────────────┼────────────────────────┘               │
│                            │ HTTPS                                   │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Supabase      │
                    │   (PostgreSQL)  │
                    │   + Auth        │
                    │   + Real-time   │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐      ┌──────▼──────┐    ┌──────▼──────┐
    │ Tasks   │      │ Users/Trials│    │ Payments    │
    │ Table   │      │ Table       │    │ Table       │
    └─────────┘      └─────────────┘    └─────────────┘
         │
    ┌────▼────────────────────────────────────┐
    │   Supabase Edge Functions (Serverless)  │
    │  ┌─────────────────────────────────────┐│
    │  │ Email Cron Job (pg_cron)            ││
    │  │ - Runs hourly                       ││
    │  │ - Fetches users requiring emails    ││
    │  │ - Generates content                 ││
    │  │ - Calls SendGrid API                ││
    │  └─────────────────────────────────────┘│
    │  ┌─────────────────────────────────────┐│
    │  │ Payment Webhook Handler             ││
    │  │ - Stripe webhook listener           ││
    │  │ - Receipt validation                ││
    │  └─────────────────────────────────────┘│
    └────┬────────────────────────────────────┘
         │
    ┌────▼────────────┐      ┌─────────────────┐
    │   SendGrid API  │      │ Stripe / IAP    │
    │  (Email)        │      │ (Payments)      │
    └─────────────────┘      └─────────────────┘
```

## System Components

**Frontend Layer (React Native + Expo):**
- **Mobile Apps:** iOS, Android, PWA (single codebase)
- **State Management:** Zustand (global app state)
- **Local Storage:** AsyncStorage (offline persistence)
- **UI Framework:** NativeWind (Tailwind CSS)

**Backend Layer (Supabase):**
- **Database:** PostgreSQL with RLS policies
- **Authentication:** Magic link (passwordless)
- **Real-time:** WebSocket for task sync
- **Serverless:** Edge Functions for cron jobs

**External Services:**
- **Email:** SendGrid API (100/day free tier)
- **Payments:** Stripe (PWA), Apple IAP (iOS), Google Play Billing (Android)
- **Analytics:** Plausible (privacy-first)

---
