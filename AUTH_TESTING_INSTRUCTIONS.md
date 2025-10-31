# Authentication Testing Instructions

## ✅ **Critical: Use Development Build App (NOT Expo Go)**

**Important:** You MUST use the development build app you just installed, NOT Expo Go.

1. **Close Expo Go completely**
2. **Open the development build app** (the one you installed via QR code)
3. **Test auth flow in that app**

---

## 🔧 **What I Just Fixed**

1. ✅ Changed redirect URL from `https://todotomorrow.com/auth/callback` → `todotomorrow://auth/callback`
   - Custom scheme works immediately with development build
   - No need for Universal Links configuration

2. ✅ Added custom scheme to Android intentFilters
   - Android will now recognize `todotomorrow://` links

---

## 📋 **Testing Steps**

### Step 1: Rebuild App (Required)

The code change requires rebuilding:

```bash
# Rebuild development build with updated code
eas build --profile development --platform android
```

**OR** if you're using EAS Update for faster iteration:

```bash
eas update --branch development
```

**OR** for fastest testing (local development):
- Stop Metro bundler
- Restart with: `npx expo start --dev-client`
- Press `a` to open on Android emulator

---

### Step 2: Configure Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to: **Authentication** → **URL Configuration**
4. **Add/Verify these redirect URLs:**
   - ✅ `todotomorrow://auth/callback` (must be present)
   - ✅ `https://todotomorrow.com/auth/callback` (can keep for future)

---

### Step 3: Request New Magic Link

**Important:** Old magic links have the old redirect URL. You need a NEW email:

1. Open the **development build app** (not Expo Go!)
2. Enter your email
3. Tap "Send Magic Link"
4. Wait for "Check your email" message

---

### Step 4: Click Magic Link

**On Android Emulator:**

When you click the link in Gmail:
- It should ask: **"Open with..."** → Select your development build app
- OR it should automatically open the app

**If it opens in browser:**
- The Supabase verification page should redirect to `todotomorrow://auth/callback`
- Android should prompt: **"Open with TodoTomorrow?"** → Select your app

**If you see a browser page:**
- Look for a redirect or "Open in app" button
- OR manually copy the `todotomorrow://auth/callback?token=...` URL
- Paste it in a new tab (Android will prompt to open with app)

---

### Step 5: Watch Console Logs

You should see:

```
🔗 Deep link event received: todotomorrow://auth/callback?token=...&type=...
🔗 Deep link received: [full URL]
📦 Parsed URL: {...}
🔍 URL scheme: todotomorrow
🔍 URL path: auth/callback
🔑 Query params: {...}
🎫 Token: Found (abc123...)
✅ Processing authentication...
🔐 Verifying OTP with type: email
✅ Token verified successfully
🎉 Session created successfully!
👤 User email: [your email]
🔄 Auth state changed: SIGNED_IN
✅ SIGNED_IN event - updating session in store
[Navigation to MainScreen should happen]
```

---

## 🐛 **Troubleshooting**

### Problem: Link opens in browser, not app

**Solution:**
1. Make sure you're using the **development build app**, not Expo Go
2. Check Android default apps: Settings → Apps → Default apps → Opening links
3. Find your app in the list and enable it for `todotomorrow://` links

### Problem: No "Open with" prompt

**Solution:**
- Manually copy the `todotomorrow://auth/callback?token=...` URL from browser
- Open Android settings → Apps → Your app → Open by default → Add link
- OR use ADB command:
  ```bash
  adb shell am start -W -a android.intent.action.VIEW -d "todotomorrow://auth/callback?token=TEST"
  ```

### Problem: No deep link logs appear

**Check:**
- Are you looking at the **correct console**? (Development build app, not Expo Go)
- Is the app running in the foreground when you click the link?
- Try restarting the app after clicking the link

### Problem: "Token verification error"

**Check:**
- Is the token expired? (Supabase tokens expire in 1 hour)
- Request a **NEW** magic link after the code changes
- Check Supabase Dashboard → Authentication → URL Configuration has `todotomorrow://auth/callback`

---

## ✅ **Success Indicators**

- ✅ Deep link logs appear in console
- ✅ Token verification succeeds
- ✅ Session created message
- ✅ App navigates to MainScreen automatically
- ✅ Session persists (close and reopen app, should stay logged in)

---

## 📝 **Quick Test Command**

You can manually test deep linking with ADB:

```bash
adb shell am start -W -a android.intent.action.VIEW -d "todotomorrow://auth/callback?token=test123&type=email"
```

This should open your app and you should see the deep link logs in console.

---

**Last Updated:** 2025-01-27  
**Status:** Ready for testing after rebuild

