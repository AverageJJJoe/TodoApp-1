# Loops Email Fix Plan

**Created:** 2025-01-18  
**Updated:** 2025-01-18 (Final PO Review Complete)  
**Status:** ✅ Approved - Ready for Implementation  
**Priority:** High  
**Owner:** Development Team

---

## Executive Summary

We have identified critical issues with our Loops email system:

1. **Welcome emails not sending** - 11 out of 13 users never received welcome emails due to flawed 5-minute time window check
2. **Day 3 re-engagement emails not sending** - Narrow exact date match window causes users to be missed

**Impact:** Poor user onboarding experience, missed re-engagement opportunities, potential user churn.

---

## Prerequisites

Before implementing fixes, verify:

- [ ] Supabase Edge Functions are deployed and accessible
- [ ] `LOOPS_API_KEY` environment variable is set in Supabase Edge Function secrets
- [ ] Database migrations 016, 017, 018 are applied (re-engagement tracking columns exist)
- [ ] Loops API is accessible and responding
- [ ] Test Loops account has sufficient credits for testing
- [ ] Access to Supabase dashboard for Edge Function deployment
- [ ] Access to Loops dashboard for email verification

---

## Problem Analysis

### Issue 1: Welcome Emails Not Sending

**Root Cause:**
- Code uses a 5-minute time window check (`isNewUser = userCreatedAt > fiveMinutesAgo`)
- Most users complete authentication >5 minutes after account creation
- When time window expires, code incorrectly treats them as existing users
- `welcome_email_sent` flag exists in database but isn't being checked properly

**Current Logic Flow (BROKEN):**
```
User signs up → Account created in DB
↓
User clicks magic link (could be hours later)
↓
Code checks: created_at > 5 minutes ago? → FALSE
↓
Code thinks: "Not a new user" → Skips welcome email
↓
welcome_email_sent stays FALSE forever
```

**Evidence:**
- 13 users total in database
- Only 2-3 received welcome emails (manual testing accounts)
- 11 users have `welcome_email_sent = false` despite being new users
- Users with `minutes_since_signup` values: 971, 2509, 5603 minutes (all >5 minutes)

**Affected Code Locations:**
- `src/screens/AuthScreen.tsx` - Lines 431-435, 642-644, 733-735 (three duplicate code blocks)
- Logic appears in both fragment token path and verification token path

---

### Issue 2: Day 3 Re-Engagement Emails Not Sending

**Root Cause:**
- Edge Function uses exact date match: `created_at::date = (CURRENT_DATE - INTERVAL '3 days')::date`
- Cron job runs once per day at 9 AM UTC
- Users who sign up after 9 AM miss the exact date match window
- Example: User signs up Nov 13 at 10 AM → Cron runs Nov 16 at 9 AM → Exact date match fails

**Current Logic Flow (BROKEN):**
```sql
-- Line 113 in send-loops-reengagement-emails/index.ts
.eq('created_at::date', threeDaysAgoDate)  -- Exact date match
```

**Evidence:**
- Test user `joegaleckas+welc7@gmail.com` created Nov 13, 2025 18:51:45
- Day 3 window would be Nov 16 (already passed)
- No Day 3 email received
- Cron job runs daily but narrow window causes misses

**Affected Code Location:**
- `supabase/functions/send-loops-reengagement-emails/index.ts` - Line 113

---

### Issue 3: Day 5 Inactivity Email (No Issue - Uses Correct Approach)

**Note:** Day 5 inactivity emails use the transactional template:
- **Template ID:** `cmhw3sebk0bqf760ipe4mvthm` (Inactivity Email)

**Current Status:** 
- Day 5 emails are implemented in Edge Function
- Day 5 uses correct approach: queries all users, checks last task date (not exact date matching)
- **No fix needed** - Day 5 implementation is correct and doesn't have the exact date match issue

---

## Solution Plan

### Phase 1: Fix Welcome Email Logic (CRITICAL - Do First)

**Objective:** Remove unreliable 5-minute time check, use 24-hour window with database flag

**Changes Required:**

