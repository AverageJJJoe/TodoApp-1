# AI Assistant Reminder: Version Code Check

**⚠️ CRITICAL REMINDER FOR AI ASSISTANTS**

## 🚨 MANDATORY CHECK BEFORE RECOMMENDING ANY BUILD

**Before suggesting `eas build` command, ALWAYS:**

1. **Read current version code from `app.config.js`:**
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
   - Update `android.versionCode` in `app.config.js`
   - Update `version` in both `app.config.js` and `app.json`
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
2. [Reads app.config.js]
3. "Current version code is 2. What's the last version code uploaded to Play Console?"
4. [User responds]
5. "I'll update version code to 3 (higher than last upload)..."
6. [Updates files]
7. "Now ready to build with version code 3. Run: `eas build --platform android --profile production`"

---

## ❌ Wrong Workflow (What Happened)

**User:** "I need to rebuild"

**AI:**
1. "Run: `eas build --platform android --profile production`"
2. [Build completes]
3. [User tries to upload]
4. [Error: Version code already used]
5. [Build credit wasted]

**This is what we must NEVER do again!**

---

## 📚 Reference

- Full checklist: `docs/VERSION_CODE_CHECK_BEFORE_BUILD.md`
- Play Store checklist: `docs/GOOGLE_PLAY_STORE_LAUNCH_CHECKLIST.md`

---

**Remember:** Check version code FIRST, update SECOND, build THIRD. Never skip step 1!

