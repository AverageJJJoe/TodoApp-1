# iOS App Store Launch Plan

**Created:** 2025-01-27  
**Status:** Planning Phase  
**Goal:** Test on dev, then publish to App Store

---

## 🎯 Overview

This plan outlines the path from zero to App Store for TodoTomorrow on iOS. Since you're an Android user, we'll focus on getting you set up to test on your wife's/daughter's iPhones via TestFlight, then publish to the App Store.

**Key Milestones:**
1. ✅ App already configured for iOS
2. ⚠️ Apple Developer Program enrollment (REQUIRED)
3. ⚠️ Create screenshots (REQUIRED)
4. ⚠️ Build & test via TestFlight
5. ⚠️ Submit to App Store

---

## 📋 Phase 1: Prerequisites (Days 1-2)

### Step 1: Apple Developer Program Enrollment ⚠️ **CRITICAL FIRST STEP**

**Why:** Cannot proceed without this. Apple requires paid membership ($99/year).

**Action:**
1. Go to: https://developer.apple.com/programs/
2. Sign in with Apple ID (or create one)
3. Enroll in Apple Developer Program
4. Pay $99/year fee
5. Complete identity verification if required
6. **Wait for approval:** 24-48 hours typical

**What You'll Need:**
- Apple ID (free to create)
- Payment method ($99/year)
- Legal entity information (personal or business)

**Status:** ✅ **ENROLLED** - Waiting for approval (24-48 hours typical)

---

## 📋 Phase 2: App Store Connect Setup (Day 2-3)

### Step 2: Create App in App Store Connect

**After Developer Program approval:**

1. Go to: https://appstoreconnect.apple.com
2. Sign in with Apple Developer account
3. Click "+" → New App
4. Fill in:
   - **Platform:** iOS
   - **Name:** TodoTomorrow
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** `com.todotomorrow.app` (already configured ✅)
   - **SKU:** `todotomorrow-001` (or similar unique ID)
5. Click "Create"

**Status:** ⚠️ **WAITING FOR DEVELOPER PROGRAM**

---

## 📋 Phase 3: Prepare Assets (Day 3-4)

### Step 3: Create Screenshots ⚠️ **REQUIRED**

**Why:** App Store requires at least 1 screenshot per device family.

**Options:**

**Option A: Use iPhone Simulator (Easiest)**
1. Install Xcode (if on Mac) or use cloud Mac service
2. Run iOS Simulator
3. Install your app via development build
4. Take screenshots at required resolution:
   - **6.7" Display:** 1290×2796px (iPhone 14 Pro Max, 15 Pro Max)
5. Save screenshots

**Option B: Use Physical iPhone (Your Wife's/Daughter's)**
1. Install development build on iPhone
2. Take screenshots directly
3. Transfer to computer
4. Verify resolution matches requirements

**Option C: Use Design Tool**
1. Create mockups in Figma/Canva/etc.
2. Export at required resolution
3. Ensure they look realistic

**Screenshots Needed:**
- [ ] Auth screen (magic link entry)
- [ ] Main screen with tasks
- [ ] Empty state
- [ ] Settings screen
- [ ] Archive view (optional but recommended)

