# Sentry & PostHog Testing Checklist - Play Console Build
**Date:** 2025-01-27  
**Build Version:** 1.0.8 (versionCode 11)  
**Platform:** Android (Play Console)

---

## 🎯 TESTING OBJECTIVES

Verify that Sentry and PostHog integrations work correctly in the production build uploaded to Play Console.

---

## 📋 PRE-TEST SETUP

### Required Access:
- [ ] Android device with Play Console build installed
- [ ] Sentry dashboard access: https://sentry.io/organizations/todotomorrow/projects/react-native/
- [ ] PostHog dashboard access: https://posthog.com/project/247541
- [ ] App installed from Play Console (internal testing track)

### Verify Build:
- [ ] App version shows `1.0.8` in Settings
- [ ] App launches without crashes
- [ ] All core features working (login, tasks, etc.)

---

## 🔍 SENTRY TESTING

### Test 1: Verify Sentry Initialization
**Objective:** Confirm Sentry is initialized and connected

**Steps:**
1. Launch app
2. Check Sentry dashboard → Releases → Look for release `1.0.8`
3. Verify release shows source maps uploaded ✅

**Expected Result:**
- ✅ Release `1.0.8` visible in Sentry dashboard
- ✅ Source maps uploaded (if build succeeded)
- ✅ No initialization errors in Sentry

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 2: Test JavaScript Error Capture
**Objective:** Verify Sentry captures JavaScript errors

**Steps:**
1. Open app
2. Navigate to Settings screen
3. **Note:** Test crash buttons are dev-only (`__DEV__` check), so won't appear in production build
4. Trigger a real error scenario (if possible):
   - Try to access a feature that might error
   - Or wait for natural errors to occur

**Alternative:** Check Sentry dashboard for any existing errors

**Expected Result:**
- ✅ Errors appear in Sentry dashboard (if any occur)
- ✅ Stack traces show readable file names (source maps working)
- ✅ Errors include app version `1.0.8`

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

**Note:** Since test crash buttons are dev-only, we'll rely on natural errors or check Sentry dashboard for any existing errors.

---

### Test 3: Verify Error Boundary Works
**Objective:** Confirm React Error Boundary catches component errors

**Steps:**
1. Use app normally
2. If app crashes, verify it shows error screen (not blank screen)
3. Check Sentry dashboard for error boundary captures

**Expected Result:**
- ✅ App doesn't show blank screen on errors
- ✅ Error boundary catches React errors
- ✅ Errors logged to Sentry

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 4: Check Sentry Release Tracking
**Objective:** Verify crashes are associated with correct release

**Steps:**
1. Check Sentry dashboard → Releases → `1.0.8`
2. Verify release shows:
   - Correct version number
   - Source maps uploaded
   - Any errors associated with this release

**Expected Result:**
- ✅ Release `1.0.8` exists
- ✅ Source maps uploaded successfully
- ✅ Errors (if any) linked to release `1.0.8`

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

## 📊 POSTHOG TESTING

### Test 5: Verify PostHog Initialization
**Objective:** Confirm PostHog is initialized and tracking

**Steps:**
1. Launch app
2. Check PostHog dashboard → Live Events
3. Verify events start appearing immediately

**Expected Result:**
- ✅ Events appear in PostHog dashboard
- ✅ Autocapture events visible (clicks, page views)
- ✅ No initialization errors

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 6: Test User Identification
**Objective:** Verify user identification works on signup/login

**Steps:**
1. Sign up with a new account OR log in with existing account
2. Check PostHog dashboard → Persons → Find your user
3. Verify user properties:
   - User ID (UUID from Supabase)
   - Email (if available)
   - Cohort (if assigned)

**Expected Result:**
- ✅ User identified in PostHog after signup/login
- ✅ User properties visible (email, cohort)
- ✅ Events linked to correct user

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 7: Test Autocapture Events
**Objective:** Verify PostHog autocapture is working

**Steps:**
1. Use app normally:
   - Navigate between screens
   - Click buttons
   - Interact with UI elements
2. Check PostHog dashboard → Live Events
3. Verify autocapture events appear:
   - Page views
   - Clicks
   - Other interactions

**Expected Result:**
- ✅ Autocapture events appear in PostHog
- ✅ Events include user context
- ✅ Events timestamped correctly

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 8: Test Custom Events - Task Management
**Objective:** Verify custom task events are tracked

**Steps:**
1. **Add a task:**
   - Create a new task
   - Check PostHog dashboard → Events → `task_added`
   - Verify properties: `task_id`, `workflow_mode`

