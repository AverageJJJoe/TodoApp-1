# Quick Guide: Testing on iPhone with Expo Go

**Date:** 2025-01-27  
**Goal:** Test TodoTomorrow on your wife's iPhone using Expo Go

---

## ⚠️ Important: Expo Go Limitations

**What Works in Expo Go:**
- ✅ Basic app functionality
- ✅ Task creation, editing, deletion
- ✅ Settings screen
- ✅ Dark mode
- ✅ Archive view
- ✅ Supabase authentication (magic link)
- ✅ Email delivery

**What DOESN'T Work in Expo Go:**
- ❌ **Universal Links** (email magic links won't open app automatically)
- ❌ **Deep linking** (custom URL scheme `todotomorrow://`)
- ❌ **Associated Domains** (requires development build)

**For Full Testing:** You'll need a development build later, but Expo Go is perfect for initial testing!

---

## Step 1: Set Up Environment Variables

**Check if `.env` file exists:**
- If `.env` exists: ✅ You're good to go!
- If `.env` doesn't exist: Create it (see below)

**Create `.env` file** (if needed):
1. Create a file named `.env` in the project root
2. Add these lines (replace with your actual Supabase values):

```env
EXPO_PUBLIC_SUPABASE_URL=https://zrnjxrtgrommlhexbpde.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get Your Supabase Values:**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: Settings → API
4. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

**Note:** The `.env` file is already in `.gitignore`, so it's safe.

---

## Step 2: Start Expo Development Server

**Open PowerShell in project directory:**
```powershell
cd "C:\Users\joega\My Apps\todoapp"
```

**Start Expo:**
```powershell
npx expo start
```

**Or with cache clear (if you have issues):**
```powershell
npx expo start -c
```

**What You'll See:**
- QR code in terminal
- Options: `i` for iOS simulator, `a` for Android, `w` for web
- Development server URL

---

## Step 3: Connect iPhone to Expo Go

### Option A: Same Wi-Fi Network (Recommended)

**On Your Computer:**
1. Make sure computer and iPhone are on **same Wi-Fi network**
2. Expo should show a QR code automatically

**On iPhone (Your Wife's):**
1. Open **Expo Go** app (already downloaded ✅)
2. Tap **"Scan QR Code"** button
3. Point camera at QR code in terminal
4. App will load automatically

### Option B: Tunnel Mode (If Wi-Fi Doesn't Work)

**If devices aren't on same network:**
```powershell
npx expo start --tunnel
```

**Note:** Tunnel mode is slower but works across networks.

---

## Step 4: Test the App

### Basic Functionality Tests:

**1. Authentication:**
- [ ] App loads and shows sign-in screen
- [ ] Enter email address
- [ ] Tap "Send Magic Link"
- [ ] Check email for magic link
- ⚠️ **Note:** Magic link won't open app automatically in Expo Go
- ⚠️ **Workaround:** Copy the token from email URL and manually test (see below)

**2. Task Management:**
- [ ] Create a new task
- [ ] Edit a task
- [ ] Complete a task
- [ ] Delete a task
- [ ] View archive

**3. Settings:**
- [ ] Open settings screen
- [ ] Toggle dark mode
- [ ] Change workflow mode (Fresh Start vs Carry Over)
- [ ] Set email delivery time

**4. UI/UX:**
- [ ] Check layout on iPhone screen size
- [ ] Test dark mode
- [ ] Verify all buttons work
- [ ] Check for any visual glitches

---

## Step 5: Testing Magic Link (Workaround for Expo Go)

**Since Universal Links don't work in Expo Go:**

**Option 1: Manual Token Entry (For Testing)**
1. Request magic link
2. Check email
3. Copy the token from the email URL (looks like: `?token=abc123&type=email`)
4. You can manually test the auth flow in the app

**Option 2: Test Authentication Flow**
- The app should handle the auth state correctly
- You can test by signing in/out manually
- Full deep linking will work in development build

---

## Troubleshooting

### Issue: "Unable to resolve module"
**Solution:**
```powershell
# Stop Expo (Ctrl+C)
# Clear cache and restart
npx expo start -c
```

### Issue: "Network request failed"
**Solution:**
- Check `.env` file exists and has correct values
- Verify Supabase URL and key are correct
- Make sure iPhone and computer are on same Wi-Fi

### Issue: QR Code Not Scanning
**Solution:**
- Make sure both devices on same Wi-Fi
- Try tunnel mode: `npx expo start --tunnel`
- Or manually enter URL shown in terminal

### Issue: App Won't Load
**Solution:**
```powershell
# Full clean restart
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
npx expo start -c
```

---

## What's Ready for Apple?

### ✅ **Ready:**
- App configuration (bundle ID, version, etc.)
- iOS-specific settings
- Privacy Policy
- EAS Build configuration
- Basic functionality

### ⚠️ **Still Needed (for App Store):**
- Apple Developer Program enrollment ($99/year)
- Screenshots (1290×2796px for iPhone)
- TestFlight testing (requires development build)
- App Store Connect setup

### 📝 **Expo Go vs Development Build:**

**Expo Go (Current):**
- ✅ Quick testing
- ✅ Basic functionality
- ❌ No Universal Links
- ❌ No deep linking

**Development Build (Next Step):**
- ✅ Full functionality
- ✅ Universal Links work
- ✅ Deep linking works
- ✅ Closer to production
- ⚠️ Requires Apple Developer Program

---

## Next Steps After Testing

**If Testing Goes Well:**
1. ✅ App works correctly
2. ⚠️ Enroll in Apple Developer Program
3. ⚠️ Create development build for full testing
4. ⚠️ Test Universal Links in development build
5. ⚠️ Create screenshots
6. ⚠️ Submit to App Store

**If Issues Found:**
- Fix bugs
- Test again in Expo Go
- Then proceed to development build

---

## Quick Commands Reference

```powershell
# Start Expo (normal)
npx expo start

# Start Expo (with cache clear)
npx expo start -c

# Start Expo (tunnel mode - works across networks)
npx expo start --tunnel

# Stop Expo
# Press Ctrl+C in terminal
```

---

## Testing Checklist

**Before Moving to Development Build:**
- [ ] App loads successfully
- [ ] Authentication screen displays
- [ ] Can create tasks
- [ ] Can edit/delete tasks
- [ ] Settings screen works
- [ ] Dark mode works
- [ ] Archive view works
- [ ] No crashes or errors
- [ ] UI looks good on iPhone

**Ready for Development Build?**
- ✅ All above items checked
- ✅ Ready to test Universal Links
- ✅ Ready for TestFlight

---

**Good luck with testing! 🚀**

If you encounter any issues, check the troubleshooting section or let me know!

