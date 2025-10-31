# Detailed Testing Guide for Story 1.4: Magic Link Authentication Flow

## Prerequisites

Before testing, make sure you have:
- ✅ Node.js and npm installed
- ✅ Expo CLI installed globally (`npm install -g expo-cli` if needed)
- ✅ A Supabase account with your project set up
- ✅ Your development environment ready (iOS Simulator, Android Emulator, or physical device)
- ✅ Access to an email inbox (for receiving magic link emails)

## Step 1: Configure Supabase Redirect URL (REQUIRED)

This is a critical step that must be done before testing the magic link flow.

### Steps:
1. **Go to Supabase Dashboard**
   - Open your browser and navigate to: https://supabase.com/dashboard
   - Log in to your account

2. **Navigate to Your Project**
   - Select your project (the one with URL: `https://zrnjxrtgrommlhexbpde.supabase.co`)

3. **Go to Authentication Settings**
   - In the left sidebar, click on **"Authentication"**
   - Then click on **"URL Configuration"** (or look for "Redirect URLs" or "Site URL" settings)

4. **Add Redirect URL**
   - Find the **"Redirect URLs"** section (may also be called "Allowed Redirect URLs" or "Email Redirect URLs")
   - Add this exact URL: `todomorning://auth/callback`
   - Click **"Save"** or **"Add"**

5. **Verify Site URL** (Optional but recommended)
   - Make sure your "Site URL" is set (can be any valid URL, e.g., `http://localhost:3000`)
   - This is used as a fallback

**Important Notes:**
- The redirect URL format is: `todomorning://auth/callback`
- This must match exactly what we configured in the app
- Supabase will reject magic link authentication if this URL is not whitelisted

## Step 2: Start the Development Server

### Option A: Using Expo Go App (Recommended for Newbies)
This is the easiest way to test on a physical device.

1. **Open Terminal/Command Prompt**
   - Navigate to your project directory:
     ```powershell
     cd "C:\Users\joega\My Apps\todoapp"
     ```

2. **Start Expo**
   ```powershell
   npm start
     ```
   - This will start the Expo development server
   - You'll see a QR code in the terminal

3. **Install Expo Go on Your Phone**
   - **iOS**: Download "Expo Go" from the App Store
   - **Android**: Download "Expo Go" from Google Play Store

4. **Scan the QR Code**
   - Open Expo Go app on your phone
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the Expo Go app's built-in QR scanner
   - The app will load on your phone

### Option B: Using iOS Simulator (Mac Only)
1. **Start Expo**
   ```powershell
   npm start
     ```

2. **Open iOS Simulator**
   - Press `i` in the terminal where Expo is running
   - Or run: `npm run ios`

### Option C: Using Android Emulator
1. **Start Android Emulator** (must be running first)
2. **Start Expo**
   ```powershell
   npm start
     ```
3. **Open in Emulator**
   - Press `a` in the terminal where Expo is running
   - Or run: `npm run android`

## Step 3: Test Each Acceptance Criterion

### ✅ Test 1: AuthScreen Component Display (AC: 1)

**What to Check:**
- [ ] The app should show a screen with:
  - A title "Sign In" at the top
  - Subtitle text "Enter your email to receive a magic link"
  - An empty email input field
  - A "Send Magic Link" button

**How to Test:**
1. After the app loads, you should immediately see the AuthScreen
2. Verify all UI elements are visible and properly formatted
3. The input field should be empty
4. The button should say "Send Magic Link"

**Expected Result:** ✅ All UI elements are visible and correctly positioned

---

### ✅ Test 2: Email Validation (AC: 2)

**Test Case 2a: Empty Email**
1. Leave the email field empty
2. Click "Send Magic Link" button
3. **Expected:** Error message appears: "Please enter your email address"

**Test Case 2b: Invalid Email Format (No @)**
1. Type: `notanemail`
2. Click "Send Magic Link" button
3. **Expected:** Error message appears: "Please enter a valid email address"

