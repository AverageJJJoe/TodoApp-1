# Epic 8: Sentry Crash Logging, PostHog Analytics & Loops Email Sequences - Post-Launch Enhancement

**Epic Goal:** Integrate Sentry for crash logging, PostHog for product analytics, and Loops for automated email sequences to improve user engagement, retention, and crash debugging post-launch.

**Status:** 📋 **PLANNED** (Post-Launch)

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
- Supabase Auth for magic link authentication emails
- Resend API for daily task batch emails (via `send-daily-emails` Edge Function)
- Email logs table (`email_logs`) for tracking delivery status
- No automated lifecycle emails (welcome, re-engagement, etc.)

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

3. **Loops Integration:**
   - Automated email sequences for user lifecycle
   - Post-signup welcome email
   - Day 2 engagement nudge
   - 7-day re-engagement campaign
   - Webhook/OAuth integration with Supabase for triggers
   - Free tier for MVP
   - Keeps Supabase/Resend for magic links and daily batches

**How It Integrates:**

- **Sentry:** Initialized in `App.tsx`, wraps app with error boundary, automatically captures crashes and errors
- **PostHog:** Initialized in `App.tsx`, tracks events throughout app lifecycle, separate from crash reporting
- **Loops:** Edge Functions listen for database events (user signup, inactivity), trigger Loops API calls
- **Non-Breaking:** All services are additive - existing functionality remains unchanged
- **Configuration:** Environment variables stored in EAS secrets, loaded via `app.config.js`

**Success Criteria:**

- Sentry automatically captures all crashes with stack traces and source maps
- PostHog tracks all key user events (signup, task creation, completion, email sends)
- Crash reports appear in Sentry dashboard within minutes of occurrence
- Loops sends welcome email within 5 minutes of signup
- Loops sends Day 2 nudge email exactly 2 days after signup
- Loops sends 7-day re-engagement email for inactive users
- All integrations work on iOS, Android, and web (PWA)
- Zero impact on existing functionality (magic links, daily emails continue working)

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

### Story 8.4: Loops Integration & Welcome Email Sequence
**Estimated Time:** 3-4 hours  
**Dependencies:** Story 8.1 complete (Loops is independent of PostHog, only needs app to be launched)

**As a** product manager  
**I want** Loops integrated with automated welcome email sequence  
**So that** new users receive onboarding emails to improve engagement

**Acceptance Criteria:**
1. Loops account created, API key obtained
2. Loops email templates created:
   - Welcome email (sent immediately after signup)
   - Day 2 nudge email (sent 2 days after signup)
