# Authentication Issues Overview - Stories 2.1 & 2.2

**Purpose:** This document summarizes the authentication problems encountered during Story 2.1 and 2.2 development to help diagnose and fix the auth flow.

---

## ✅ RESOLVED - Current State

**Status:** ✅ **AUTHENTICATION FLOW IS NOW WORKING END-TO-END!** 🎉
**Date Resolved:** 2025-01-27
**Solution:** Native Android module + URL fragment parsing for Supabase tokens
**Impact:** Full production-ready authentication - users can click magic links from email and get automatically logged in

### What Was Fixed:
1. ✅ **Native Android Module** - Captures deep link intents before React Native initializes
2. ✅ **URL Fragment Parsing** - Properly extracts tokens from `#access_token=...&refresh_token=...` format
3. ✅ **Dual Token Support** - Handles both session tokens (fragment) and verification tokens (query params)
4. ✅ **Automatic Authentication** - No manual paste needed - works completely automatically

---

## 📋 What Was Supposed to Work

### Expected Authentication Flow:
1. User enters email in `AuthScreen`
2. Supabase sends magic link email
3. User clicks link in email
4. Deep link opens app with token
5. App verifies token and creates session
6. Session stored in Zustand store
7. `App.tsx` detects session → shows `MainScreen`
8. User can access authenticated features

---

## ❌ Issues Encountered

### Issue #1: Deep Link Not Reaching App (Primary Problem)

**What happens:**
- User clicks magic link in email
- Instead of app opening, user sees white screen OR browser page
- Deep link never reaches the React Native app
- Token verification never happens

**Where it fails:**
- `AuthScreen.tsx` deep link handler (line 62-191)
- Deep link listener never receives the URL
- `handleDeepLink()` function never executes

**Evidence:**
- No console logs showing "🔗 Deep link received"
- User never sees "Successfully signed in!" message
- Session is never created

**Files involved:**
- `src/screens/AuthScreen.tsx` - Deep link handler (lines 40-60, 62-191)
- `App.tsx` - Session checking logic (lines 10-59)

---

### Issue #2: Expo Go Limitation with Custom URL Schemes

**Problem:**
- Custom URL schemes (`todotomorrow://`) don't work in Expo Go
- Expo Go only recognizes `exp://` links
- Browser doesn't prompt "Open in Expo Go?" for custom schemes

**Documentation:**
- See `STORY_1.4_ISSUES_SUMMARY.md`
- Custom schemes only work in:
  - ✅ Development builds (EAS Build)
  - ✅ Production builds
  - ❌ NOT in Expo Go

**Current Workaround:**
- Using Universal Links (`https://todotomorrow.com/auth/callback`)
- Should work in all environments, but still having issues

---

### Issue #3: Session Not Detected After Auth

**What happens:**
- Token verification succeeds (logs show "✅ Token verified")
- Session creation appears to work
- But `App.tsx` doesn't detect the session
- User stays on `AuthScreen` instead of navigating to `MainScreen`

**Where it might fail:**
- `AuthScreen.tsx` line 156: `setSession(sessionData.session)` - Session set in store
- `App.tsx` line 10: `const session = useAuthStore((state) => state.session)` - Should detect session
- `App.tsx` line 69: Conditional rendering `{DEV_BYPASS_AUTH || session ? <MainScreen /> : <AuthScreen />}`

**Possible causes:**
- Session not persisting to AsyncStorage
- Zustand store not updating properly
- `onAuthStateChange` listener not firing
- Race condition between session creation and store update

---

### Issue #4: White Screen on Magic Link Click

**Problem:**
- User clicks magic link in email
- Instead of app opening, sees white/blank screen
- Usually happens when Supabase redirect page tries to redirect to custom scheme

**Documentation:**
- See `SUPABASE_WHITE_SCREEN_FIX.md`
- See `DEEP_LINK_TROUBLESHOOTING.md`

**Root cause:**
- HTTPS pages can't redirect to custom URL schemes (browser security)
- Supabase verification page can't automatically redirect to `todotomorrow://`

**Attempted fix:**
- Changed to Universal Links (`https://todotomorrow.com/auth/callback`)
- But Universal Links require proper domain configuration (Team ID, etc.)

---

## 🔧 Current Workaround

**File:** `App.tsx` (line 64)
```typescript
const DEV_BYPASS_AUTH = __DEV__ && true; // Enabled for Story 2.2 testing - auth flow needs fixing
```

**What it does:**
- Bypasses authentication check
- Always shows `MainScreen` in dev mode
- Allows testing UI features without auth

