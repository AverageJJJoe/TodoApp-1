# Deep Link Troubleshooting - White Screen Fix

## The Problem
When clicking the magic link email, you get a white screen instead of the app opening.

## What I Fixed

1. ✅ **Added support for 'signup' type** - Supabase uses `type=signup` for new users, not just `type=email`
2. ✅ **Added debug logging** - Console logs will show what's happening
3. ✅ **Better error messages** - You'll see specific error messages instead of white screen

## How to Test

### Step 1: Reload the App
Make sure the updated code is loaded:
- In Expo Go: Shake your device → "Reload"
- Or in terminal: Press `r` to reload
- Or close and reopen the app

### Step 2: Request a NEW Magic Link
1. Enter your email again
2. Click "Send Magic Link"
3. Wait for "Check your email" message

### Step 3: Click the Magic Link in Email
Click the "Confirm your mail" link in the new email.

### Step 4: Check What Happens

**Expected Results:**
- ✅ App should open (if not already open)
- ✅ You should see either:
  - "Successfully signed in!" message (SUCCESS!)
  - OR an error message explaining what went wrong (instead of white screen)

**If you still see white screen:**
- Check the Expo terminal/console for debug logs
- Look for messages starting with 🔗, 📦, 🔑, etc.
- Share those logs with me

## Understanding the Flow

1. **Email Link:** `https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?token=...&redirect_to=todomorning://auth/callback`
   - This is a web page hosted by Supabase

2. **Supabase Redirect:** The web page should automatically redirect to:
   - `todomorning://auth/callback?token=...&type=signup`
   - This is the deep link that opens your app

3. **App Receives Deep Link:** Your app should catch this and verify the token

## Possible Issues

### Issue 1: Web Page Not Redirecting
If you see the Supabase web page instead of the app opening:
- This means the redirect isn't working
- Try manually copying the redirect URL and opening it
- Or check if the Supabase redirect URL is correctly configured

### Issue 2: Deep Link Not Caught
If nothing happens when clicking:
- Check if `todomorning://` scheme is registered in your phone
- For Expo Go, the scheme should work automatically
- Try manually opening: `todomorning://auth/callback?token=test&type=signup`

### Issue 3: Error in Handler
If you see error messages:
- Check the console logs for details
- The error message should tell you what went wrong
- Common issues:
  - Token expired (request new link)
  - Invalid token format
  - Network error

## Debug Console Logs

When you click the magic link, watch the Expo terminal/console. You should see logs like:

```
🔗 Deep link received: todomorning://auth/callback?token=...
📦 Parsed URL: {...}
🔑 Query params: {...}
🎫 Token: Found Type: signup
✅ Processing authentication...
🔐 Verifying OTP with type: signup
✅ Token verified, getting session...
🎉 Session created successfully!
```

If you see error messages (❌), share them and I'll help fix them.

## Manual Test (Alternative)

If clicking the email link doesn't work, you can test the deep link manually:

1. **Get the token from the email URL:**
   - Copy the full email link
   - Extract the `token=XXXXX` part

2. **Manually trigger deep link:**
   - iOS Simulator: `xcrun simctl openurl booted "todomorning://auth/callback?token=YOUR_TOKEN&type=signup"`
   - Android: `adb shell am start -W -a android.intent.action.VIEW -d "todomorning://auth/callback?token=YOUR_TOKEN&type=signup"`

This bypasses the email/web redirect and tests the deep link handler directly.

