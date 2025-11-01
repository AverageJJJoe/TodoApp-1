# Build Cache Clear Instructions

## Problem: Native Logging Not Appearing

If native logging statements aren't appearing, the build cache may be preventing the new Kotlin code from being included.

## Solution: Clear Build Cache and Rebuild

### Option 1: EAS Build (Recommended)

EAS Build should automatically use fresh code, but if you suspect cache issues:

```powershell
# Clean build (clears EAS cache)
eas build --profile development --platform android --clear-cache

# Or if clear-cache doesn't work:
eas build --profile development --platform android --no-cache
```

### Option 2: Local Build Cache Clearing

If building locally, clear the Android build cache:

```powershell
# Navigate to project root
cd "C:\Users\joega\My Apps\todoapp"

# Clean Android build
cd android
.\gradlew clean
cd ..

# Also clear Metro cache
npx expo start --clear

# Then rebuild
npx expo run:android
```

### Option 3: Full Clean (Nuclear Option)

If still having issues:

```powershell
# 1. Delete Android build directories
Remove-Item -Recurse -Force android\app\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\.gradle -ErrorAction SilentlyContinue

# 2. Delete node_modules and reinstall (if needed)
# npm ci

# 3. Clean Gradle cache
cd android
.\gradlew clean
.\gradlew cleanBuildCache
cd ..

# 4. Rebuild
eas build --profile development --platform android
```

## Verification Logs to Check

After rebuilding, check for these **critical verification logs**:

### Must See Logs (if native code is running):

```powershell
.\adb logcat | findstr "DeepLinkIntent"
```

**Expected output:**
```
DeepLinkIntent: 🔴 VERIFICATION: MainApplication.onCreate() called - Native code IS running!
DeepLinkIntent: 🔴 VERIFICATION: MainActivity.onCreate() called - Activity native code IS running!
DeepLinkIntent: MainActivity.onCreate() called
```

### If you DON'T see these verification logs:

1. **Build cache issue** - The new code wasn't included in the build
   - Solution: Use `--clear-cache` or `--no-cache` flags

2. **Wrong APK installed** - Old build still installed
   - Solution: Uninstall app completely, then install new build
   ```powershell
   .\adb uninstall com.todotomorrow.app
   .\adb install path\to\new\build.apk
   ```

3. **Logs filtered out** - Check logcat command
   - Solution: Try without filter first:
   ```powershell
   .\adb logcat | findstr "VERIFICATION"
   ```

## How to View All DeepLinkIntent Logs

```powershell
cd C:\Users\joega\AppData\Local\Android\Sdk\platform-tools

# Clear old logs
.\adb logcat -c

# Start monitoring (leave running)
.\adb logcat | findstr "DeepLinkIntent"

# Then launch app or trigger deep link
```

## Expected Log Flow After Clean Build

1. **App starts:**
   ```
   DeepLinkIntent: 🔴 VERIFICATION: MainApplication.onCreate() called - Native code IS running!
   DeepLinkIntent: Registering DeepLinkIntentPackage
   DeepLinkIntent: DeepLinkIntentPackage registered successfully
   DeepLinkIntent: DeepLinkIntentModule initialized
   ```

2. **MainActivity starts:**
   ```
   DeepLinkIntent: 🔴 VERIFICATION: MainActivity.onCreate() called - Activity native code IS running!
   DeepLinkIntent: MainActivity.onCreate() called
   DeepLinkIntent: Intent check - intent is null: true
   ```

3. **Deep link clicked:**
   ```
   DeepLinkIntent: MainActivity.onCreate() called
   DeepLinkIntent: Intent action: android.intent.action.VIEW
   DeepLinkIntent: ✅ Captured deep link URL in onCreate: todotomorrow://auth/callback?token=...
   ```

## Troubleshooting Checklist

- [ ] Build completed successfully
- [ ] Used `--clear-cache` or `--no-cache` flag
- [ ] Uninstalled old app before installing new build
- [ ] Checked adb logcat with correct filter
- [ ] Verified verification logs appear (🔴 VERIFICATION messages)
- [ ] Checked if logs appear with different tag filters

