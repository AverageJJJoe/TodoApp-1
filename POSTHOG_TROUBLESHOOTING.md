# PostHog Troubleshooting Guide - Play Console Build
**Date:** 2025-01-27  
**Build Version:** 1.0.8 (versionCode 11)  
**Issue:** PostHog not showing events in dashboard

---

## 🔍 DIAGNOSIS

### Current Status:
- ✅ EAS secrets configured (`EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_POSTHOG_HOST`)
- ✅ PostHog initialized in `App.tsx`
- ✅ User identification configured in `authStore.ts`
- ✅ Event tracking functions implemented
- ❌ **No events appearing in PostHog dashboard**

---

## 🎯 POSTHOG DASHBOARD NAVIGATION (For Beginners)

### Step 1: Access PostHog Dashboard
1. Go to: https://posthog.com/project/247541
2. Log in with your PostHog account
3. You should see the project dashboard

### Step 2: Check Live Events
**This is the easiest way to see if events are coming in:**

1. In PostHog dashboard, look for:
   - **"Activity"** tab (top navigation)
   - **"Live Events"** or **"Events"** section
   - **"Activity Feed"** (real-time events)

2. **If you see "Install PostHog" message:**
   - This usually means NO events have been received yet
   - PostHog shows this when the project is empty

### Step 3: Verify Project Settings
1. Go to: **Settings** → **Project** (or gear icon)
2. Check:
   - **Project API Key:** Should match your EAS secret (`phc_wbVxqoHW4r7aIDKFCZhthadcj2t3olV685JauaS40jU`)
   - **Project ID:** Should be `247541`
   - **Host:** Should be `https://us.i.posthog.com` (or EU if you're using EU)

---

## 🐛 TROUBLESHOOTING STEPS

### Issue 1: PostHog Not Initialized (Silent Failure)

**Problem:** PostHog initialization fails silently in production (no error logs)

**Check:**
1. Verify EAS secret is correct:
   ```bash
   eas env:list --scope project --environment production | Select-String "POSTHOG"
   ```

2. Check if API key matches PostHog dashboard:
   - PostHog Dashboard → Settings → Project → API Key
   - Should match: `phc_wbVxqoHW4r7aIDKFCZhthadcj2t3olV685JauaS40jU`

**Solution:** If API key doesn't match, update EAS secret:
```bash
eas env:update production --variable-name EXPO_PUBLIC_POSTHOG_KEY --value "phc_wbVxqoHW4r7aIDKFCZhthadcj2t3olV685JauaS40jU" --scope project
```

---

### Issue 2: Events Not Appearing (Delayed or Filtered)

**Problem:** Events might be delayed or filtered out

**Check:**
1. **Wait 1-2 minutes** - PostHog batches events, so there's a delay
2. **Check filters** - Make sure no filters are applied in dashboard
3. **Check time range** - Set to "Last 24 hours" or "All time"

**Solution:** 
- Use app normally for 2-3 minutes
- Then check PostHog dashboard again
- Events should appear within 1-2 minutes

---

### Issue 3: User Not Identified

**Problem:** Events appear but aren't linked to users

**Check:**
1. In PostHog dashboard → **Persons** → Search for your email
2. If user doesn't exist, identification might be failing

**Solution:** 
- Sign out and sign back in
- This triggers `identifyUser()` again
- Check PostHog dashboard → Persons after sign in

---

### Issue 4: PostHog SDK Not Working in Production

**Problem:** PostHog React Native SDK might not work correctly in production builds

**Check:**
1. Verify PostHog package is included in build:
   - Check `package.json` → `posthog-react-native` should be listed
   - Check build logs for any PostHog-related errors

**Solution:** 
- Rebuild app if package wasn't included
- Check native module linking (should be automatic with Expo)

---

## 🔧 DEBUGGING STEPS

### Step 1: Add Debug Logging (Temporary)

We need to add debug logging to see what's happening. Let me create a debug version:

**File:** `src/lib/posthog.ts`

Add logging even in production (temporary, for debugging):

```typescript
export function initPostHog() {
  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

  // TEMPORARY DEBUG: Log even in production
  console.log('🔍 [PostHog Debug] API Key exists:', !!apiKey);
  console.log('🔍 [PostHog Debug] Host:', host);

  if (!apiKey) {
    console.warn('⚠️ PostHog API key not configured. Analytics disabled.');
    return;
  }

  try {
    PostHog.setup(apiKey, {
      host,
      autocapture: true,
    });

    console.log('✅ PostHog initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize PostHog:', error);
  }
}
```

**Then rebuild and check logs:**
- Connect device via ADB
- Run: `adb logcat | Select-String "PostHog"`
- Look for initialization messages

---

### Step 2: Test PostHog Directly

**Manual Test:**
1. Open app
2. Sign up/login
3. Add a task
4. Complete a task
5. Wait 2-3 minutes
6. Check PostHog dashboard → Activity → Events

**Expected Events:**
- `$pageview` (autocapture)
- `$screen` (autocapture)
- `$autocapture` (autocapture clicks)
- `user_signed_up` or `user_logged_in` (custom)
- `task_added` (custom)
- `task_completed` (custom)

---

### Step 3: Verify PostHog API Endpoint

**Test API directly:**

1. Get your PostHog API key: `phc_wbVxqoHW4r7aIDKFCZhthadcj2t3olV685JauaS40jU`
2. Test with curl (or Postman):
   ```bash
   curl -X POST https://us.i.posthog.com/capture/ \
     -H "Content-Type: application/json" \
     -d '{
       "api_key": "phc_wbVxqoHW4r7aIDKFCZhthadcj2t3olV685JauaS40jU",
       "event": "test_event",
       "distinct_id": "test_user_123",
       "properties": {
         "test": true
       }
     }'
   ```

3. Check PostHog dashboard → Activity → Should see `test_event`

**If this works:** PostHog API is fine, issue is in app
**If this fails:** Check API key or PostHog account

---

## 📋 CHECKLIST

### Pre-Testing:
- [ ] PostHog account active and accessible
- [ ] Project ID: `247541` matches dashboard
- [ ] API Key matches EAS secret
- [ ] Host URL correct (`https://us.i.posthog.com`)

### During Testing:
- [ ] App launches without crashes
- [ ] Sign up/login works
- [ ] Tasks can be added/completed/deleted
- [ ] Wait 2-3 minutes after actions
- [ ] Check PostHog dashboard → Activity → Events

### Post-Testing:
- [ ] Events appear in PostHog dashboard
- [ ] User identified in PostHog → Persons
- [ ] Custom events tracked (`task_added`, `task_completed`, etc.)
- [ ] Autocapture events visible (`$pageview`, `$screen`, etc.)

---

## 🎯 NEXT STEPS

1. **First:** Verify API key matches PostHog dashboard
2. **Second:** Use app for 2-3 minutes, then check PostHog Activity
3. **Third:** If still no events, add debug logging and rebuild
4. **Fourth:** Check ADB logs for PostHog initialization messages

---

## 📞 POSTHOG SUPPORT

If still not working:
1. Check PostHog status: https://status.posthog.com/
2. PostHog docs: https://posthog.com/docs/integrate/client/react-native
3. PostHog community: https://posthog.com/questions

---

**Last Updated:** 2025-01-27  
**Created By:** James (Dev Agent)