1. **Update AuthScreen.tsx** (3 locations - all duplicate logic)
   - Remove: `const isNewUser = userCreatedAt && userCreatedAt > fiveMinutesAgo;`
   - Remove: `const isSignup = fragmentType === 'signup' || isNewUser;`
   - Replace with: Use 24-hour window check combined with database flag to prevent false positives
   - Keep: `shouldSendWelcomeEmail` logic that checks `!userData?.welcome_email_sent`
   - **CRITICAL:** Must prevent sending welcome emails to old users who happen to have `welcome_email_sent = false`

**Rationale:**
- 24-hour window catches delayed magic link clicks (more realistic than 5 minutes)
- Prevents false positives for existing users with `welcome_email_sent = false` (data migration issues)
- Database flag prevents duplicate sends automatically
- Balances reliability with safety

**Files to Modify:**
- `src/screens/AuthScreen.tsx` - Lines 431-441, 642-651, 733-742
- **Note:** Existing user record creation logic (lines 410-429, 620-639, 711-730) should remain unchanged

**Testing:**
1. Create new test user
2. Complete signup flow
3. Verify welcome email sent
4. Verify `welcome_email_sent = true` in database
5. Log out and log back in
6. Verify NO duplicate welcome email sent

---

### Phase 2: Fix Day 3 Email Time Window (HIGH PRIORITY)

**Objective:** Widen time window from exact date match to 24-hour range

**Changes Required:**

1. **Update Edge Function Query**
   - Current: `created_at::date = threeDaysAgoDate` (exact match)
   - New: Use reliable date calculation with time range (see Code Changes Detail section)
   - This gives a 24-hour window: users who signed up 2.5-3.5 days ago

**Rationale:**
- Accounts for cron job timing variance
- Catches users regardless of signup time
- Still prevents duplicate sends (checks `last_day3_email_sent_at IS NULL`)
- More reliable than exact date match
- Uses reliable date math to avoid month rollover issues

**Files to Modify:**
- `supabase/functions/send-loops-reengagement-emails/index.ts` - Lines 105-114

**Note:** Day 5 emails use a different approach (query all users, check last task date) so they don't have this exact date match issue. Day 5 implementation is correct and doesn't need fixing.

**Testing:**
1. Create test user
2. Manually set `created_at` to 3 days ago (via SQL)
3. Run Edge Function manually
4. Verify Day 3 email sent
5. Verify `last_day3_email_sent_at` updated
6. Run Edge Function again
7. Verify NO duplicate email sent

---

### Phase 3: Manual Remediation for Existing Users (MEDIUM PRIORITY)

**Objective:** Send welcome emails to 11 users who missed them

**Options:**

**Option A: Via Loops Dashboard (Recommended)**
1. Export list of 11 user emails from Supabase
2. Import into Loops as contacts
3. Manually send welcome email template to batch
4. Update database flags: `UPDATE users SET welcome_email_sent = true WHERE email IN (...);`

**Option B: Create One-Time Script**
1. Create Edge Function: `send-missed-welcome-emails`
2. Query users where `welcome_email_sent = false` AND `created_at < NOW() - INTERVAL '1 day'` AND `created_at > NOW() - INTERVAL '30 days'` (exclude very recent and very old users)
3. Send welcome emails via Loops API
4. Update flags after successful sends
5. Run once, then delete function

**Option C: Update Flags Only (If Emails Already Sent)**
- If welcome emails were actually sent but flags not updated:
- Run SQL: `UPDATE users SET welcome_email_sent = true WHERE welcome_email_sent = false;`
- ⚠️ Only use if you're CERTAIN emails were sent

**Recommendation:** Option A (Loops Dashboard) - fastest, most reliable, visual confirmation

---

## Implementation Checklist

### Phase 1: Welcome Email Fix
- [ ] **Step 1.1:** Remove 5-minute time check from AuthScreen.tsx (fragment token path - line ~431)
- [ ] **Step 1.2:** Remove 5-minute time check from AuthScreen.tsx (verification token path - line ~642)
- [ ] **Step 1.3:** Remove 5-minute time check from AuthScreen.tsx (retry path - line ~733)
- [ ] **Step 1.4:** Update logic to use 24-hour window with database flag check (prevents false positives)
- [ ] **Step 1.5:** Update console.log statements to reflect new logic (lines 443, 653)
- [ ] **Step 1.6:** Test with new user signup
- [ ] **Step 1.7:** Verify welcome email sent
- [ ] **Step 1.8:** Verify database flag updated
- [ ] **Step 1.9:** Test re-login doesn't send duplicate email
- [ ] **Step 1.10:** Test delayed magic link click (Test 3a: 10-30 min delay, within expiration window)
- [ ] **Step 1.11:** Test very delayed magic link scenario (Test 3b/13: >24 hours, requires new magic link)
- [ ] **Step 1.12:** Test all edge cases (Tests 6-9 from Testing Plan)

