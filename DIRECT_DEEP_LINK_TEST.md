# Direct Deep Link Test - Bypass Supabase Redirect

## The Problem

Supabase's web page (`https://...verify?...`) is showing a white screen instead of redirecting to `todomorning://auth/callback`. This means the redirect mechanism isn't working.

## ✅ Solution: Test Deep Link Directly

We'll bypass Supabase's redirect page and test the deep link handler directly.

### Step 1: Extract Token from Email

From your email link:
```
https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?token=c5edb72ca94c8eb95d18672da27bb4971ffd2dd97384f89cb752168e&type=magiclink&redirect_to=todomorning://auth/callback
```

**Your token is:** `c5edb72ca94c8eb95d18672da27bb4971ffd2dd97384f89cb752168e`

### Step 2: Manually Open Deep Link on Phone

**On your phone (where Expo Go is running):**

1. **Open Chrome browser**
2. **In the address bar, type exactly:**
   ```
   todomorning://auth/callback?token=c5edb72ca94c8eb95d18672da27bb4971ffd2dd97384f89cb752168e&type=magiclink
   ```
3. **Press Enter/Go**
4. **You should see a prompt:** "Open in Expo Go?" or similar
5. **Tap "Open"**
6. **Expo Go should open** and process the authentication

### Step 3: Check Console Logs

**In your Expo terminal (on PC),** you should see logs like:
```
🔗 Deep link received: todomorning://auth/callback?token=...
📦 Parsed URL: {...}
🔑 Query params: {...}
🎫 Token: Found Type: magiclink
✅ Processing authentication...
```

### What This Tests

This bypasses Supabase's redirect page entirely and tests:
1. ✅ Deep link registration (`todomorning://` scheme)
2. ✅ Deep link handler in your app
3. ✅ Token extraction and verification
4. ✅ Session creation

## 🔍 If Direct Deep Link Works But Email Link Doesn't

This confirms:
- ✅ Your deep link handler works
- ✅ Expo Go can receive deep links
- ❌ Supabase's redirect page isn't working properly

**Next steps:** We'll need to fix the Supabase redirect configuration.

## 🔍 If Direct Deep Link Also Doesn't Work

This suggests:
- ❌ Deep link isn't registered (check `app.json`)
- ❌ Expo Go isn't running
- ❌ System isn't recognizing the scheme

**Troubleshooting:**
1. Make sure Expo Go is **running** (not just installed)
2. Check `app.json` has `"scheme": "todomorning"` ✅ (we added this)
3. Restart Expo: `npx expo start -c`

## 📝 Alternative: Use Newer Token

If the token from the old email is expired, get a fresh one:
1. Request new magic link in app
2. Get new email
3. Extract new token
4. Use in manual deep link test above

Try the direct deep link test and let me know what happens!

