# 7. Epic Details - RESTRUCTURED

## Epic 1: Foundation & Authentication (Week 1, Days 1-3)

**Epic Goal:** Get basic project running with authentication working. Users can sign up and log in.

**Status:** ✅ **COMPLETE** (All core stories done, Story 1.2.5 testing framework setup pending)

**Completion Summary:**
- ✅ Story 1.1: Project Setup & Configuration - **Done**
- ✅ Story 1.2: Supabase Client Configuration - **Done**
- ⏸️ Story 1.2.5: Testing Framework Setup - **Not Started** (Optional, tests can be added incrementally)
- ✅ Story 1.3: Database Schema - Users Table - **Done**
- ✅ Story 1.4: Magic Link Authentication Flow - **Completed** (with documented limitations addressed by Story 1.6)
- ✅ Story 1.5: Session Management & Protected Routes - **Done**
- ✅ Story 1.6: Universal Links / App Links Authentication - **Done** (Android working, iOS Team ID pending but non-blocking)

**Epic Achievement:** ✅ All core authentication functionality is working. Users can sign up, log in via magic links, stay logged in across app restarts, and use Universal Links/App Links for reliable authentication flow.

---

### Story 1.1: Project Setup & Configuration
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

### Story 1.2: Supabase Client Configuration
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

### Story 1.2.5: Testing Framework Setup
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

### Story 1.3: Database Schema - Users Table
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

### Story 1.4: Magic Link Authentication Flow
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

### Story 1.5: Session Management & Protected Routes
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

## Epic 2: Core Task Management (Week 1, Days 4-5 + Week 2, Days 1-2)

**Epic Goal:** Users can create, view, edit, and delete tasks. All data saves to Supabase.

**Status:** ✅ **COMPLETE** (All stories done)

**Completion Summary:**
- ✅ Story 2.1: Tasks Table & Basic UI - **Done**
- ✅ Story 2.2: Create Task - Local State Only - **Done**
- ✅ Story 2.3: Save Task to Supabase - **Done**
- ✅ Story 2.4: Load Tasks on App Open - **Done**
- ✅ Story 2.5: Delete Task - **Done**
- ✅ Story 2.6: Edit Task - **Done**

**Epic Achievement:** ✅ Full CRUD functionality for tasks is working. Users can create tasks with a bottom sheet modal, tasks are saved to Supabase with optimistic updates, tasks load on app open, users can delete tasks via swipe gesture, and users can edit task text by tapping on tasks. All operations include proper error handling, rollback mechanisms, and RLS security enforcement.

---

### Story 2.1: Tasks Table & Basic UI
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

### Story 2.2: Create Task - Local State Only
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

### Story 2.3: Save Task to Supabase
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

### Story 2.4: Load Tasks on App Open
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

### Story 2.5: Delete Task
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

### Story 2.6: Edit Task
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

## Epic 3: Email Delivery System (Week 2, Days 3-5)

**Epic Goal:** Automated daily emails with task list sent at user's chosen time.

**Status:** ✅ **COMPLETE** (Core functionality complete - Story 3.4 optional for testing)

**Completion Summary:**
- ✅ Story 3.1: User Preferences - Delivery Time (Done)
- ✅ Story 3.2: Email Template - HTML Design (Done)
- ✅ Story 3.3: Resend Email Integration (Done)
- ⚠️ Story 3.4: Manual "Send Now" Button (Draft - Optional testing utility, not required for production)
- ✅ Story 3.5: Automated Cron Job (Done)

**Note:** Story 3.4 is a manual testing utility. Core epic goal (automated email delivery) achieved via Story 3.5.

---

### Story 3.1: User Preferences - Delivery Time ✅ DONE
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1 complete
**Status:** Done

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

### Story 3.2: Email Template - HTML Design ✅ DONE
**Estimated Time:** 2 hours  
**Dependencies:** Story 3.1
**Status:** Done

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

### Story 3.3: Resend Email Integration ✅ DONE
**Estimated Time:** 3 hours  
**Dependencies:** Story 3.2
**Status:** Done

**As a** developer  
**I want to** integrate Resend for email sending  
**So that** emails can be delivered reliably with high inbox rates and zero cost for MVP

**Acceptance Criteria:**
1. Resend account created (free tier: 100 emails/day unlimited total)
2. Sender email verified: `hello@todotomorrow.com` (or temp email for MVP)
3. Supabase Edge Function created: `send-email`
4. Function accepts: `{ to, subject, html }`
5. Function calls Resend API with email content
6. Test: Manually invoke function → Receive test email

**Deliverable:** Working Edge Function that sends email via Resend

**Test:** Call function with test data → Email received in inbox (high deliverability)

---