### Phase 2: Day 3 Email Fix
- [ ] **Step 2.1:** Update Edge Function query to use time range instead of exact date
- [ ] **Step 2.2:** Deploy Edge Function to Supabase
- [ ] **Step 2.3:** Test with manually adjusted user `created_at` date
- [ ] **Step 2.4:** Verify Day 3 email sent
- [ ] **Step 2.5:** Verify no duplicate sends
- [ ] **Step 2.6:** Monitor next cron job execution (9 AM UTC daily)
- [ ] **Step 2.7:** Verify Day 5 inactivity emails working correctly (no fix needed - uses correct approach)

### Phase 3: Manual Remediation
- [ ] **Step 3.1:** Query database for users with `welcome_email_sent = false` AND `created_at < NOW() - INTERVAL '1 day'` AND `created_at > NOW() - INTERVAL '30 days'` (exclude very recent users and very old users)
- [ ] **Step 3.2:** Export email list
- [ ] **Step 3.3:** Send welcome emails via Loops Dashboard (Option A) OR create script (Option B)
- [ ] **Step 3.4:** Update database flags after successful sends
- [ ] **Step 3.5:** Verify all 11 users now have `welcome_email_sent = true`

---

## Code Changes Detail

### Change 1: AuthScreen.tsx - Fragment Token Path

**Location:** Lines ~431-441

**Current Code:**
```typescript
// Check if this is a new user (created within last 5 minutes) OR explicit signup
const userCreatedAt = userData?.created_at ? new Date(userData.created_at) : null;
const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
const isNewUser = userCreatedAt && userCreatedAt > fiveMinutesAgo;
const isSignup = fragmentType === 'signup' || isNewUser;

// Check if welcome email should be sent (new user AND not already sent)
const shouldSendWelcomeEmail = isSignup && 
                              sessionData.session.user.email && 
                              userData?.id &&
                              !userData?.welcome_email_sent;
```

**New Code:**
```typescript
// Check if this is a signup:
// 1. Explicit signup type from URL (always send, regardless of time window - Supabase preserves type in magic link)
// 2. OR new user within 24 hours who hasn't received email (catches edge cases where type might be missing/incorrect)
// Note: Magic links expire after ~1 hour, so delayed clicks >24 hours require new magic link request
const userCreatedAt = userData?.created_at ? new Date(userData.created_at) : null;
const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
const isNewUserWithinWindow = userCreatedAt && userCreatedAt > twentyFourHoursAgo;
const isSignup = fragmentType === 'signup' || (isNewUserWithinWindow && !userData?.welcome_email_sent);

// Check if welcome email should be sent (signup AND not already sent)
const shouldSendWelcomeEmail = isSignup && 
                              sessionData.session.user.email && 
                              userData?.id &&
                              !userData?.welcome_email_sent;
```

**Rationale:**
- 24-hour window catches delayed magic link clicks (realistic user behavior)
- Prevents false positives: old users with `welcome_email_sent = false` won't trigger emails
- Still respects explicit `signup` type from URL
- Prevents duplicate sends via flag check
- More reliable than 5-minute window, safer than flag-only check

---

### Change 2: AuthScreen.tsx - Verification Token Path

**Location:** Lines ~642-651

**Same change as Change 1** - duplicate code block needs same fix.

---

### Change 3: AuthScreen.tsx - Retry Path

**Location:** Lines ~733-742

**Same change as Change 1** - duplicate code block needs same fix.

---

### Change 4: Edge Function - Day 3 Query

**Location:** `supabase/functions/send-loops-reengagement-emails/index.ts` Lines 105-114

**Current Code:**
```typescript
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
const threeDaysAgoDate = threeDaysAgo.toISOString().split('T')[0]; // YYYY-MM-DD format

const { data: day3Users, error: day3Error } = await supabase
  .from('users')
  .select('id, email, auth_id, created_at, last_day3_email_sent_at')
  .is('deleted_at', null)
  .eq('created_at::date', threeDaysAgoDate)  // ❌ Exact date match
  .is('last_day3_email_sent_at', null);
```