3. Supabase Edge Function created: `trigger-loops-welcome`
   - **Recommended approach:** Use Supabase database trigger (simpler, more reliable)
   - Database trigger fires on `users` table INSERT
   - Edge Function called via webhook from database trigger
   - Calls Loops API to send welcome email
   - Handles errors gracefully (logs, doesn't break signup flow)
4. Loops API key stored in Supabase secrets (`LOOPS_API_KEY`) for Edge Function access
5. Welcome email sent within 5 minutes of signup
6. Day 2 email scheduled automatically via Loops (using Loops' built-in scheduling)
7. Email templates match TodoTomorrow branding (simple, clean, email-native)

**Deliverable:** Loops integrated, welcome sequence working

**Test:**
- Sign up new user → Verify welcome email received within 5 minutes
- Wait 2 days → Verify Day 2 nudge email received
- Check Loops dashboard → Emails show as sent/delivered
- Verify existing magic link emails still work (non-breaking)

**Code Structure:**
- `supabase/functions/trigger-loops-welcome/index.ts` - Edge Function for welcome email
- `supabase/migrations/XXX_add_loops_webhook.sql` - Database trigger to call Edge Function on user signup
- Loops dashboard: Email templates configured

**Database Trigger Approach (Recommended):**
```sql
-- Create database trigger that calls Edge Function webhook on user signup
CREATE OR REPLACE FUNCTION trigger_loops_welcome()
RETURNS TRIGGER AS $$
BEGIN
  -- Call Edge Function webhook (async, non-blocking)
  PERFORM net.http_post(
    url := 'https://[PROJECT_REF].supabase.co/functions/v1/trigger-loops-welcome',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer [ANON_KEY]'),
    body := jsonb_build_object('user_id', NEW.id, 'email', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_signup_trigger_loops
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_loops_welcome();
```

---

### Story 8.5: Loops Re-Engagement Sequence & Inactivity Detection
**Estimated Time:** 4-5 hours  
**Dependencies:** Story 8.4 complete

**As a** product manager  
**I want** Loops re-engagement emails for inactive users  
**So that** I can bring back users who haven't used the app in 7 days

**Acceptance Criteria:**
1. Loops email template created: 7-day re-engagement email
2. Supabase Edge Function created: `check-inactive-users`
   - Runs daily (via pg_cron or scheduled Edge Function)
   - Queries users who haven't created a task in 7 days
   - Calls Loops API to send re-engagement email
   - Tracks last email sent to prevent duplicates:
     - **Recommended approach:** Add `last_reengagement_email_sent_at` timestamp field to `users` table
     - Alternative: Use Loops' built-in deduplication if available
     - Check timestamp before sending to prevent duplicate emails
3. Edge Function scheduled to run daily at 9 AM in user's configured timezone:
   - Use `users.timezone` field (IANA timezone string, e.g., "America/New_York")
   - For MVP: Run at 9 AM UTC, then filter users whose timezone matches current UTC+offset
   - Future enhancement: Run at 9 AM in each user's specific timezone
4. Re-engagement email includes:
   - Friendly reminder about TodoTomorrow
   - Link to open app
   - Stats about their usage (if available)
5. Users who become active again are removed from re-engagement queue
6. Edge Function logs all actions for debugging

**Deliverable:** Re-engagement sequence working, inactive users receive emails

**Test:**
- Create test user, wait 7 days without activity → Verify re-engagement email sent
- Create task after receiving email → Verify user removed from queue
- Check Loops dashboard → Re-engagement emails tracked
- Verify no duplicate emails sent to same user

**Code Structure:**
- `supabase/functions/check-inactive-users/index.ts` - Edge Function for inactivity detection
- `supabase/migrations/XXX_add_reengagement_tracking.sql` - Add `last_reengagement_email_sent_at` field to `users` table
- Loops dashboard: Re-engagement email template

**Database Schema Addition:**
```sql
-- Add field to track last re-engagement email sent
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_reengagement_email_sent_at TIMESTAMP DEFAULT NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_last_reengagement_email 
ON users(last_reengagement_email_sent_at);
```

**Note:** Inactivity detection uses existing `tasks.created_at` timestamp - query tasks table to find users who haven't created a task in 7 days. The `last_reengagement_email_sent_at` field prevents sending duplicate emails.

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
- ✅ Daily task batch emails continue working (Resend integration unchanged)
- ✅ Existing error handling preserved (Sentry error boundary wraps, doesn't replace)

---

## Risk Mitigation

**Primary Risk:** Sentry, PostHog, or Loops integration breaks existing functionality (magic links, daily emails)

**Mitigation:**
- Sentry initialized with error handling - failures don't crash app
- PostHog initialized with error handling - failures don't crash app
- Loops Edge Functions have try-catch blocks - failures logged but don't break signup flow
- All integrations wrapped in feature flags (can disable via environment variables)
- Test thoroughly on staging before production deployment
- Monitor error logs after deployment

**Rollback Plan:**
- Disable Sentry: Remove initialization from `App.tsx`, remove error boundary
- Disable PostHog: Remove initialization from `App.tsx`
- Disable Loops: Comment out Edge Function calls, remove database triggers
- All changes are additive - removing them restores original functionality
- No database migrations required (optional indexes can be dropped if added)

**Testing Strategy:**
- Test Sentry crash reporting with test crash button (dev mode only)
- Test PostHog event tracking with user actions
- Test Loops welcome email with new test account
- Test re-engagement sequence with test user (wait 7 days or mock date)
- Verify existing functionality still works (magic links, daily emails)
- Test on iOS, Android, and web (PWA)

---

## Definition of Done

- [ ] Story 8.1: Sentry integrated, crash reporting verified
- [ ] Story 8.2: PostHog integrated, analytics tracking verified
- [ ] Story 8.3: All key events tracked in PostHog
- [ ] Story 8.4: Loops welcome sequence working (welcome + Day 2 emails)
- [ ] Story 8.5: Loops re-engagement sequence working (7-day inactivity emails)
- [ ] Story 8.6: PostHog dashboard configured with retention metrics
- [ ] Existing functionality verified (magic links, daily emails still work)
- [ ] Integration points tested on iOS, Android, and web
- [ ] Environment variables configured in EAS secrets
- [ ] Documentation updated (README or integration docs)
- [ ] No regression in existing features
- [ ] Sentry dashboard accessible and showing crash reports
- [ ] PostHog dashboard accessible and showing data
- [ ] Loops dashboard showing email sends and delivery rates

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

### Loops Integration

**API:** Loops REST API  
**Authentication:** API key in Authorization header  
**Triggers:** Supabase Edge Functions (webhooks or database triggers)  
**Scheduling:** Loops handles Day 2 email scheduling; Edge Function handles 7-day re-engagement

**Environment Variables:**
- `LOOPS_API_KEY` - Loops API key (stored in EAS secrets, passed to Edge Functions)

**Code Example:**
```typescript
// supabase/functions/trigger-loops-welcome/index.ts
const loopsApiKey = Deno.env.get('LOOPS_API_KEY');
const response = await fetch('https://app.loops.so/api/v1/events/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${loopsApiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: userEmail,
    transactionalId: 'welcome-email',
  }),
});
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

**Loops Email Sequences:**
- Welcome email: Sent immediately after signup
- Day 2 nudge: Sent 2 days after signup (scheduled in Loops)
- 7-day re-engagement: Sent when user inactive for 7 days (triggered by Edge Function)

---

## Success Metrics

**Post-Launch Analytics Goals:**
- Track Week 1 retention: Target 20%+ (from PRD Goal 1.1)
- Monitor crash rate via Sentry: Target < 1% of sessions
- Track task creation rate: Average tasks per user per day
- Monitor email delivery: 95%+ delivery rate (Resend + Loops)
- Crash resolution time: Fix critical crashes within 24 hours

**Loops Email Goals:**
- Welcome email open rate: Target 40%+
- Day 2 email engagement: Target 20%+ click-through
- 7-day re-engagement: Target 10%+ return to app

---

## Post-Launch Priority

This epic is intentionally planned for **post-launch** because:
1. Analytics are most valuable with real user data
2. Email sequences need user base to test effectiveness
3. Focus on launch first (Epic 7), then optimize engagement (Epic 8)
4. Both services have free tiers sufficient for MVP scale
5. Can be implemented incrementally (PostHog first, then Loops)

**Recommended Timeline:**
- Week 1 post-launch: Implement Sentry (Story 8.1) - **Priority: High** (catch crashes immediately)
- Week 1 post-launch: Implement PostHog (Stories 8.2, 8.3, 8.6) - **Priority: High** (start tracking user behavior)
- Week 2 post-launch: Implement Loops welcome sequence (Story 8.4)
- Week 3 post-launch: Implement Loops re-engagement (Story 8.5)
- Ongoing: Monitor Sentry for crashes, PostHog for analytics, optimize email sequences based on data

---

---

## Environment Variables Summary

All environment variables must be configured in EAS secrets before deployment:

**App-Level Variables (React Native):**
- `EXPO_PUBLIC_SENTRY_DSN` - Sentry project DSN (Story 8.1)
- `EXPO_PUBLIC_POSTHOG_KEY` - PostHog project API key (Story 8.2)
- `EXPO_PUBLIC_POSTHOG_HOST` - PostHog host URL (Story 8.2, default: `https://us.i.posthog.com`)

**Edge Function Variables (Supabase):**
- `LOOPS_API_KEY` - Loops API key (Stories 8.4, 8.5) - **Stored in Supabase secrets, not EAS**
- `POSTHOG_API_KEY` - PostHog API key for Edge Functions (Story 8.3, optional if using HTTP API)
- `POSTHOG_HOST` - PostHog host URL for Edge Functions (Story 8.3, optional)

**Configuration Steps:**
1. Create accounts: Sentry, PostHog, Loops
2. Obtain API keys and DSNs
3. Set EAS secrets: `eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value [DSN]`
4. Set Supabase secrets: `supabase secrets set LOOPS_API_KEY=[key]`
5. Verify secrets are accessible in production builds

---

**Epic Created:** 2025-01-27  
**Epic Updated:** 2025-01-27 (PO validation fixes applied)  
**Epic Owner:** Product Manager (John)  
**Status:** 📋 PLANNED (Post-Launch)

