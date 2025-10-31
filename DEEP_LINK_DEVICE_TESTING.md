# Testing Deep Links - Device Matching Issue

## The Problem

You're running Expo Go on your **phone**, but clicking the magic link from your **PC email**. This creates a mismatch:

1. **Email link clicked on PC** → Opens in PC browser
2. **Deep link `todomorning://`** → PC doesn't know what to do with it (no Expo Go on PC)
3. **Result:** White screen or nothing happens

## ✅ Solution: Test on the Same Device

You need to click the magic link **on the same device where Expo Go is running** (your phone).

### Option 1: Open Email on Phone (Easiest)

1. **Open your email on your phone** (the same phone running Expo Go)
2. **Click the "Confirm your mail" link** in the email
3. **Expected:** App should open and handle the deep link

### Option 2: Copy Link from PC to Phone

1. **On PC:** Right-click the magic link → "Copy link address"
2. **Send to phone:** 
   - Email it to yourself
   - Or use a messaging app
   - Or copy to clipboard and sync (if you have that)
3. **On phone:** Open the copied link in a browser (Chrome, Safari, etc.)
4. **Click it** → Should open Expo Go

### Option 3: Manual Deep Link Test (For Development)

If you want to test the deep link handler directly without the email redirect:

1. **Extract the token from the email link:**
   ```
   From: https://...verify?token=XXXXX&type=magiclink&redirect_to=...
   Token: XXXXX
   ```

2. **On your phone, manually open the deep link:**
   - **Android:** Use a browser and type/paste:
     ```
     todomorning://auth/callback?token=YOUR_TOKEN&type=magiclink
     ```
   - **iOS:** Same as Android

   The browser will prompt to open in Expo Go.

## 🔍 Why This Happens

- **Deep links (`todomorning://`)** are device-specific
- They need a registered app handler on the same device
- PC browsers don't know about your phone's Expo Go installation
- So the redirect fails silently (white screen)

## ✅ Correct Testing Flow

### The Right Way:

1. **Start app on phone** (Expo Go)
2. **Send magic link** (from app on phone)
3. **Open email on phone** (same device!)
4. **Click magic link** (on phone)
5. **App opens** (on phone) → Deep link works! ✅

### The Wrong Way (What You Did):

1. ✅ Start app on phone
2. ✅ Send magic link (from app on phone)  
3. ❌ Open email on PC (different device!)
4. ❌ Click link on PC → Can't open app on phone
5. ❌ Result: White screen

## 🎯 Quick Test Steps

1. **Make sure Expo Go is running on your phone**
2. **In the app, send a magic link** (enter email, click "Send Magic Link")
3. **On your PHONE, open your email app** (Gmail, Outlook, etc.)
4. **Find the Supabase email** (should arrive within seconds)
5. **Click "Confirm your mail" link** (on your phone)
6. **Expected Result:** 
   - Expo Go app opens (or switches to it if already open)
   - You see "Successfully signed in!" message
   - OR you see an error message (but not white screen)

## 📱 Platform-Specific Notes

### Android
- Email apps usually handle deep links automatically
- If it opens in a browser first, the browser should still trigger the deep link
- Chrome on Android handles `todomorning://` links well

### iOS
- iOS Mail app handles deep links
- Safari also handles them
- You might get a prompt: "Open in Expo Go?" → Click Yes

## 🔧 Troubleshooting

### "Nothing happens when I click the link on my phone"

1. **Check Expo Go is running** on your phone
2. **Check the link format** - Should contain `todomorning://auth/callback?token=...`
3. **Try copying the link** and pasting it in your phone's browser address bar
4. **Check console logs** in Expo terminal for debug messages

### "Link opens browser but doesn't open app"

1. **Make sure Expo Go is running** (not just installed)
2. **Try closing and reopening Expo Go**
3. **Check `app.json` has `"scheme": "todomorning"`** (we added this ✅)
4. **Restart Expo dev server** with `npx expo start -c`

### "I see an error message in the app"

Great! This means the deep link worked, but there's an error in the handler. Check:
- Console logs for details (🔗, 📦, 🔑 emojis in logs)
- Error message text in the app
- Share the error and I'll help fix it