**Test Case 2c: Invalid Email Format (No Domain)**
1. Type: `test@`
2. Click "Send Magic Link" button
3. **Expected:** Error message appears: "Please enter a valid email address"

**Test Case 2d: Invalid Email Format (No TLD)**
1. Type: `test@example`
2. Click "Send Magic Link" button
3. **Expected:** Error message appears: "Please enter a valid email address"

**Test Case 2e: Valid Email Format**
1. Type: `your.email@example.com`
2. **Expected:** No error message appears while typing
3. **Note:** We'll test submitting in the next step

**Expected Results:**
- ✅ All invalid formats show appropriate error messages
- ✅ Error messages clear when user starts typing again
- ✅ Valid format doesn't show errors while typing

---

### ✅ Test 3: Send Magic Link API Call (AC: 3)

**Prerequisites:** You must have completed Step 1 (Supabase redirect URL configuration)

**Test Steps:**
1. Enter a **real, valid email address** that you have access to:
   - Example: `test@yourdomain.com` or use a test email service
2. Click "Send Magic Link" button
3. **Watch for:**
   - Button should show a loading spinner
   - Button should be disabled while loading

**Expected Results:**
- ✅ Button shows loading state (spinner)
- ✅ After a few seconds, loading stops
- ✅ Success message appears: "Check your email"
- ✅ Email input field is cleared

**What's Happening Behind the Scenes:**
- The app calls `supabase.auth.signInWithOtp({ email })`
- Supabase processes the request and sends an email
- Check your browser console/terminal for any error logs

**Troubleshooting:**
- If you see an error, check:
  - Is Supabase redirect URL configured? (Step 1)
  - Is your internet connection working?
  - Check the terminal/console for error messages

---

### ✅ Test 4: Success Message Display (AC: 4)

**Test Steps:**
1. Complete Test 3 successfully
2. After clicking "Send Magic Link", wait for the response

**Expected Results:**
- ✅ Success message appears: "Check your email"
- ✅ Message is displayed in green color
- ✅ Message is centered below the input field
- ✅ Error messages (if any) are cleared

**Note:** This confirms the API call succeeded and email was sent by Supabase.

---

### ✅ Test 5: Magic Link Email Received (AC: 5)

**Test Steps:**
1. Complete Test 3 successfully (magic link sent)
2. Check the email inbox for the email address you used
3. **Wait:** Email usually arrives within 10-30 seconds

**What to Look For:**
- [ ] Email from Supabase (sender might be "noreply@mail.app.supabase.io" or similar)
- [ ] Subject line should mention "magic link" or "sign in"
- [ ] Email contains a clickable link

**Expected Results:**
- ✅ Email is received within 30 seconds
- ✅ Email contains a link/button to authenticate
- ✅ Link format should include your deep link scheme

**Important Notes:**
- If testing in development, Supabase may send emails to a test mailbox
- Check Supabase Dashboard → Authentication → Users to see if email was sent
- Some email providers may delay or filter emails (check spam folder)

**Troubleshooting:**
- **No email received:**
  - Check spam/junk folder
  - Verify email address is correct
  - Wait up to 2 minutes (sometimes delayed)
  - Check Supabase Dashboard logs for email delivery status
  - Verify redirect URL is configured (Step 1)

---

### ✅ Test 6: Deep Link Opens App (AC: 6)

This is the most complex test. We'll test it multiple ways.

#### Test 6a: Click Magic Link in Email (Real Flow)

**Prerequisites:**
- Completed Test 5 (email received)
- App is installed or Expo Go is available on device

**Test Steps:**

**For Physical Device with Expo Go:**
1. Open the magic link email on your phone
2. Click the link in the email
3. **Expected Results:**
   - ✅ App opens automatically (Expo Go or your app)
   - ✅ AuthScreen shows a loading state briefly
   - ✅ Success message: "Successfully signed in!"

**For iOS Simulator:**
1. The magic link in email might not open simulator directly
2. Instead, use the manual deep link test (Test 6b)

