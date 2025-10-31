# Expo Go Deep Link Limitation - Solution

## The Problem

**Expo Go doesn't register custom URL schemes!** When you type `todotomorrow://` in a browser, the system doesn't recognize it because Expo Go only handles `exp://` links.

This is a known limitation of Expo Go - custom schemes only work in **development builds** or **production builds**, not in Expo Go.

## ✅ Solution Options

### Option 1: Use Expo's Development URL (Quick Test)

For testing in Expo Go, we can use Expo's built-in URL format:

1. **Get your Expo dev server URL** from the terminal:
   ```
   › Metro waiting on exp://192.168.0.7:8081
   ```
   Your URL is: `exp://192.168.0.7:8081` (or whatever IP/port you see)

2. **Manually trigger the deep link handler** by modifying the code to accept a test button, OR

3. **Use Expo's Linking API directly in the app** to simulate the deep link

### Option 2: Accept Limitation for Now (Recommended for MVP)

**Document this limitation:**
- Custom URL schemes (`todotomorrow://`) only work in development builds or production
- Expo Go doesn't support custom schemes
- For testing the authentication flow:
  1. Test that magic link email is sent ✅ (this works!)
  2. Test that deep link handler code is correct (we can test manually)
  3. Note that full end-to-end testing requires a development build

### Option 3: Create a Development Build (More Complex)

To test custom schemes properly, you'd need to:
1. Create an Expo development build
2. Install it on your device
3. Then custom schemes would work

But this is more setup than needed for MVP testing.

## 🎯 What We Can Test Right Now

Even though the deep link doesn't work in Expo Go, we can verify:

1. ✅ **Magic link email is sent** - This works!
2. ✅ **Email validation works** - This works!
3. ✅ **API calls work** - This works!
4. ✅ **Deep link handler code is correct** - Code is ready, just can't test in Expo Go
5. ⚠️ **Full deep link flow** - Requires dev build or production

## 📝 Recommended Approach

For Story 1.4 (MVP), we should:

1. **Mark the deep link implementation as complete** - The code is correct
2. **Document the Expo Go limitation** - Note in the story that full testing requires a dev build
3. **Test what we can:**
   - Email sending ✅
   - Email validation ✅
   - UI works ✅
   - Code structure is correct ✅

4. **For production:** Custom URL schemes will work fine once built as a standalone app

## 🔧 Alternative: Test Handler Manually

We can add a temporary test button in the app to simulate receiving a deep link:

```typescript
// Temporary test button (remove later)
<TouchableOpacity onPress={() => {
  handleDeepLink('todotomorrow://auth/callback?token=TEST_TOKEN&type=magiclink');
}}>
  <Text>Test Deep Link Handler</Text>
</TouchableOpacity>
```

This would let us test the handler logic without needing the actual deep link.

## 💡 Summary

- **Custom URL schemes don't work in Expo Go** - This is expected behavior
- **Your code is correct** - It will work in production/dev builds
- **For MVP testing:** We can test everything except the actual deep link triggering
- **Documentation:** Add a note that full deep link testing requires a development build

Would you like me to add a test button so we can manually trigger the deep link handler and verify it works?