2. **Complete a task:**
   - Mark a task as complete
   - Check PostHog dashboard → Events → `task_completed`
   - Verify properties: `task_id`

3. **Delete a task:**
   - Delete a task
   - Check PostHog dashboard → Events → `task_deleted`
   - Verify properties: `task_id`

**Expected Result:**
- ✅ `task_added` event tracked with correct properties
- ✅ `task_completed` event tracked with correct properties
- ✅ `task_deleted` event tracked with correct properties
- ✅ All events linked to correct user

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 9: Test Custom Events - Authentication
**Objective:** Verify authentication events are tracked

**Steps:**
1. **Sign up (if new account):**
   - Complete signup flow
   - Check PostHog dashboard → Events → `user_signed_up`
   - Verify properties: `user_id`, `email`, `cohort`

2. **Log in:**
   - Log in with existing account
   - Check PostHog dashboard → Events → `user_logged_in`
   - Verify properties: `user_id`, `email`

**Expected Result:**
- ✅ `user_signed_up` event tracked on signup
- ✅ `user_logged_in` event tracked on login
- ✅ Events include correct user properties

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 10: Test Custom Events - Paywall
**Objective:** Verify paywall events are tracked

**Steps:**
1. Navigate to paywall (if applicable)
2. View paywall screen
3. Check PostHog dashboard → Events → `paywall_viewed`
4. Verify properties: `cohort`, `days_remaining`, `tasks_remaining`

**Expected Result:**
- ✅ `paywall_viewed` event tracked
- ✅ Event includes correct properties
- ✅ Event linked to correct user

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 11: Test Edge Function Event - Email Sent
**Objective:** Verify email_sent event tracked from Edge Function

**Steps:**
1. Ensure you have open tasks
2. Trigger daily email (via Settings → Send Test Email)
3. Check PostHog dashboard → Events → `email_sent`
4. Verify properties: `user_id`, `email`, `task_count`, `workflow_mode`, `cohort`

**Expected Result:**
- ✅ `email_sent` event tracked from Edge Function
- ✅ Event includes correct properties
- ✅ Event linked to correct user

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

## 🔄 INTEGRATION TESTING

### Test 12: Verify No Conflicts
**Objective:** Ensure Sentry and PostHog don't interfere with each other

**Steps:**
1. Use app normally
2. Verify both services working:
   - Sentry capturing errors (if any)
   - PostHog tracking events
3. Check for any errors or crashes

**Expected Result:**
- ✅ Both Sentry and PostHog working simultaneously
- ✅ No conflicts or interference
- ✅ App functionality unchanged

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

### Test 13: Performance Check
**Objective:** Verify integrations don't impact app performance

**Steps:**
1. Use app normally
2. Monitor:
   - App startup time
   - Screen transition speed
   - Task operations speed
3. Compare with previous version (if possible)

**Expected Result:**
- ✅ No noticeable performance degradation
- ✅ App feels responsive
- ✅ Startup time acceptable

**Status:** [ ] Pass / [ ] Fail / [ ] Not Tested

---

## 📝 TEST RESULTS SUMMARY

### Sentry Tests:
- [ ] Test 1: Sentry Initialization
- [ ] Test 2: JavaScript Error Capture
- [ ] Test 3: Error Boundary
- [ ] Test 4: Release Tracking

### PostHog Tests:
- [ ] Test 5: PostHog Initialization
- [ ] Test 6: User Identification
- [ ] Test 7: Autocapture Events
- [ ] Test 8: Task Events
- [ ] Test 9: Auth Events
- [ ] Test 10: Paywall Events
- [ ] Test 11: Email Events

### Integration Tests:
- [ ] Test 12: No Conflicts
- [ ] Test 13: Performance Check

---

## 🐛 ISSUES FOUND

**Document any issues discovered during testing:**

1. **Issue:** [Description]
   - **Severity:** [Critical/High/Medium/Low]
   - **Steps to Reproduce:** [Steps]
   - **Expected:** [Expected behavior]
   - **Actual:** [Actual behavior]

---

## ✅ SIGN-OFF

**Tester:** _________________  
**Date:** _________________  
**Build Version:** 1.0.8 (versionCode 11)  
**Overall Status:** [ ] Pass / [ ] Fail / [ ] Partial

**Notes:**
[Any additional notes or observations]

---

**Last Updated:** 2025-01-27  
**Created By:** James (Dev Agent)