### Story 3.4: Manual "Send Now" Button (Testing) ⚠️ OPTIONAL
**Estimated Time:** 2 hours  
**Dependencies:** Story 3.3
**Status:** Draft (Optional - Manual testing utility, not required for production)

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

### Story 3.5: Automated Cron Job ✅ DONE
**Estimated Time:** 3 hours  
**Dependencies:** Story 3.4 (Optional - Skipped, functionality incorporated)
**Status:** Done

**As a** user  
**I want to** automatically receive my task list every morning  
**So that** I don't have to manually send it

**Acceptance Criteria:**
1. Supabase cron job created (runs hourly via pg_cron at minute 0 of each hour)
2. Query users: WHERE delivery_time converts to current UTC hour in their timezone AND (is_paid = true OR grandfather_status = true OR trial is valid) AND last_email_sent_at < 20 hours ago
   - **Note:** During free launch (Months 1-3), all users have `grandfather_status = true`, so all receive emails. See `docs/monetization-decision-framework.md`.
   - **Note:** Simplified summary above; see architecture docs (`docs/architecture/email-delivery-system.md`) for full timezone-aware SQL implementation details
3. For each user: Query tasks based on workflow_mode (fresh_start: created_at > last_email_sent_at AND status = 'open', carry_over: status = 'open') → Send email
4. Send email even if user has no tasks (empty state email: "No new tasks for today. Enjoy your morning coffee! ☕")
5. Update: `last_email_sent_at = NOW()` after successful send
6. Log email send in email_logs table
7. Test: Set delivery_time to current time + 1 hour → Wait for next hour boundary → Receive email

**Deliverable:** Automated email delivery