**New Code:**
```typescript
// Use time range instead of exact date match
// Window: users who signed up 2.5-3.5 days ago (24-hour window)
// Use reliable date calculation to avoid month rollover issues
const now = new Date();
const threeDaysAgoStart = new Date(now.getTime() - (3 * 24 + 12) * 60 * 60 * 1000); // 3.5 days ago
const twoDaysAgoEnd = new Date(now.getTime() - (2 * 24 + 12) * 60 * 60 * 1000);     // 2.5 days ago

const { data: day3Users, error: day3Error } = await supabase
  .from('users')
  .select('id, email, auth_id, created_at, last_day3_email_sent_at')
  .is('deleted_at', null)
  .gte('created_at', threeDaysAgoStart.toISOString())  // ✅ >= 3 days 12 hours ago
  .lte('created_at', twoDaysAgoEnd.toISOString())      // ✅ <= 2 days 12 hours ago
  .is('last_day3_email_sent_at', null);
```

**Rationale:**
- Reliable date calculation avoids month rollover issues with `setDate()`
- 24-hour window catches users regardless of signup time
- Accounts for cron job timing variance
- Still prevents duplicates via `last_day3_email_sent_at` check

---

## Testing Plan

### Test 1: Welcome Email - New User Signup
1. Create new test account with email `test+welc@example.com`
2. Complete signup flow
3. **Expected:** Welcome email sent immediately
4. **Verify:** Check Loops dashboard for email sent
5. **Verify:** Check database: `SELECT welcome_email_sent FROM users WHERE email = 'test+welc@example.com';` → Should be `true`

### Test 2: Welcome Email - Re-Login (No Duplicate)
1. Log out from test account
2. Log back in (same account)
3. **Expected:** NO welcome email sent
4. **Verify:** Check Loops dashboard - no new email
5. **Verify:** Database flag still `true`

### Test 3: Welcome Email - Delayed Magic Link Click
**Note:** Supabase magic links expire after ~1 hour. Tests must use fresh links.

**Test 3a: Delayed Click Within Window (< 1 hour)**
1. Request magic link for new account
2. Wait 10-30 minutes before clicking link (within expiration window)
3. Complete authentication
4. **Expected:** Welcome email sent (even though >5 minutes passed, within 24-hour window)
5. **Verify:** Email sent, flag updated

**Test 3b: Very Delayed Click (>24 hours)**
1. Request magic link for new account
2. **Note:** Magic link will expire after ~1 hour, so this test requires:
   - User signs up at Day 0, 10 AM
   - User requests NEW magic link at Day 1, 11 AM (25 hours later)
   - User clicks new magic link immediately
3. Complete authentication
4. **Expected:** 
   - If `fragmentType === 'signup'` → Welcome email sent (explicit signup, regardless of time window)
   - If `fragmentType !== 'signup'` → NO welcome email (outside 24-hour window, not explicit signup)
5. **Verify:** Email behavior matches expected based on `fragmentType`

### Test 4: Day 3 Email - Manual Test
1. Create test user in database with `created_at` set to 3 days ago:
   ```sql
   UPDATE users 
   SET created_at = NOW() - INTERVAL '3 days',
       last_day3_email_sent_at = NULL
   WHERE email = 'test+day3@example.com';
   ```
2. Manually invoke Edge Function:
   ```bash
   curl -X POST https://zrnjxrtgrommlhexbpde.supabase.co/functions/v1/send-loops-reengagement-emails \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```
3. **Expected:** Day 3 email sent
4. **Verify:** Check Loops dashboard
5. **Verify:** Database: `last_day3_email_sent_at` updated

### Test 5: Day 3 Email - Edge Cases
1. Test user created 2 days 13 hours ago → Should NOT receive email (too early)
2. Test user created 3 days 11 hours ago → Should receive email (within window)
3. Test user created 3 days 13 hours ago → Should receive email (within window)
4. Test user created 3 days 1 hour ago → Should NOT receive email (too recent)

