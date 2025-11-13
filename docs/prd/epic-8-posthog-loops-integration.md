# Epic 8: Sentry Crash Logging, PostHog Analytics & Loops Email Sequences - Post-Launch Enhancement

**Epic Goal:** Integrate Sentry for crash logging, PostHog for product analytics, and Loops for lifecycle/marketing emails (welcome, re-engagement sequences) to improve user engagement, retention, and crash debugging post-launch.

**Status:** 🔄 **IN PROGRESS** (Post-Launch)
- ✅ Sentry Integration: Complete
- ✅ PostHog Integration: Complete (including retention tracking & dashboard)
- ✅ Loops Welcome Email: Complete (Story 8.4 - 2025-11-13)
- 🔄 Loops Re-Engagement: In Progress (Story 8.5 - implementation complete, testing pending)

**Timing:** After app launch (Epic 7 complete), when we have real users to track and engage

**Prerequisites:**
- ✅ Epic 1: Foundation & Authentication - COMPLETE
- ✅ Epic 2: Core Task Management - COMPLETE
- ✅ Epic 3: Email Delivery System - COMPLETE
- ✅ Epic 7: Pre-Launch Polish - COMPLETE (app launched)

---

## Epic Description

### Existing System Context

**Current Analytics & Monitoring:**
- Basic analytics via Supabase queries on users table (assumption from PRD Section 4.5)
- Manual crash log checking via Android Studio Logcat or ADB (documented in `CHECK_CRASH_LOGS.md`)
- No automated crash reporting or error tracking (crashes require manual investigation)
- No product analytics or user behavior tracking
- No automated email sequences beyond daily task batches
- Recent crash issues (ShareHandler) discovered only through manual log checking

**Current Email Infrastructure:**
- Supabase Auth for magic link authentication emails (using default Supabase SMTP)
- Resend API for daily task batch emails (via `send-daily-emails` Edge Function)
- Email logs table (`email_logs`) for tracking delivery status
- No automated lifecycle emails (welcome, re-engagement, etc.)

**Email Provider Strategy (CORRECTED):**
- **Resend (Transactional Emails - Critical):**
  - ✅ Magic link authentication (time-sensitive, critical) - via Supabase SMTP
  - ✅ Daily todo digest emails (core product feature) - via Edge Functions API
  - **Why:** These MUST be delivered reliably and immediately. Resend is built for transactional emails.
- **Loops (Lifecycle/Marketing Emails - Non-Critical):**
  - ✅ Welcome emails (nice-to-have, not critical) - via Loops API
  - ✅ Day 3 "no tasks" nudge (re-engagement) - via Loops API
  - ✅ Day 5 inactivity email (re-engagement) - via Loops API
  - **Why:** These are marketing/engagement emails, not product-critical. Loops is built for marketing automation.
- **Rationale:** Different email types = different providers. This split protects deliverability (if Loops has issues, core product still works) and optimizes costs (both free tiers sufficient).

**Technology Stack:**
- React Native + Expo SDK 54
- Supabase (PostgreSQL, Edge Functions, Auth)
- Resend API (email delivery)
- Zustand (state management)
- TypeScript

**Integration Points:**
- `App.tsx` - App initialization, error boundaries
- `src/screens/` - User actions to track (task creation, completion, etc.)
- `supabase/functions/` - Edge Functions for webhook triggers
- `src/lib/supabase.ts` - Supabase client configuration
- `app.config.js` - Environment variables and app configuration

### Enhancement Details

**What's Being Added:**

1. **Sentry Integration:**
   - Professional crash logging and error tracking platform
   - Automatic crash reports with stack traces and source maps
   - Error boundary integration for React Native
   - Breadcrumbs for debugging context
   - Release tracking and crash grouping
   - Free tier: 5K events/month (sufficient for MVP)
   - Use immediately (no delay)

2. **PostHog Integration:**
   - Product analytics platform for user behavior tracking
   - Autocapture events (automatic event tracking)
   - Custom events for key user actions
   - Retention analysis and cohort tracking
   - Free tier: 1M events/month (sufficient for MVP)
   - Use immediately (no 7-day delay)

