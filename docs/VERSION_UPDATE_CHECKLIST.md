# 🚨 CRITICAL: Version Update Checklist Before Every Build

**⚠️ MANDATORY:** Complete this checklist BEFORE every EAS build to avoid wasting build credits!

**💰 COST WARNING:** Each wasted build = 1 EAS credit lost. Version code errors are 100% preventable!

---

## ✅ PRE-BUILD CHECKLIST

### Step 1: Check Play Console for Last Uploaded Version Code ⚠️ **CRITICAL**

**Before updating ANYTHING, check Google Play Console:**

1. Go to: https://play.google.com/console
2. Select app: **TodoTomorrow**
3. Check ALL tracks:
   - **Production** → Releases → Find highest version code
   - **Testing** → Internal testing → Find highest version code
   - **Testing** → Closed testing → Find highest version code
   - **Testing** → Open testing → Find highest version code
4. **Take the HIGHEST version code** across all tracks
5. **Example:** If Production has `9` and Internal Testing has `8`, use `10` or higher

**Write down:** Last uploaded version code: `____`

---

### Step 2: Determine What Version Code to Use

**New version code MUST be:**
- **Higher** than last uploaded version code
- **Integer** (10, 11, 12, etc.)
- **Cannot reuse** previous version codes

**Example:** If last upload was `9`, use `10` or higher

**Write down:** New version code: `____`

---

### Step 3: Update Version Numbers ⚠️ **CRITICAL - NATIVE DIRECTORY EXISTS**

**⚠️ CRITICAL:** This project has a native `android` directory, so EAS Build uses Gradle file, NOT `app.config.js`!

**Files to update (in order):**

#### 3A. PRIMARY FILE: `android/app/build.gradle` ⚠️ **EAS BUILD USES THIS!**

**Location:** `android/app/build.gradle`  
**Lines:** ~96-97

**Update:**
```gradle
defaultConfig {
    // ... other config ...
    versionCode 10        // ← UPDATE THIS (must be higher than last upload)
    versionName "1.0.8"   // ← UPDATE THIS (user-facing version)
}
```

**Current values (as of 2025-01-27):**
- `versionCode`: `10`
- `versionName`: `"1.0.8"`

**✅ Verify update:**
```powershell
Get-Content android\app\build.gradle | Select-String "versionCode|versionName"
```

---

#### 3B. SECONDARY FILE: `app.config.js` (Keep in sync for reference)

**Location:** `app.config.js`  
**Lines:** 10, 38, 52, 60, 61

**Update:**
```javascript
version: "1.0.8",              // Line 10
runtimeVersion: "1.0.8",       // Line 38 (root)
runtimeVersion: "1.0.8",       // Line 52 (iOS)
versionCode: 10,               // Line 60 (android)
runtimeVersion: "1.0.8",       // Line 61 (android)
```

**Note:** These are kept in sync for reference, but EAS Build ignores `android.versionCode` when native directory exists.

**Current values (as of 2025-01-27):**
- `version`: `"1.0.8"` ✅
- `runtimeVersion`: `"1.0.8"` ✅ (all 3 locations)
- `android.versionCode`: `10` ✅

---

#### 3C. TERTIARY FILE: `src/lib/sentry.ts` (Fallback version)

**Location:** `src/lib/sentry.ts`  
**Line:** ~26

**Update:**
```typescript
const appVersion = Constants.expoConfig?.version || '1.0.8';
```

**Current value (as of 2025-01-27):**
- Fallback version: `'1.0.8'` ✅

---

#### 3D. ANDROID STRINGS: `android/app/src/main/res/values/strings.xml`

**Location:** `android/app/src/main/res/values/strings.xml`  
**Line:** ~5

**Update:**
```xml
<string name="expo_runtime_version">1.0.8</string>
```

**Current value (as of 2025-01-27):**
- `expo_runtime_version`: `"1.0.7"` ⚠️ **NEEDS UPDATE**

---

### Step 4: Verify All Updates

**Run verification commands:**

```powershell
# Check Gradle file (PRIMARY - EAS BUILD USES THIS)
Get-Content android\app\build.gradle | Select-String "versionCode|versionName"

# Check app.config.js (SECONDARY - kept in sync)
Get-Content app.config.js | Select-String "version|versionCode"

# Check Sentry fallback
Get-Content src\lib\sentry.ts | Select-String "1\.0\."

# Check Android strings
Get-Content android\app\src\main\res\values\strings.xml | Select-String "expo_runtime_version"
```

**Expected output:**
```
android/app/build.gradle:96:        versionCode 10
android/app/build.gradle:97:        versionName "1.0.8"
app.config.js:10:    version: "1.0.8",
app.config.js:38:    runtimeVersion: "1.0.8",
app.config.js:52:      runtimeVersion: "1.0.8",
app.config.js:60:      versionCode: 10,
app.config.js:61:      runtimeVersion: "1.0.8",
src/lib/sentry.ts:26:  const appVersion = Constants.expoConfig?.version || '1.0.8';
android/app/src/main/res/values/strings.xml:5:  <string name="expo_runtime_version">1.0.8</string>
```

---

### Step 5: Final Verification Checklist

Before running `eas build`, verify:

- [ ] **Play Console checked** - Last uploaded version code: `____`
- [ ] **Gradle file updated** - `android/app/build.gradle` → `versionCode` is HIGHER than last upload
- [ ] **Gradle file updated** - `android/app/build.gradle` → `versionName` matches app.config.js
- [ ] **app.config.js updated** - All `version` and `runtimeVersion` fields updated
- [ ] **Sentry fallback updated** - `src/lib/sentry.ts` fallback version updated
- [ ] **Android strings updated** - `android/app/src/main/res/values/strings.xml` → `expo_runtime_version` updated
- [ ] **Verification commands run** - All files show correct version numbers
- [ ] **Ready to build** ✅

---

## 📋 Current Version Status (2025-01-27)

**Version Name:** `1.0.8`  
**Version Code:** `11` (incremented from 10 - last upload was versionCode 10)

**Files Status:**
- ✅ `android/app/build.gradle` → `versionCode 11`, `versionName "1.0.8"`
- ✅ `app.config.js` → `version "1.0.8"`, `runtimeVersion "1.0.8"` (all locations), `android.versionCode: 11`
- ✅ `src/lib/sentry.ts` → Fallback `'1.0.8'`
- ✅ `android/app/src/main/res/values/strings.xml` → `expo_runtime_version "1.0.8"`

---

## 🚨 CRITICAL REMINDERS

1. **Native directory exists** → EAS Build uses `android/app/build.gradle`, NOT `app.config.js`
2. **Always check Play Console first** → Find highest version code across all tracks
3. **Version code MUST increment** → Cannot reuse or decrease
4. **Update ALL files** → Keep everything in sync
5. **Verify before building** → Run verification commands
6. **Each wasted build = money lost** → This checklist prevents that!

---

## 📝 Quick Reference

**Primary file (EAS Build uses this):**
- `android/app/build.gradle` → Lines 96-97

**Secondary files (keep in sync):**
- `app.config.js` → Lines 10, 38, 52, 60, 61
- `src/lib/sentry.ts` → Line ~26
- `android/app/src/main/res/values/strings.xml` → Line ~5

**Verification command:**
```powershell
Get-Content android\app\build.gradle | Select-String "versionCode|versionName"
```

---

**Remember:** When native `android` directory exists, Gradle file takes precedence. Always update `android/app/build.gradle` FIRST!