### Test 6: Welcome Email - User Record Doesn't Exist
1. Simulate auth before user record creation (edge case)
2. **Expected:** User record created automatically (existing code handles this)
3. **Verify:** Welcome email sent after record creation
4. **Verify:** Database flag updated

### Test 7: Welcome Email - Loops API Failure
1. Temporarily break Loops API (wrong API key or network issue)
2. Complete signup flow
3. **Expected:** Signup succeeds, welcome email fails gracefully
4. **Verify:** No error thrown, user can still use app
5. **Verify:** Database flag stays `false` (email not sent)
6. **Verify:** Logs show error message

### Test 8: Welcome Email - Database Flag Update Failure
1. Simulate database update failure after email sent
2. **Expected:** Email sent successfully, flag update fails gracefully
3. **Verify:** Email appears in Loops dashboard
4. **Verify:** Logs show flag update error
5. **Verify:** User can still use app

### Test 9: Welcome Email - Race Condition (Multiple Auths)
1. User authenticates multiple times rapidly before flag is updated
2. **Expected:** Only first auth sends welcome email
3. **Verify:** Only one email sent (flag prevents duplicates)
4. **Verify:** Database flag updated correctly

### Test 10: Day 3 Email - Multiple Users in Window
1. Create 5 test users with `created_at` set to 3 days ago
2. Run Edge Function manually
3. **Expected:** All 5 users receive Day 3 email
4. **Verify:** All emails sent via Loops dashboard
5. **Verify:** All `last_day3_email_sent_at` flags updated
6. **Verify:** No duplicate sends

### Test 11: Day 3 Email - Loops API Rate Limit
1. Simulate Loops API returning 429 (rate limit)
2. Run Edge Function with multiple eligible users
3. **Expected:** Function handles rate limit gracefully
4. **Verify:** Errors logged but function completes
5. **Verify:** Partial sends tracked correctly

### Test 12: Day 3 Email - Boundary Conditions
1. Test user created exactly at window start (3.5 days ago)
2. Test user created exactly at window end (2.5 days ago)
3. **Expected:** Both users receive email
4. **Verify:** Emails sent, flags updated

### Test 13: Welcome Email - Very Delayed Magic Link (>24 hours)
**Note:** This test requires requesting a NEW magic link after 24+ hours (old link expires after ~1 hour)

1. User signs up at Day 0, 10 AM
2. User does NOT click magic link immediately
3. Wait 25+ hours
4. User requests NEW magic link (old one expired)
5. User clicks new magic link immediately
6. **Expected:** 
   - If Supabase preserves `type=signup` in new magic link → Welcome email sent (explicit signup)
   - If Supabase uses `type=email` for new link → NO welcome email (outside 24-hour window)
7. **Verify:** Email behavior matches expected based on `fragmentType` from URL

---

## Risk Mitigation

### Identified Risks

1. **Risk:** Phase 1 fix causes MORE welcome emails to be sent
   - **Mitigation:** 24-hour window prevents old users from triggering emails
   - **Monitoring:** Track email send rate in first 24 hours after deployment
   - **Rollback:** Revert to 5-minute check if send rate spikes unexpectedly

2. **Risk:** Day 3 window change causes duplicate sends
   - **Mitigation:** `last_day3_email_sent_at` flag prevents duplicates
   - **Monitoring:** Check Edge Function logs for duplicate send attempts
   - **Rollback:** Revert to exact date match if duplicates detected

3. **Risk:** Manual remediation sends emails to users who already got them
   - **Mitigation:** Check Loops dashboard before manual send
   - **Monitoring:** Verify email list against Loops sent emails
   - **Rollback:** Update flags manually if duplicates sent

4. **Risk:** Loops API failures break signup flow
   - **Mitigation:** All Loops API calls are non-blocking (try-catch)
   - **Monitoring:** Check error logs for Loops API failures
   - **Rollback:** Not needed - failures are already handled gracefully

5. **Risk:** Database flag update failures cause duplicate sends
   - **Mitigation:** Flag update is non-blocking, but email send succeeds
   - **Monitoring:** Check logs for flag update errors
   - **Rollback:** Not needed - flag check prevents duplicates even if update fails

### Monitoring Checkpoints

**First 24 Hours:**
- [ ] Check welcome email send rate (should match new signups)
- [ ] Verify no duplicate welcome emails sent
- [ ] Check Edge Function logs for Day 3 email execution
- [ ] Monitor Loops API error rates