**Test:** Set delivery time to current time + 1 hour (e.g., if it's 2:30pm, set to 3:00pm) → Wait for cron job at next hour boundary → Email arrives

---

## Epic 4: Monetization & Payments (Week 2, Day 5 + Week 3)

**Epic Goal:** Cohort assignment implemented (deferred: trials, paywalls, and payment processing only after traction thresholds met).

**Status:** ✅ **PARTIAL** (Story 4.1 complete - Stories 4.2-4.8 deferred until Month 4+)

**Strategy Note:** Stories 4.2-4.8 (trials, paywalls, payments) are **DEFERRED** until Month 4+ when traction thresholds are met. During free launch period (Months 1-3), focus on product quality and retention validation. See `docs/monetization-decision-framework.md` for activation criteria.

**Completion Status:**
- ✅ **Story 4.1:** Cohort Assignment on Signup - **COMPLETE** (2025-02-11)
- ⏸️ **Stories 4.2-4.8:** **DEFERRED** until traction thresholds met (Month 4+)

**Sequencing Note:** Epic 4 uses **parallel execution strategy** - backend stories (4.1-4.3, 4.7) can start immediately, UI stories (4.4-4.6, 4.8) wait for Epic 6, Story 6.4 (design specs). **However, only Story 4.1 was active during free launch period.**

---

### Story 4.1: Cohort Assignment on Signup
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1 complete
**Status:** ✅ **COMPLETE** (Simplified for Free Until Traction strategy - 2025-02-11)

**As a** system  
**I want to** assign users to cohorts based on signup date  
**So that** monetization strategy can be implemented (when traction thresholds are met)

**Acceptance Criteria:**
1. Verify columns exist in users table: `cohort`, `grandfather_status`, `trial_started_at`, `trial_expires_at` (columns already exist from Story 1.3)
2. After user signs up, run cohort assignment logic:
   - **Current Strategy (Free Until Traction):** All users assigned: `cohort = 'free_launch'`, `grandfather_status = true`, `trial_expires_at = null`, `trial_started_at = null`
   - Original tiered monetization logic preserved in codebase comments for future re-enablement when traction thresholds are met (see `docs/monetization-decision-framework.md`)
3. Cohort assignment runs automatically when user record is created (integrated with existing user creation points)
4. Verify cohort saved correctly in database after signup

**Deliverable:** Cohort assignment logic working (all users free forever during launch)

**Test:** Sign up new user → Check database → `cohort = 'free_launch'`, `grandfather_status = true`, `trial_expires_at = null`

---

### Story 4.2: Trial Days Remaining Display
**Estimated Time:** 2 hours  
**Dependencies:** Story 4.1
**Status:** ⏸️ **DEFERRED** - Not needed until traction thresholds met (Month 4+). See `docs/monetization-decision-framework.md`.

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

### Story 4.3: Trial Expiration Check & Gate
**Estimated Time:** 2 hours  
**Dependencies:** Story 4.2
**Status:** ⏸️ **DEFERRED** - Not needed until traction thresholds met (Month 4+). See `docs/monetization-decision-framework.md`.

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

### Story 4.4: Task Limit Counter (Alternative Gate)
**Estimated Time:** 2 hours  
**Dependencies:** Story 4.3
**Status:** ⏸️ **DEFERRED** - Not needed until traction thresholds met (Month 4+). See `docs/monetization-decision-framework.md`.

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

### Story 4.5: Paywall UI & Messaging
**Estimated Time:** 3 hours  
**Dependencies:** Story 4.4
**Status:** ⏸️ **DEFERRED** - Not needed until traction thresholds met (Month 4+). See `docs/monetization-decision-framework.md`.

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

### Story 4.6: Stripe Payment Integration (Web/PWA)
**Estimated Time:** 4 hours  
**Dependencies:** Story 4.5
**Status:** ⏸️ **DEFERRED** - Not needed until traction thresholds met (Month 4+). See `docs/monetization-decision-framework.md`.

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

### Story 4.7: Apple In-App Purchase (iOS)
**Estimated Time:** 4 hours  
**Dependencies:** Story 4.5
**Status:** ⏸️ **DEFERRED** - Not needed until traction thresholds met (Month 4+). See `docs/monetization-decision-framework.md`.

**As an** iOS user  
**I want to** pay via Apple IAP  
**So that** I can unlock premium using my Apple ID

**Acceptance Criteria:**
1. Apple Developer account created ($99/year)
2. IAP products created in App Store Connect:
   - `com.todotomorrow.premium_2_99` ($2.99)
   - `com.todotomorrow.premium_4_99` ($4.99)
3. `react-native-iap` library integrated
4. Tapping "Unlock Premium" triggers StoreKit purchase
5. Receipt validated via Supabase Edge Function
6. On success: Update `is_paid = true`

**Deliverable:** Apple IAP working in TestFlight

**Test:** Build to TestFlight → Purchase with sandbox account → Verify payment

---

### Story 4.8: Payment Status Sync & Verification
**Estimated Time:** 3 hours  
**Dependencies:** Stories 4.6, 4.7
**Status:** ⏸️ **DEFERRED** - Not needed until traction thresholds met (Month 4+). See `docs/monetization-decision-framework.md`.

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

## Epic 5: Workflow Modes & Polish (Week 3-4)

**Epic Goal:** Fresh Start vs Carry Over modes, task completion, archive, final polish.

**Status:** ✅ **COMPLETE** (All stories done - 2025-11-04)

**Completion Summary:**
- ✅ Story 5.1: Workflow Mode Selection (Onboarding) - **Done**
- ✅ Story 5.2: Task Completion UI (Carry Over Mode) - **Done**
- ✅ Story 5.3: Archive View (Carry Over Mode) - **Done**
- ✅ Story 5.4: Email Delivery - Mode-Specific Logic - **Done** (2025-11-04)

**Epic Achievement:** ✅ Complete workflow mode implementation. Users can select Fresh Start or Carry Over modes during onboarding, switch modes in Settings, complete tasks in Carry Over mode with animations, view completed tasks in Archive, and receive mode-specific emails (Fresh Start archives tasks after email, Carry Over shows "(from yesterday)" indicators).

**Prerequisites:**
- ✅ Epic 1: Foundation & Authentication - COMPLETE
- ✅ Epic 2: Core Task Management - COMPLETE
- ✅ Epic 3: Email Delivery System - COMPLETE
- ✅ Epic 4: Story 4.1 (Cohort Assignment) - COMPLETE
- ✅ Epic 6: Design System Integration - COMPLETE (Story 6.3 provides onboarding design specs)

---

### Story 5.1: Workflow Mode Selection (Onboarding)
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1 complete, Story 6.3 (Onboarding Design) complete
**Status:** ✅ **DONE**

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

### Story 5.2: Task Completion UI (Carry Over Mode)
**Estimated Time:** 3 hours  
**Dependencies:** Story 5.1
**Status:** ✅ **DONE**

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

### Story 5.3: Archive View (Carry Over Mode)
**Estimated Time:** 2 hours  
**Dependencies:** Story 5.2
**Status:** ✅ **DONE**

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

### Story 5.4: Email Delivery - Mode-Specific Logic
**Estimated Time:** 3 hours  
**Dependencies:** Stories 5.1, 5.3, Epic 3 complete
**Status:** ✅ **DONE** (2025-11-04)

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

## Epic 6: Design System Integration & UI Polish (Week 2-4, Parallel Track)

**Epic Goal:** Integrate polished Lovable designs into the existing React Native app, transforming the functional MVP into a visually polished, delightful user experience that matches Apple-level design quality.

**Status:** ✅ **COMPLETE** (All stories done)

**Completion Summary:**
- ✅ Story 6.1: Design System Foundation + Update Existing Screens - **Done**
- ✅ Story 6.2: Apply Design to Settings Screen - **Done**
- ✅ Story 6.3: Onboarding & Workflow Screens Design - **Done**
- ✅ Story 6.4: Payment Modal & Archive Screen Design - **Done**

**Epic Achievement:** ✅ Complete design system integrated throughout the app. All screens (Auth, Main, Settings, Onboarding, Archive) now match the polished Lovable design specification with consistent design tokens, animations, and iOS-native styling. Design system foundation established for future Epic 4 and Epic 5 UI work.

**Sequencing Note:** Epic 6 uses **design-first approach** with parallel execution where safe. Stories 6.1-6.2 can start immediately. Stories 6.3-6.4 must complete before Epic 4/5 UI work begins. See `docs/development-sequencing-plan.md` for detailed execution plan.

**Design Source (AUTHORITATIVE DOCUMENTS):**
- **`docs/design-system-complete.md`** - **PRIMARY SOURCE OF TRUTH**
  - Complete design system extracted from Lovable implementation
  - All color values (HSL format) - Part 2
  - All spacing values (4pt grid system) - Part 2
  - All typography values (font sizes, line heights, weights) - Part 8
  - All shadow specifications - Part 10
  - Complete component patterns and examples - Part 12
  - Animation timings and sequences - Part 7
  - **THIS IS THE AUTHORITATIVE SOURCE for all design tokens**
- **`docs/cursor-implementation-guide.md`** - **REACT NATIVE TRANSLATION GUIDE**
  - Step-by-step translation from Lovable (web) to React Native
  - NativeWind configuration
  - Component translation patterns
  - Animation implementation with React Native Reanimated
- **Lovable Reference Implementation:** `lovable-reference/` directory (cloned from `https://github.com/AverageJJJoe/todo-morning-delight.git`)
  - Actual Lovable component files (`.tsx`, `.css`)
  - Source of truth for component structure and behavior
  - Visual reference for layout, spacing, and interactions
  - Key files: `src/components/EmailLogin.tsx`, `TodoApp.tsx`, `TaskItem.tsx`, `EmptyState.tsx`, `src/index.css`
- **Legacy Reference (DEPRECATED):** `docs/todomorning-app-lovable-prompt.md` - Use `design-system-complete.md` instead
- **Design Philosophy:** Apple minimalism + Things 3 polish with delightful micro-interactions

**Epic Context & Developer Guidance:**

This epic is **NEW** and addresses a critical gap: integrating professionally designed UI/UX from Lovable into our existing functional codebase. The current implementation (Epics 1-2) has working functionality but basic styling. Epic 6 brings the visual polish that matches the design specification.

**How This Epic Works:**
- **Parallel Track:** Epic 6 can run alongside Epics 3-5. Stories are designed to coordinate with ongoing work.
- **Design-First Approach:** All visual design decisions reference the Lovable repository and design spec document.
- **Incremental Integration:** Updates existing screens (Stories 6.1-6.2) and ensures new screens (Epics 3-5) use the design system from the start (Stories 6.3-6.4).

**For Developers Implementing Epic 6 - CRITICAL READING ORDER:**

1. **MANDATORY FIRST STEP:** Read `docs/design-system-complete.md` BEFORE starting ANY implementation
   - This is the authoritative source for ALL design tokens
   - Contains complete component examples, animations, and patterns
   - Every color, spacing, typography value must match exactly
   - Review Part 12 for complete copy-pasteable component examples

2. **IMPLEMENTATION GUIDE:** Follow `docs/cursor-implementation-guide.md`
   - React Native translation patterns from Lovable (web) to React Native
   - NativeWind configuration setup
   - Component translation examples
   - Animation implementation guide

3. **REFERENCE IMPLEMENTATION:** Use `lovable-reference/` directory
   - Actual Lovable component files (`.tsx`, `.css`)
   - Source of truth for component structure and behavior
   - Visual reference for layout, spacing, and interactions
   - Key files: `src/components/EmailLogin.tsx`, `TodoApp.tsx`, `TaskItem.tsx`, `EmptyState.tsx`
   - **Important:** The Lovable repository uses "TodoMorning" as the project name, but all implementation should use "TodoTomorrow" to match our project branding

4. **Implementation Strategy:**
   - **Story 6.1:** Extract design tokens → Create design system constants → Update existing screens
   - **Story 6.2:** Coordinate with Epic 3, Story 3.1 work → Apply iOS Settings style
   - **Story 6.3:** Ensure onboarding screens (Epic 5) use design system
   - **Story 6.4:** Apply design to payment (Epic 4) and archive screens (Epic 5)

5. **Key Design Principles to Follow:**
   - **Apple Minimalism:** Clean white space, subtle shadows, native feel
   - **Things 3 Polish:** Soft shadows, spring animations (300-600ms), satisfying interactions
   - **60fps Animations:** All animations must be smooth (use Framer Motion or React Native Reanimated)
   - **Haptic Feedback:** Use `expo-haptics` for tactile satisfaction on key interactions

6. **Coordination Points:**
   - Story 6.2 should coordinate with Epic 3, Story 3.1 (Settings screen) implementation
   - Stories 6.3-6.4 should be completed before implementing Epic 4 and Epic 5 screens to ensure design consistency

**Technology Notes:**
- React Native implementation of web-based Lovable designs
- Use NativeWind (Tailwind) for styling (already in project)
- Consider `react-native-reanimated` or `framer-motion` for animations (if needed, add dependency)
- Platform-specific adaptations: iOS haptics, Android Material patterns where appropriate

---

### Story 6.1: Design System Foundation + Update Existing Screens
**Estimated Time:** 5 hours  
**Dependencies:** Epic 1 & Epic 2 complete

**As a** developer  
**I want to** extract the Lovable design system and update existing screens to match the polished design  
**So that** the app has a consistent, professional visual identity from the start

**Design References (AUTHORITATIVE):**
- **PRIMARY:** `docs/design-system-complete.md` - Complete design system specification
  - Part 2: CSS Variables & Design Tokens (colors, spacing, shadows)
  - Part 7: Animation Timings & Sequences (600ms task completion)
  - Part 8: Typography Scale (all font sizes, line heights, weights)
  - Part 10: Border Radius & Shadows
  - Part 12: Example Component Implementations
- **TRANSLATION GUIDE:** `docs/cursor-implementation-guide.md` - React Native implementation guide
- **REFERENCE IMPLEMENTATION:** `lovable-reference/src/components/EmailLogin.tsx` - Actual Lovable component
- **Note:** Lovable repository uses "TodoMorning" as project name, but all implementation should use "TodoTomorrow" to match project branding

**Acceptance Criteria:**
1. Design system constants created matching `docs/design-system-complete.md` EXACTLY:
   - `src/design-system/colors.ts` - All colors from Part 2 (CSS Variables)
   - `src/design-system/typography.ts` - All typography from Part 8 (Typography Scale)
   - `src/design-system/spacing.ts` - All spacing from Part 2 (Spacing System, 4pt grid)
   - `src/design-system/shadows.ts` - All shadows from Part 10 (Shadow System)
   - `src/design-system/index.ts` - Central export point
2. AuthScreen updated to match `lovable-reference/src/components/EmailLogin.tsx` EXACTLY:
   - Logo: 120px size (not 80px)
   - Title: "TodoTomorrow" (34px bold)
   - Subtitle: Two-line format "Evening brain dump, morning clarity."
   - Email input: 50px height, 2px border (not 1px), proper focus states
   - Primary button: 50px height, 8px radius, icon + text layout
   - Success state: Checkmark screen after email sent
   - Helper text: Two-line format matching Lovable
3. MainScreen updated to match `lovable-reference/src/components/TodoApp.tsx` EXACTLY:
   - Header: 44px height, border separator (not shadow)
   - Empty state: Matches `EmptyState.tsx` - floating Moon icon, two-line text
   - FAB: 56px circle, shadow-fab (blue glow), positioned bottom-80px right-lg
   - **CRITICAL:** Task items are CARD-BASED matching `TaskItem.tsx`:
     - White card (`bg-card`), rounded-lg (16px), shadow-soft-sm
     - Custom checkbox (24px circle, 2px border)
     - Proper padding (16px) and gap spacing (12px)
4. Task completion animation: 600ms multi-step sequence matching `design-system-complete.md` Part 7 EXACTLY
5. All design tokens match `docs/design-system-complete.md` values exactly (no approximations)
6. All styling uses NativeWind/Tailwind classes or StyleSheet with design tokens

**Deliverable:** Design system constants + Updated AuthScreen & MainScreen

**Test:**
- Visual inspection: AuthScreen matches Lovable Email Login design
- Visual inspection: MainScreen matches Lovable Main Screen design (empty state, FAB, task list)
- Design tokens accessible via imports (e.g., `import { colors } from '../design-system/colors'`)

---

### Story 6.2: Apply Design to Settings Screen
**Estimated Time:** 3 hours  
**Dependencies:** Story 6.1, Epic 3 Story 3.1 (coordinate timing)

**As a** developer  
**I want to** apply iOS Settings-style design to the Settings screen  
**So that** it matches the polished Lovable design specification

**Design References (AUTHORITATIVE):**
- **PRIMARY:** `docs/design-system-complete.md` - Complete design system specification
  - Part 2: CSS Variables & Design Tokens (iOS Settings colors)
  - Part 12: Example Component Implementations (Settings patterns)
- **TRANSLATION GUIDE:** `docs/cursor-implementation-guide.md` - React Native implementation guide
- **REFERENCE IMPLEMENTATION:** `lovable-reference/` directory - Actual Lovable Settings component (if available)
- **Note:** Repository uses "TodoMorning" name, adapt to "TodoTomorrow"

**Acceptance Criteria:**
1. Settings screen uses iOS grouped table view style:
   - Background: Light gray (#F2F2F7)
   - Cells: White with 1px separator lines
   - Section headers: All caps, 13px, gray (#6E6E73)
2. Navigation bar styled: Back button (←) with proper spacing
3. Time picker styled to match iOS native time picker appearance
4. Disclosure indicators: Right-pointing chevron (>) for tappable rows
5. Toggle switch (if workflow mode toggle added): iOS-style, blue when on
6. Sign Out button: Red text, centered, styled as destructive action
7. All spacing, typography, and colors follow design system from Story 6.1
8. Coordinate with Epic 3, Story 3.1 implementation (apply design as screen is built, or update after)

**Deliverable:** Settings screen with iOS Settings-style design

**Test:**
- Visual inspection: Settings screen matches Lovable Settings design spec
- All interactive elements follow iOS interaction patterns
- Design system tokens used consistently

---

### Story 6.3: Onboarding & Workflow Screens Design
**Estimated Time:** 4 hours  
**Dependencies:** Story 6.1, Epic 5 Story 5.1 (coordinate timing)

**As a** developer  
**I want to** implement the onboarding flow and workflow mode selection with polished Lovable design  
**So that** users have a delightful first-time experience

**Design References (AUTHORITATIVE):**
- **PRIMARY:** `docs/design-system-complete.md` - Complete design system specification
  - Part 2: CSS Variables & Design Tokens (colors, spacing)
  - Part 7: Animation Timings & Sequences (onboarding animations)
  - Part 12: Example Component Implementations (OnboardingWelcome, DeliveryTimePicker, WorkflowModeSelection)
- **TRANSLATION GUIDE:** `docs/cursor-implementation-guide.md` - React Native implementation guide
- **REFERENCE IMPLEMENTATION:** `lovable-reference/` directory - Actual Lovable onboarding components
- **Note:** Repository uses "TodoMorning" name, adapt to "TodoTomorrow"

**Acceptance Criteria:**
1. Welcome screen (Epic 5, Story 5.1) matches Lovable Welcome design:
   - Large icon (🌙) with proper spacing
   - Headline "Capture tonight, conquer tomorrow" (28px bold)
   - Body text styling (17px)
   - Primary button styling
   - Page indicators (○ ○ ●) at bottom
2. Delivery Time Picker (Epic 3, Story 3.1 enhancement or Epic 5) matches Lovable spec:
   - iOS-style time picker (wheel or native input)
   - Question text "When should we email your morning list?" (20px)
   - Tip text styling (13px gray)
   - Proper spacing and layout
3. Workflow Mode Selection (Epic 5, Story 5.1) matches Lovable spec:
   - Two mode cards (Fresh Start, Carry Over)
   - Card styling: White background, border, tap to select
   - Selected state: Blue border + checkmark
   - Proper spacing between cards
4. Onboarding navigation: Swipe gestures optional, back button on steps 2-3, "Skip" button option
5. All screens use design system tokens and follow Lovable animation patterns

**Deliverable:** Polished onboarding flow (Welcome, Time Picker, Mode Selection)

**Test:**
- Visual inspection: All three onboarding screens match Lovable design spec
- Interactions feel smooth (animations, transitions)
- Design system used consistently

---

### Story 6.4: Payment Modal & Archive Screen Design
**Estimated Time:** 4 hours  
**Dependencies:** Story 6.1 required. **Timing coordination:** Design components can be built in parallel with Epic 4/Epic 5, but must be completed and ready before Epic 4 (Payment Modal) and Epic 5 Story 5.3 (Archive Screen) implementation begins to ensure design consistency.

**As a** developer  
**I want to** apply polished Lovable design to payment modal and archive screen  
**So that** monetization and archive features match the app's visual quality

**Design References (AUTHORITATIVE):**
- **PRIMARY:** `docs/design-system-complete.md` - Complete design system specification
  - Part 2: CSS Variables & Design Tokens (trial badge colors, payment modal colors)
  - Part 7: Animation Timings & Sequences (modal animations, tab switching)
  - Part 12: Example Component Implementations (TrialBadge, UpgradeModal patterns)
- **TRANSLATION GUIDE:** `docs/cursor-implementation-guide.md` - React Native implementation guide
- **REFERENCE IMPLEMENTATION:** `lovable-reference/` directory - Actual Lovable payment/archive components
- **Note:** Repository uses "TodoMorning" name, adapt to "TodoTomorrow"

**Acceptance Criteria:**
1. Trial Badge component created (matches Lovable spec):
   - Pill shape (fully rounded)
   - Light yellow background (#FFF9E6)
   - Warning icon (⚡) + text
   - Pulse animation when < 3 days remain
2. Payment/Trial Modal (Epic 4) matches Lovable paywall design:
   - Cohort-specific messaging styling
   - Primary CTA button ("Unlock Premium")
   - Secondary option styling ("Use Free Tier")
   - Proper spacing and typography
3. Archive Screen (Epic 5, Story 5.3) matches Lovable Archive design:
   - Tab bar styling (iOS segmented control style, 44px height)
   - Completed tasks: Green checkmark, strikethrough text (#C6C6C8), gray timestamp
   - Stats footer ("📊 X tasks this week")
   - No FAB on Archive tab
4. Tab switching animation: Smooth slide (200ms) for tab bar, crossfade for content
5. All components use design system tokens

**Deliverable:** Polished payment modal and archive screen

**Test:**
- Visual inspection: Payment modal matches Lovable paywall design
- Visual inspection: Archive screen matches Lovable Archive design
- Animations feel smooth and intentional
- Design system used consistently

---

## Epic 7: Pre-Launch Polish (Pre-Launch)

**Epic Goal:** Final polish and cleanup before production launch - remove development tools, add logo, update messaging, add essential user features (contact form, archive view, dark mode).

**Status:** 🔄 **IN PROGRESS** (Stories 7.1-7.4 in progress/complete, Stories 7.5-7.7 & 7.9 approved, Story 7.8 deferred)

**Completion Summary:**
- 🔄 Story 7.1: Pre-Launch - Magic Link Screen Polish - **In Progress**
- ✅ Story 7.2: Pre-Launch - App Icon & Splash Screen - **Done**
- ✅ Story 7.3: Pre-Launch - Create Email Logs Table - **Done**
- ✅ Story 7.4: Pre-Launch - UI Polish & Copy Updates - **Done**
- ✅ Story 7.5: Pre-Launch - Contact Form in Settings - **Approved** (2025-01-27, PO validated v2)
- ✅ Story 7.6: Pre-Launch - Archive Tab for Fresh Start Mode - **Approved** (2025-01-27, PO validated)
- ✅ Story 7.7: Pre-Launch - Dark Mode Support - **Approved** (2025-01-27, PO validated v2)
- 📝 Story 7.8: Pre-Launch - App Review Prompting - **Draft (Deferred - Post-Launch)**
- ✅ Story 7.9: Pre-Launch - Share Extension (Share Sheet Integration) - **Approved** (2025-01-27, PO validated v2)

**Epic Achievement:** _To be updated upon completion_

**Prerequisites:**
- ✅ Epic 1: Foundation & Authentication - COMPLETE
- ✅ Epic 2: Core Task Management - COMPLETE
- ✅ Epic 3: Email Delivery System - COMPLETE
- ✅ Epic 4: Story 4.1 (Cohort Assignment) - COMPLETE
- ✅ Epic 5: Workflow Modes & Polish - COMPLETE
- ✅ Epic 6: Design System Integration - COMPLETE

---

### Story 7.1: Pre-Launch - Magic Link Screen Polish
**Estimated Time:** 1-2 hours  
**Dependencies:** Epic 1-6 complete

**As a** user  
**I want to** see a polished, professional Magic Link screen without development tools  
**So that** my first impression of the app is clean and production-ready

**Acceptance Criteria:**
1. Replace emoji logo (🌅) with TodoTomorrow logo image from `lovable-reference/src/assets/logo.png`
2. Remove all dev tools section completely (remove `{__DEV__ && (` wrapper and all dev tools code)
3. Update tagline from "Evening brain dump, morning clarity." to "Capture on the go"

**Deliverable:** Production-ready Magic Link screen with logo, updated tagline, and no dev tools

**Test:** Launch app → Verify logo displays (not emoji), no dev tools visible, tagline shows "Capture on the go"

---

### Story 7.5: Pre-Launch - Contact Form in Settings
**Estimated Time:** 2 hours  
**Dependencies:** Epic 1-6 complete

**As a** user  
**I want to** contact the support team directly from the Settings screen  
**So that** I can report issues, ask questions, or provide feedback without leaving the app

**Acceptance Criteria:**
1. New "SUPPORT" section added to Settings screen below "WORKFLOW" section
2. "Contact Us" row displays in SUPPORT section with disclosure indicator
3. Tapping "Contact Us" opens modal with form fields: Name (optional), Email (pre-filled from session), Message (required)
4. Form submission inserts data to `contacts` table in Supabase
5. After successful insert, Edge Function `send-email` is triggered to send notification email to support
6. User sees success message: "Thanks! We'll get back to you soon."
7. Form validates: Message is required (show error if empty)

**Deliverable:** Contact form integrated into Settings screen

**Test:** Open Settings → Tap "Contact Us" → Fill form → Submit → Verify success message and email sent

---

### Story 7.6: Pre-Launch - Archive Tab for Fresh Start Mode
**Estimated Time:** 1-2 hours  
**Dependencies:** Epic 1-6 complete

**As a** Fresh Start mode user  
**I want to** view my archived tasks in an Archive tab  
**So that** I can still see previous tasks that were sent via email, even though they're cleared from my active list

**Acceptance Criteria:**
1. Tab bar displays in Fresh Start mode (currently only shows in Carry Over mode)
2. Archive tab queries: `SELECT * FROM tasks WHERE user_id = ? AND status = 'archived' ORDER BY archived_at DESC`
3. Archive tab shows archived tasks with archived timestamp
4. Empty state: "No archived tasks yet! 📧"
5. Archive tab is read-only (no editing, no FAB button)
6. Active tab shows only open tasks (unchanged behavior)

**Deliverable:** Archive tab enabled for Fresh Start mode users

**Test:** Switch to Fresh Start mode → Verify tab bar shows → Switch to Archive tab → Verify archived tasks display

---

### Story 7.7: Pre-Launch - Dark Mode Support
**Estimated Time:** 3-4 hours  
**Dependencies:** Epic 1-6 complete

**As a** user  
**I want to** switch between light and dark themes  
**So that** I can use the app comfortably in different lighting conditions and match my device's system preference

**Acceptance Criteria:**
1. New "APPEARANCE" section added to Settings screen below "WORKFLOW" section
2. Appearance section shows theme selector with options: "Light", "Dark", "System" (follows system preference)
3. Theme preference stored in user preferences store and persisted to database
4. App applies theme colors immediately when theme changes
5. All screens and components respect theme (use theme-aware colors from design system)
6. Theme persists across app restarts
7. "System" option respects device system theme (light/dark mode)

**Deliverable:** Dark mode support with theme selector in Settings

**Test:** Open Settings → Select "Dark" → Verify app switches to dark theme → Restart app → Verify theme persists

---

### Story 7.8: Pre-Launch - App Review Prompting
**Estimated Time:** 4-5 hours  
**Dependencies:** Epic 1-6 complete  
**Status:** 📝 **DEFERRED - Post-Launch** (Implement after Month 1+ when engagement patterns stabilize)

**As a** engaged user  
**I want to** be prompted to review the app at the right moment  
**So that** I can share my positive experience and help others discover the app

**Acceptance Criteria:**
1. Install `react-native-in-app-review` library
2. Track engagement metrics: app opens, tasks added, tasks completed, days since install
3. Implement "happiness engine" that calculates engagement score
4. Prompt eligibility: After 2-3 days of use, 3+ sessions, engagement score > threshold (e.g., 16 points)
5. Two-tap flow: Pre-screen ("Are you liking the app?") → Review prompt (if yes) or feedback form (if no)
6. Cooldown: 90 days between prompts, lifetime cap: 3 prompts max
7. Pre-screen uses fun, brand-aligned copy
8. Review prompt uses native platform APIs (iOS SKStoreReviewController, Android In-App Review API)

**Deliverable:** Smart review prompting system with engagement tracking

**Test:** Simulate engaged user (2+ days, 3+ opens, score 16+) → Verify prompt eligibility → Verify pre-screen → Verify review prompt

**Note:** Deferred to post-launch (Month 2+) when real engagement data is available for threshold calibration.

---

### Story 7.9: Pre-Launch - Share Extension (Share Sheet Integration)
**Estimated Time:** 3-4 hours  
**Dependencies:** Epic 1-6 complete

**As a** user  
**I want to** share links or text from other apps (Safari, Chrome, etc.) directly to TodoTomorrow  
**So that** I can quickly add tasks from web pages, articles, or other content without manually copying and pasting

**Acceptance Criteria:**
1. TodoTomorrow appears in iOS Share Sheet when sharing URLs or text
2. TodoTomorrow appears in Android Share Menu when sharing URLs or text
3. Tapping TodoTomorrow in share sheet opens app (or brings to foreground)
4. Shared content (URL or text) is captured and displayed in task creation flow
5. User can edit shared content before creating task
6. Shared content creates new task with pre-filled text (URL or text content)
7. Share extension works from Safari, Chrome, Notes, and other common apps

**Deliverable:** Share extension integrated, app appears in share sheets

**Test:** Share URL from Safari → Verify TodoTomorrow appears → Tap it → Verify task creation modal opens with URL pre-filled

---