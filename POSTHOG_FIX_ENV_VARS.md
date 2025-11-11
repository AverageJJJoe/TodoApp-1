# PostHog Fix - Environment Variables Not Available
**Date:** 2025-01-27  
**Issue:** PostHog not receiving events - environment variables not accessible in production build

---

## 🔍 ROOT CAUSE

**Problem:** `process.env.EXPO_PUBLIC_POSTHOG_KEY` is not available in production builds.

**Why:** 
- EAS secrets set environment variables during build
- But `process.env.EXPO_PUBLIC_*` might not be directly accessible in React Native code
- Need to use `Constants.expoConfig?.extra` to access env vars in production

**Solution:** 
- Updated `app.config.js` to expose PostHog config in `extra` section
- Updated `src/lib/posthog.ts` to check multiple sources for API key
- Added debug logging to diagnose the issue

---

## ✅ FIXES APPLIED

### 1. Updated `app.config.js`
Added PostHog config to `extra` section:
```javascript
extra: {
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY,
  posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  EXPO_PUBLIC_POSTHOG_KEY: process.env.EXPO_PUBLIC_POSTHOG_KEY,
  EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  // ... other config
}
```

### 2. Updated `src/lib/posthog.ts`
Now checks multiple sources for API key:
- `process.env.EXPO_PUBLIC_POSTHOG_KEY` (direct access)
- `Constants.expoConfig?.extra?.posthogKey` (via app config)
- `Constants.expoConfig?.extra?.EXPO_PUBLIC_POSTHOG_KEY` (alternative)

### 3. Added Debug Logging
- Logs API key existence and length
- Logs which source provided the key
- Sends test event on initialization
- Enables PostHog debug mode

---

## 🚀 NEXT STEPS

### Step 1: Rebuild App
**The fix requires a rebuild:**

```bash
eas build --platform android --profile production
```

**Why rebuild?**
- `app.config.js` changes require rebuild
- New debug logging will help diagnose
- PostHog config now properly exposed

### Step 2: Test After Rebuild
1. Install new build from Play Console
2. Launch app
3. Check ADB logs for PostHog debug messages:
   ```bash
   adb logcat | Select-String "PostHog"
   ```
4. Look for:
   - `🔍 [PostHog Debug] API Key exists: true`
   - `✅ PostHog initialized successfully`
   - `✅ PostHog test event sent`

### Step 3: Verify in PostHog Dashboard
1. Go to: https://posthog.com/project/247541
2. Check Activity Feed
3. Should see `posthog_initialized` event immediately
4. Then test: sign in, add task, complete task
5. Events should appear within 1-2 minutes

---

## 🔍 VERIFICATION

After rebuild, check logs for:

**Success indicators:**
- ✅ `API Key exists: true`
- ✅ `PostHog initialized successfully`
- ✅ `PostHog test event sent`
- ✅ Events appear in PostHog dashboard

**Failure indicators:**
- ❌ `API Key exists: false` → EAS secret not set correctly
- ❌ `Failed to initialize PostHog` → Check error details
- ❌ No events in dashboard → Check network/API key

---

## 📝 NOTES

**Why this approach?**
- Sentry works because it uses `process.env.EXPO_PUBLIC_SENTRY_DSN` directly
- But PostHog might need it via `Constants.expoConfig.extra`
- Checking both ensures compatibility

**Debug mode:**
- PostHog debug mode enabled (`debug: true`)
- Will show more detailed logs
- Can be disabled after verification

---

**Last Updated:** 2025-01-27  
**Created By:** James (Dev Agent)  
**Status:** Ready for rebuild