**First Week:**
- [ ] Daily check: Welcome email send rate vs new signups
- [ ] Daily check: Day 3 email execution logs
- [ ] Verify no user complaints about duplicate emails
- [ ] Check database flags are updating correctly

## Rollback Plan

If issues occur after deployment:

### Welcome Email Rollback
1. Revert AuthScreen.tsx changes to previous version
2. Restore 5-minute check temporarily
3. Manually send welcome emails to affected users via Loops Dashboard
4. Investigate root cause before re-deploying fix

### Day 3 Email Rollback
1. Revert Edge Function to exact date match
2. Monitor cron job execution
3. Consider alternative approach (wider window with different logic)
4. Re-deploy fix after investigation

---

## Success Criteria

### Phase 1 Complete When:
- ✅ 100% of new signups receive welcome email within 1 hour of authentication
- ✅ 0 duplicate welcome emails sent in 7-day test period
- ✅ Database flags updated correctly for all new users
- ✅ All test scenarios pass (Tests 1-9, 13)
- ✅ No errors in production logs related to welcome email logic

### Phase 2 Complete When:
- ✅ Day 3 emails sent to 95%+ of eligible users in 2.5-3.5 day window
- ✅ 0 duplicate Day 3 emails sent
- ✅ Cron job executes successfully daily for 7 consecutive days
- ✅ Edge Function logs show correct user counts matching database queries
- ✅ All test scenarios pass (Tests 4, 5, 10-12)

### Phase 3 Complete When:
- ✅ All 11 existing users receive welcome emails
- ✅ Database flags updated for all 11 users
- ✅ Loops dashboard shows 11 emails sent
- ✅ No duplicate emails sent to existing users

---

## Monitoring & Validation

### Post-Deployment Monitoring (First 7 Days)

**Daily Checks:**
1. Query new signups: `SELECT COUNT(*) FROM users WHERE created_at::date = CURRENT_DATE;`
2. Query welcome emails sent: `SELECT COUNT(*) FROM users WHERE welcome_email_sent = true AND created_at::date = CURRENT_DATE;`
3. Compare counts - should match (or be close if some users haven't clicked magic link yet)

**Weekly Checks:**
1. Check Day 3 email execution logs in Supabase Edge Function logs
2. Verify email counts match expected user counts
3. Check for any errors in Edge Function execution

**Metrics to Track:**
- Welcome email send rate: `welcome_emails_sent / new_signups` (target: 95%+)
- Day 3 email send rate: `day3_emails_sent / eligible_users` (target: 95%+)
- Duplicate email rate: Should be 0%
- Loops API error rate: Should be <1%
- Database flag update success rate: Should be 99%+

**Error Handling:**
- Loops API failures are logged but don't break signup flow
- Database flag update failures are logged but don't prevent email sends
- Edge Function errors are logged and tracked in Supabase logs
- Consider adding retry logic for transient Loops API failures (future enhancement)

---

## Related Documentation

- Story 8.4: Loops API Welcome Email Integration
- Story 8.5: Loops Re-Engagement Email Sequences
- Migration 018: Add welcome_email_sent flag
- Migration 016: Add re-engagement email tracking columns
- Migration 017: Cron job configuration

---

## Notes

- **Critical:** The 5-minute check appears in 3 places in AuthScreen.tsx - must fix all 3
- **Important:** Day 3 window widening should not affect Day 5 logic (already uses different approach - queries all users, checks last task date)
- **Important:** Day 5 inactivity emails use correct approach (query all users, check last task date) - no fix needed. Day 5 template ID: `cmhw3sebk0bqf760ipe4mvthm` (Inactivity Email)
- **Important:** Magic links expire after ~1 hour (Supabase default), so delayed click tests must account for expiration
- **Consider:** Adding structured logging/metrics to track email send success rates
- **Future:** Consider adding retry logic for failed Loops API calls
- **Future:** Consider adding alerting for high Loops API error rates
- **Debug:** Update console.log statements to reflect new logic (lines 443, 653 in AuthScreen.tsx)

---

**Next Steps:**
1. Review this plan with team
2. Prioritize Phase 1 (Welcome Email Fix) - highest impact
3. Implement changes
4. Test thoroughly
5. Deploy
6. Monitor results

