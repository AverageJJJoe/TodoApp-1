# How to Check Crash Logs for ShareHandler Issue

## Quick Setup for Log Checking

### Option 1: Use Android Studio Logcat (Easiest)

1. **Open Android Studio**
2. **Connect your device via USB**
   - Enable USB Debugging: Settings → Developer Options → USB Debugging
3. **Open Logcat** (bottom panel)
4. **Filter by package:** `com.todotomorrow.app`
5. **Filter by level:** Select "Error" or "All"
6. **Launch the app** and watch for crashes

### Option 2: Install ADB Platform Tools

**Download:** https://developer.android.com/studio/releases/platform-tools

**Extract to:** `C:\platform-tools\`

**Then run:**
```powershell
C:\platform-tools\adb.exe devices
C:\platform-tools\adb.exe logcat -c
C:\platform-tools\adb.exe logcat | Select-String -Pattern "ShareHandler|ShareMenu|error|crash|FATAL"
```

## What to Look For

### Before Fix (What We Fixed):
```
E ReactNativeJS: TypeError: Cannot read property 'getSharedText' of null
E ReactNativeJS: ShareMenu is not defined
E AndroidRuntime: FATAL EXCEPTION: main
```

### After Fix (Should See):
```
I ReactNativeJS: ℹ️ [ShareHandler] ShareMenu not available, skipping share handler setup
```
(No crashes - app continues normally)

### If Still Crashing, Look For:
- `ShareHandler` errors
- `ShareMenu` errors  
- `NativeModules.ShareMenu` errors
- Any `FATAL EXCEPTION` related to ShareHandler

## Quick Test Commands

**Clear logs and start monitoring:**
```powershell
# If ADB is installed
adb logcat -c
adb logcat | Select-String -Pattern "ShareHandler|ShareMenu|ReactNativeJS|FATAL"
```

**Or save to file:**
```powershell
adb logcat > crash_logs.txt
# Then open app, wait for crash, Ctrl+C to stop
# Review crash_logs.txt
```

## What We Fixed

1. ✅ Added null check for ShareMenu module
2. ✅ Graceful degradation if module unavailable
3. ✅ Proper error handling with try-catch
4. ✅ Safe listener cleanup

The app should now:
- ✅ Start without crashing even if ShareMenu isn't available
- ✅ Log a warning (in dev mode) if module unavailable
- ✅ Continue working normally (share feature just won't work)

## If Still Crashing

Share the exact error message from logs and we'll fix it!

