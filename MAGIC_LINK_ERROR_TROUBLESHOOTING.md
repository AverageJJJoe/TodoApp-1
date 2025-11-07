# Magic Link Error Troubleshooting - Production Build

**Issue:** "Unable to send magic link. Please try again." error when requesting magic link in production build.

**Date:** 2025-01-27  
**Build Type:** Production AAB (Internal Testing)

---

## 🔍 Root Cause Analysis

The error occurs at line 626 in `AuthScreen.tsx` when `supabase.auth.signInWithOtp()` fails. Common causes:

1. **Supabase Redirect URL Not Configured** (Most Likely)
2. **Environment Variables Not Set in EAS Build**
3. **Network/API Issue**

---

## ✅ Solution Steps

### Step 1: Verify Supabase Redirect URL Configuration ✅ **COMPLETE**

**This is the most common cause of this error.**

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `zrnjxrtgrommlhexbpde`

2. **Navigate to Authentication Settings**
   - Left sidebar → **Authentication**
   - Click **URL Configuration** (or "Redirect URLs")

3. **Verify Redirect URLs Are Added** ✅ **COMPLETE**
   - ✅ `todotomorrow://auth/callback` (required for custom scheme)
   - ✅ `https://todotomorrow.com/auth/callback` (for Universal Links)
   
4. **If Missing, Add Them:**
   - Click **"Add URL"** or **"+"**
   - Add: `todotomorrow://auth/callback`
   - Click **Save**

**Why This Matters:**
- Supabase **rejects** magic link requests if the redirect URL isn't whitelisted
- The error message is generic ("Unable to send magic link") for security
- This is a common issue when moving from dev to production

**Status:** ✅ **COMPLETE** - Both redirect URLs are now configured in Supabase Dashboard

---

### Step 2: Verify EAS Build Environment Variables

**Check if environment variables are set in EAS:**

```bash
# List all secrets
eas secret:list

# Verify these secrets exist:
# - EXPO_PUBLIC_SUPABASE_URL
# - EXPO_PUBLIC_SUPABASE_ANON_KEY
```

**If Missing, Add Them:**

```bash
# Add Supabase URL
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://zrnjxrtgrommlhexbpde.supabase.co" --scope project

# Add Supabase Anon Key
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybmp4cnRncm9tbWxoZXhicGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc2OTQsImV4cCI6MjA3NzQ2MzY5NH0.8Ci--doOpAqx9FRGLH_cIF4E4xPHIKszlwp0DorSvOo" --scope project
```

**Note:** Your `app.json` has hardcoded values, but `app.config.js` (if it exists) takes precedence and reads from env vars. If env vars aren't set, the build will fail or use undefined values.

---

### Step 3: Check Console Logs for Detailed Error

**In the production build, check for detailed error logs:**

The code logs the actual error at line 627:
```typescript
console.error('Magic link error:', error);
```

**To see logs:**
- **Android:** Use `adb logcat` or Android Studio Logcat
- **Or:** Add temporary Alert to show error details:
  ```typescript
  if (error) {
    Alert.alert('Error Details', JSON.stringify(error));
    setErrorMessage('Unable to send magic link. Please try again.');
  }
  ```

**Common Error Messages:**
- `"Invalid redirect URL"` → Redirect URL not configured in Supabase
- `"Email rate limit exceeded"` → Too many requests (wait a few minutes)
- `"Invalid API key"` → Environment variable issue
- `"Network error"` → Connectivity issue

---

### Step 4: Verify App Configuration

**Check which config file is being used:**

Your project has both:
- `app.json` (hardcoded values) ✅
- `app.config.js` (reads from env vars) ⚠️

**If `app.config.js` exists, it takes precedence.** Check if env vars are undefined:

```javascript
// In app.config.js, check:
console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
```

**Quick Fix Option:**
- Temporarily hardcode values in `app.config.js` for testing:
  ```javascript
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || "https://zrnjxrtgrommlhexbpde.supabase.co",
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  }
  ```

---

## 🧪 Testing After Fix

1. **Request a NEW Magic Link** ⚠️ **IMPORTANT**
   - **Old magic link emails won't work** - they were sent before the redirect URL was configured
   - Open the app
   - Enter your email address
   - Tap "Send Magic Link"
   - Should see "Check your email" message (not error)

2. **Check Your Email**
   - Open the NEW magic link email
   - Click the link
   - App should open and authenticate automatically

3. **If Still Getting Error:**
   - Wait 1-2 minutes (in case of rate limiting)
   - Try again with same email
   - Check console logs for detailed error (Step 3 above)

---

## 📋 Quick Checklist

- [x] **Supabase Dashboard:** Redirect URL `todotomorrow://auth/callback` added ✅
- [x] **Supabase Dashboard:** Redirect URL `https://todotomorrow.com/auth/callback` added ✅
- [ ] **EAS Secrets:** `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` set
- [ ] **App Config:** Verify which file is used (`app.json` vs `app.config.js`)
- [ ] **Console Logs:** Check detailed error message (if still failing)
- [ ] **Test:** Request new magic link after fixes

---

## 🎯 Most Likely Fix

**90% chance it's Step 1:** Supabase redirect URL not configured.

**Action:** Go to Supabase Dashboard → Authentication → URL Configuration → Add `todotomorrow://auth/callback`

---

## 📞 If Still Not Working

1. **Check detailed error logs** (Step 3)
2. **Verify network connectivity** on device
3. **Test with different email** (in case of rate limiting)
4. **Check Supabase project status** (not paused/disabled)

---

## Notes

- The error message is intentionally generic for security (doesn't reveal if email exists)
- Supabase requires redirect URLs to be whitelisted before sending magic links
- Production builds use different config than development (env vars vs hardcoded)

