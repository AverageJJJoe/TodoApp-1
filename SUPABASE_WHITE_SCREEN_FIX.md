# Supabase White Screen Fix

## The Problem

You're seeing a white screen because Supabase's verification page (`https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?...`) is trying to redirect to `todotomorrow://auth/callback`, but browsers block custom scheme redirects from HTTPS pages for security reasons.

**The URL you're seeing:**
```
https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?token=...&redirect_to=todotomorrow://auth/callback
```

## Why This Happens

1. **Old Magic Link Email:** The email was sent before the code was updated, so it still has `redirect_to=todotomorrow://auth/callback`
2. **App Not Reloaded:** The app might still be running old code that sends the custom scheme URL
3. **Supabase Dashboard Override:** Supabase might be using the dashboard redirect URL instead of the API parameter

## Fix Steps (Do All of These)

### Step 1: Reload the App ⚠️ CRITICAL

**In Expo Go:**
- Shake device → "Reload"
- OR close and reopen the app

**In Development Build:**
- Rebuild and reinstall the app

**Why:** The code change won't take effect until the app is reloaded.

### Step 2: Verify Supabase Dashboard Configuration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to: **Authentication** → **URL Configuration**
3. **Verify both URLs are listed:**
   - ✅ `https://todotomorrow.com/auth/callback` (must be present)
   - ✅ `todotomorrow://auth/callback` (can keep for fallback)

4. **Important:** Make sure the web URL (`https://todotomorrow.com/auth/callback`) is **checked/enabled**

### Step 3: Request a NEW Magic Link

**After reloading the app:**
1. Enter your email
2. Click "Send Magic Link"
3. **Wait for "Check your email" message**
4. Open the NEW email (not the old one!)

**Why:** Old emails have the old redirect URL baked in. You need a fresh email with the new redirect URL.

### Step 4: Verify the Email Link

**In the new email, check the link:**
- ✅ **Should contain:** `redirect_to=https://todotomorrow.com/auth/callback`
- ❌ **Should NOT contain:** `redirect_to=todotomorrow://auth/callback`

**Example of correct email link:**
```
https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?token=...&redirect_to=https://todotomorrow.com/auth/callback
```

### Step 5: Test the Flow

1. Click the link in the NEW email
2. **Expected behavior:**
   - Supabase verification page loads briefly
   - Redirects to `https://todotomorrow.com/auth/callback`
   - Our redirect page loads (you'll see "Opening TodoTomorrow...")
   - App opens automatically (or shows fallback button)

3. **If still white screen:**
   - Check browser console for errors
   - Verify redirect page is accessible: `https://todotomorrow.com/auth/callback?token=test&type=magiclink`

## Verification Checklist

Before testing, verify:

- [ ] App has been reloaded (Step 1)
- [ ] Supabase dashboard has `https://todotomorrow.com/auth/callback` in redirect URLs
- [ ] New magic link email was requested (after app reload)
- [ ] New email link contains `redirect_to=https://todotomorrow.com/auth/callback`
- [ ] Redirect page is uploaded to Cloudways: `https://todotomorrow.com/auth/callback` loads correctly

## Why Custom Scheme Causes White Screen

Browsers (Chrome, Safari, etc.) have security restrictions:
- **HTTPS pages cannot redirect to custom schemes** (`todotomorrow://`)
- This prevents malicious websites from hijacking apps
- Result: Redirect fails silently → white screen

**Solution:** Use HTTPS URLs (`https://todotomorrow.com/auth/callback`) which browsers allow, then redirect to app from our page.

## Quick Test

To verify everything is working:

1. **Test redirect page directly:**
   ```
   https://todotomorrow.com/auth/callback?token=test123&type=magiclink
   ```
   Should show the "Opening TodoTomorrow..." page.

2. **Test Supabase redirect:**
   - Request NEW magic link (after app reload)
   - Check email link contains `https://todotomorrow.com/auth/callback`
   - Click link
   - Should redirect to our page, then open app

## Still Not Working?

If you've done all steps and still see white screen:

1. **Check browser console:**
   - Open Chrome DevTools → Console tab
   - Look for JavaScript errors
   - Share any errors you see

2. **Verify redirect page:**
   - Visit `https://todotomorrow.com/auth/callback?token=test&type=magiclink`
   - Should show page (not white screen)

3. **Check Supabase logs:**
   - Supabase Dashboard → Logs
   - Look for authentication errors

Let me know what you find!

