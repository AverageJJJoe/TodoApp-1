# ⚠️ CRITICAL: Version Code Management for Native Android Projects

**IMPORTANT:** This project has a native `android` directory, which means EAS Build uses the Gradle file directly, NOT `app.config.js`!

---

## 🚨 The Critical File

**File Location:** `android/app/build.gradle`

**What to Update:**
- Line ~95: `versionCode` (must increment: 1 → 2 → 3 → 4, etc.)
- Line ~96: `versionName` (user-facing version like "1.0.1")

**Example:**
```gradle
defaultConfig {
    applicationId 'com.todotomorrow.app'
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode 3        // ← UPDATE THIS (must be higher than last upload)
    versionName "1.0.1"  // ← UPDATE THIS (user-facing version)
    // ...
}
```

---

## ⚠️ Why This Matters

1. **Native Directory Takes Precedence:**
   - When `android/app/build.gradle` exists, EAS Build uses it directly
   - Changes to `app.config.js` versionCode are **IGNORED**
   - This is why builds failed - wrong file was updated!

2. **Google Play Requirements:**
   - Each new upload MUST have a higher versionCode than the previous one
   - Version codes cannot be reused
   - Version codes must increment sequentially: 1 → 2 → 3 → 4

3. **Cost Impact:**
   - Building with wrong version code wastes EAS build credits
   - Each wasted build = money lost
   - This is 100% preventable!

---

## 📋 Process for Future Builds

**Before EVERY build:**

1. **Check Play Console:**
   - Go to: Production → Releases
   - Go to: Testing → Internal testing
   - Find the highest version code across all tracks

2. **Open `android/app/build.gradle`:**
   - Find line ~95: `versionCode X`
   - Increment X by 1 (or more if needed)
   - Update `versionName` if needed

3. **Verify the Update:**
   ```powershell
   Get-Content android\app\build.gradle | Select-String "versionCode"
   ```
   Should show: `versionCode 3` (or your new number)

4. **Build:**
   ```bash
   eas build --platform android --profile production
   ```

5. **Upload to Play Console:**
   - Upload the new AAB file
   - Version code must be higher than last upload

---

## 🔍 Verification Commands

**Check current version code:**
```powershell
Get-Content android\app\build.gradle | Select-String "versionCode"
```

**Check version name:**
```powershell
Get-Content android\app\build.gradle | Select-String "versionName"
```

---

## 📝 Current Status

**As of 2025-01-27:**
- **File:** `android/app/build.gradle`
- **Line 95:** `versionCode 3`
- **Line 96:** `versionName "1.0.1"`

**Next Build Should Use:**
- **Version Code:** `4` (or higher, check Play Console first!)
- **Version Name:** `1.0.2` (or higher)

---

## ⚠️ REMINDER FOR AI ASSISTANTS

**Before recommending ANY build:**

1. ✅ **Check if `android/app/build.gradle` exists**
   - If YES → This file takes precedence!
   - If NO → Use `app.config.js`

2. ✅ **Read current `versionCode` from Gradle file:**
   ```powershell
   Get-Content android\app\build.gradle | Select-String "versionCode"
   ```

3. ✅ **Ask user for Play Console version codes**

4. ✅ **Update `android/app/build.gradle` → `versionCode`**

5. ✅ **Verify update before recommending build**

6. ✅ **NEVER skip this check - it costs money!**

---

## 💰 Cost Warning

- **Each wasted build = 1 EAS credit lost**
- **EAS credits cost money**
- **Version code errors are 100% preventable**
- **Always check Gradle file if native directory exists!**

---

## 📚 Related Documentation

- Full checklist: `docs/VERSION_CODE_CHECK_BEFORE_BUILD.md`
- Google Play checklist: `docs/GOOGLE_PLAY_STORE_LAUNCH_CHECKLIST.md`

---

**Remember:** Native Android directory = Gradle file takes precedence. Always update `android/app/build.gradle`!

