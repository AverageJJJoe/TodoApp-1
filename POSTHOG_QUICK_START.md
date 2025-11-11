# PostHog Quick Start Guide - For Beginners
**Date:** 2025-01-27

---

## 🎯 WHAT IS POSTHOG?

PostHog is an analytics platform that tracks:
- **User actions** (clicks, page views, etc.)
- **Custom events** (task_added, task_completed, etc.)
- **User identification** (who did what)
- **User properties** (email, cohort, etc.)

---

## 📍 WHERE TO FIND EVENTS IN POSTHOG DASHBOARD

### Step 1: Log In
1. Go to: https://posthog.com/project/247541
2. Log in with your PostHog account

### Step 2: Find Events (3 Ways)

#### Method 1: Activity Feed (Easiest)
1. Look for **"Activity"** tab in top navigation
2. Or look for **"Live Events"** section
3. You'll see events in real-time (with 1-2 minute delay)

#### Method 2: Events List
1. Click **"Events"** in left sidebar
2. You'll see a list of all events
3. Filter by event name (e.g., `task_added`)

#### Method 3: Activity Feed (Homepage)
1. On the project homepage
2. Look for **"Activity Feed"** widget
3. Shows recent events

---

## 🔍 WHAT EVENTS TO LOOK FOR

### Autocapture Events (Automatic):
- `$pageview` - When user views a screen
- `$screen` - Screen views
- `$autocapture` - Automatic click tracking

### Custom Events (Our App):
- `user_signed_up` - When user signs up
- `user_logged_in` - When user logs in
- `task_added` - When user adds a task
- `task_completed` - When user completes a task
- `task_deleted` - When user deletes a task
- `paywall_viewed` - When paywall is shown
- `email_sent` - When daily email is sent

---

## ✅ HOW TO VERIFY POSTHOG IS WORKING

### Test 1: Check Activity Feed
1. Open app on your device
2. Sign up or log in
3. Add a task
4. Complete a task
5. Wait 2-3 minutes
6. Go to PostHog dashboard → Activity Feed
7. **You should see events appearing**

### Test 2: Check User Identification
1. After signing up/logging in
2. Go to PostHog dashboard → **Persons** (left sidebar)
3. Search for your email address
4. **You should see your user profile**
5. Click on your user → See all events linked to you

### Test 3: Check Specific Event
1. Go to PostHog dashboard → **Events** (left sidebar)
2. Search for: `task_added`
3. **You should see events with properties:**
   - `task_id` (the task ID)
   - `workflow_mode` (if available)
   - `user_id` (your user ID)

---

## 🐛 IF YOU SEE "INSTALL POSTHOG" MESSAGE

**This means:** No events have been received yet

**Possible reasons:**
1. PostHog not initialized (API key missing)
2. Events delayed (wait 2-3 minutes)
3. Network issue (check internet connection)
4. Wrong project (verify Project ID: 247541)

**What to do:**
1. Verify API key matches PostHog dashboard
2. Use app for 2-3 minutes
3. Check Activity Feed again
4. If still nothing, check ADB logs (see troubleshooting guide)

---

## 📊 UNDERSTANDING POSTHOG DASHBOARD

### Main Sections:
- **Activity Feed** - Real-time events (what's happening now)
- **Events** - All events (searchable list)
- **Persons** - User profiles (who did what)
- **Insights** - Analytics charts (for later)
- **Settings** - Project configuration

### Event Properties:
Each event has properties (like metadata):
- `task_id` - Which task was added/completed
- `user_id` - Which user did the action
- `email` - User's email
- `cohort` - User's cohort (A/B test group)
- `timestamp` - When it happened

---

## 🎯 QUICK TEST CHECKLIST

1. [ ] Open PostHog dashboard → Activity Feed
2. [ ] Open app on device
3. [ ] Sign up/login
4. [ ] Add a task
5. [ ] Complete a task
6. [ ] Wait 2-3 minutes
7. [ ] Check PostHog Activity Feed → **Should see events!**

---

## 📞 NEED HELP?

If events still don't appear:
1. Check `POSTHOG_TROUBLESHOOTING.md` for detailed steps
2. Check ADB logs: `adb logcat | Select-String "PostHog"`
3. Verify API key matches PostHog dashboard

---

**Last Updated:** 2025-01-27  
**Created By:** James (Dev Agent)