**For Android Emulator:**
1. Copy the magic link URL from email
2. Use ADB command (see Test 6c)

**What Happens:**
- Email link redirects to: `todomorning://auth/callback?token=XXXXX&type=email`
- Deep link handler detects the URL
- Token is extracted and verified with Supabase
- Session is created automatically

---

#### Test 6b: Manual Deep Link Test (iOS Simulator)

**Test Steps:**
1. **Start iOS Simulator** (if not already running)
   ```powershell
   npm run ios
     ```

2. **Open Terminal** and run:
   ```powershell
   xcrun simctl openurl booted "todomorning://auth/callback?token=test&type=email"
     ```
   
   **Note:** This uses a dummy token. For real testing, you need the actual token from the email.

3. **Expected Results:**
   - ✅ App receives the deep link
   - ✅ Shows error (because token is invalid): "Invalid or expired magic link"
   - ✅ This confirms deep linking is working

---

#### Test 6c: Manual Deep Link Test (Android Emulator)

**Prerequisites:**
- Android Emulator must be running
- ADB must be in your PATH

**Test Steps:**
1. **Open Command Prompt/Terminal**

2. **Test basic deep link:**
   ```powershell
   adb shell am start -W -a android.intent.action.VIEW -d "todomorning://auth/callback?token=test&type=email"
     ```

3. **Expected Results:**
   - ✅ App opens (or switches to foreground)
   - ✅ Deep link handler processes the URL
   - ✅ Shows error message (invalid token)
   - ✅ This confirms deep linking works

**Troubleshooting Android:**
- If command not found: Add Android SDK platform-tools to PATH
- If app doesn't open: Make sure app is installed on emulator

---

#### Test 6d: Full End-to-End Test with Real Token

**This is the complete flow:**

1. **Send Magic Link** (Test 3)
   - Enter your email
   - Click "Send Magic Link"
   - See success message

2. **Receive Email** (Test 5)
   - Check your email
   - Find the magic link

3. **Extract Token from Email Link:**
   - Right-click on the link in email
   - "Copy link address" or "Copy link"
   - The URL will look like:
     ```
     https://zrnjxrtgrommlhexbpde.supabase.co/auth/v1/verify?token=XXXXX&type=email&redirect_to=todomorning://auth/callback
     ```
   - The token is the `token=XXXXX` part

4. **Click the Link:**
   - On physical device: Just click it, app should open
   - On simulator/emulator: Use manual commands (Test 6b/6c) with the real token

5. **Expected Results:**
   - ✅ App opens
   - ✅ Token is verified with Supabase
   - ✅ Session is created
   - ✅ Success message: "Successfully signed in!"
   - ✅ No error messages

---

### ✅ Test 7: Session Creation Verification

**After completing Test 6d successfully:**

1. **Check Console/Logs:**
   - Look for log message: "Session created: [session object]"
   - This confirms session was created

2. **Verify in Supabase Dashboard:**
   - Go to Supabase Dashboard → Authentication → Users
   - **Expected:** You should see a new user with the email you used
   - User should be marked as "Confirmed" or "Active"

3. **Check Session Storage:**
   - Session is automatically stored in AsyncStorage (configured in `src/lib/supabase.ts`)
   - This happens automatically - no action needed

**Expected Results:**
- ✅ User appears in Supabase Dashboard Users list
- ✅ User email matches what you entered
- ✅ User status is "Confirmed"
- ✅ Session is stored locally in app

---

## Step 4: Error Handling Tests

### Test Error Cases:

#### Error Test 1: Network Offline
1. Turn off WiFi/mobile data
2. Enter valid email
3. Click "Send Magic Link"
4. **Expected:** Error message appears: "Unable to send magic link. Please try again."

#### Error Test 2: Expired Token
1. Wait for magic link to expire (default: 1 hour)
2. Click old magic link
3. **Expected:** Error message: "Invalid or expired magic link. Please try again."

