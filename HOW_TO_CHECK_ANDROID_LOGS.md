# How to Check Android Console Logs for Magic Link Error

**Purpose:** View detailed error messages from the production build to diagnose the magic link issue.

---

## Method 1: Using ADB Logcat (Recommended)

### Prerequisites
- Android device connected via USB (with USB debugging enabled)
- ADB installed on your computer
- Device connected and authorized

### Step-by-Step Instructions

1. **Enable USB Debugging on Your Device**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times (enables Developer Options)
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"
   - Connect device via USB
   - When prompted on device, tap "Allow USB debugging"

2. **Verify Device Connection**
   ```bash
   adb devices
   ```
   Should show your device listed (e.g., `ABC123XYZ    device`)

3. **Clear Old Logs (Optional but Recommended)**
   ```bash
   adb logcat -c
   ```

4. **Start Logging with Filter**
   ```bash
   # Filter for React Native/Expo logs
   adb logcat | grep -i "react\|expo\|magic\|supabase\|error"
   ```
   
   **OR for more detailed output:**
   ```bash
   # Show all logs (more verbose)
   adb logcat
   ```

5. **Reproduce the Error**
   - Open the TodoTomorrow app on your device
   - Enter email and tap "Send Magic Link"
   - Watch the terminal for error messages

6. **Look for These Log Messages**
   - `Magic link error:` - This will show the actual Supabase error
   - `Unable to send magic link` - Error message
   - `supabase` - Any Supabase-related errors
   - `Error:` - General error messages

### Alternative: Save Logs to File
```bash
# Save logs to file for easier review
adb logcat > magic_link_logs.txt

# Then reproduce error, then press Ctrl+C to stop logging
# Review magic_link_logs.txt file
```

---

## Method 2: Using Android Studio Logcat

### Step-by-Step Instructions

1. **Open Android Studio**
   - Download if needed: https://developer.android.com/studio

2. **Connect Your Device**
   - Connect device via USB
   - Enable USB debugging (see Method 1, Step 1)

3. **Open Logcat**
   - Bottom panel → **Logcat** tab
   - Or: View → Tool Windows → Logcat

4. **Filter Logs**
   - In Logcat filter box, enter: `react|expo|magic|supabase|error`
   - Or select "Show only selected application" and select your app

5. **Reproduce Error**
   - Open TodoTomorrow app
   - Request magic link
   - Watch Logcat for errors

6. **Look for Error Messages**
   - Red text indicates errors
   - Look for "Magic link error:" followed by error details

---

## Method 3: Using React Native Debugger (If Available)

If you have React Native Debugger or Chrome DevTools connected:

1. **Open Chrome DevTools**
   - Shake device → "Debug" (if available)
   - Or: Open `chrome://inspect` in Chrome browser

2. **Check Console Tab**
   - Look for error messages
   - Filter by "error" or "magic"

**Note:** This may not work in production builds - Method 1 or 2 is more reliable.

---

## What to Look For

### Common Error Messages:

1. **"Invalid redirect URL"**
   ```
   Error: Invalid redirect URL
   ```
   - **Fix:** Verify redirect URL is exactly `todotomorrow://auth/callback` in Supabase

2. **"Email rate limit exceeded"**
   ```
   Error: Email rate limit exceeded
   ```
   - **Fix:** Wait 5-10 minutes, then try again

3. **"Invalid API key" or "Unauthorized"**
   ```
   Error: Invalid API key
   ```
   - **Fix:** Check EAS secrets are set correctly

4. **"Network error" or "Failed to fetch"**
   ```
   Error: Network request failed
   ```
   - **Fix:** Check device internet connection

5. **"Missing environment variables"**
   ```
   Error: Missing Supabase environment variables
   ```
   - **Fix:** Verify EAS secrets are set

### Example Log Output:

**Good (Success):**
```
I ReactNativeJS: Sending magic link to: user@example.com
I ReactNativeJS: Magic link sent successfully
```

**Bad (Error):**
```
E ReactNativeJS: Magic link error: { message: "Invalid redirect URL", status: 400 }
E ReactNativeJS: Unable to send magic link. Please try again.
```

---

## Quick ADB Commands Reference

```bash
# List connected devices
adb devices

# Clear logs
adb logcat -c

# View all logs
adb logcat

# Filter for specific app (replace com.todotomorrow.app with your package)
adb logcat | grep "com.todotomorrow.app"

# Filter for errors only
adb logcat *:E

# Filter for React Native
adb logcat | grep -i "react"

# Save logs to file
adb logcat > logs.txt
```

---

## If ADB is Not Installed

### Windows:
1. Download Android SDK Platform Tools: https://developer.android.com/studio/releases/platform-tools
2. Extract to a folder (e.g., `C:\platform-tools`)
3. Add to PATH or use full path:
   ```powershell
   C:\platform-tools\adb.exe devices
   ```

### macOS:
```bash
# Install via Homebrew
brew install android-platform-tools

# Or download from Android website
```

### Linux:
```bash
# Install via package manager
sudo apt-get install android-tools-adb

# Or download from Android website
```

---

## Troubleshooting ADB Connection

**Device not showing up:**
```bash
# Restart ADB server
adb kill-server
adb start-server
adb devices
```

**"Unauthorized" device:**
- Check device screen for "Allow USB debugging" prompt
- Tap "Allow" or "Always allow"

**No devices found:**
- Check USB cable (try different cable)
- Check USB debugging is enabled
- Try different USB port
- Restart device

---

## Next Steps After Getting Logs

Once you have the error message:

1. **Copy the exact error text** from logs
2. **Share it** so we can diagnose the specific issue
3. **Common fixes based on error:**
   - Invalid redirect URL → Check Supabase config
   - Invalid API key → Check EAS secrets
   - Rate limit → Wait and retry
   - Network error → Check connectivity

---

## Alternative: Add Temporary Error Display

If you can't access logs, we can add a temporary Alert to show the error:

**File:** `src/screens/AuthScreen.tsx` (around line 624)

**Change:**
```typescript
if (error) {
  // Temporarily show detailed error for debugging
  Alert.alert('Magic Link Error', JSON.stringify(error, null, 2));
  setErrorMessage('Unable to send magic link. Please try again.');
  console.error('Magic link error:', error);
}
```

This will show a popup with the full error details on your device.

---

## Quick Test Command

**One-liner to see magic link errors:**
```bash
adb logcat -c && adb logcat | grep -i "magic\|error\|supabase"
```

Then reproduce the error in the app, and you'll see filtered logs.

