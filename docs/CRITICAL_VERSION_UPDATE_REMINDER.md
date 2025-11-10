# 🚨 CRITICAL: Version Update Reminder

**⚠️ MANDATORY READING BEFORE ANY BUILD COMMAND**

## 💰 COST IMPACT
- **3 build credits wasted in 2 hours** (2025-02-01)
- **Root cause:** Updated wrong file - `app.config.js` instead of `android/app/build.gradle`
- **Each wasted build = money lost**

---

## 🔴 THE CRITICAL RULE

**When native `android` directory exists, EAS Build uses the GRADLE FILE, NOT `app.config.js`!**

### Error Message You'll See:
```
Specified value for "android.package" in app.config.js is ignored because an android directory was detected in the project.
EAS Build will use the value found in the native code.
```

**This means:** `app.config.js` version settings are IGNORED for Android builds!

---

## ✅ CORRECT WORKFLOW (MANDATORY)

### Step 1: Check if Native Android Directory Exists
```powershell
Test-Path android\app\build.gradle
```

**If TRUE (native directory exists):**
- ✅ **UPDATE:** `android/app/build.gradle` (line ~95-96)
- ⚠️ **IGNORE:** `app.config.js` for Android versionCode (still update version for reference)

**If FALSE (no native directory):**
- ✅ **UPDATE:** `app.config.js` → `android.versionCode`

### Step 2: Check Current Version in GRADLE FILE
```powershell
Get-Content android\app\build.gradle | Select-String "version"
```

**Look for:**
```gradle
versionCode 8        ← THIS IS WHAT EAS BUILD USES!
versionName "1.0.6"  ← THIS IS WHAT EAS BUILD USES!
```

### Step 3: Check Play Console for Last Uploaded Version Code
- Go to Google Play Console
- Check ALL tracks: Production, Internal Testing, Closed Testing, Open Testing
- Find HIGHEST version code across all tracks
- Example: If Production has 8 and Internal Testing has 9, use 10 or higher

### Step 4: Update GRADLE FILE (if native directory exists)
**File:** `android/app/build.gradle`  
**Lines:** ~95-96

**Update:**
```gradle
versionCode 10        ← Must be HIGHER than last upload
versionName "1.0.7"   ← Match app.config.js version
```

### Step 5: Verify Update
```powershell
Get-Content android\app\build.gradle | Select-String "version"
```

**Expected output:**
```
versionCode 10
versionName "1.0.7"
```

### Step 6: THEN Build
```powershell
eas build --platform android --profile production
```

---

## 📋 PRE-BUILD CHECKLIST (MANDATORY)

**Before EVERY Android build, verify:**

- [ ] **Checked if native `android` directory exists:** `Test-Path android\app\build.gradle`
- [ ] **If native directory exists:** Updated `android/app/build.gradle` → `versionCode` (line ~95)
- [ ] **If native directory exists:** Updated `android/app/build.gradle` → `versionName` (line ~96)
- [ ] **Checked Play Console** for last uploaded version code (ALL tracks)
- [ ] **New versionCode is HIGHER** than last upload
- [ ] **Verified Gradle file** using: `Get-Content android\app\build.gradle | Select-String "version"`
- [ ] **Ready to build** - versionCode is correct in GRADLE FILE

---

## 🎯 QUICK REFERENCE

### File Priority (When Native Directory Exists):
1. **PRIMARY:** `android/app/build.gradle` → `versionCode` (line ~95) ← **EAS BUILD USES THIS**
2. **SECONDARY:** `app.config.js` → `android.versionCode` ← **IGNORED BY EAS BUILD**

### Commands to Remember:
```powershell
# Check if native directory exists
Test-Path android\app\build.gradle

# Check current version in Gradle file
Get-Content android\app\build.gradle | Select-String "version"

# Verify after update
Get-Content android\app\build.gradle | Select-String "version"
```

---

## ❌ WHAT WENT WRONG (2025-02-01)

**Mistake 1:**
- Updated `app.config.js` → `versionCode: 9`
- Did NOT update `android/app/build.gradle` → Still had `versionCode 8`
- **Result:** Build used versionCode 8, Play Console rejected (already used)

**Mistake 2:**
- Updated `app.config.js` → `versionCode: 9` again
- Still did NOT update Gradle file
- **Result:** Build still used versionCode 8

**Mistake 3:**
- Updated `app.config.js` → `versionCode: 9` again
- Still did NOT update Gradle file
- **Result:** Build still used versionCode 8, wasted 3rd build credit

**Final Fix:**
- Updated `android/app/build.gradle` → `versionCode 10`
- Updated `android/app/build.gradle` → `versionName "1.0.7"`
- **Result:** Should work now

---

## 📚 RELATED DOCUMENTATION

- Full checklist: `docs/VERSION_CODE_CHECK_BEFORE_BUILD.md`
- AI reminder: `docs/AI_VERSION_CODE_REMINDER.md`
- Play Store checklist: `docs/GOOGLE_PLAY_STORE_LAUNCH_CHECKLIST.md`

---

## 🚨 REMINDER FOR AI ASSISTANTS

**BEFORE recommending ANY Android build:**

1. ✅ **ALWAYS check:** `Test-Path android\app\build.gradle`
2. ✅ **If native directory exists:** Update `android/app/build.gradle` FIRST
3. ✅ **Verify:** `Get-Content android\app\build.gradle | Select-String "version"`
4. ✅ **NEVER skip Gradle file check when native directory exists**
5. ✅ **Remember:** EAS Build error message tells you Gradle file is being used

**If user asks to build without checking Gradle file:**
- **STOP** and check Gradle file first
- **NEVER** proceed without verifying correct file is updated
- **ALWAYS** run verification command before building

---

## 💡 KEY TAKEAWAY

**When you see this error message:**
```
Specified value for "android.package" in app.config.js is ignored because an android directory was detected in the project.
EAS Build will use the value found in the native code.
```

**This means:** Update `android/app/build.gradle`, NOT `app.config.js`!

---

**Last Updated:** 2025-02-01  
**Reason:** 3 build credits wasted due to updating wrong file  
**Status:** CRITICAL - Must check before every build