**File Requirements:**
- Format: PNG or JPEG
- Size: 1290×2796px (6.7" iPhone) - minimum required
- No device frames needed (Apple adds them)

**Status:** ⚠️ **NOT STARTED**

---

## 📋 Phase 4: Build & Test (Day 4-5)

### Step 4: Build Production iOS App

**Prerequisites:**
- ✅ Apple Developer Program approved
- ✅ App created in App Store Connect
- ✅ Screenshots ready

**Command:**
```powershell
# ⚠️ CRITICAL: Check version in app.config.js first!
# Current version: 1.0.4

eas build --profile production --platform ios
```

**What Happens:**
1. EAS prompts for Apple ID credentials (first time)
2. EAS creates certificates/provisioning profiles automatically
3. Build takes 15-30 minutes
4. Build appears in App Store Connect → TestFlight

**First Time Setup:**
- EAS will ask for Apple ID
- Create app-specific password: https://appleid.apple.com → Sign-In and Security → App-Specific Passwords
- EAS handles everything else automatically

**Status:** ⚠️ **WAITING FOR PREREQUISITES**

---

### Step 5: Upload to TestFlight

**After build completes:**

**Option A: Automatic (Recommended)**
```powershell
eas submit --platform ios
```
- EAS automatically uploads to TestFlight
- Build appears in App Store Connect → TestFlight

**Option B: Manual**
1. Go to App Store Connect → TestFlight
2. Upload build manually (if needed)

**Status:** ⚠️ **WAITING FOR BUILD**

---

### Step 6: Test on Physical Devices ⚠️ **REQUIRED**

**Setup TestFlight:**
1. Add internal testers in App Store Connect:
   - Go to App Store Connect → Users and Access → TestFlight Internal Testing
   - Add your Apple ID
   - Add wife's/daughter's Apple IDs (if they have Apple IDs)
2. Distribute build to internal testers:
   - Go to TestFlight → Internal Testing
   - Select build → Add to Internal Testing
   - Testers receive email invitation

**On iPhone (Your Wife's/Daughter's):**
1. Install TestFlight app from App Store (free)
2. Open email invitation → Accept
3. Open TestFlight app
4. Install TodoTomorrow
5. Test thoroughly:
   - [ ] Authentication (magic link)
   - [ ] Task creation
   - [ ] Task completion/deletion
   - [ ] Email delivery
   - [ ] Settings screen
   - [ ] Dark mode
   - [ ] Archive view
   - [ ] Universal Links (email links)

**Testing Checklist:**
- Test on at least one physical iPhone
- Test all major features
- Verify no crashes
- Test Universal Links (email magic links)
- Test on different iOS versions if possible

**Status:** ⚠️ **WAITING FOR TESTFLIGHT BUILD**

---

## 📋 Phase 5: App Store Listing (Day 5-6)

### Step 7: Complete App Store Listing

**In App Store Connect:**

1. **App Information:**
   - [ ] App name: "TodoTomorrow"
   - [ ] Subtitle: (optional) "Capture tasks, get them by email"
   - [ ] Category: Productivity
   - [ ] Support URL: https://todotomorrow.com/support (or contact page)
   - [ ] Marketing URL: https://todotomorrow.com (optional)

2. **Description:**
   - [ ] Copy description from checklist (see `docs/APPLE_APP_STORE_LAUNCH_CHECKLIST.md`)
   - [ ] Add keywords: "todo,task,productivity,email,morning,organize"

3. **Screenshots:**
   - [ ] Upload screenshots created in Step 3
   - [ ] Minimum 1 per device family (6.7" iPhone)

4. **Privacy:**
   - [x] Privacy Policy URL: https://www.todotomorrow.com/privacy ✅

5. **Content Rating:**
   - [ ] Complete questionnaire (expected: "4+" - Everyone)

6. **Pricing:**
   - [ ] Set as Free

**Status:** ⚠️ **WAITING FOR SCREENSHOTS**

---

## 📋 Phase 6: Submission (Day 6-7)

### Step 8: Submit for App Store Review

**After testing passes:**

1. **Create App Store Version:**
   - Go to App Store Connect → Your App → App Store tab
   - Click "+" → New Version
   - Enter version: "1.0.4"
   - Fill in "What's New":
     ```
     Initial release of TodoTomorrow - Capture tasks on the go and get them delivered to your inbox every morning.
     ```

2. **Select Build:**
   - Choose the build you tested in TestFlight
   - Build must be "Ready to Submit" status

3. **Final Review:**
   - Verify all information is correct
   - Check privacy policy link works
   - Review screenshots
   - Check release notes

4. **Submit:**
   - Click "Submit for Review"
   - Answer any additional questions
   - Submit

**Status:** ⚠️ **WAITING FOR TESTING**

---

## 📋 Phase 7: Review & Launch (Day 7-10)

### Step 9: Apple Review

**Timeline:**
- Typical: 24-48 hours
- Can be faster (hours) or slower (up to 7 days)
- You'll receive email when review completes

**Possible Outcomes:**
- ✅ **Approved:** App goes live (or scheduled release)
- ⚠️ **Rejected:** Fix issues and resubmit
- 📝 **In Review:** Waiting

**If Rejected:**
- Apple provides detailed feedback
- Fix issues
- Resubmit
- Usually faster second review

**Status:** ⚠️ **WAITING FOR SUBMISSION**

---

## 🚦 Current Status

### ✅ **COMPLETE:**
- App configuration (bundle ID, version, etc.)
- Privacy Policy (https://www.todotomorrow.com/privacy)
- EAS Build configuration
- Associated Domains (Universal Links)
- App icon (verify 1024×1024px)

### ✅ **IN PROGRESS:**
1. **Apple Developer Program** - ✅ **ENROLLED & PAID**
   - Enrollment complete ✅
   - Payment processed ✅
   - ⚠️ **Waiting for approval** (24-48 hours typical)
   - Check email for approval notification

2. **Screenshots** - ⚠️ **REQUIRED**
   - Need to create before submission
   - Can do in parallel with Developer Program wait

3. **App Store Connect Setup** - ⚠️ **WAITING FOR DEVELOPER PROGRAM**
   - Can't create app until Developer Program approved

4. **Build & Test** - ⚠️ **WAITING FOR PREREQUISITES**
   - Need Developer Program + App Store Connect first

---

## 🎯 Immediate Next Steps

### **TODAY (While Waiting for Approval):**
1. ✅ **Apple Developer Program** - **ENROLLED & PAID** ✅
   - Enrollment complete ✅
   - Payment processed ✅
   - ⚠️ **Waiting for approval** (check email in 24-48 hours)
   - **Action:** Check email regularly for approval notification

2. ⚠️ **Create Screenshots** (Can do NOW while waiting)
   - **Option A:** Use Expo Go on wife's iPhone to take screenshots
   - **Option B:** Use design tool (Figma/Canva) to create mockups
   - **Option C:** Wait for development build (after approval)
   - **Recommended:** Start with Option A or B now
   - **Size Required:** 1290×2796px (6.7" iPhone)
   - **Screenshots needed:**
     - Auth screen (magic link entry)
     - Main screen with tasks
     - Empty state
     - Settings screen
     - Archive view (optional)

3. ⚠️ **Prepare App Store Listing Content** (Can do NOW)
   - Write app description (see checklist for template)
   - Prepare keywords: "todo,task,productivity,email,morning,organize"
   - Prepare "What's New" release notes
   - Verify support URL: https://todotomorrow.com/support

### **TOMORROW (After Developer Program Approval):**
3. ⚠️ **Create App in App Store Connect**
   - Create new app with bundle ID `com.todotomorrow.app`

4. ⚠️ **Create Screenshots**
   - Use chosen method (simulator/device/design tool)
   - Create at least 1 screenshot (1290×2796px)

### **DAY 3-4:**
5. ⚠️ **Build Production iOS App**
   ```powershell
   eas build --profile production --platform ios
   ```

6. ⚠️ **Upload to TestFlight**
   ```powershell
   eas submit --platform ios
   ```

7. ⚠️ **Test on Physical iPhone**
   - Install TestFlight
   - Test all features
   - Verify no crashes

### **DAY 5-6:**
8. ⚠️ **Complete App Store Listing**
   - Fill in description, keywords, support URL
   - Upload screenshots
   - Complete content rating

9. ⚠️ **Submit for Review**
   - Create version in App Store Connect
   - Select build
   - Submit

### **DAY 7-10:**
10. ⚠️ **Wait for Apple Review**
    - Typical: 24-48 hours
    - Respond to any feedback if needed

---

## 💡 Tips for Android-First Developer

### **Testing on Family's iPhones:**
- **TestFlight is your friend:** Easy way to distribute test builds
- **No need for their Apple IDs initially:** You can test on your own device first
- **Internal Testing:** Up to 100 internal testers (team members)
- **External Testing:** Up to 10,000 external testers (requires review)

### **Key Differences from Android:**
- **More strict review:** Apple reviews more carefully
- **TestFlight vs Play Console:** TestFlight is built-in, easier than Play Console testing
- **Certificates:** EAS handles automatically (unlike Android where you manage keystore)
- **Versioning:** iOS uses version + build number (both managed by EAS)

### **Cost Considerations:**
- **Apple Developer Program:** $99/year (recurring)
- **EAS Build:** Uses credits (same as Android)
- **No per-app fees:** Unlike Google Play's one-time $25

---

## 📚 Resources

**Full Checklist:** See `docs/APPLE_APP_STORE_LAUNCH_CHECKLIST.md` for complete details

**Key Links:**
- Apple Developer Program: https://developer.apple.com/programs/
- App Store Connect: https://appstoreconnect.apple.com
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- EAS Submit Docs: https://docs.expo.dev/submit/introduction/

**Support:**
- Apple Developer Support: https://developer.apple.com/support/
- EAS Support: https://docs.expo.dev/build/introduction/

---

## ❓ Questions to Consider

1. **Do you have access to a Mac?**
   - Needed for: Xcode/iOS Simulator (for screenshots)
   - Alternative: Use cloud Mac service or physical iPhone

2. **Do your wife/daughter have Apple IDs?**
   - Needed for: TestFlight testing
   - Alternative: You can test on your own device first

3. **Timeline expectations?**
   - Realistic: 6-10 days from start to live
   - Fastest: 3-4 days (if everything goes smoothly)
   - Slower: 2+ weeks (if issues arise)

---

## 🎉 Success Criteria

**Phase Complete When:**
- ✅ Apple Developer Program approved
- ✅ App created in App Store Connect
- ✅ Screenshots created and uploaded
- ✅ Production build tested in TestFlight
- ✅ All features work correctly
- ✅ App Store listing complete
- ✅ Submitted for review
- ✅ Approved and live on App Store

**You'll know you're ready when:**
- TestFlight testing passes on physical iPhone
- All features work as expected
- No crashes or critical bugs
- App Store listing is complete
- Ready to submit!

---

**Next Action:** ✅ **Enrollment Complete!** ⚠️ **Wait for approval email** (24-48 hours), then proceed to App Store Connect setup.

**While Waiting:** Create screenshots and prepare App Store listing content!

