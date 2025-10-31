# Deep Link Debugging

## Current Situation

✅ **App opens when clicking magic link** - Deep link is working!
❌ **getInitialURL() returns null** - React Native isn't capturing it

## What to Check

### Step 1: What URL is in the Browser?

When you click the magic link in email and it opens the browser:

1. **Look at the browser address bar** - What URL do you see?
2. **Check if it redirects** - Does it show:
   - Supabase verification page first?
   - Then redirect to `todotomorrow://auth/callback?token=...`?
   
3. **Copy the URL** - When you see `todotomorrow://auth/callback?token=...` in the address bar, copy it

### Step 2: Test Manual Paste

Since the app opens but we're not capturing the URL automatically:

1. **Click magic link** → Opens in browser
2. **Wait for redirect** → Look for `todotomorrow://auth/callback?token=...` in address bar
3. **Copy that full URL**
4. **Go to your app** (should be open now)
5. **Paste the URL** into the input field "Paste magic link URL or token here"
6. **Watch console** - Should process automatically

This will tell us:
- ✅ If the handler works (we know it does from test button)
- ✅ If the URL format is correct
- ✅ If token verification works

### Step 3: Alternative - Check Browser Console

When the link opens in browser:

1. Open browser developer tools (if on desktop) or
2. Check if browser shows any errors
3. See what URL it's trying to redirect to

## Possible Solutions

### Option 1: Android Intent Filter Issue

The deep link might not be properly registered. We added it to `app.json` but need to rebuild:

```bash
eas build --profile development --platform android
```

### Option 2: URL Format Mismatch

The URL format from Supabase might not match what we're expecting. We need to see the actual URL.

### Option 3: React Native Linking Timing

`getInitialURL()` might be called too early. We're already trying multiple approaches but may need native module.

---

## Next Steps

1. **Share the browser URL** you see when clicking the magic link
2. **Try pasting it manually** in the app input field
3. **Share console logs** from the paste attempt

This will help us diagnose the exact issue!

