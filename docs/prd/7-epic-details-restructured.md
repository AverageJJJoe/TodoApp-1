# 7. Epic Details - RESTRUCTURED

## Epic 1: Foundation & Authentication (Week 1, Days 1-3)

**Epic Goal:** Get basic project running with authentication working. Users can sign up and log in.

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

---

### Story 3.1: User Preferences - Delivery Time
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

### Story 3.2: Email Template - HTML Design
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

### Story 3.3: SendGrid Integration
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

### Story 3.4: Manual "Send Now" Button (Testing)
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

### Story 3.5: Automated Cron Job
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

## Epic 4: Monetization & Payments (Week 2, Day 5 + Week 3)

**Epic Goal:** Trial system, paywall, and payment processing working.

---

### Story 4.1: Cohort Assignment on Signup
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

### Story 4.2: Trial Days Remaining Display
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

### Story 4.3: Trial Expiration Check & Gate
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

### Story 4.4: Task Limit Counter (Alternative Gate)
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

### Story 4.5: Paywall UI & Messaging
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

### Story 4.6: Stripe Payment Integration (Web/PWA)
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

### Story 4.7: Apple In-App Purchase (iOS)
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

### Story 4.8: Payment Status Sync & Verification
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

## Epic 5: Workflow Modes & Polish (Week 3-4)

**Epic Goal:** Fresh Start vs Carry Over modes, task completion, archive, final polish.

---

### Story 5.1: Workflow Mode Selection (Onboarding)
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

### Story 5.2: Task Completion UI (Carry Over Mode)
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

### Story 5.3: Archive View (Carry Over Mode)
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

### Story 5.4: Email Delivery - Mode-Specific Logic
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