#### Error Test 3: Invalid Token Format
1. Use manual deep link with malformed token:
   ```powershell
   xcrun simctl openurl booted "todomorning://auth/callback?token=invalid&type=email"
     ```
2. **Expected:** Error handling gracefully shows error message

---

## Step 5: Platform-Specific Testing

### iOS Testing Checklist:
- [ ] Deep link opens app from email
- [ ] Deep link works when app is closed
- [ ] Deep link works when app is in background
- [ ] Manual deep link command works (Test 6b)

### Android Testing Checklist:
- [ ] Deep link opens app from email
- [ ] Deep link works when app is closed
- [ ] Deep link works when app is in background
- [ ] Manual deep link command works (Test 6c)

### Web/PWA Testing (Future):
- Note: Web deep linking will be tested when PWA support is added

---

## Troubleshooting Common Issues

### Issue 1: "Unable to send magic link" Error

**Possible Causes:**
- ❌ Supabase redirect URL not configured (Step 1)
- ❌ Network connectivity issues
- ❌ Invalid Supabase credentials in `app.json`

**Solutions:**
1. Double-check Step 1 (Supabase redirect URL)
2. Verify internet connection
3. Check `app.json` has correct Supabase URL and key
4. Check terminal/console for detailed error messages

---

### Issue 2: Email Not Received

**Possible Causes:**
- Email in spam folder
- Email delivery delay
- Supabase email service issue
- Invalid email address

**Solutions:**
1. Check spam/junk folder
2. Wait 2-3 minutes
3. Check Supabase Dashboard → Authentication → Users (see if request was logged)
4. Try a different email address
5. Verify email address is correctly formatted

---

### Issue 3: Deep Link Doesn't Open App

**Possible Causes:**
- Deep link scheme not configured correctly
- App not installed/running
- Platform-specific deep link handler issue

**Solutions:**
1. Verify `app.json` has `"scheme": "todomorning"` (we added this)
2. Make sure app is installed on device/simulator
3. For iOS Simulator: Rebuild app after adding scheme
4. For Android: Rebuild app after adding scheme
5. Try manual deep link command to test

---

### Issue 4: "Invalid or expired magic link" After Clicking

**Possible Causes:**
- Token already used (magic links are single-use)
- Token expired (default: 1 hour)
- Incorrect token extraction

**Solutions:**
1. Request a new magic link
2. Click the new link immediately
3. Verify token format in URL matches what Supabase expects
4. Check console logs for detailed error

---

## Success Criteria Summary

All acceptance criteria are met when:

✅ **AC 1:** AuthScreen displays correctly with email input
✅ **AC 2:** Email validation works for invalid formats
✅ **AC 3:** "Send Magic Link" button calls API successfully
✅ **AC 4:** Success message "Check your email" appears
✅ **AC 5:** Magic link email is received in inbox
✅ **AC 6:** Clicking magic link opens app and creates session

---

## Next Steps After Testing

Once all tests pass:

1. **Story 1.4 is complete!** ✅
2. **Document any issues found** in the story file
3. **Move to Story 1.5** which will handle:
   - Navigation between auth and authenticated screens
   - Session persistence checking
   - Auto-login on app startup

---

## Quick Reference Commands

```powershell
# Start Expo development server
npm start

# Start on iOS Simulator (Mac only)
npm run ios

# Start on Android Emulator
npm run android

# Test deep link on iOS Simulator
xcrun simctl openurl booted "todomorning://auth/callback?token=test&type=email"

# Test deep link on Android Emulator
adb shell am start -W -a android.intent.action.VIEW -d "todomorning://auth/callback?token=test&type=email"
```

---

## Need Help?

If you encounter issues:
1. Check console/terminal for error messages
2. Verify all prerequisites are met (Step 1 especially!)
3. Review the troubleshooting section above
4. Check Supabase Dashboard for authentication logs
5. Verify all configuration steps were completed correctly

Good luck with testing! 🚀