**Problem:**
- Can't test authenticated features (like Story 2.3 task saving)
- Not a real solution - just a workaround
- Needs to be removed before production

---

## 📁 Relevant Files

### Core Authentication Files:
1. **`App.tsx`** (lines 1-83)
   - Main app entry point
   - Session checking and navigation logic
   - `DEV_BYPASS_AUTH` workaround

2. **`src/screens/AuthScreen.tsx`** (lines 1-376)
   - Email input and magic link sending
   - Deep link handler (`handleDeepLink` function)
   - Token verification logic
   - Session creation and store update

3. **`src/stores/authStore.ts`** (lines 1-52)
   - Zustand store for session management
   - `initializeSession()` - Checks for existing session
   - `setSession()` - Updates session in store
   - `clearSession()` - Removes session

4. **`src/lib/supabase.ts`** (lines 1-23)
   - Supabase client configuration
   - AsyncStorage for session persistence

### Configuration Files:
5. **`app.json`**
   - Deep link scheme configuration
   - Universal Links setup (if configured)

---

## 🔍 Debug Information

### Console Logs to Check:
When auth flow works, you should see:
```
✅ Deep link received: [URL]
📦 Parsed URL: {...}
🔑 Query params: {...}
🎫 Token: Found, Type: [magiclink|signup|email]
✅ Processing authentication...
🔐 Verifying OTP with type: [type]
✅ Token verified, getting session...
🎉 Session created successfully! [email]
```

### What to Check if Not Working:
1. **No deep link logs:**
   - Deep link not reaching app
   - Check `Linking.getInitialURL()` and `Linking.addEventListener`
   - Verify app.json configuration

2. **Token verification fails:**
   - Check token format
   - Verify token type (`email`, `signup`, `magiclink`)
   - Check Supabase dashboard for token validity

3. **Session not created:**
   - Check `verifyOtp` response
   - Verify `getSession()` call after verification
   - Check AsyncStorage for session persistence

4. **Session created but not detected:**
   - Check Zustand store state
   - Verify `setSession()` was called
   - Check `onAuthStateChange` listener in App.tsx
   - Verify store subscription in components

---

## 🎯 What Needs Investigation

### Priority 1: Deep Link Not Reaching App
- [ ] Verify Universal Links configuration in app.json
- [ ] Check if deep link listener is properly set up
- [ ] Test with both `getInitialURL()` and `addEventListener`
- [ ] Verify app can receive deep links at all (test with simple URL)

### Priority 2: Session Detection Issue
- [ ] Verify session is actually being created in Supabase
- [ ] Check if session persists in AsyncStorage
- [ ] Verify Zustand store update triggers re-render
- [ ] Check if `onAuthStateChange` listener fires correctly
- [ ] Test session restoration on app restart

### Priority 3: Token Verification
- [ ] Verify token format from email link
- [ ] Check token type mapping (`magiclink` → `email` vs `signup`)
- [ ] Verify `verifyOtp` API call parameters
- [ ] Check Supabase logs for verification errors

---

## 🛠️ Potential Solutions to Try

### Solution 1: Fix Deep Link Listener
- Ensure `useEffect` in AuthScreen properly sets up listener
- Test with `Linking.canOpenURL()` first
- Add error handling for deep link setup

### Solution 2: Session Persistence Check
- Add explicit AsyncStorage check after session creation
- Verify session is written to storage
- Check session restoration on app restart

### Solution 3: Store Update Timing
- Ensure `setSession()` is called after successful verification
- Add delay or check to ensure store update completes
- Verify React re-render happens after store update

### Solution 4: Universal Links Configuration
- Verify domain is properly configured
- Check Team ID (iOS) / SHA-256 fingerprint (Android)
- Test Universal Links work in browser first
- Verify `apple-app-site-association` file (iOS)
- Verify `.well-known/assetlinks.json` file (Android)

---

## 📝 Code Locations Reference

### Deep Link Handler:
- **File:** `src/screens/AuthScreen.tsx`
- **Function:** `handleDeepLink` (line 62)
- **Setup:** `useEffect` with `Linking.addEventListener` (line 40)

### Session Management:
- **Store:** `src/stores/authStore.ts`
- **Initialization:** `App.tsx` line 17: `initializeSession()`
- **Update:** `AuthScreen.tsx` line 156: `setSession(sessionData.session)`
- **Check:** `App.tsx` line 10: `const session = useAuthStore(...)`

### Navigation Logic:
- **File:** `App.tsx` line 69
- **Condition:** `{DEV_BYPASS_AUTH || session ? <MainScreen /> : <AuthScreen />}`

---

## 📞 Questions for Your Dev Friend

