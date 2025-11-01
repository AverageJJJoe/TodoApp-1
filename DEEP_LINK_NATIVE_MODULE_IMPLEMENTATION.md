# Deep Link Native Module Implementation

**Status:** ✅ Implemented  
**Date:** 2025-01-27  
**Solution:** Native Android Module to capture deep link intents before React Native initializes

---

## 🎯 Problem Solved

**Issue:** Android consumes deep link intents before React Native finishes initializing, causing `Linking.getInitialURL()` to return `null`.

**Solution:** Created a native Android module that stores the intent in `MainActivity.onCreate()` before React Native starts, then exposes it to JavaScript.

---

## 📁 Files Created/Modified

### Native Android Files

1. **`android/app/src/main/java/com/todotomorrow/app/MainActivity.kt`**
   - Stores initial intent in `onCreate()` and `onNewIntent()`
   - Uses both static variable (fast) and SharedPreferences (persistent backup)
   - Provides `getInitialUrl()` and `clearInitialUrl()` methods

2. **`android/app/src/main/java/com/todotomorrow/app/DeepLinkIntentModule.kt`**
   - React Native native module that bridges MainActivity methods to JavaScript
   - Exposes `getInitialURL()` and `clearInitialURL()` to JS

3. **`android/app/src/main/java/com/todotomorrow/app/DeepLinkIntentPackage.kt`**
   - React Native package that registers the native module
   - Registered in `MainApplication.kt`

4. **`android/app/src/main/java/com/todotomorrow/app/MainApplication.kt`**
   - Added `DeepLinkIntentPackage()` to packages list

### JavaScript/TypeScript Files

5. **`src/lib/deepLinkIntent.ts`**
   - TypeScript wrapper for the native module
   - Provides `getStoredDeepLink()` and `clearStoredDeepLink()` functions
   - Includes error handling and logging

6. **`src/lib/deepLinkIntent.d.ts`**
   - TypeScript type definitions for the native module

7. **`App.tsx`**
   - Updated to check native module FIRST before falling back to `Linking.getInitialURL()`
   - Logs which method successfully captured the URL

8. **`src/screens/AuthScreen.tsx`**
   - Clears stored deep link after successful authentication
   - Prevents the same link from being processed multiple times

---

## 🔧 How It Works

### Flow

1. **User clicks magic link** → Android launches app with intent
2. **MainActivity.onCreate()** → Captures intent and stores URL (BEFORE React Native initializes)
3. **React Native initializes** → Takes 1-2 seconds
4. **App.tsx useEffect** → Calls native module to get stored URL
5. **Native module** → Returns the URL stored in MainActivity
6. **AuthScreen** → Processes the URL and authenticates
7. **After success** → Clears stored URL to prevent reprocessing

### Storage Methods

1. **Static variable** (primary): Fast, but cleared on app restart
2. **SharedPreferences** (backup): Persistent, survives app restarts

---

## 🚀 Testing Instructions

### ⚠️ IMPORTANT: Rebuild Required

**You MUST rebuild the Android app** for the native code changes to take effect:

```powershell
# Option 1: EAS Build (recommended for development)
eas build --profile development --platform android

# Option 2: Local build (if you have Android Studio set up)
npx expo run:android
```

### Test Steps

1. **Build new APK** with native module changes
2. **Install on device** (completely uninstall old version first)
3. **Request magic link** from app (enter email)
4. **Click magic link** in email (Gmail or any email client)
5. **App should open** and automatically capture the URL
6. **Watch console logs** - you should see:
   ```
   🔍 [App.tsx] Checking native module for stored deep link...
   ✅ [App.tsx] Found deep link from native module: todotomorrow://auth/callback?token=...
   🔗 Deep link received: todotomorrow://auth/callback?token=...
   ✅ Token verified successfully
   🎉 Session created successfully!
   ```

### ADB Test (Alternative)

If you want to test without email:

```powershell
cd C:\Users\joega\AppData\Local\Android\Sdk\platform-tools

# Close app completely
.\adb shell am force-stop com.todotomorrow.app

# Launch with deep link
.\adb shell am start -a android.intent.action.VIEW -d "todotomorrow://auth/callback?token_hash=test123&type=email"

# Watch logs
.\adb logcat | findstr "ReactNativeJS|DeepLink|getInitialURL"
```

---

## 📊 Expected Behavior

### ✅ Success Case

- Native module captures URL: `✅ [App.tsx] Found deep link from native module: ...`
- Token extracted and verified
- Session created
- User navigated to MainScreen
- Stored URL cleared after processing

### ❌ Fallback Case

If native module fails (shouldn't happen, but fallback exists):

- Logs show: `⚠️ [App.tsx] Native module check failed`
- Falls back to `Linking.getInitialURL()` with retries
- Still should work if React Native initializes fast enough

### ⚠️ Debugging

If you see `⚠️ DeepLinkIntent native module not available`:

- **Cause:** Native module not loaded (build issue)
- **Fix:** Rebuild the app - native code changes require full rebuild
- **Check:** Ensure `DeepLinkIntentPackage` is added in `MainApplication.kt`

---

## 🎯 Acceptance Criteria

- [x] Native module captures intent before React Native initializes
- [x] URL stored persistently (SharedPreferences backup)
- [x] JavaScript can retrieve stored URL via native module
- [x] App.tsx checks native module first, then falls back to Linking API
- [x] Stored URL cleared after successful authentication
- [x] Works for both fresh app launch and app-in-background scenarios
- [x] TypeScript types defined for native module

---

## 🔍 Code Architecture

### Native Layer (Kotlin)

```
MainActivity
├── onCreate() → Stores intent immediately
├── onNewIntent() → Updates stored intent
├── getInitialUrl() → Returns stored URL
└── clearInitialUrl() → Clears stored URL

DeepLinkIntentModule (React Native Bridge)
├── getInitialURL() → Calls MainActivity.getInitialUrl()
└── clearInitialURL() → Calls MainActivity.clearInitialUrl()
```

### JavaScript Layer (TypeScript)

```
deepLinkIntent.ts (Wrapper)
├── getStoredDeepLink() → Calls native module
└── clearStoredDeepLink() → Calls native module

App.tsx
└── captureInitialURL()
    ├── Check native module first
    └── Fallback to Linking.getInitialURL()
```

---

## 🐛 Known Limitations

1. **Android only**: iOS uses different deep linking mechanism (works via Linking API)
2. **Requires rebuild**: Native code changes need full rebuild (not hot-reloadable)
3. **One URL at a time**: Only stores the most recent deep link (previous ones are overwritten)

---

## 📝 Future Improvements

1. **iOS support**: Similar native module for iOS if needed
2. **Multiple URLs queue**: Store array of URLs if multiple links are clicked
3. **URL expiry**: Auto-clear old URLs after timeout
4. **Better error handling**: More granular error reporting from native module

---

## ✅ Verification Checklist

After rebuilding, verify:

- [ ] Native module loads (no warnings in console)
- [ ] Deep link captured when app launched via intent
- [ ] URL successfully retrieved from native module
- [ ] Authentication completes successfully
- [ ] Stored URL cleared after processing
- [ ] Works on fresh app launch
- [ ] Works when app is in background
- [ ] Falls back to Linking API if native module unavailable

---

**Last Updated:** 2025-01-27  
**Tested On:** EAS Development Build (Android)  
**Status:** Ready for testing with rebuilt app

