# Product Requirements Document: TodoMorning

**Project Name:** TodoMorning - Evening Brain Dump App  
**PRD Date:** October 14, 2025  
**Version:** 1.2 - Restructured Stories 
**Author:** John (Product Manager)  
**Status:** Approved - Ready for Architecture Phase

---

## Table of Contents

1. [Goals and Background Context](#1-goals-and-background-context)
2. [Requirements](#2-requirements)
3. [User Interface Design Goals](#3-user-interface-design-goals)
4. [Technical Assumptions](#4-technical-assumptions)
5. [Explicitly Out of Scope for MVP](#5-explicitly-out-of-scope-for-mvp)
6. [Epic List](#6-epic-list)
7. [Epic Details](#7-epic-details)
8. [Checklist Results Report](#8-checklist-results-report)
9. [Next Steps](#9-next-steps)

---

## 1. Goals and Background Context

### 1.1 Goals

1. **Launch MVP in 4 weeks** - Ship functional PWA + native apps (if approved) by Week 4
2. **Validate product-market fit** - Achieve 300-500 downloads in Month 1 with 20% Day-30 retention
3. **Generate early revenue** - Reach $500 cumulative net revenue by Month 3 via tiered freemium strategy
4. **Build organic audience** - Grow X (Twitter) following through build-in-public strategy (50-100 engaged followers)
5. **Establish competitive positioning** - Position as "the anti-Todoist" for simplicity-seeking email users
6. **Prove monetization model** - Validate tiered pricing ($2.99 vs $4.99) converts at 10-12%+ rate
7. **Maximize adoption through free launch** - Remove price friction at launch, then introduce freemium in Phase 2

### 1.2 Background Context

TodoMorning solves a problem experienced by email-native knowledge workers: capturing sporadic evening brain dumps without cluttering their inbox or requiring manual intervention.

**The Problem:** During busy reactive daytimes, there's no time for planning. But during evenings (bed, car, waiting for kids), strategic ideas for tomorrow surface sporadically. Existing solutions fail:
- **Email drafts** - Users forget to send them, tasks never arrive in morning inbox
- **Todoist** - Too complex with overwhelming features, clutters inbox with individual reminder emails
- **TodoMailer** - Sends one email per task immediately, creating inbox spam

**The Solution:** TodoMorning is a mobile-first capture tool that automatically batches evening brain dumps into one clean morning email at the user's chosen time (default 6:00 AM), delivering a consolidated daily action plan directly to their inbox.

**Why This Matters:** Email remains the universal productivity hub for knowledge workers. The app doesn't try to replace email—it bridges mobile capture to email delivery. Competitive analysis reveals no existing solution offers automatic batched email delivery, creating a genuine blue ocean opportunity.

**Strategic Context:** This indie maker project targets a niche within the $50B+ productivity software market. Success is defined as sustainable solo-dev income ($500-2000/month), validated through X build-in-public strategy and Product Hunt launch.

### 1.3 Monetization Strategy Overview

TodoMorning uses a **tiered freemium launch strategy** to maximize adoption first, then capture revenue through data-driven pricing:

**Phase 1 (Weeks 4-6):** Launch completely FREE
- Remove all payment friction
- Build habit formation in first users
- Create testimonial cohort (grandfather'd forever)
- Target: 200-300 downloads

**Phase 2 (Weeks 7-8, Month 2):** Introduce freemium with A/B pricing test
- New users: 30-day trial, then $2.99 OR $4.99 (50/50 split)
- Early adopters: Stay free forever (grandfather status)
- Test which price point drives higher conversion
- Target: 10-12% conversion rate

**Phase 3 (Month 3+):** Scale with winning price
- Implement winner from Phase 2 test
- Sustain 12%+ conversion rate
- Optional: Test $5.99 if conversion stays strong
- Target: $500+ net revenue by Month 3

**Cohort Strategy:**
- `free_launch`: Early adopters, never charged (Weeks 4-6)
- `early_freemium_2.99`: Phase 2 test group at $2.99
- `early_freemium_4.99`: Phase 2 test group at $4.99
- `paid_cohort_v1`: Phase 3+ users at winning price

### 1.4 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| October 14, 2025 | 1.0 | Initial PRD creation from Project Brief | John (PM) |
| October 14, 2025 | 1.0.1 | Renamed from Night Owl Todo to TodoMorning | John (PM) |
| October 30, 2025 | 1.1 | Updated monetization strategy: tiered freemium launch, cohort tracking, grandfather status, A/B pricing tests | John (PM) |
| October 31, 2025 | 1.2 | Restructured all stories to be 2-4 hours each, testable independently, and building sequentially | John (PM) |

---

## 2. Requirements

### 2.1 Functional Requirements

**FR1:** The app shall provide a simple text input field for capturing todo items with minimal friction

**FR2:** The app shall allow users to optionally add a due date to any todo item via a date picker

**FR3:** The app shall allow users to optionally set priority levels (High/Medium/Low) for todo items

**FR4:** The app shall display all captured tasks in a chronological list view showing most recent first

**FR5:** The app shall save tasks to local storage immediately upon creation (offline-first architecture)

**FR6:** The app shall automatically sync locally stored tasks to Supabase backend when internet connection is available

**FR7:** The app shall require users to provide their email address during onboarding for delivery

**FR8:** The app shall allow users to set their preferred daily email delivery time during onboarding (default 6:00 AM)

**FR9:** The app shall allow users to choose between two workflow modes during onboarding:
- **Fresh Start Mode**: App resets to blank slate after email is sent
- **Carry Over Mode**: Tasks persist in app until marked complete

**FR10:** In Fresh Start Mode, the app shall clear all tasks from view after the morning email is sent

**FR11:** In Carry Over Mode, the app shall display a checkbox next to each task for completion

**FR12:** In Carry Over Mode, when a user marks a task complete, the app shall play a satisfying animation (strike-through → fade → slide-out) with haptic feedback

**FR13:** In Carry Over Mode, completed tasks shall be immediately moved to an "Archive" view accessible via a separate tab

**FR14:** Archived tasks shall be stored permanently with no automatic deletion

**FR15:** The app shall send one consolidated email containing all open/incomplete tasks at the user's configured time

**FR16:** The email content shall differ by mode:
- **Fresh Start Mode**: Simple bulleted list of all tasks added since last email
- **Carry Over Mode**: Simple bulleted list with subtle "(from yesterday)" indicator for carried-over tasks

**FR17:** The email shall use minimal formatting (clean bulleted list, no buttons, no complex sections, print-friendly)

**FR18:** The email shall include only task text and optional due date - no action buttons or links

**FR19:** The app shall assign users to cohorts based on signup date:
- `free_launch` cohort (Weeks 4-6): Free forever, never charged
- `early_freemium_2.99` cohort (Weeks 7-8): 30-day trial, then $2.99
- `early_freemium_4.99` cohort (Weeks 7-8): 30-day trial, then $4.99
- `paid_cohort_v1` cohort (Month 3+): 30-day trial, then winning price

**FR20:** The app shall track trial expiration based on 30 days from signup OR 100 task limit (whichever comes first)

**FR21:** The app shall respect grandfather status for `free_launch` cohort users and never show them paywalls

**FR22:** The app shall notify trial users when trial is expiring:
- Day 27: "Trial ending in 3 days" (prominent modal)
- Day 29: "Trial ending tomorrow" (banner)
- Day 30: Hard paywall (blocking)

**FR23:** The app shall show paywall messaging tailored to user's cohort and price point:
- $2.99 cohort: Simpler messaging, emphasize "forever" value
- $4.99 cohort: Show usage stats (task count, email count), emphasize ROI
- Free launch cohort: Optional support prompt (non-blocking)

**FR24:** The app shall support three payment unlock triggers:
- Trial expiration (30 days)
- Task limit reached (100 open tasks)
- Manual upgrade (Settings → "Unlock Premium")

**FR25:** Post-trial, non-paying users shall be limited to 50 tasks per month (soft cap, not hard block)

**FR26:** The app shall support one-time in-app purchases via:
- iOS: Apple IAP (non-consumable products)
- Android: Google Play Billing (one-time products)
- Web: Stripe (one-time charge)

**FR27:** The app shall validate all payment receipts server-side via Supabase Edge Functions

**FR28:** The app shall work as a Progressive Web App (PWA) installable on mobile home screens

**FR29:** The app shall allow users to switch between Fresh Start and Carry Over modes in Settings at any time

**FR30:** The Archive view shall display all completed tasks in reverse chronological order (most recent first)

**FR31:** The Archive view shall allow users to view completion date for each archived task

**FR32:** The app shall track paywall interactions for analytics:
- Paywall shown count
- Last paywall shown date
- Paywall dismissal events
- Conversion method (trial expiry, task limit, manual)

### 2.2 Non-Functional Requirements

**NFR1:** The app shall work offline with full functionality for task capture and viewing

**NFR2:** Task sync to backend shall occur within 5 seconds of internet connection restoration

**NFR3:** Email delivery shall achieve 95%+ inbox placement rate (not spam folder)

**NFR4:** The app UI shall be responsive and work on iOS, Android, and web browsers

**NFR5:** Task creation shall feel instantaneous with local-first architecture (<100ms perceived latency)

**NFR6:** The system shall scale to support 500+ users within Supabase free tier limits

**NFR7:** Email sending shall stay within SendGrid free tier (100 emails/day) for MVP phase

**NFR8:** All user data shall be stored securely with proper authentication via Supabase Auth

**NFR9:** The app shall comply with GDPR requirements for email data collection and storage

**NFR10:** The system shall support user-configurable email delivery times across all timezones

**NFR11:** The codebase shall be written in TypeScript for type safety and maintainability

**NFR12:** The app shall follow React Native best practices for performance and user experience

**NFR13:** The completion animation shall feel responsive and complete within 600ms total duration

**NFR14:** Archived task storage shall have no size limits within Supabase free tier constraints (effectively unlimited for text data)

**NFR15:** Payment validation shall complete within 2 seconds to prevent user friction

**NFR16:** Cohort assignment shall be deterministic and never change after user signup

**NFR17:** Grandfather status shall be permanent and unrevokable for `free_launch` cohort users

---

## 3. User Interface Design Goals

### 3.1 Overall UX Vision

TodoMorning embraces Apple's design philosophy: radical simplicity with obsessive attention to detail. The interface should feel native, polished, and invisible - users capture thoughts with zero friction, then forget about the app until the next evening.

**Design Philosophy:**
- **Apple Minimalism**: Clean white space, subtle shadows, native feel
- **Things 3 Polish**: Delightful micro-interactions, considered typography
- **Speed Over Features**: Task creation in 2 taps maximum
- **Invisible When Right**: Best UX is when users don't notice the app

**Inspiration (DO THIS):**
- ✅ Apple Reminders: Simplicity, system font usage, native patterns
- ✅ Things 3: Polish, animations, "Today" view philosophy
- ✅ Clear app: Gesture-based, minimal chrome

**Anti-Inspiration (DON'T DO THIS):**
- ❌ Todoist: Feature density, overwhelming options
- ❌ Any.do: Over-animated, too many colors
- ❌ Microsoft To Do: Generic, cluttered

### 3.2 Key Interaction Paradigms

**Primary Interaction Flow:**
1. User opens app → Already on main screen (no navigation)
2. Taps floating "+" button (Apple-style FAB, bottom-right)
3. Types task → Taps "Add" (or Enter key)
4. Task appears instantly with subtle slide-in animation
5. Repeat throughout evening
6. Close app → Forget until tomorrow

**Completion Flow (Carry Over Mode):**
1. User taps checkbox next to completed task
2. Haptic feedback (light impact)
3. Strike-through animation (200ms)
4. Fade out (200ms)
5. Slide out and collapse (200ms)
6. Task moves to Archive tab

**Paywall Interaction Flow:**
1. **Trial Active (Days 1-26):** Subtle banner in Settings: "X days remaining"
2. **Trial Ending (Days 27-29):** Prominent modal on app open (dismissible)
3. **Trial Expired (Day 30+):** Hard paywall (non-dismissible, must choose action)
4. **Free Launch Cohort:** Optional support prompt (always dismissible, shown once post-Day 30)

### 3.3 Visual Language

**Color Palette:**
- Primary Blue: `#007AFF` (iOS system blue)
- Success Green: `#34C759` (iOS system green)
- Warning Orange: `#FF9500` (iOS system orange)
- Text Primary: `#000000` (pure black on white background)
- Text Secondary: `#8E8E93` (iOS secondary label)
- Background: `#FFFFFF` (pure white)
- Card Background: `#F2F2F7` (iOS system gray 6)

**Typography:**
- Primary: SF Pro Display (iOS), Roboto (Android), system font (Web)
- Task Text: 17pt regular
- Date Labels: 13pt regular
- Section Headers: 20pt semibold
- Buttons: 17pt semibold

**Spacing System:**
- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px
- Screen margins: 16px (mobile), 24px (tablet)
- Task item padding: 16px vertical, 16px horizontal

### 3.4 Animation Principles

**Task Creation:**
- Slide in from bottom with spring animation (duration: 300ms)
- Cubic bezier easing: `(0.25, 0.1, 0.25, 1)`

**Task Completion:**
- Strike-through: 200ms linear
- Fade: 200ms ease-out
- Slide out: 200ms ease-in
- Total: 600ms

**Paywall Modal:**
- Fade in backdrop: 200ms ease-out
- Slide in from bottom: 300ms spring
- On dismiss: Reverse animations

**General Rules:**
- Never animate longer than 600ms
- Use spring animations for natural feel
- Haptic feedback on state changes
- No animations longer than 2 steps

### 3.5 Paywall Design Specifications

**Modal Structure:**
```
┌─────────────────────────────┐
│  🌅 [Headline]              │
│                             │
│  [Body text with stats]     │
│                             │
│  [Price callout]            │
│                             │
│  [Primary CTA Button]       │
│  [Secondary CTA Button]     │
│                             │
│  [Dismiss link if allowed]  │
└─────────────────────────────┘
```

**Paywall States:**

**State 1: Trial Active (Days 1-26)**
- Location: Settings tab, sticky banner at bottom
- Dismissible: Yes
- Text: "🌅 X days remaining in trial"
- CTA: Taps to open full paywall modal

**State 2: Trial Ending (Days 27-29)**
- Location: Full-screen modal on app open
- Dismissible: Yes (X button top-right)
- Headline: "🌅 Trial Ending Soon"
- Body: Cohort-specific messaging (see FR23)
- Primary CTA: "Unlock Premium" (blue button)
- Secondary CTA: "Maybe Later" (text link)

**State 3: Trial Expired (Day 30)**
- Location: Full-screen modal (blocking)
- Dismissible: No
- Headline: "🌅 Trial Complete"
- Body: "Continue with TodoMorning Premium for $X.XX—one time, forever."
- Stats: "You've captured [TASK_COUNT] tasks and received [EMAIL_COUNT] emails."
- Primary CTA: "Unlock Premium" (blue button)
- Secondary CTA: "Use Free Tier (50 tasks/month)" (text link)

**State 4: Free Launch Cohort (Optional, Post-Day 30)**
- Location: Modal (shown once, never repeats)
- Dismissible: Yes (always)
- Headline: "🌅 Love TodoMorning? ❤️"
- Body: "If you'd like to support ongoing development, you can opt-in to premium for $X.XX. Your free access is locked in forever—thanks for being early! 🎉"
- Primary CTA: "Support Development" (blue button)
- Secondary CTA: "Keep Free" (text link)
- Tertiary: "Not Now" (X button)

### 3.6 Screen Definitions

#### 3.6.1 Main Screen (Active Tasks)

**Layout:**
```
┌─────────────────────────────────┐
│  TodoMorning              [⚙️]  │  ← Header
├─────────────────────────────────┤
│                                 │
│  🌅 Add your first task         │  ← Empty state
│                                 │
│          [or]                   │
│                                 │
│  ☑️ Complete presentation       │  ← Task items (Carry Over)
│  ☐ Call Sarah about project    │
│  ☐ Draft Q4 strategy doc        │
│                                 │
│                                 │
│                                 │
│                          [+]    │  ← Floating Action Button
└─────────────────────────────────┘
│ Active | Archive               │  ← Tab bar (Carry Over only)
└─────────────────────────────────┘
```

**Key Elements:**
- Header: App name left-aligned, Settings icon right-aligned
- Empty state: Friendly prompt with emoji
- Task list: Full-width cards with checkboxes (Carry Over mode only)
- FAB: Bottom-right, always accessible
- Tab bar: Only shown in Carry Over mode

#### 3.6.2 Add Task Sheet

**Layout:**
```
┌─────────────────────────────────┐
│  Add Task                  [✕]  │  ← Sheet header
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │ What needs to be done?      ││  ← Text input
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  📅 Due Date (Optional)         │  ← Date picker trigger
│  🔥 Priority (Optional)         │  ← Priority picker
│                                 │
│                                 │
│           [Add Task]            │  ← Primary button
│                                 │
└─────────────────────────────────┘
```

**Behavior:**
- Slides up from bottom
- Keyboard auto-focuses on text input
- Can add task by pressing Enter
- Close by tapping X or swiping down

#### 3.6.3 Settings Screen

**Layout:**
```
┌─────────────────────────────────┐
│  ← Settings                     │
├─────────────────────────────────┤
│                                 │
│  Account                        │
│  📧 Email: john@example.com     │
│                                 │
│  Preferences                    │
│  🕐 Email Time: 6:00 AM         │
│  🔄 Mode: Fresh Start           │
│                                 │
│  Subscription                   │
│  ✨ Premium (Trial: 23 days)    │  ← Trial banner
│  [Unlock Premium]               │
│                                 │
│  Support                        │
│  Privacy Policy                 │
│  Terms of Service               │
│  Contact Support                │
│                                 │
│  [Sign Out]                     │
│                                 │
└─────────────────────────────────┘
```

**Trial Banner States:**
- Days 1-26: "Premium (Trial: X days remaining)"
- Days 27-29: "⚠️ Premium (Trial ends in X days)" (orange badge)
- Day 30+: "Premium Expired" or "Premium Active" or "Free Forever 🎉" (cohort-dependent)

#### 3.6.4 Archive Screen (Carry Over Mode Only)

**Layout:**
```
┌─────────────────────────────────┐
│  TodoMorning              [⚙️]  │
├─────────────────────────────────┤
│                                 │
│  ✅ Completed presentation      │
│     Oct 29, 2025 2:34 PM        │
│                                 │
│  ✅ Called Sarah                │
│     Oct 28, 2025 4:15 PM        │
│                                 │
│  ✅ Drafted strategy doc        │
│     Oct 28, 2025 11:23 AM       │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
│ Active | Archive               │
└─────────────────────────────────┘
```

**Key Elements:**
- Completed tasks with timestamps
- Read-only (no editing or deletion in MVP)
- Scrollable list, infinite scroll
- Empty state: "No completed tasks yet! 🎉"

---

## 4. Technical Assumptions

### 4.1 Technology Stack

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

### 4.2 Third-Party Services

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

### 4.3 Development Environment

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

### 4.4 Platform Support

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

### 4.5 Assumptions

1. **Development velocity:** With Cursor AI, 1 developer can complete 15-20 hours of work per week
2. **App Store approval:** iOS and Android approvals will take 2-3 days (not blocking launch)
3. **Email deliverability:** SendGrid will achieve 95%+ inbox placement with proper domain configuration
4. **Payment integration:** Supabase Edge Functions can handle receipt validation for all 3 platforms
5. **User cohort assignment:** Cohort assignment happens on signup and never changes
6. **Trial tracking:** Trial expiration is based on `created_at` timestamp, not first task creation
7. **Grandfather enforcement:** `free_launch` cohort check happens on every paywall trigger
8. **Analytics:** Basic analytics via Supabase (queries on users table) sufficient for MVP

---

## 5. Explicitly Out of Scope for MVP

The following features are intentionally excluded from the 4-week MVP to maintain focus and ensure launch velocity:

### 5.1 Features Deferred to Post-MVP

**Task Management:**
- ❌ Subtasks or nested tasks
- ❌ Task notes or descriptions beyond title
- ❌ Task tags or labels
- ❌ Task search functionality
- ❌ Bulk task operations (select all, delete all)
- ❌ Task templates or recurring tasks
- ❌ Task reordering (drag and drop)

**Collaboration:**
- ❌ Shared tasks with other users
- ❌ Team workspaces
- ❌ Comments or collaboration features
- ❌ Assigning tasks to others

**Advanced Email Features:**
- ❌ Multiple email addresses per user
- ❌ Custom email templates
- ❌ Email frequency options (every other day, weekly)
- ❌ Email time suggestions based on timezone
- ❌ HTML email customization
- ❌ Inline task completion from email

**Monetization Beyond MVP:**
- ❌ Subscription pricing (monthly/annual)
- ❌ Team pricing tiers
- ❌ Lifetime pricing tier ($99+)
- ❌ Optional tip jar feature
- ❌ Referral program or affiliate marketing

**Integrations:**
- ❌ Calendar integrations (Google Calendar, Apple Calendar)
- ❌ Third-party todo app sync (Todoist, Things)
- ❌ Zapier or IFTTT integration
- ❌ API for developers

**Advanced Features:**
- ❌ AI-powered task suggestions
- ❌ Smart scheduling recommendations
- ❌ Natural language processing for task input
- ❌ Voice input for tasks
- ❌ Dark mode (uses system preference)
- ❌ Multiple themes or customization

**Analytics & Insights:**
- ❌ User productivity dashboard
- ❌ Task completion statistics
- ❌ Habit tracking or streaks
- ❌ Weekly/monthly summary emails

**Notifications:**
- ❌ Push notifications for task reminders
- ❌ Mid-day reminder notifications
- ❌ Custom notification schedules

### 5.2 Intentional Limitations

**Email Delivery:**
- Only 1 email per day at user-configured time
- No support for manual "send now" trigger
- No preview of email before sending

**Task Limits:**
- No folder or project structure
- No filtering or sorting options beyond chronological
- No task limits per se (free tier: soft cap at 50/month post-trial)

**User Management:**
- Email/password auth only (no social login in MVP)
- No account recovery flow beyond magic link
- No profile customization (name, avatar)

**Payment Features:**
- No refund handling in-app (manual via email)
- No payment history view
- No invoices or receipts (platform-provided only)

---

## 6. Epic List - RESTRUCTURED

| Epic ID | Epic Name | Stories | Estimated Hours | Dependencies |
|---------|-----------|---------|-----------------|--------------|
| E1 | Foundation & Authentication | 6 stories | 14 hours | None |
| E2 | Core Task Management | 6 stories | 16 hours | E1 complete |
| E3 | Email Delivery System | 5 stories | 12 hours | E1, E2 complete |
| E4 | Monetization & Payments | 8 stories | 20 hours | E1, E2, E3 complete |
| E5 | Workflow Modes & Polish | 4 stories | 10 hours | All previous complete |

**Total:** 29 stories, ~72 hours development time

**Note:** Story 1.2.5 (Testing Framework Setup) was added to ensure test infrastructure is established early.

**Key Changes from v1.1:**
- Broke down 31 large stories into 28 smaller, focused stories
- Each story now 2-4 hours instead of 8-12 hours
- Clear dependencies and build order
- Every story is testable independently

---

## 7. Epic Details - RESTRUCTURED

### Epic 1: Foundation & Authentication (Week 1, Days 1-3)

**Epic Goal:** Get basic project running with authentication working. Users can sign up and log in.

---

#### Story 1.1: Project Setup & Configuration
**Estimated Time:** 2 hours  
**Dependencies:** None

**As a** developer  
**I want to** initialize the React Native + Expo project with essential dependencies  
**So that** I have a working development environment

**Acceptance Criteria:**
1. Expo project created with TypeScript
2. Package.json includes: `supabase-js`, `@supabase/auth-helpers-react-native`, `zustand`, `nativewind`
3. `app.json` configured with app name and bundle ID
4. `.env.example` file exists with placeholder Supabase keys
5. Project runs on iOS simulator: `npx expo start --ios`

**Deliverable:** Working Expo project that displays "Hello World"

**Test:** Run `npx expo start` - app opens and shows default screen

---

#### Story 1.2: Supabase Client Configuration
**Estimated Time:** 2 hours  
**Dependencies:** Story 1.1

**As a** developer  
**I want to** configure Supabase client with proper environment variables  
**So that** the app can connect to the database

**Acceptance Criteria:**
1. Supabase project created (free tier)
2. `.env` file created with actual `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. `src/lib/supabase.ts` file exports configured Supabase client
4. Test connection: Query `SELECT 1` succeeds
5. AsyncStorage configured as session storage

**Deliverable:** `supabase.ts` file with working client connection

**Test:** Add console.log in App.tsx that calls `supabase.from('test').select()` - should connect (even if table doesn't exist, should get "table not found" not "connection error")

---

#### Story 1.2.5: Testing Framework Setup
**Estimated Time:** 2 hours  
**Dependencies:** Story 1.2

**As a** developer  
**I want to** set up testing frameworks and test infrastructure  
**So that** I can write and run tests for all features

**Acceptance Criteria:**
1. Install testing dependencies: `jest`, `@testing-library/react-native`, `@testing-library/jest-native`, `jest-expo`
2. Create `jest.config.js` with Expo preset and test environment configuration
3. Create `__tests__` directory structure:
   - `__tests__/setup.ts` - Test setup file
   - `__tests__/utils/` - Test utilities directory
4. Add test scripts to `package.json`: `"test": "jest"`, `"test:watch": "jest --watch"`
5. Create example test file: `__tests__/example.test.ts` that passes
6. Run `npm test` → All tests pass

**Deliverable:** Working test infrastructure with example test

**Test:** Run `npm test` → Example test passes, no errors

**Note:** Tests will be written alongside features starting from Story 2.1. This story establishes the foundation.

---

#### Story 1.3: Database Schema - Users Table
**Estimated Time:** 2 hours  
**Dependencies:** Story 1.2

**As a** developer  
**I want to** create the users table in Supabase  
**So that** user profiles can be stored

**Acceptance Criteria:**
1. Users table created with SQL migration file using unified schema (see `docs/architecture.md` Section 3 or `docs/prd.md` Appendix B)
2. Table includes all required fields: `id`, `email`, `auth_id`, `created_at`, `delivery_time`, `timezone`, `workflow_mode`, `email_enabled`, plus all monetization fields (`cohort`, `grandfather_status`, `trial_started_at`, `trial_expires_at`, `trial_tasks_count`, `is_paid`, etc.)
3. RLS policies created: Users can only read/write their own row (using `auth_id` reference)
4. Test data inserted manually (1 test user with sample data)
5. Can query test user via Supabase client

**Note:** The unified schema combines technical requirements (auth_id, sync fields) with monetization fields (cohort, grandfather_status). See architecture document for complete schema.

**Deliverable:** `supabase/migrations/001_users_table.sql` file

**Test:** Query users table from app - should return test user data

---

#### Story 1.4: Magic Link Authentication Flow
**Estimated Time:** 3 hours  
**Dependencies:** Story 1.3

**As a** first-time user  
**I want to** sign up using my email address  
**So that** I can create an account without a password

**Acceptance Criteria:**
1. AuthScreen component with email input field
2. Email validation (basic format check)
3. "Send Magic Link" button calls `supabase.auth.signInWithOtp()`
4. Success message shows: "Check your email"
5. Magic link email received in inbox
6. Clicking link opens app (deep link configured)

**Deliverable:** `src/screens/AuthScreen.tsx` + working magic link

**Test:** Enter email → Receive email → Click link → App opens

---

#### Story 1.5: Session Management & Protected Routes
**Estimated Time:** 3 hours  
**Dependencies:** Story 1.4

**As a** returning user  
**I want to** stay logged in after closing the app  
**So that** I don't have to sign in every time

**Acceptance Criteria:**
1. Zustand store created: `authStore.ts` with `session` state
2. `useEffect` in App.tsx checks for existing session
3. If session exists → Navigate to MainScreen
4. If no session → Navigate to AuthScreen
5. Session persists after app restart (AsyncStorage)
6. "Sign Out" button in MainScreen clears session

**Deliverable:** Working session persistence + navigation

**Test:** Sign in → Close app → Reopen → Should stay signed in

---

### Epic 2: Core Task Management (Week 1, Days 4-5 + Week 2, Days 1-2)

**Epic Goal:** Users can create, view, edit, and delete tasks. All data saves to Supabase.

---

#### Story 2.1: Tasks Table & Basic UI
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1 complete

**As a** developer  
**I want to** create the tasks table and display empty state  
**So that** the app is ready for task creation

**Acceptance Criteria:**
1. Tasks table created with fields: `id`, `user_id`, `text` (database field - displayed as "title" in UI), `status`, `created_at`, `completed_at`, `archived_at`, `deleted_at`, `synced_at`, `emailed_at`
2. RLS policy: Users can only access their own tasks
3. MainScreen shows empty state: "🌅 Add your first task"
4. Floating Action Button (FAB) "+" in bottom-right corner
5. Tapping FAB shows alert: "Add task feature coming soon"

**Deliverable:** Tasks table + empty state UI

**Test:** Sign in → See empty state and FAB button

---

#### Story 2.2: Create Task - Local State Only
**Estimated Time:** 2 hours  
**Dependencies:** Story 2.1

**As a** user  
**I want to** add a task using a simple input  
**So that** I can capture quick thoughts

**Acceptance Criteria:**
1. Tapping FAB opens bottom sheet with text input
2. Input field is auto-focused
3. "Add Task" button is enabled when input has text
4. Tapping "Add Task" closes sheet and adds task to local state (Zustand)
5. Task appears in list on MainScreen (FlatList)
6. Task shows: title + timestamp ("Just now")

**Deliverable:** Task creation UI with local state

**Test:** Tap + → Type task → Tap Add → Task appears in list

---

#### Story 2.3: Save Task to Supabase
**Estimated Time:** 2 hours  
**Dependencies:** Story 2.2

**As a** user  
**I want to** have my tasks automatically saved to the cloud  
**So that** I don't lose data if I close the app

**Acceptance Criteria:**
1. After adding task to local state, immediately call `supabase.from('tasks').insert()`
2. Task saves with: `user_id` (from session), `text` (task content), `status: 'open'`, `created_at`
3. If save succeeds → Task stays in list
4. If save fails → Show error toast, remove from local state
5. Verify task exists in Supabase dashboard

**Deliverable:** Tasks persist to database

**Test:** Add task → Refresh Supabase dashboard → Task is there

---

#### Story 2.4: Load Tasks on App Open
**Estimated Time:** 2 hours  
**Dependencies:** Story 2.3

**As a** user  
**I want to** see all my tasks when I open the app  
**So that** I can review what I've captured

**Acceptance Criteria:**
1. On MainScreen mount, query: `SELECT * FROM tasks WHERE user_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`
2. Loading state shows spinner while fetching
3. Tasks populate FlatList after load completes
4. Pull-to-refresh gesture re-queries database
5. Error state if query fails

**Deliverable:** Tasks load from database

**Test:** Add tasks → Close app → Reopen → Tasks are still there

---

#### Story 2.5: Delete Task
**Estimated Time:** 2 hours  
**Dependencies:** Story 2.4

**As a** user  
**I want to** delete tasks I no longer need  
**So that** I can keep my list clean

**Acceptance Criteria:**
1. Swipe left on task reveals red "Delete" button
2. Tapping Delete shows confirmation alert
3. Confirming calls: `UPDATE tasks SET deleted_at = NOW() WHERE id = ?`
4. Task removed from local state immediately (optimistic update)
5. If delete fails → Show error, restore task to list

**Deliverable:** Swipe-to-delete functionality

**Test:** Swipe task left → Tap Delete → Confirm → Task disappears

---

#### Story 2.6: Edit Task
**Estimated Time:** 3 hours  
**Dependencies:** Story 2.5

**As a** user  
**I want to** edit task text after creation  
**So that** I can fix typos or update information

**Acceptance Criteria:**
1. Tapping a task opens bottom sheet with pre-filled text input
2. "Save" button updates task in local state
3. Call: `UPDATE tasks SET text = ?, updated_at = NOW() WHERE id = ?`
4. Optimistic update (change shows immediately)
5. If update fails → Show error, revert to original text

**Deliverable:** Edit task functionality

**Test:** Tap task → Edit text → Save → Text updates

---

### Epic 3: Email Delivery System (Week 2, Days 3-5)

**Epic Goal:** Automated daily emails with task list sent at user's chosen time.

---

#### Story 3.1: User Preferences - Delivery Time
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1 complete

**As a** user  
**I want to** set what time I receive my daily email  
**So that** tasks arrive when I need them

**Acceptance Criteria:**
1. Settings screen accessible via header icon (⚙️)
2. Time picker component for delivery_time (default: 06:00)
3. Timezone selector (default: system timezone)
4. "Save" button updates: `UPDATE users SET delivery_time = ?, timezone = ? WHERE id = ?`
5. Confirmation toast on successful save

**Deliverable:** Settings screen with time configuration

**Test:** Open Settings → Change time to 08:00 → Save → Verify in Supabase

---

#### Story 3.2: Email Template - HTML Design
**Estimated Time:** 2 hours  
**Dependencies:** Story 3.1

**As a** developer  
**I want to** create a clean HTML email template  
**So that** task emails look professional

**Acceptance Criteria:**
1. HTML template file: `supabase/functions/send-email/template.html`
2. Template includes: Header, task list ({{tasks}} placeholder), footer
3. Responsive design (works on mobile)
4. Test rendering in browser (save as .html file, open locally)
5. Task list renders as simple `<ul>` bullets

**Deliverable:** Email template HTML file

**Test:** Open template.html in browser → Looks clean and readable

---

#### Story 3.3: SendGrid Integration
**Estimated Time:** 3 hours  
**Dependencies:** Story 3.2

**As a** developer  
**I want to** integrate SendGrid for email sending  
**So that** emails can be delivered reliably

**Acceptance Criteria:**
1. SendGrid account created (free tier)
2. Sender email verified: `hello@todomorning.com` (or temp email for MVP)
3. Supabase Edge Function created: `send-email`
4. Function accepts: `{ to, subject, html }`
5. Function calls SendGrid API with template
6. Test: Manually invoke function → Receive test email

**Deliverable:** Working Edge Function that sends email

**Test:** Call function with test data → Email received in inbox

---

#### Story 3.4: Manual "Send Now" Button (Testing)
**Estimated Time:** 2 hours  
**Dependencies:** Story 3.3

**As a** user (for testing)  
**I want to** manually trigger email sending  
**So that** I can test email delivery without waiting

**Acceptance Criteria:**
1. Button in Settings: "Send Test Email"
2. Button queries: `SELECT * FROM tasks WHERE user_id = ? AND deleted_at IS NULL`
3. Button calls `send-email` Edge Function with tasks
4. Email received with current task list
5. Email matches template design

**Deliverable:** Manual send button for testing

**Test:** Add 3 tasks → Tap "Send Test Email" → Receive email with 3 tasks

---

#### Story 3.5: Automated Cron Job
**Estimated Time:** 3 hours  
**Dependencies:** Story 3.4

**As a** user  
**I want to** automatically receive my task list every morning  
**So that** I don't have to manually send it

**Acceptance Criteria:**
1. Supabase cron job created (runs every minute)
2. Query users: `WHERE delivery_time <= NOW() AND last_email_sent_at < TODAY`
3. For each user: Query tasks → Send email
4. Update: `last_email_sent_at = NOW()` after send
5. Test: Set delivery_time to 2 minutes from now → Wait → Receive email

**Deliverable:** Automated email delivery

**Test:** Set delivery time to current time + 2 mins → Wait → Email arrives

---

### Epic 4: Monetization & Payments (Week 2, Day 5 + Week 3)

**Epic Goal:** Trial system, paywall, and payment processing working.

---

#### Story 4.1: Cohort Assignment on Signup
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1 complete

**As a** system  
**I want to** assign users to cohorts based on signup date  
**So that** monetization strategy can be implemented

**Acceptance Criteria:**
1. Add columns to users table: `cohort`, `grandfather_status`, `trial_started_at`, `trial_expires_at`
2. SQL migration file created
3. After user signs up, run cohort assignment logic:
   - Calculate weeks since launch (env var: `LAUNCH_DATE`)
   - Weeks 4-6: `cohort = 'free_launch'`, `grandfather_status = true`, `trial_expires_at = null`
   - Weeks 7-8: 50/50 split `early_freemium_2.99` or `early_freemium_4.99`, `trial_expires_at = NOW() + 30 days`
   - Week 9+: `cohort = 'paid_cohort_v1'`, `trial_expires_at = NOW() + 30 days`
4. Verify cohort saved correctly in database

**Deliverable:** Cohort assignment logic working

**Test:** Sign up new user → Check database → Correct cohort assigned

---

#### Story 4.2: Trial Days Remaining Display
**Estimated Time:** 2 hours  
**Dependencies:** Story 4.1

**As a** user  
**I want to** see how many trial days I have left  
**So that** I know when I need to upgrade

**Acceptance Criteria:**
1. Settings screen shows: "Trial: X days remaining"
2. If `grandfather_status = true`: Shows "✅ Free Forever"
3. If `trial_expires_at` is null: Shows nothing (no trial)
4. Calculate days: `EXTRACT(DAY FROM trial_expires_at - NOW())`
5. Display updates every time Settings screen opens

**Deliverable:** Trial countdown in Settings

**Test:** Open Settings → See "Trial: 30 days remaining" (for new user)

---

#### Story 4.3: Trial Expiration Check & Gate
**Estimated Time:** 2 hours  
**Dependencies:** Story 4.2

**As a** system  
**I want to** check if trial has expired on app open  
**So that** non-paying users are prompted to upgrade

**Acceptance Criteria:**
1. On app launch, query: `trial_expires_at <= NOW() AND is_paid = false AND grandfather_status = false`
2. If expired: Navigate to PaywallScreen instead of MainScreen
3. PaywallScreen shows: "Your trial has ended. Upgrade to continue."
4. Button: "Unlock Premium for $X.XX"
5. For grandfather users: Never show paywall

**Deliverable:** Trial gate working

**Test:** Manually set `trial_expires_at` to yesterday → Reopen app → See paywall

---

#### Story 4.4: Task Limit Counter (Alternative Gate)
**Estimated Time:** 2 hours  
**Dependencies:** Story 4.3

**As a** system  
**I want to** track how many tasks a user has created  
**So that** I can trigger paywall at 100 tasks (whichever comes first with 30-day trial)

**Acceptance Criteria:**
1. Add column: `trial_tasks_count` to users table
2. Increment on every task creation: `UPDATE users SET trial_tasks_count = trial_tasks_count + 1 WHERE id = ?`
3. If `trial_tasks_count >= 100 AND is_paid = false AND grandfather_status = false`: Show paywall
4. Settings shows: "Tasks created: X / 100" (during trial)
5. After paying: Remove task counter display

**Deliverable:** Task limit tracking

**Test:** Create 100 tasks → See paywall appear

---

#### Story 4.5: Paywall UI & Messaging
**Estimated Time:** 3 hours  
**Dependencies:** Story 4.4

**As a** trial user  
**I want to** see clear messaging about upgrading  
**So that** I understand the value and pricing

**Acceptance Criteria:**
1. PaywallScreen component created
2. Cohort-specific messaging:
   - `early_freemium_2.99`: "Unlock for just $2.99—one time, forever."
   - `early_freemium_4.99`: "Unlock for $4.99—one time, forever. You've captured X tasks."
3. Primary CTA button: "Unlock Premium"
4. Secondary option: "Use Free Tier (50 tasks/month)"
5. For free_launch cohort: Optional support prompt (dismissible)

**Deliverable:** PaywallScreen with cohort messaging

**Test:** View paywall as different cohorts → Messaging changes correctly

---

#### Story 4.6: Stripe Payment Integration (Web/PWA)
**Estimated Time:** 4 hours  
**Dependencies:** Story 4.5

**As a** web user  
**I want to** pay via credit card  
**So that** I can unlock premium features

**Acceptance Criteria:**
1. Stripe account created (test mode)
2. Stripe Checkout session created when "Unlock Premium" tapped
3. Redirect to Stripe payment page
4. After payment: Redirect back to app
5. Webhook: `payment_intent.succeeded` → Update `is_paid = true`, `paid_at = NOW()`
6. Test with Stripe test card: `4242 4242 4242 4242`

**Deliverable:** Stripe payment flow working

**Test:** Tap "Unlock Premium" → Pay with test card → Return to app → Paywall gone

---

#### Story 4.7: Apple In-App Purchase (iOS)
**Estimated Time:** 4 hours  
**Dependencies:** Story 4.5

**As an** iOS user  
**I want to** pay via Apple IAP  
**So that** I can unlock premium using my Apple ID

**Acceptance Criteria:**
1. Apple Developer account created ($99/year)
2. IAP products created in App Store Connect:
   - `com.todomorning.premium_2_99` ($2.99)
   - `com.todomorning.premium_4_99` ($4.99)
3. `react-native-iap` library integrated
4. Tapping "Unlock Premium" triggers StoreKit purchase
5. Receipt validated via Supabase Edge Function
6. On success: Update `is_paid = true`

**Deliverable:** Apple IAP working in TestFlight

**Test:** Build to TestFlight → Purchase with sandbox account → Verify payment

---

#### Story 4.8: Payment Status Sync & Verification
**Estimated Time:** 3 hours  
**Dependencies:** Stories 4.6, 4.7

**As a** user  
**I want to** have my payment status verified securely  
**So that** I can't bypass payment

**Acceptance Criteria:**
1. Supabase Edge Function: `validate-payment`
2. Function checks:
   - Stripe: Verify webhook signature
   - Apple: Verify receipt with Apple's API
3. On valid payment: INSERT into `payments` table, UPDATE `users.is_paid = true`
4. On app open: Check `users.is_paid` → If true, skip paywall
5. RLS policy: Users cannot update their own `is_paid` field

**Deliverable:** Server-side payment verification

**Test:** Attempt to manually set `is_paid = true` in database → Should fail (RLS blocks it)

---

### Epic 5: Workflow Modes & Polish (Week 3-4)

**Epic Goal:** Fresh Start vs Carry Over modes, task completion, archive, final polish.

---

#### Story 5.1: Workflow Mode Selection (Onboarding)
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1 complete

**As a** first-time user  
**I want to** choose between Fresh Start and Carry Over modes  
**So that** the app matches my workflow

**Acceptance Criteria:**
1. After magic link authentication, show onboarding screen
2. Two cards: "Fresh Start" (tasks reset daily) and "Carry Over" (tasks persist)
3. User selects one mode
4. Save to: `UPDATE users SET workflow_mode = ? WHERE id = ?`
5. Navigate to MainScreen after selection

**Deliverable:** Mode selection in onboarding

**Test:** Sign up → Choose mode → Verify saved in database

---

#### Story 5.2: Task Completion UI (Carry Over Mode)
**Estimated Time:** 3 hours  
**Dependencies:** Story 5.1

**As a** Carry Over mode user  
**I want to** mark tasks as complete with a checkbox  
**So that** I can track what I've finished

**Acceptance Criteria:**
1. If `workflow_mode = 'carry_over'`: Show checkbox next to each task
2. Tapping checkbox triggers animation: Strike-through → Fade → Slide out (600ms)
3. Update: `UPDATE tasks SET completed_at = NOW() WHERE id = ?`
4. Haptic feedback on completion
5. Task removed from Active list

**Deliverable:** Task completion with animation

**Test:** Tap checkbox → See animation → Task disappears

---

#### Story 5.3: Archive View (Carry Over Mode)
**Estimated Time:** 2 hours  
**Dependencies:** Story 5.2

**As a** Carry Over mode user  
**I want to** view completed tasks in Archive  
**So that** I can review my accomplishments

**Acceptance Criteria:**
1. Tab bar appears: "Active | Archive" (only in Carry Over mode)
2. Archive tab queries: `SELECT * FROM tasks WHERE user_id = ? AND status = 'completed' ORDER BY completed_at DESC`
3. Tasks show: Task text (from `text` field) + completion timestamp
4. Empty state: "No completed tasks yet! 🎉"
5. Read-only (no editing in Archive)

**Deliverable:** Archive tab with completed tasks

**Test:** Complete 3 tasks → Switch to Archive → See 3 tasks with timestamps

---

#### Story 5.4: Email Delivery - Mode-Specific Logic
**Estimated Time:** 3 hours  
**Dependencies:** Stories 5.1, 5.3, Epic 3 complete

**As a** user  
**I want to** receive emails formatted for my workflow mode  
**So that** emails match my preferences

**Acceptance Criteria:**
1. In cron job, check `users.workflow_mode`
2. If `fresh_start`: Query all tasks → Send email → `UPDATE tasks SET archived_at = NOW()` (clear app)
3. If `carry_over`: Query incomplete tasks only → Send email → Add "(from yesterday)" indicator for old tasks
4. Test both modes: Receive correct email format
5. Fresh Start mode: App is empty after email sent

**Deliverable:** Mode-specific email logic

**Test:** Set mode to Fresh Start → Receive email → Open app → Empty state shown

---

## 8. Development Guidelines - NEW SECTION

### Story Size Principles

**Every story should be:**
- ✅ Completable in 2-4 hours (not 8+ hours)
- ✅ Testable immediately after completion
- ✅ Building directly on previous story
- ✅ Single clear deliverable

**Red Flags (Story Too Big):**
- ❌ Multiple database tables in one story
- ❌ More than 8 acceptance criteria
- ❌ "And also..." appearing in story description
- ❌ Multiple integration points (auth + tasks + emails in one story)
- ❌ Cannot test without completing other stories first

### Build-Test-Fix Workflow

After each story:

1. **Build:** Implement the story
2. **Test:** Verify acceptance criteria (all should pass)
3. **Fix:** If issues found, fix before moving to next story
4. **Commit:** Git commit with story ID (e.g., "Story 1.3: Database schema - Users table")
5. **Next:** Only then move to next story

**Never move forward if current story has failing tests.**

### Story Dependencies

Stories are **intentionally sequential**. Do not skip ahead.

Example: You cannot do Story 2.3 (Save to Supabase) without Story 2.2 (Local state) working first.

If a story is blocked:
1. Check if previous story is actually complete (all ACs passing)
2. If previous story incomplete → Go back and fix it
3. If blocked by external factor (e.g., waiting for Stripe approval) → Mark story as "Blocked" and work on different epic temporarily

### Testing Each Story

**Minimum test for each story:**
- Unit test (if business logic exists)
- Manual test following the "Test:" line in each story
- Verify acceptance criteria manually

**Do not proceed if:**
- Story's "Test:" step fails
- Any acceptance criteria not met
- Code has obvious bugs or crashes

---

## 8. Checklist Results Report

### PM Master Checklist Results

✅ **All checks passed** - PRD ready for architecture handoff

**Checklist Categories:**

1. **Problem Definition** ✅
   - Clear problem statement with user context
   - Quantified pain points (email drafts forgotten, inbox spam)
   - Validated through competitive analysis

2. **Goals & Success Metrics** ✅
   - 6 specific, measurable goals defined
   - Timeline: 4 weeks to MVP launch
   - Success metrics: 300-500 downloads Month 1, 20% D30 retention, $500 revenue Month 3

3. **User Stories** ✅
   - 31 detailed user stories across 4 epics
   - Each story includes acceptance criteria
   - Stories follow "As a... I want... So that..." format

4. **Requirements** ✅
   - 32 functional requirements (FR1-FR32)
   - 17 non-functional requirements (NFR1-NFR17)
   - Clear distinction between functional and non-functional

5. **Technical Assumptions** ✅
   - Technology stack documented (React Native, Supabase, SendGrid)
   - Third-party service limits specified
   - Platform support defined (iOS 14+, Android 8+, modern browsers)

6. **Out of Scope** ✅
   - 40+ features explicitly deferred to post-MVP
   - Clear rationale for exclusions (maintain focus, ensure launch velocity)

7. **UI/UX Design Goals** ✅
   - Design philosophy documented (Apple minimalism, Things 3 polish)
   - Key interaction paradigms defined
   - Visual language specified (color palette, typography, spacing, animations)
   - Paywall design specifications included

8. **Monetization Strategy** ✅
   - Tiered freemium launch strategy (3 phases)
   - Cohort tracking system defined
   - Grandfather status for early adopters
   - A/B pricing test ($2.99 vs $4.99)
   - Payment platform integration (Apple IAP, Google Play, Stripe)
   - Revenue projections with mitigation strategies

9. **Dependencies** ✅
   - Epic dependencies mapped (E1 → E2 → E3, E4)
   - External service dependencies documented
   - Timeline accounts for App Store approval delays

10. **Handoff Readiness** ✅
    - Next agent identified (Architect)
    - Next deliverable specified (architecture.md)
    - Handoff prompt template provided

### Key Strengths

- **Comprehensive monetization strategy**: Detailed 3-phase freemium launch with cohort tracking
- **Clear user flows**: 31 stories with specific acceptance criteria
- **Technical depth**: Database schema, API endpoints, and payment validation specified
- **Risk mitigation**: App Store fee calculations, rate limiting, deliverability monitoring
- **Design specifications**: Detailed paywall messaging, animation timings, visual language

### Architect Handoff Notes

The architect should focus on:

1. **Database schema design**: Implement `cohort`, `grandfather_status`, `trial_expires_at`, and payment tracking fields
2. **Payment validation**: Build Supabase Edge Functions for receipt validation (Apple, Google, Stripe)
3. **Cron job logic**: Email delivery scheduler with cohort and trial checks
4. **Offline-first architecture**: Local storage sync strategy for React Native and Web
5. **Paywall triggering logic**: Trial expiration, task limit, and grandfather exemption checks

---

## 9. Next Steps

### 9.1 Immediate Actions

1. **Save this PRD** as `docs/prd.md` in your TodoMorning project repository
2. **Review monetization strategy** with stakeholders (if any) to confirm tiered approach
3. **Verify domain availability** for email sending (todomorning.com or alternative)
4. **Set up project structure**:
   ```
   todomorning/
   ├── docs/
   │   ├── prd.md ✅
   │   ├── project-brief.md
   │   └── competitive-analysis.md
   ├── backend/ (Supabase project)
   ├── mobile/ (React Native app)
   └── web/ (Next.js PWA)
   ```

### 9.2 Architecture Phase Handoff

**Next Agent:** Architect (use `*agent architect` command)

**Handoff Prompt:**
```
I've completed the TodoMorning Product Requirements Document (PRD v1.1). 

Key points for architecture:
- Mobile-first React Native app (iOS/Android) + Next.js PWA
- Offline-first architecture with Supabase backend
- Tiered freemium monetization (3-phase launch, cohort tracking, grandfather status)
- Payment integration: Apple IAP, Google Play Billing, Stripe (with server-side validation)
- Email delivery system: Supabase cron job + SendGrid
- Two workflow modes: Fresh Start (reset daily) and Carry Over (task persistence)

Please create architecture.md covering:
1. System architecture diagram
2. Database schema (with monetization fields: cohort, grandfather_status, trial_expires_at, etc.)
3. API endpoints (Supabase Edge Functions for payment validation, email sending)
4. Data flow diagrams (offline sync, payment flow, email delivery)
5. Payment validation architecture (Apple/Google/Stripe receipt verification)
6. Cron job logic (email scheduler with cohort checks)
7. Security considerations (receipt validation, grandfather status enforcement)

The PRD is available at docs/prd.md. Let's build the technical foundation!
```

### 9.3 Development Timeline

**Week 1: Core Task Capture (Epic 1)**
- User onboarding and authentication
- Task creation, editing, deletion
- Local storage and Supabase sync
- Settings management

**Week 2: Email Delivery System (Epic 2)**
- Email template design
- SendGrid integration
- Scheduled cron job
- Fresh Start and Carry Over email logic

**Week 3: Tiered Monetization & Payments (Epic 3)**
- Cohort assignment logic
- Trial tracking and expiration
- Paywall UI and messaging
- Apple IAP, Google Play, Stripe integration
- Payment validation (server-side)

**Week 4: Mode Selection & Polish (Epic 4)**
- Mode selection onboarding
- Task completion animation
- Archive tab
- Mode switching
- Final testing and bug fixes

**Week 5 (Buffer): App Store Submission & Launch**
- TestFlight beta testing (iOS)
- Internal testing (Android)
- PWA deployment to Vercel
- App Store and Play Store submissions
- Launch on X (Twitter) with build-in-public updates

---

## Appendix A: Story Sizing Estimates

| Epic | Stories | Total Hours | With Cursor AI | Per Week |
|------|---------|-------------|----------------|----------|
| E1: Core Task Capture | 8 | 32 hours | 24 hours | 15-16 hours |
| E2: Email Delivery | 7 | 28 hours | 21 hours | 15-16 hours |
| E3: Monetization & Payments | 10 | 40 hours | 30 hours | 15-16 hours |
| E4: Mode & Archive | 6 | 24 hours | 18 hours | 15-16 hours |
| **Total** | **31** | **124 hours** | **93 hours** | **15-16 hours/week** |

**Assumptions:**
- Cursor AI reduces implementation time by 25-30%
- Estimates include: coding, testing, debugging, documentation
- Does not include: design mockups, App Store assets, marketing

---

## Appendix B: Database Schema

**Note:** This schema matches the unified schema in `docs/architecture.md`. The database field `text` in the tasks table is displayed as "title" in the UI for better user experience.

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Delivery preferences
  delivery_time TIME NOT NULL DEFAULT '06:00:00',
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  workflow_mode VARCHAR(20) NOT NULL DEFAULT 'fresh_start' 
    CHECK (workflow_mode IN ('fresh_start', 'carry_over')),
  email_enabled BOOLEAN DEFAULT TRUE,
  
  -- Email tracking
  last_email_sent_at TIMESTAMP DEFAULT NULL,
  last_email_failed_at TIMESTAMP DEFAULT NULL,
  consecutive_failures INTEGER DEFAULT 0,
  
  -- Monetization: Cohort & Trial
  cohort VARCHAR(50) NOT NULL DEFAULT 'free_launch'
    CHECK (cohort IN ('free_launch', 'early_freemium_2.99', 'early_freemium_4.99', 'paid_cohort_v1', 'paid_cohort_v2')),
  grandfather_status BOOLEAN DEFAULT FALSE,
  trial_started_at TIMESTAMP DEFAULT NULL,
  trial_expires_at TIMESTAMP DEFAULT NULL,
  trial_tasks_count INTEGER DEFAULT 0,
  
  -- Payment tracking
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP DEFAULT NULL,
  paid_price_cents INTEGER DEFAULT NULL,
  unlock_method VARCHAR(50) DEFAULT NULL
    CHECK (unlock_method IS NULL OR unlock_method IN ('trial_expiry', 'task_limit', 'manual_upgrade')),
  
  -- Paywall analytics
  paywall_shown_count INTEGER DEFAULT 0,
  last_paywall_shown_at TIMESTAMP DEFAULT NULL,
  paywall_dismissed_at TIMESTAMP DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_users_trial_expires ON users(trial_expires_at) 
  WHERE is_paid = FALSE AND trial_expires_at IS NOT NULL;
CREATE INDEX idx_users_cohort_acquired ON users(cohort, created_at DESC);
CREATE INDEX idx_users_delivery_time ON users(delivery_time, timezone, email_enabled)
  WHERE deleted_at IS NULL AND email_enabled = TRUE;
```

### Tasks Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Task content (database field is 'text', UI displays as 'title')
  text VARCHAR(500) NOT NULL,
  
  -- Task metadata
  due_date DATE DEFAULT NULL,
  priority VARCHAR(10) DEFAULT NULL 
    CHECK (priority IS NULL OR priority IN ('high', 'medium', 'low')),
  
  -- Task status (enum for cleaner queries, with timestamp for ordering)
  status VARCHAR(20) NOT NULL DEFAULT 'open' 
    CHECK (status IN ('open', 'completed', 'archived')),
  completed_at TIMESTAMP DEFAULT NULL,
  archived_at TIMESTAMP DEFAULT NULL,
  
  -- Sync/email tracking (for offline-first architecture)
  synced_at TIMESTAMP DEFAULT NULL,
  emailed_at TIMESTAMP DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_tasks_user_id_created ON tasks(user_id, created_at DESC);
CREATE INDEX idx_tasks_user_id_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_completed_at ON tasks(user_id, completed_at DESC) 
  WHERE status = 'completed';
```

### Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment details
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('stripe', 'apple', 'google')),
  external_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  receipt_data TEXT NOT NULL,
  
  -- Validation
  validated_at TIMESTAMP DEFAULT NULL,
  validation_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (validation_status IN ('pending', 'valid', 'invalid', 'refunded')),
  
  -- Financial
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Monetization analytics
  cohort_at_purchase VARCHAR(50) NOT NULL,
  test_variant_paid BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_user_created ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_external_transaction_id ON payments(external_transaction_id);
```

### Email Logs Table

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email details
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  
  -- Sending info
  sendgrid_message_id VARCHAR(255) UNIQUE DEFAULT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'sent'
    CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  
  -- Task count for this email
  task_count INTEGER NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_user_sent ON email_logs(user_id, sent_at DESC);
```

---

## Appendix C: Email Templates

### Fresh Start Mode Email Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your TodoMorning</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
  
  <h2 style="color: #1a1a1a; margin-bottom: 10px;">Good morning! 🌅</h2>
  <p style="color: #666; margin-bottom: 20px;">Here's your action list:</p>
  
  <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
    <li style="margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-left: 3px solid #007AFF;">
      Call Sarah about project kickoff
    </li>
    <li style="margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-left: 3px solid #007AFF;">
      Review Q4 budget proposal
    </li>
    <li style="margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-left: 3px solid #007AFF;">
      Book dentist appointment
    </li>
  </ul>
  
  <p style="color: #666;">Have a productive day!</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    TodoMorning - Sent at your requested time<br>
    <a href="{unsubscribe_url}" style="color: #999;">Unsubscribe</a>
  </p>
  
  </div>
</body>
</html>
```

### Carry Over Mode Email Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your TodoMorning</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
  
  <h2 style="color: #1a1a1a; margin-bottom: 10px;">Good morning! 🌅</h2>
  <p style="color: #666; margin-bottom: 20px;">Here's your action list:</p>
  
  <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
    <li style="margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-left: 3px solid #007AFF;">
      Contact John from yesterday's call <span style="color: #999; font-size: 13px; font-style: italic;">(from yesterday)</span>
    </li>
    <li style="margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-left: 3px solid #007AFF;">
      Follow up with Sarah <span style="color: #999; font-size: 13px; font-style: italic;">(from yesterday)</span>
    </li>
    <li style="margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-left: 3px solid #007AFF;">
      Create new marketing plan
    </li>
    <li style="margin-bottom: 8px; padding: 10px; background: #f9f9f9; border-left: 3px solid #007AFF;">
      Draft article on productivity
    </li>
  </ul>
  
  <p style="color: #666;">Have a productive day!</p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    TodoMorning - Sent at your requested time<br>
    <a href="{unsubscribe_url}" style="color: #999;">Unsubscribe</a>
  </p>
  
  </div>
</body>
</html>
```

---

## Appendix D: Key User Flows

### Flow 1: First-Time User (Fresh Start Mode)
1. Download app / Open PWA
2. Enter email address → Receive magic link
3. Click magic link → Logged in
4. Cohort assigned automatically (based on signup date)
5. Onboarding: Set delivery time (default 6:00 AM)
6. Onboarding: Choose "Fresh Start" mode
7. Land on main screen (empty state)
8. Tap "+" → Type first task → Tap "Add"
9. Task appears in list (trial starts if not grandfather'd)
10. Add 2-3 more tasks throughout evening
11. Next morning at 6:00 AM: Receive email with 3-4 tasks
12. Open app → Empty slate (yesterday's tasks emailed)
13. Continue using for 30 days
14. **Phase-dependent:**
   - **Free launch cohort:** Never see paywall, use free forever
   - **Freemium cohort:** Day 27 sees "Trial expires in 3 days" modal
15. **If freemium:** Tap "Upgrade Now" → Pay $2.99 or $4.99 → Premium unlocked

### Flow 2: First-Time User (Carry Over Mode)
1. Download app / Open PWA
2. Enter email → Magic link → Logged in
3. Cohort assigned automatically
4. Onboarding: Set delivery time
5. Onboarding: Choose "Carry Over" mode
6. Land on main screen (empty, with "Active" | "Archive" tabs)
7. Add 5 tasks throughout evening
8. Next morning: Receive email with 5 tasks
9. Afternoon: Open app → See 5 tasks with checkboxes
10. Tap checkbox on 3 tasks → Satisfying animation → Move to Archive
11. Add 2 new tasks for tomorrow
12. Next morning: Receive email with 2 uncompleted + 2 new = 4 tasks
13. Open Archive tab → See 3 completed tasks with timestamps
14. Continue pattern for 30 days
15. **Phase-dependent paywall flow** (same as Flow 1)

### Flow 3: Trial Expiration (Freemium Cohort)
1. User in Day 27 of trial
2. Opens app → Modal appears: "Trial ending in 3 days"
3. User reads cohort-specific messaging:
   - **$2.99 cohort:** "Unlock for just $2.99—one time, forever"
   - **$4.99 cohort:** "You've captured X tasks and received Y emails. Unlock for $4.99—one time, forever"
4. User dismisses modal (clicks "Maybe Later")
5. Banner persists at top: "⚠️ 3 days remaining"
6. Day 29: Banner updates to "⚠️ Trial ends tomorrow"
7. Day 30: Hard paywall (non-dismissible)
8. User must choose:
   - **Option A:** Tap "Unlock Premium" → Payment flow → Premium unlocked
   - **Option B:** Tap "Use Free Tier (50 tasks/month)" → Downgraded to limited tier
9. If Option A: Receipt validated server-side → `is_paid = true` → Paywall dismisses
10. If Option B: User continues with 50 tasks/month soft cap, weekly paywall reminder

### Flow 4: Payment Flow (iOS)
1. User taps "Unlock Premium" button
2. App checks cohort → Shows appropriate IAP product ($2.99 or $4.99)
3. StoreKit payment sheet opens
4. User authenticates with Face ID / Touch ID / Password
5. Apple processes payment (30% commission deducted)
6. App receives transaction receipt
7. Receipt sent to Supabase Edge Function: `POST /validate-ios-receipt`
8. Edge Function validates receipt with Apple's verifyReceipt API
9. On success: Edge Function updates `users` table:
   - `is_paid = true`
   - `paid_at = NOW()`
   - `paid_price_cents = 299` or `499`
   - `unlock_method = 'trial_expiry'` or `'task_limit'` or `'manual_upgrade'`
10. Edge Function inserts into `payments` table
11. App receives success response → Paywall dismisses
12. Settings screen updates: "✅ Premium Active"
13. User continues using with no limits

---

## Appendix E: Success Metrics Dashboard

### Week 1 Metrics (Post-Launch, Free Phase)
- **Downloads:** 50-100 (X audience + early adopters)
- **DAU:** 30-60 (60% of downloads)
- **Email open rate:** Track via SendGrid (target 80%+)
- **Crash rate:** <1%
- **Trial starts:** N/A (Phase 1 is free forever)
- **Grandfather cohort size:** 50-100 users

### Month 1 Metrics (End of Free Phase)
- **Downloads:** 300-500 (target)
- **MAU:** 90-150 (30% retention from free phase)
- **Email deliverability:** 95%+ inbox placement
- **Email open rate:** 80%+
- **Avg tasks per email:** 3-8
- **Trial-to-paid conversion:** N/A yet (freemium starts Month 2)
- **Free launch cohort:** 200-300 users (grandfather'd forever)

### Month 2 Metrics (Freemium A/B Test Phase)
- **New downloads:** 300-400
- **Cohort split:**
  - `early_freemium_2.99`: 150-200 users
  - `early_freemium_4.99`: 150-200 users
- **Conversion rate ($2.99):** Target 10-12%
- **Conversion rate ($4.99):** Target 10-12%
- **Statistical significance:** Need 100+ trial completions for valid test
- **Revenue (gross):** ~$129 (from ~33 conversions)
- **Revenue (net):** ~$90 (after 30% platform fees)

### Month 3 Metrics (Scale with Winning Price)
- **Cumulative downloads:** 1000-1500
- **New downloads (Month 3):** 400-500
- **D30 retention:** 20%+ (200-300 active users)
- **Paid users:** 81+ (cumulative from Month 2-3)
- **Conversion rate (winner):** Sustained 12%+
- **Revenue (cumulative net):** $191+ (still short of $500 goal)
- **Mitigation actions:**
  - Test $5.99 if conversion stays strong
  - Increase acquisition (better X presence, Product Hunt launch)
  - Optional tip jar for free users
- **NPS score:** 40+ (survey after 14 days)
- **Support tickets:** <5 per week
- **Crash rate:** <0.5%

### Month 4+ Metrics (Optimization Phase)
- **Revenue target:** $500+ net revenue (cumulative)
- **Paid user LTV:** $10-15 by Day 30
- **Paywall dismissal rate:** <40% (if higher, improve messaging)
- **Churn (free cohort):** <20% monthly
- **Churn (paid cohort):** Near 0% (one-time purchase should be sticky)
- **App Store rating:** 4.5+ stars (iOS and Android)
- **Decision point:** Evaluate subscription model if LTV supports it

---

## Document End

**TodoMorning PRD - Version 1.1**  
**Updated:** October 30, 2025  
**Total Pages:** ~65  
**Total Stories:** 31  
**Total Epics:** 4  
**Timeline:** 4 weeks to launch + 3 months to revenue validation  
**Status:** ✅ Ready for Architecture Phase

---

**Key Changes in v1.1:**
- Added tiered freemium launch strategy (Phase 1: Free, Phase 2: A/B Test, Phase 3: Scale)
- Implemented cohort tracking system (4 cohorts: free_launch, early_freemium_2.99, early_freemium_4.99, paid_cohort_v1)
- Added grandfather status for early adopters (free forever)
- Expanded monetization epic from 4 stories to 10 stories
- Updated database schema with monetization fields
- Added cohort-specific paywall messaging
- Updated revenue projections with tiered approach
- Added mitigation strategies for revenue gap ($500 goal)

**Next Agent:** Architect  
**Next Document:** `docs/architecture.md`  
**Handoff:** Use prompt from Section 9.2

🌅 **Let's build TodoMorning with a sustainable monetization strategy!**
