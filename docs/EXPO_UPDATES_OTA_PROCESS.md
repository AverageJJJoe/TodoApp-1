# Expo Updates OTA Process - Critical Workflow

**⚠️ CRITICAL:** Understanding how Expo Updates works is essential to avoid wasted builds and ensure users get the latest code.

---

## 🔍 What is Expo Updates?

Expo Updates is an **Over-The-Air (OTA) update system** that allows you to push JavaScript bundle updates to your app without rebuilding and resubmitting to app stores.

**How it works:**
1. Your app is built with Expo Updates enabled
2. When the app launches, it checks Expo's update server for a newer JavaScript bundle
3. If an update exists for the app's runtime version, it downloads and applies it
4. The new JavaScript bundle replaces the one embedded in the app

---

## 🚨 The Critical Issue: OTA Updates Override Build Code

### What Happened (Epic 9 Incident)

**Problem:**
- Built production app with Epic 9 design changes (version 1.0.13, versionCode 16)
- Uploaded to Google Play Console
- Installed on device - **old design still showing**
- Epic 9 changes (icons, spacing) were missing

**Root Cause:**
- Expo Updates was checking for updates on launch (`EXPO_UPDATES_CHECK_ON_LAUNCH` = `ALWAYS`)
- An old update existed for runtime version `1.0.0` (or older)
- The app downloaded the old JavaScript bundle, overriding the new code built into the app
- **Result:** Users saw old code despite new build

**Solution:**
- Published a new Expo Update with Epic 9 code for runtime version `1.0.13`
- This ensures the app downloads the correct JavaScript bundle

---

## ✅ Correct Workflow for Production Releases

### Step 1: Build the App
```powershell
# Build production app (includes JavaScript bundle embedded)
eas build --platform android --profile production
```

**What this does:**
- Builds native Android app with JavaScript bundle embedded
- Sets versionCode and versionName
- Creates AAB/APK for Play Store upload

### Step 2: Upload to Play Console
- Upload the AAB/APK to Google Play Console
- Submit for review/release

### Step 3: Publish Expo Update (CRITICAL!)
```powershell
# Publish OTA update with latest code
eas update --branch production --message "Description of changes"
```

**What this does:**
- Bundles current JavaScript code
- Uploads to Expo's update server
- Makes it available for apps with matching runtime version
- **This ensures users get the latest code even if they have an older build**

**⚠️ IMPORTANT:** 
- **You MUST publish an update after building** if you want users to get the latest JavaScript code
- The update must match the app's `runtimeVersion` (set in `app.config.js`)

---

## 🔄 When Do You Need to Rebuild?

### Rebuild Required:
- ✅ **Native code changes** (Android/iOS native modules, native dependencies)
- ✅ **Version number changes** (versionCode, versionName)
- ✅ **App configuration changes** (permissions, app icons, splash screens)
- ✅ **New native dependencies** added
- ✅ **Expo SDK upgrades** (major version changes)

### Rebuild NOT Required:
- ❌ **JavaScript-only changes** (React components, logic, styling)
- ❌ **Expo Updates publishing** (this is just OTA, no rebuild needed)
- ❌ **Bug fixes in React code**
- ❌ **UI/UX improvements** (if no native changes)

---

## 📋 Pre-Release Checklist

Before releasing to production:

1. **✅ Build the app** (if native changes or version bump needed)
   ```powershell
   eas build --platform android --profile production
   ```

2. **✅ Update version numbers** (if needed)
   - `android/app/build.gradle` → `versionCode`, `versionName`
   - `app.config.js` → `version`, `runtimeVersion`
   - `android/app/src/main/res/values/strings.xml` → `expo_runtime_version`

3. **✅ Commit and push code**
   ```powershell
   git add .
   git commit -m "feat: Description of changes"
   git push origin main
   ```

4. **✅ Publish Expo Update** (ALWAYS do this!)
   ```powershell
   eas update --branch production --message "Description of changes"
   ```

5. **✅ Upload to Play Console**
   - Upload AAB/APK
   - Submit for review/release

---

## 🔍 How to Check Published Updates

### List Recent Updates:
```powershell
eas update:list --branch production --limit 10
```

**What to check:**
- ✅ Runtime version matches your app's `runtimeVersion`
- ✅ Update message describes the changes
- ✅ Update includes latest code (check commit hash)

### View Update Details:
```powershell
eas update:view <update-id>
```

---

## 🛠️ Troubleshooting

### Issue: Users not seeing latest changes after update

**Possible causes:**
1. **Update not published** - Check with `eas update:list`
2. **Runtime version mismatch** - Update's runtime version doesn't match app's `runtimeVersion`
3. **Update not downloaded** - App might need to be force-closed and reopened
4. **Old update still active** - Check if older updates exist for same runtime version

**Solution:**
```powershell
# Publish new update with correct runtime version
eas update --branch production --message "Fix: Latest changes"
```

### Issue: App crashes after update

**Possible causes:**
1. **Breaking changes** in JavaScript code
2. **Missing dependencies** in update bundle
3. **Runtime version mismatch**

**Solution:**
- Check update logs in Expo Dashboard
- Roll back update if needed: `eas update:rollback`
- Rebuild app if native changes required

---

## 📊 Update Channels vs Branches

**Channels:** Used for different app versions (production, staging, development)
- Set in `eas.json` → `build.production.channel`
- Default: `"production"`

**Branches:** Used for different code branches (main, feature-branch)
- Set via `--branch` flag: `eas update --branch production`

**Best Practice:**
- Use `production` branch for production releases
- Match channel in `eas.json` with branch in update command

---

## 💡 Key Takeaways

1. **Always publish an Expo Update after building** - This ensures users get the latest JavaScript code
2. **Updates don't require rebuilds** - They're just JavaScript bundles
3. **Runtime version must match** - Update's runtime version must match app's `runtimeVersion`
4. **Check update status** - Use `eas update:list` to verify updates are published
5. **Force close app** - Users may need to force close and reopen to get updates

---

## 🚨 Epic 9 Incident Summary

**What happened:**
- Built app with Epic 9 changes (version 1.0.13, versionCode 16)
- Uploaded to Play Console
- Installed on device - old design still showing
- **Root cause:** Old Expo Update was overriding new build code

**Solution:**
- Published new Expo Update for runtime version 1.0.13
- Update includes Epic 9 icon system and spacing changes
- Users now get correct code when app checks for updates

**Lesson learned:**
- **Always publish Expo Update after building** to ensure users get latest JavaScript code
- Check `eas update:list` to verify updates are published correctly
- Runtime version must match between app and update

---

## 📚 References

- [Expo Updates Documentation](https://docs.expo.dev/guides/over-the-air-updates/)
- [EAS Update CLI](https://docs.expo.dev/eas-update/introduction/)
- [Runtime Versions](https://docs.expo.dev/eas-update/runtime-versions/)

---

**Last Updated:** 2025-02-01  
**Related:** Epic 9 Post-Launch Design Refinements