1. **Deep Links:**
   - Are Universal Links properly configured for Expo?
   - Should we test with a development build instead of Expo Go?
   - Is there a better way to handle deep links in React Native/Expo?

2. **Session Management:**
   - Is the Zustand store update pattern correct?
   - Should we use Supabase's `onAuthStateChange` differently?
   - Is there a race condition between session creation and store update?

3. **Supabase Integration:**
   - Are we using `verifyOtp` correctly?
   - Should we use a different Supabase auth method?
   - Is the token type mapping (`magiclink` → `email`) correct?

4. **State Management:**
   - Should session checking happen differently?
   - Is `initializeSession()` called at the right time?
   - Should we add session restoration logic?

---

## 🔗 Related Documentation

- `STORY_1.4_ISSUES_SUMMARY.md` - Original auth implementation issues
- `DEEP_LINK_TROUBLESHOOTING.md` - Deep link debugging steps
- `SUPABASE_WHITE_SCREEN_FIX.md` - White screen fix attempts
- `docs/stories/1.4.magic-link-authentication-flow.story.md` - Original story requirements
- `docs/stories/1.6.universal-links-authentication.md` - Universal Links implementation

---

---

## ✅ **Solutions Provided by Dev Friend**

### **Root Cause:**
1. **Expo Go limitation** - Cannot handle custom URL schemes (`todotomorrow://`)
2. **Token type mismatch** - Supabase magic links use `type: 'email'` in `verifyOtp`, NOT `type: 'magiclink'`
3. **Universal Links not configured** - Requires proper domain setup (Apple App Site Association, etc.)

### **Recommended Solution:**
1. **Create EAS Development Build** - Required for testing auth properly (Expo Go doesn't support custom schemes)
2. **Fix token verification** - Always use `type: 'email'` in `verifyOtp()` call
3. **Improve logging** - Added detailed console logs to track auth flow

### **Code Fixes Applied:**
- ✅ Changed token verification to always use `type: 'email'` (not 'magiclink')
- ✅ Improved deep link listener setup with better error handling
- ✅ Added comprehensive logging throughout auth flow
- ✅ Improved session detection with retry logic
- ✅ Enhanced `onAuthStateChange` logging in App.tsx
- ✅ Changed `DEV_BYPASS_AUTH` default to `false` to enable real auth testing

### **Next Steps:**
1. Create EAS development build: `eas build --profile development --platform ios`
2. Test magic link flow with real email
3. Monitor console logs to see exactly where auth succeeds/fails
4. Once auth works, remove `DEV_BYPASS_AUTH` completely

**Last Updated:** 2025-01-27
**Status:** ✅ **RESOLVED** - Authentication flow working end-to-end!

---

## 🎉 **FINAL SOLUTION - RESOLVED**

### Root Causes Identified and Fixed:

1. **Android Intent Timing Issue** ✅ FIXED
   - **Problem:** Android consumed deep link intent before React Native initialized
   - **Solution:** Created native Android module (`DeepLinkIntentModule`) that stores intent in `MainActivity.onCreate()` before React Native loads
   - **Files:** `MainActivity.kt`, `DeepLinkIntentModule.kt`, `DeepLinkIntentPackage.kt`

2. **URL Fragment vs Query Params** ✅ FIXED
   - **Problem:** Code was parsing query params (`?token=...`) but Supabase returns tokens in URL fragment (`#access_token=...&refresh_token=...`)
   - **Solution:** Updated `AuthScreen.tsx` to parse both fragments and query params, with fragment parsing as primary method
   - **Files:** `src/screens/AuthScreen.tsx`

3. **Session Token Handling** ✅ FIXED
   - **Problem:** Using `verifyOtp()` when session tokens were already available
   - **Solution:** Added support for `setSession()` when `access_token` and `refresh_token` are in fragment
   - **Files:** `src/screens/AuthScreen.tsx`

### Final Implementation:

**Native Layer:**
- `MainActivity.kt` - Stores intent on app launch
- `DeepLinkIntentModule.kt` - Exposes stored intent to JavaScript
- `DeepLinkIntentPackage.kt` - Registers native module

**JavaScript Layer:**
- `App.tsx` - Checks native module first, then falls back to Linking API
- `AuthScreen.tsx` - Parses URL fragments, extracts session tokens, calls `setSession()`
- `src/lib/deepLinkIntent.ts` - Wrapper functions for native module

### Test Results:
✅ Deep link captured by native module  
✅ URL fragment parsed correctly  
✅ Session tokens extracted  
✅ `setSession()` called successfully  
✅ User automatically logged in  
✅ Navigation to MainScreen works  

**Status:** ✅ **PRODUCTION READY**

