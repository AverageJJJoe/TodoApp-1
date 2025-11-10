# AI Assistant Reminder: Version Code Check

**⚠️ CRITICAL REMINDER FOR AI ASSISTANTS**

**🚨 URGENT:** See `docs/CRITICAL_VERSION_UPDATE_REMINDER.md` - 3 build credits wasted on 2025-02-01 due to updating wrong file!

## 🚨 MANDATORY CHECK BEFORE RECOMMENDING ANY BUILD

**Before suggesting `eas build` command, ALWAYS:**

1. **Check if native `android` directory exists:**
   - **CRITICAL:** Run `Test-Path android\app\build.gradle` first!
   - If YES → **UPDATE `android/app/build.gradle` (line ~95)** ← EAS BUILD USES THIS!
   - If NO → Update `app.config.js`
   - **⚠️ WARNING:** If native directory exists, `app.config.js` versionCode is IGNORED by EAS Build!
   
   **Gradle file (if native directory exists):**
   ```gradle
   versionCode X  // ← Check this value (around line 95)
   ```
   
   **app.config.js (if no native directory):**
   ```javascript
   android: {
     versionCode: X,  // ← Check this value
   }
   ```

2. **Ask user to check Play Console:**
   - "What is the last uploaded version code in Play Console?"
   - User should check: Production → Releases AND Testing → Internal testing
   - Take the HIGHEST version code across all tracks

3. **Verify new version code is HIGHER:**
   - If last upload was `2`, new must be `3` or higher
   - If last upload was `5`, new must be `6` or higher
   - **NEVER** use same or lower version code

4. **Update version code BEFORE building:**
   - **If native `android` directory exists:**
     - **CRITICAL:** Update `android/app/build.gradle` → `versionCode` (line ~95) ← EAS BUILD USES THIS!
     - **CRITICAL:** Update `android/app/build.gradle` → `versionName` (line ~96)
     - **DO NOT** rely on `app.config.js` - it's IGNORED when native directory exists!
   - **If NO native directory:**
     - Update `app.config.js` → `android.versionCode`
     - Update `app.json` → `android.versionCode`
   - **Verify:** `Get-Content android\app\build.gradle | Select-String "version"`
   - **THEN** recommend build command

5. **NEVER skip this check:**
   - EAS Build credits cost money
   - Wasted builds are costly
   - This is preventable with proper checking

---

## 📋 Quick Check Template

**Before recommending build, use this template:**

```
⚠️ VERSION CODE CHECK REQUIRED:

1. Current version code in app.config.js: [CHECK FILE]
2. Last uploaded version code in Play Console: [ASK USER]
3. New version code should be: [CALCULATE: last + 1 or higher]
4. Updating version code now... [UPDATE FILES]
5. Ready to build with version code: [CONFIRM NUMBER]
```

---

## 💰 Cost Impact

- **Each wasted build = 1 EAS credit lost**
- **EAS credits cost money**
- **Version code errors are 100% preventable**
- **Always check before building**

---

## ✅ Correct Workflow

**User:** "I need to rebuild"

**AI:** 
1. "Let me check the current version code first..."
2. [Checks if android/app/build.gradle exists]
3. [Reads android/app/build.gradle OR app.config.js]
4. "Current version code is 3 (in Gradle file). What's the last version code uploaded to Play Console?"
4. [User responds]
5. "I'll update version code to 3 (higher than last upload)..."
6. [Updates files]
7. "Now ready to build with version code 3. Run: `eas build --platform android --profile production`"

---

## ❌ Wrong Workflow (What Happened - 2025-02-01)

**User:** "I need to rebuild"

**AI:**
1. Updated `app.config.js` → `versionCode: 9` ✅
2. Did NOT check/update `android/app/build.gradle` ❌
3. "Run: `eas build --platform android --profile production`"
4. [Build completes with versionCode 8 from Gradle file]
5. [User tries to upload to Play Console]
6. [Error: Version code 8 already used]
7. [Build credit wasted - REPEATED 3 TIMES!]

**What Actually Happened:**
- Updated `app.config.js` 3 times (versionCode 9)
- Never updated `android/app/build.gradle` (still had versionCode 8)
- EAS Build used Gradle file (versionCode 8), ignored app.config.js
- Play Console rejected all 3 builds (versionCode 8 already used)
- **Result:** 3 build credits wasted in 2 hours

**This is what we must NEVER do again!**

**Key Lesson:** When native `android` directory exists, EAS Build uses Gradle file, NOT app.config.js!

---

## 📚 Reference

- **🚨 CRITICAL:** `docs/CRITICAL_VERSION_UPDATE_REMINDER.md` - Read this first!
- Full checklist: `docs/VERSION_CODE_CHECK_BEFORE_BUILD.md`
- Play Store checklist: `docs/GOOGLE_PLAY_STORE_LAUNCH_CHECKLIST.md`

---

**Remember:** Check version code FIRST, update SECOND, build THIRD. Never skip step 1!

