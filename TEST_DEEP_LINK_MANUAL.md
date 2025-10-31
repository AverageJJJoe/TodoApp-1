# Manual Deep Link Testing

Since Android isn't recognizing the app for `todotomorrow://` links yet, let's test manually.

## 🔧 **Quick Test: Use ADB to Test Deep Link**

This will manually trigger the deep link to see if your app handles it:

### Step 1: Test Deep Link Handler

1. **Make sure your development build app is open** (not Expo Go)
2. **Keep the PowerShell console visible** to see logs
3. **Run this command** in PowerShell:

```powershell
adb shell am start -W -a android.intent.action.VIEW -d "todotomorrow://auth/callback?token=test123&type=email"
```

**What to look for:**
- App should open/focus
- You should see `🔗 Deep link received` in console logs
- This confirms the deep link handler works

---

## 🔍 **Get the Real Token from Email**

The issue is that when you click the link, Android opens it in browser. But we can extract the token and test manually:

1. **In Gmail, long-press the magic link** → "Copy URL"
2. **The URL format will be:**
   ```
   https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?token=ACTUAL_TOKEN_HERE&type=magiclink&redirect_to=todotomorrow://auth/callback
   ```

3. **Extract the token** (the long string after `token=`)

4. **Test with real token** using ADB:
   ```powershell
   adb shell am start -W -a android.intent.action.VIEW -d "todotomorrow://auth/callback?token=YOUR_ACTUAL_TOKEN&type=email"
   ```
   (Replace `YOUR_ACTUAL_TOKEN` with the token from the email)

**What should happen:**
- App receives deep link
- Token verification happens
- Session created
- Navigate to MainScreen

---

## 🔄 **Alternative: Fix Android App Association**

The reason Android isn't showing "Open with app" is because:
1. App needs to be rebuilt with new intentFilters (after app.json change)
2. Android needs to verify the app can handle the scheme

### Option A: Rebuild Development Build

```bash
eas build --profile development --platform android
```

This will take ~20 minutes but ensures Android knows the app can handle `todotomorrow://`

### Option B: Manual App Association (Faster Testing)

1. On Android emulator:
   - Settings → Apps → See all apps
   - Find "TodoTomorrow" (your dev build app)
   - Open by default → Add link
   - Enable `todotomorrow://` scheme

2. OR use ADB:
   ```powershell
   adb shell pm set-app-links --package com.todotomorrow.app 0 "todotomorrow"
   ```

---

## 📧 **Workaround: Copy Token from Browser**

Since the link opens in browser:

1. **Click the magic link** → Opens Supabase verification page
2. **Look at the browser URL bar** - it might show the redirect URL with token
3. **If you see a redirect** to `todotomorrow://auth/callback?token=...`, that's the URL we need
4. **Copy that full URL** and paste it (Android should then prompt to open with app)

---

## 🎯 **Best Solution: Rebuild App**

The `app.json` changes (adding custom scheme to intentFilters) require a rebuild. The reload doesn't apply native configuration changes.

**Rebuild command:**
```bash
eas build --profile development --platform android
```

**Then:**
1. Install new build
2. Click magic link
3. Android should now show "Open with TodoTomorrow"

---

## 🔍 **Quick Debug: Check Current Link Format**

When you click the magic link in email, what exact URL does it open in the browser?

Look at the browser address bar - it should show:
- Either: `https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?...`
- Or after redirect: `todotomorrow://auth/callback?token=...&type=...`

Share what you see and we can fix the exact issue!

