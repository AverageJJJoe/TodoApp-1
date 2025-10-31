# Appendix D: Key User Flows

## Flow 1: First-Time User (Fresh Start Mode)
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

## Flow 2: First-Time User (Carry Over Mode)
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

## Flow 3: Trial Expiration (Freemium Cohort)
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

## Flow 4: Payment Flow (iOS)
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