3. **Loops Integration:** 🔄 **REVISED APPROACH** (2025-01-28)
   - Using Loops API for lifecycle/marketing emails (welcome, re-engagement sequences)
   - **NOT for auth emails** - Resend handles transactional emails (magic links, daily digests)
   - Welcome emails sent via Loops API (from app code or Edge Functions)
   - Re-engagement emails sent via Loops API (Day 3, Day 5 sequences)
   - **Previous Approach:** Custom solution with database triggers, Edge Functions, pg_net (rolled back due to complexity)
   - **New Approach:** Simple Loops API integration - send lifecycle emails directly from app code or Edge Functions (10-20 lines of code)
   - **Reference:** [Loops API Documentation](https://loops.so/docs/api)

**How It Integrates:**

- **Sentry:** Initialized in `App.tsx`, wraps app with error boundary, automatically captures crashes and errors ✅
- **PostHog:** Initialized in `App.tsx`, tracks events throughout app lifecycle, separate from crash reporting ✅
- **Loops:** 🔄 **REVISED** - Using Loops API for lifecycle/marketing emails (welcome, re-engagement). Simple API integration from app code or Edge Functions (10-20 lines). Previous custom solution (database triggers, Edge Functions, pg_net) was rolled back due to complexity.
- **Non-Breaking:** All services are additive - existing functionality remains unchanged
- **Configuration:** Environment variables stored in EAS secrets, loaded via `app.config.js`

**Success Criteria:**

- ✅ Sentry automatically captures all crashes with stack traces and source maps
- ✅ PostHog tracks all key user events (signup, task creation, completion, email sends)
- ✅ Crash reports appear in Sentry dashboard within minutes of occurrence
- 🔄 Loops API integrated - Lifecycle/marketing emails (welcome, re-engagement) sent via Loops API
- ✅ All integrations work on iOS, Android, and web (PWA)
- ✅ Zero impact on existing functionality (magic links, daily emails continue working)

---

## Stories

### Story 8.1: Sentry Setup & Crash Reporting
**Estimated Time:** 3-4 hours  
**Dependencies:** Epic 7 complete (app launched)

**As a** product manager  
**I want** Sentry integrated for crash logging  
**So that** crashes are automatically captured with stack traces and I can debug issues without manual log checking

**Acceptance Criteria:**
1. Sentry account created, project initialized for React Native
2. Verify Sentry package compatibility with Expo SDK 54:
   - Check if `@sentry/expo` or `sentry-expo` is available and compatible
   - If not, confirm `@sentry/react-native` works with native modules in Expo dev client
   - Document chosen approach
3. Appropriate Sentry package installed and configured
4. Sentry initialized in `App.tsx` with DSN from environment variables
5. Error boundary wrapper added to catch React errors and send to Sentry
6. Native crash reporting configured (iOS and Android)
7. Source maps configured for readable stack traces
8. Release tracking configured (tracks app version with crashes)
9. Test crash button added (dev only) to verify crash reporting works
10. Configuration stored in EAS secrets (`EXPO_PUBLIC_SENTRY_DSN`)

**Deliverable:** Sentry integrated, crash reporting verified

**Test:**
- Trigger test crash → Verify crash appears in Sentry dashboard with stack trace
- Trigger JavaScript error → Verify error captured in Sentry
- Check Sentry dashboard → Crashes grouped by error type
- Verify source maps → Stack traces show readable file names and line numbers

**Code Structure:**
- `src/lib/sentry.ts` - Sentry client initialization
- `src/components/ErrorBoundary.tsx` - Error boundary wrapper (Sentry-aware)
- `App.tsx` - Sentry initialization and error boundary wrapping
- `sentry.properties` - Source map configuration (if needed)

---

### Story 8.2: PostHog Setup & Initialization
**Estimated Time:** 2-3 hours  
**Dependencies:** Story 8.1 complete

**As a** product manager  
**I want** PostHog integrated for product analytics  
**So that** I can track user behavior and measure retention

**Acceptance Criteria:**
1. PostHog account created, project initialized
2. `posthog-react-native` package installed and configured
3. PostHog initialized in `App.tsx` with API key from environment variables
4. Autocapture enabled for automatic event tracking
5. User identification configured (links events to users)
6. Configuration stored in EAS secrets (`EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_POSTHOG_HOST`)

**Deliverable:** PostHog integrated, analytics tracking verified

**Test:**
- Perform user actions → Verify autocapture events appear in PostHog
- Sign up → Verify user identification works
- Check PostHog dashboard → Events appear in real-time

**Code Structure:**
- `src/lib/posthog.ts` - PostHog client initialization
- `App.tsx` - PostHog initialization

---

### Story 8.3: PostHog Event Tracking Implementation
**Estimated Time:** 2-3 hours  
**Dependencies:** Story 8.2 complete

**As a** product manager  
**I want** key user actions tracked as PostHog events  
**So that** I can analyze user behavior and measure retention

**Acceptance Criteria:**
1. Custom events implemented for:
   - `task_added` - When user creates a task
   - `task_completed` - When user completes a task
   - `task_deleted` - When user deletes a task
   - `email_sent` - When daily email is sent (tracked in Edge Function)
   - `user_signed_up` - When user completes signup
   - `user_logged_in` - When user logs in
   - `paywall_viewed` - When paywall is shown
   - `purchase_completed` - When user purchases premium
2. Events include relevant properties (task_id, user_id, timestamp, etc.)
3. Events tracked in both app (React Native) and Edge Functions (Deno):
   - React Native: Use `posthog-react-native` package (from Story 8.2)
   - Edge Functions: Use PostHog HTTP API (`https://us.i.posthog.com/capture/`) or `posthog-node` SDK if compatible with Deno runtime
   - Document chosen approach for Edge Functions
4. User identification set on signup/login (PostHog `identify()`)
5. Test events verified in PostHog dashboard

**Deliverable:** All key events tracked and visible in PostHog

**Test:**
- Create task → Verify `task_added` event in PostHog
- Complete task → Verify `task_completed` event
- Sign up → Verify `user_signed_up` event and user identification
- Check PostHog dashboard → All events appear with correct properties

**Code Locations:**
- `src/screens/MainScreen.tsx` - Task creation/completion events
- `src/screens/AuthScreen.tsx` - Signup/login events
- `supabase/functions/send-daily-emails/index.ts` - Email sent events
- `src/lib/posthog.ts` - Event tracking helper functions

---

### Story 8.4: Loops API Integration for Lifecycle Emails
**Status:** 🔄 **REVISED APPROACH** (2025-01-28)  
**Estimated Time:** 2-3 hours (simple API integration)  
**Dependencies:** Story 8.1 complete (app launched)

**Previous Approach:** Custom solution with database triggers, Edge Functions, pg_net - **ROLLED BACK** (2025-11-12) due to excessive complexity.

**New Approach:** Simple Loops API integration - send lifecycle/marketing emails directly from app code or Edge Functions (10-20 lines of code). No database triggers, no complex infrastructure.

**Email Provider Strategy:**
- **Resend:** Handles transactional emails (magic links via SMTP, daily digests via API) - CRITICAL, must be reliable
- **Loops:** Handles lifecycle/marketing emails (welcome, re-engagement) - NON-CRITICAL, nice-to-have

**As a** product manager  
**I want** Loops API integrated for lifecycle/marketing emails  
**So that** users receive welcome emails and re-engagement sequences to improve engagement and retention

**Acceptance Criteria:**

1. **Loops Account Setup:**
   - Loops account created (if not already exists)
   - Loops API key obtained from Loops dashboard → Settings → API
   - Loops API key stored in Supabase Edge Functions secrets (`LOOPS_API_KEY`)

2. **Loops Email Templates Created:**
   - Create "Welcome Email" template in Loops:
     - Go to Loops → Transactional → New (or use Loops email sequences if available)
     - Design welcome email matching TodoTomorrow branding
     - Include: Welcome message, app features overview, link to open app
     - Publish template
   - Create "Day 3 No Tasks" template (optional, for Story 8.5):
     - Design re-engagement email for users with no tasks
     - Include: Friendly reminder, link to add first task
     - Publish template
   - Create "Day 5 Inactivity" template (optional, for Story 8.5):
     - Design re-engagement email for inactive users
     - Include: Come back message, link to open app
     - Publish template

3. **Loops API Integration - Welcome Email:**
   - Add Loops API call in app code (after successful signup):
     - Location: `src/screens/AuthScreen.tsx` or `src/stores/authStore.ts`
     - Call Loops API: `POST https://app.loops.so/api/v1/transactional`
     - Send welcome email immediately after user signs up
     - Use Loops API key from environment variables
   - **OR** Use Edge Function approach (if preferred):
     - Create Edge Function: `supabase/functions/send-loops-welcome/index.ts`
     - Call from app after signup success
     - Edge Function calls Loops API to send welcome email
   - Handle errors gracefully (log but don't break signup flow)

4. **Code Implementation:**
   - Simple API call (10-20 lines):
     ```typescript
     // Example: Send welcome email via Loops API
     const sendWelcomeEmail = async (email: string) => {
       try {
         await fetch('https://app.loops.so/api/v1/transactional', {
           method: 'POST',
           headers: {
             'Authorization': `Bearer ${LOOPS_API_KEY}`,
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             transactionalId: '[WELCOME_EMAIL_TEMPLATE_ID]',
             email: email,
           }),
         });
       } catch (error) {
         // Log error but don't break signup flow
         console.error('Failed to send welcome email:', error);
       }
     };
     ```

5. **Testing:**
   - Sign up new user → Verify welcome email received via Loops
   - Check Loops dashboard → Transactional → Metrics → Verify email sent/delivered
   - Verify email design matches Loops template
   - Verify signup flow still works if Loops API fails (non-blocking)

**Deliverable:** Loops API integrated, welcome emails sent via Loops API

**Test:**
- Sign up new user → Verify welcome email received via Loops
- Check Loops dashboard → Transactional → Metrics → Verify email sent/delivered
- Verify email design matches Loops template
- Verify signup flow completes even if Loops API fails (non-blocking)
- Verify magic link emails still work via Resend (unchanged)

**Setup Steps Summary:**
1. Loops Dashboard: Create welcome email template
2. Get Loops API key and store in Supabase secrets
3. Add Loops API call in app code (after signup) OR create Edge Function
4. Test: Sign up new user and verify welcome email received

**Reference Documentation:**
- [Loops API Documentation](https://loops.so/docs/api)
- [Loops Transactional Emails](https://loops.so/docs/transactional-emails)
- [Email Provider Comparison: Resend vs Loops](./EMAIL_PROVIDER_COMPARISON_RESEND_VS_LOOPS.md)

**Email Provider Separation (CORRECTED):**
- **Resend (Transactional - CRITICAL):**
  - ✅ Magic link authentication (via Supabase SMTP) - MUST be reliable
  - ✅ Daily todo digest emails (via Edge Functions API) - Core product feature
  - **Why:** These are product-critical, time-sensitive emails. Resend is built for transactional emails.
- **Loops (Lifecycle/Marketing - NON-CRITICAL):**
  - ✅ Welcome emails (via Loops API) - Nice-to-have, not critical
  - ✅ Day 3/Day 5 re-engagement emails (via Loops API) - Marketing/engagement
  - **Why:** These are marketing/engagement emails. If Loops has issues, core product still works.

**Benefits of This Split:**
- ✅ Deliverability protection: If Loops fails, magic links and daily emails still work
- ✅ Cost optimization: Both free tiers sufficient (Resend: 3K/month, Loops: 2K contacts)
- ✅ Tool specialization: Resend for transactional, Loops for marketing automation
- ✅ Non-blocking: Welcome emails don't break signup flow if Loops API fails

**Troubleshooting:**
- **Welcome emails not sending:** Check Loops API key is valid, verify template ID is correct, check Loops dashboard for errors
- **Signup flow broken:** Ensure Loops API call is non-blocking (try-catch, doesn't throw errors)
- **Magic link emails affected:** Magic links use Resend SMTP (separate), should not be affected
- **Daily emails affected:** Daily emails use Resend API (separate), should not be affected
- **Rollback:** Remove Loops API call from code (welcome emails stop, but signup still works)

---

### Story 8.5: Loops Re-Engagement Email Sequences (Optional - Post-Launch)
**Status:** 🔄 **OPTIONAL** (Post-Launch Enhancement)  
**Estimated Time:** 2-3 hours (if implemented)  
**Dependencies:** Story 8.4 complete (Loops API integration for welcome emails)

**Decision:** Optional post-launch enhancement. Can be implemented using Loops' built-in automation features or simple Edge Functions (no database triggers needed).

**As a** product manager  
**I want** automated re-engagement email sequences for inactive users  
**So that** I can bring back users who haven't used the app in 3-5 days

**Acceptance Criteria (If Implemented):**

**Option A: Use Loops Built-in Automation (Recommended - Zero Code)**
1. Check Loops dashboard for "Email Sequences" or "Automation" features
2. Create email sequence triggered by user signup date or last activity:
   - Day 3: "No tasks" nudge email (if user has no tasks created)
   - Day 5: Inactivity re-engagement email (if user hasn't created task in 5 days)
3. Configure Loops to track user activity via Loops API events (sent from app when tasks are created)
4. Loops automatically sends emails based on sequence rules

**Option B: Simple Edge Function Approach (If Loops Automation Not Available)**
1. Loops email templates created:
   - "Day 3 No Tasks" template (re-engagement for users with no tasks)
   - "Day 5 Inactivity" template (re-engagement for inactive users)
2. Supabase Edge Function created: `send-loops-reengagement-emails`
   - Runs daily (via Supabase cron job or scheduled Edge Function)
   - Queries users who match criteria:
     - Day 3: Users who signed up 3 days ago with no tasks created
     - Day 5: Users who haven't created a task in 5 days
   - Calls Loops API to send appropriate re-engagement email
   - Uses Loops API: `POST https://app.loops.so/api/v1/transactional`
   - Tracks last email sent to prevent duplicates (store timestamp in user metadata or separate table)
3. Edge Function scheduled to run daily at 9 AM UTC
4. Re-engagement emails include:
   - Friendly reminder about TodoTomorrow
   - Link to open app
   - Contextual message based on user state (no tasks vs inactive)
5. Edge Function logs all actions for debugging

**Deliverable:** Re-engagement email sequences working (if implemented)

**Test (If Implemented):**
- Create test user, wait 3 days with no tasks → Verify Day 3 "no tasks" email sent
- Create test user, wait 5 days without activity → Verify Day 5 inactivity email sent
- Check Loops dashboard → Re-engagement emails tracked
- Verify no duplicate emails sent to same user
- Verify users who become active are removed from re-engagement queue

**Code Structure (If Using Option B):**
- `supabase/functions/send-loops-reengagement-emails/index.ts` - Edge Function for scheduled emails
- Loops dashboard: Re-engagement email templates
- Supabase cron job: Daily execution at 9 AM UTC
- Optional: Add `last_reengagement_email_sent_at` field to users table (or use user metadata)

**Note:** This story is optional and can be deferred until we have users and can validate the need for re-engagement emails. The welcome email (Story 8.4) provides immediate value for new user onboarding.

---

### Story 8.6: PostHog Retention Tracking & Analytics Dashboard
**Estimated Time:** 2-3 hours  
**Dependencies:** Stories 8.2, 8.3 complete

**As a** product manager  
**I want** PostHog configured to track retention metrics  
**So that** I can measure Week 1 retention (7 days after signup) and 30-day retention to understand user engagement

**Acceptance Criteria:**
1. PostHog retention analysis configured with **PRIMARY FOCUS on Week 1 retention**:
   - **Week 1 retention cohort analysis** - Users who return 7 days after signup (PRIMARY METRIC)
   - **30-day retention cohort analysis** - Users who return 30 days after signup
   - Daily active users (DAU) tracking
   - Weekly active users (WAU) tracking
2. Custom PostHog dashboard created with key metrics:
   - **Week 1 retention rate** (prominently displayed)
   - **30-day retention rate**
   - Signups per day
   - Active users (DAU/WAU)
   - Task creation rate
   - Email send success rate
   - Crash rate (from Sentry integration - Story 8.1)
3. PostHog insights configured for:
   - `week1_retention` - **PRIMARY METRIC**: Users who return after 7 days (calculated from `user_signed_up` event)
   - `day30_retention` - Users who return after 30 days
   - `task_creation_rate` - Average tasks per user per day
   - `email_delivery_rate` - Percentage of emails successfully sent
4. Dashboard shared with team (if applicable)
5. Weekly retention report automated (PostHog scheduled reports) - **Focus on Week 1 retention in reports**

**Deliverable:** PostHog dashboard with retention metrics

**Test:**
- Check PostHog dashboard → All metrics visible and updating
- Verify retention cohorts → Week 1 retention calculated correctly
- Test scheduled reports → Weekly email received with metrics

**Configuration:**
- PostHog dashboard: Custom dashboard created
- PostHog insights: Retention and engagement insights configured
- PostHog scheduled reports: Weekly email report set up

---

## Compatibility Requirements

- ✅ Existing APIs remain unchanged (Sentry, PostHog, and Loops are additive)
- ✅ Database schema changes are minimal (optional indexes only, no breaking changes)
- ✅ UI changes are minimal (error boundary wrapper, no visible UI changes)
- ✅ Performance impact is minimal (Sentry and PostHog use batching, Loops is async)
- ✅ Magic link emails continue working (Supabase Auth unchanged)
- ✅ Daily task batch emails continue working (Resend API integration unchanged)
- ✅ Magic link authentication emails continue working (Resend SMTP integration unchanged)
- ✅ Existing error handling preserved (Sentry error boundary wraps, doesn't replace)

---

## Risk Mitigation

**Primary Risk:** Sentry, PostHog, or Loops integration breaks existing functionality (magic links, daily emails)

**Mitigation:**
- Sentry initialized with error handling - failures don't crash app
- PostHog initialized with error handling - failures don't crash app
- Loops API integration: Non-blocking API calls - failures don't break signup flow (welcome emails are nice-to-have, not critical)
- All integrations wrapped in feature flags (can disable via environment variables)
- Test thoroughly on staging before production deployment
- Monitor error logs after deployment

**Rollback Plan:**
- **Disable Sentry:** Remove initialization from `App.tsx`, remove error boundary
- **Disable PostHog:** Remove initialization from `App.tsx`
- **Disable Loops API:**
  - Remove Loops API call from app code (after signup handler)
  - OR remove Edge Function if using Edge Function approach
  - Remove `LOOPS_API_KEY` from Supabase secrets (optional)
  - No database migrations needed
  - Welcome emails stop, but signup flow continues working (non-critical feature)
- All changes are additive - removing them restores original functionality
- No database migrations required (Loops API is code-only, no schema changes)
- **Critical:** Magic links and daily emails continue working via Resend (unchanged)

**Testing Strategy:**
- Test Sentry crash reporting with test crash button (dev mode only) ✅
- Test PostHog event tracking with user actions ✅
- Test Loops API integration: Sign up new user, verify welcome email received via Loops 🔄 In Progress
- Test Loops email template rendering: Verify email design matches Loops template 🔄 In Progress
- Test non-blocking behavior: Verify signup completes even if Loops API fails ✅
- Verify existing functionality still works (magic links via Resend SMTP, daily emails via Resend API) ✅
- Test on iOS, Android, and web (PWA) ✅

---

## Definition of Done

- [x] Story 8.1: Sentry integrated, crash reporting verified ✅
- [x] Story 8.2: PostHog integrated, analytics tracking verified ✅
- [x] Story 8.3: All key events tracked in PostHog ✅
- [x] Story 8.4: Loops API integrated for lifecycle emails (welcome email) ✅ **COMPLETE** (2025-11-13)
- [ ] Story 8.5: Loops email sequences (optional - post-launch enhancement) 🔄 **IN PROGRESS**
- [x] Story 8.6: PostHog dashboard configured with retention metrics ✅
- [x] Existing functionality verified (magic links, daily emails still work) ✅
- [x] Integration points tested on iOS, Android, and web ✅
- [x] Environment variables configured in EAS secrets ✅
- [x] Documentation updated ✅
- [x] No regression in existing features ✅
- [x] Sentry dashboard accessible and showing crash reports ✅
- [x] PostHog dashboard accessible and showing data ✅
- [x] ~~Loops dashboard showing email sends and delivery rates~~ ❌ DEFERRED

---

## Technical Implementation Notes

### Sentry Setup

**Package:** `@sentry/react-native`  
**Initialization:** In `App.tsx`, before rendering app (must be first)  
**Error Boundary:** Wrap entire app with Sentry error boundary  
**Native Crashes:** Automatically captured for iOS and Android  
**Source Maps:** Configured for readable stack traces

**Environment Variables:**
- `EXPO_PUBLIC_SENTRY_DSN` - Sentry project DSN

**Expo Compatibility Note:**
- Verify `@sentry/expo` package availability for Expo SDK 54
- If not available, `@sentry/react-native` requires native modules (works with Expo dev client)
- Document chosen package and setup approach

**Code Example:**
```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableInExpoDevelopment: false, // Only in production
  tracesSampleRate: 1.0, // 100% for MVP, adjust later
  enableNativeCrashHandling: true,
});

// App.tsx
import * as Sentry from '@sentry/react-native';
import './src/lib/sentry'; // Initialize Sentry first

export default function App() {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {/* Existing app code */}
    </Sentry.ErrorBoundary>
  );
}
```

### PostHog Setup

**Package:** `posthog-react-native`  
**Initialization:** In `App.tsx`, after Sentry initialization  
**Autocapture:** Enable for automatic event tracking  
**User Identification:** Set on signup/login

**Environment Variables:**
- `EXPO_PUBLIC_POSTHOG_KEY` - PostHog project API key
- `EXPO_PUBLIC_POSTHOG_HOST` - PostHog host (usually `https://us.i.posthog.com` or `https://eu.i.posthog.com`)

**Code Example:**
```typescript
// src/lib/posthog.ts
import PostHog from 'posthog-react-native';

export const posthog = new PostHog(process.env.EXPO_PUBLIC_POSTHOG_KEY!, {
  host: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  autocapture: true,
});

// App.tsx
import { PostHogProvider } from 'posthog-react-native';
import { posthog } from './src/lib/posthog';

export default function App() {
  return (
    <PostHogProvider client={posthog}>
      {/* Existing app code */}
    </PostHogProvider>
  );
}
```

### Loops Integration 🔄 **REVISED APPROACH** (2025-01-28)

**Previous Approach:** Custom solution with database triggers, Edge Functions, pg_net - **ROLLED BACK** (2025-11-12) due to excessive complexity.

**New Approach:** Simple Loops API integration - send lifecycle/marketing emails directly from app code or Edge Functions (10-20 lines of code).

**What's Being Implemented:**
- Loops API integration for lifecycle emails (welcome, re-engagement)
- Welcome email sent immediately after signup (non-blocking)
- Re-engagement emails sent via Loops API (Day 3, Day 5 sequences - Story 8.5)
- **NOT for auth emails** - Resend handles transactional emails (magic links, daily digests)

**Email Provider Strategy:**
- **Resend (Transactional - CRITICAL):**
  - Magic link authentication (via Supabase SMTP)
  - Daily todo digest emails (via Edge Functions API)
- **Loops (Lifecycle/Marketing - NON-CRITICAL):**
  - Welcome emails (via Loops API)
  - Re-engagement emails (via Loops API)

**Setup Process:**
1. Loops Dashboard: Create email templates (welcome, re-engagement)
2. Get Loops API key, store in Supabase secrets
3. Add Loops API call in app code (after signup) OR Edge Function
4. Test: Sign up user, verify welcome email received

**Reference Documentation:**
- [Loops API Documentation](https://loops.so/docs/api)
- [Loops Transactional Emails](https://loops.so/docs/transactional-emails)

**Benefits:**
- Simple API integration (10-20 lines of code)
- No database triggers or complex infrastructure
- Non-blocking (welcome emails don't break signup if Loops fails)
- Deliverability protection (if Loops fails, core product still works)
- Cost optimization (both providers stay in free tiers)

**Code Example:**
```typescript
// Send welcome email via Loops API (non-blocking)
const sendWelcomeEmail = async (email: string) => {
  try {
    await fetch('https://app.loops.so/api/v1/transactional', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionalId: '[WELCOME_EMAIL_TEMPLATE_ID]',
        email: email,
      }),
    });
  } catch (error) {
    // Log but don't break signup flow
    console.error('Failed to send welcome email:', error);
  }
};

// Call after successful signup
await sendWelcomeEmail(userEmail);
```

**PostHog Edge Function Integration:**
```typescript
// supabase/functions/send-daily-emails/index.ts (add PostHog event tracking)
const posthogApiKey = Deno.env.get('POSTHOG_API_KEY');
const posthogHost = Deno.env.get('POSTHOG_HOST') || 'https://us.i.posthog.com';

// Track email_sent event
await fetch(`${posthogHost}/capture/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    api_key: posthogApiKey,
    event: 'email_sent',
    distinct_id: userId,
    properties: {
      user_id: userId,
      task_count: tasks.length,
      email_type: 'daily_batch',
    },
  }),
});
```

### Key Events to Track

**PostHog Events:**
- `task_added` - Properties: `task_id`, `user_id`, `has_due_date`, `priority`
- `task_completed` - Properties: `task_id`, `user_id`, `task_age_days`
- `task_deleted` - Properties: `task_id`, `user_id`
- `email_sent` - Properties: `user_id`, `task_count`, `email_type` (daily_batch)
- `user_signed_up` - Properties: `user_id`, `email`, `cohort`
- `user_logged_in` - Properties: `user_id`
- `paywall_viewed` - Properties: `user_id`, `trial_days_remaining`
- `purchase_completed` - Properties: `user_id`, `price`, `cohort`

**Loops Email Sequences:** 🔄 **IN PROGRESS** (Post-Launch Enhancement)
- Welcome email: Via Loops API (sent immediately after signup) - Story 8.4
- Day 3 "no tasks" nudge: Optional - can use Loops built-in automation or simple Edge Function - Story 8.5
- Day 5 inactivity email: Optional - can use Loops built-in automation or simple Edge Function - Story 8.5
- **Current Focus:** Loops API integration for welcome emails (Story 8.4)
- **Future:** Re-engagement sequences can be added post-launch using Loops API or automation features (Story 8.5)

---

## Success Metrics

**Post-Launch Analytics Goals:**
- Track Week 1 retention: Target 20%+ (from PRD Goal 1.1) ✅ Tracking via PostHog
- Monitor crash rate via Sentry: Target < 1% of sessions ✅ Tracking via Sentry
- Track task creation rate: Average tasks per user per day ✅ Tracking via PostHog
- Monitor email delivery: 95%+ delivery rate (Resend only) ✅ Daily emails via Resend
- Crash resolution time: Fix critical crashes within 24 hours ✅ Sentry alerts configured

**Loops Email Goals:** 🔄 **IN PROGRESS**
- Welcome email delivery: Target 95%+ delivery rate (non-critical, but good to track)
- Welcome email open rate: Target 40%+ (track via Loops dashboard)
- Email visibility: Full tracking of lifecycle emails via Loops dashboard
- Template rendering success: 100% (all lifecycle emails render correctly)
- **Non-blocking behavior:** Signup flow completes even if Loops API fails (welcome emails are nice-to-have)
- **Future (Optional):** Email sequence metrics when sequences are implemented:
  - Day 3 email engagement: Target 20%+ click-through
  - Day 5 re-engagement: Target 10%+ return to app

---

## Post-Launch Priority

This epic is intentionally planned for **post-launch** because:
1. Analytics are most valuable with real user data
2. Email sequences need user base to test effectiveness
3. Focus on launch first (Epic 7), then optimize engagement (Epic 8)
4. Both services have free tiers sufficient for MVP scale
5. Can be implemented incrementally (PostHog first, then Loops)

**Recommended Timeline:**
- Week 1 post-launch: Implement Sentry (Story 8.1) - **Priority: High** ✅ Complete
- Week 1 post-launch: Implement PostHog (Stories 8.2, 8.3, 8.6) - **Priority: High** ✅ Complete
- Week 2 post-launch: Implement Loops API integration for welcome emails (Story 8.4) - **Priority: Medium** ✅ Complete (2025-11-13)
- Week 3+ post-launch: Optional Loops re-engagement sequences (Story 8.5) - **Priority: Low** 🔄 In Progress (implementation complete, testing pending)
- Ongoing: Monitor Sentry for crashes, PostHog for analytics, Loops for lifecycle email metrics

---

---

## Environment Variables Summary

All environment variables must be configured in EAS secrets before deployment:

**App-Level Variables (React Native):**
- `EXPO_PUBLIC_SENTRY_DSN` - Sentry project DSN (Story 8.1)
- `EXPO_PUBLIC_POSTHOG_KEY` - PostHog project API key (Story 8.2)
- `EXPO_PUBLIC_POSTHOG_HOST` - PostHog host URL (Story 8.2, default: `https://us.i.posthog.com`)

**Edge Function Variables (Supabase):**
- `LOOPS_API_KEY` - Loops API key (Story 8.4 - for Loops API calls, Story 8.5 optional if using Edge Functions)
- `POSTHOG_API_KEY` - PostHog API key for Edge Functions (Story 8.3, optional if using HTTP API)
- `POSTHOG_HOST` - PostHog host URL for Edge Functions (Story 8.3, optional)

**Configuration Steps:**
1. Create accounts: Sentry ✅, PostHog ✅, Loops ✅
2. Obtain API keys and DSNs: Sentry ✅, PostHog ✅, Loops ✅
3. Set EAS secrets: `eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value [DSN]` ✅
4. Set EAS secrets: `eas secret:create --scope project --name EXPO_PUBLIC_LOOPS_API_KEY --value [key]` ✅ (Story 8.4)
5. Set Supabase secrets: `supabase secrets set LOOPS_API_KEY=[key]` ✅ (Story 8.5)
6. Configure Resend SMTP in Supabase Dashboard (Settings → Auth → SMTP) - for magic link emails ✅
7. Verify secrets are accessible in production builds ✅

---

**Epic Created:** 2025-01-27  
**Epic Updated:** 2025-01-28 (Story 8.6 complete - PostHog retention tracking & dashboard configured)  
**Epic Updated:** 2025-01-28 (Epic 8 revised - Loops integration approach changed to use Loops API)  
**Epic Updated:** 2025-11-13 (Story 8.4 complete - Loops welcome email integration)  
**Epic Owner:** Product Manager (John)  
**Status:** 🔄 **IN PROGRESS** (Post-Launch)
- ✅ Sentry Integration: Complete
- ✅ PostHog Integration: Complete (including retention tracking & dashboard)
- ✅ Loops Welcome Email: Complete (Story 8.4 - 2025-11-13)
- 🔄 Loops Re-Engagement: In Progress (Story 8.5 - implementation complete, testing pending)

