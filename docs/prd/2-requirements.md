# 2. Requirements

## 2.1 Functional Requirements

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

## 2.2 Non-Functional Requirements

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
