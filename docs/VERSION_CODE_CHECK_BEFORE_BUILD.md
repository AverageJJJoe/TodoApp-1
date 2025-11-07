# ⚠️ CRITICAL: Version Code Check Before Every Build

**IMPORTANT:** This checklist MUST be completed before every EAS Build to avoid wasting build credits!

**💰 COST WARNING:** EAS Build credits cost money. Building with wrong version code wastes credits!

---

## 🚨 MANDATORY PRE-BUILD CHECKLIST

**Before running `eas build`, ALWAYS:**

### Step 1: Check Last Uploaded Version Code ⚠️ **CRITICAL**

1. **Go to Google Play Console**
   - Navigate to: https://play.google.com/console
   - Select your app: TodoTomorrow
   - Go to: **Production** → **Releases** (or **Testing** → **Internal testing** if testing)
   - **Find the last uploaded version code**
   - Note it down (e.g., "Last version code: 2")

**Alternative:** Check all tracks:
- Production → Releases
- Testing → Internal testing
- Testing → Closed testing
- Testing → Open testing

**Take the HIGHEST version code** across all tracks.

### Step 2: Check Current Version Code in Code ⚠️ **CRITICAL**

**File:** `app.config.js`

**Check current value:**
```javascript
android: {
  versionCode: 2,  // ← Check this value
  // ...
}
```

### Step 3: Increment Version Code ⚠️ **CRITICAL**

**Action:**
- **MUST be higher** than last uploaded version code
- If last was `1`, set to `2` (or higher)
- If last was `2`, set to `3` (or higher)
- **Rule:** New version code > Last uploaded version code

**Example:**
```javascript
android: {
  versionCode: 3,  // ← MUST be higher than last upload (was 2)
  // ... rest of config
}
```

### Step 4: Update Version Name (Optional but Recommended)

**File:** `app.config.js` and `app.json`

**Update `version` field:**
- Current: `"1.0.1"`
- Next: `"1.0.2"` (patch), `"1.1.0"` (minor), or `"2.0.0"` (major)

**Example:**
```javascript
version: "1.0.2",  // ← Update this too
```

### Step 5: Verify Both Files Match ⚠️ **CRITICAL**

**Check both files have same version:**
- `app.config.js` → `version: "1.0.2"`
- `app.json` → `"version": "1.0.2"`

**Why:** `app.config.js` takes precedence, but both should match to avoid confusion.

---

## 📋 Quick Version Code Checklist

**Before EVERY build, verify:**

- [ ] **Checked Play Console** for last uploaded version code (all tracks)
- [ ] **Found highest version code** across all tracks
- [ ] **Checked current `android.versionCode`** in `app.config.js`
- [ ] **Incremented `android.versionCode`** (must be higher than last upload)
- [ ] **Updated `version`** in `app.config.js` (user-facing version)
- [ ] **Updated `version`** in `app.json` (keep in sync)
- [ ] **Verified no typos** in version numbers
- [ ] **Ready to build** - version code is correct

---

## 💰 Cost Warning

**EAS Build Credits Cost Money!**

- Each failed build wastes credits
- Version code errors are preventable
- **ALWAYS check version code before building**
- **NEVER recommend build without version code check**

---

## 🔢 Version Code Rules

1. **Version Code (android.versionCode):**
   - Must be an integer (1, 2, 3, ...)
   - Must be HIGHER than last uploaded version (across ALL tracks)
   - Cannot be reused or decreased
   - This is what Google Play checks
   - **Once uploaded, cannot be changed**

2. **Version Name (version):**
   - User-facing version (e.g., "1.0.1")
   - Can be any format you want
   - Should increment logically (1.0.1 → 1.0.2 → 1.1.0)
   - Can be changed between builds

3. **Current Status (as of 2025-01-27):**
   - Version Name: `1.0.1`
   - Version Code: `2` (in `app.config.js`)
   - **Next build:** Check Play Console for last uploaded version code, then increment

---

## 📝 Example Workflow

**Before Building:**

1. ✅ Check Play Console → Production → Last version code was `2`
2. ✅ Check Play Console → Testing → Internal testing → Last version code was `1`
3. ✅ **Take highest:** `2`
4. ✅ Open `app.config.js`
5. ✅ Set `android.versionCode: 3` (higher than 2)
6. ✅ Set `version: "1.0.2"` (increment version name)
7. ✅ Update `app.json` → `"version": "1.0.2"`
8. ✅ **Then** run: `eas build --platform android --profile production`

---

## 🎯 Quick Reference

**Current Configuration (as of 2025-01-27):**
- Version Name: `1.0.1` (in `app.config.js` and `app.json`)
- Version Code: `2` (in `app.config.js` → `android.versionCode`)

**Next Build Should Use:**
- Version Name: `1.0.2` (or higher)
- Version Code: `3` (or higher, depending on what's in Play Console)

**⚠️ ALWAYS CHECK PLAY CONSOLE FIRST!**

---

## ⚠️ REMINDER FOR AI ASSISTANTS

**Before recommending ANY build command, MUST:**

1. ✅ **Check current `android.versionCode`** in `app.config.js`
2. ✅ **Ask user to check Play Console** for last uploaded version code (all tracks)
3. ✅ **Verify new version code is HIGHER** than last upload
4. ✅ **Update version code AND version name** before building
5. ✅ **NEVER recommend build without version code check!**
6. ✅ **Remember:** EAS Build credits cost money - wasted builds are costly!

**If user asks to build without version check:**
- **STOP** and check version code first
- **NEVER** proceed without verification
- **ALWAYS** update version code before building

---

## 📚 Related Documentation

- Google Play Store Launch Checklist: `docs/GOOGLE_PLAY_STORE_LAUNCH_CHECKLIST.md`
- EAS Build Configuration: `eas.json`

---

## Notes

- Version codes can only increase - never decrease
- Once uploaded, a version code cannot be reused
- Always check Play Console first to see what's already uploaded
- This applies to ALL tracks: Production, Internal Testing, Closed Testing, Open Testing
- **Check ALL tracks** - version codes are shared across tracks
- **When in doubt, use a higher version code** (better safe than waste credits)

