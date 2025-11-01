package com.todotomorrow.app

import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import android.os.Bundle
import android.util.Log

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import expo.modules.ReactActivityDelegateWrapper

class MainActivity : ReactActivity() {
  companion object {
    private const val PREFS_NAME = "DeepLinkPrefs"
    private const val KEY_INITIAL_URL = "initial_deep_link_url"
    private var initialIntent: Intent? = null
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    // Set the theme to AppTheme BEFORE onCreate to support
    // coloring the background, status bar, and navigation bar.
    // This is required for expo-splash-screen.
    setTheme(R.style.AppTheme);
    
    // VERIFICATION: This log should ALWAYS appear when MainActivity starts
    Log.e("DeepLinkIntent", "🔴 VERIFICATION: MainActivity.onCreate() called - Activity native code IS running!")
    Log.d("DeepLinkIntent", "MainActivity.onCreate() called")
    
    // Store the initial intent before React Native initializes
    val intent = intent
    Log.d("DeepLinkIntent", "Intent check - intent is null: ${intent == null}")
    
    if (intent != null) {
      Log.d("DeepLinkIntent", "Intent action: ${intent.action}")
      Log.d("DeepLinkIntent", "Intent data: ${intent.data}")
      Log.d("DeepLinkIntent", "Intent data string: ${intent.dataString}")
      
      if (intent.data != null) {
        val url = intent.data.toString()
        Log.d("DeepLinkIntent", "✅ Captured deep link URL in onCreate: $url")
        initialIntent = intent
        // Also save to SharedPreferences as backup
        saveInitialUrl(url)
        Log.d("DeepLinkIntent", "✅ Saved deep link URL to SharedPreferences")
      } else {
        Log.d("DeepLinkIntent", "⚠️ Intent exists but intent.data is null")
      }
    } else {
      Log.d("DeepLinkIntent", "⚠️ Intent is null in onCreate")
    }
    
    super.onCreate(null)
    Log.d("DeepLinkIntent", "MainActivity.onCreate() completed")
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    
    Log.d("DeepLinkIntent", "MainActivity.onNewIntent() called")
    
    if (intent != null && intent.data != null) {
      val url = intent.data.toString()
      Log.d("DeepLinkIntent", "✅ Captured deep link URL in onNewIntent: $url")
      initialIntent = intent
      saveInitialUrl(url)
      Log.d("DeepLinkIntent", "✅ Saved deep link URL to SharedPreferences in onNewIntent")
    } else {
      Log.d("DeepLinkIntent", "⚠️ onNewIntent called but intent.data is null")
    }
  }

  private fun saveInitialUrl(url: String) {
    Log.d("DeepLinkIntent", "Saving URL to SharedPreferences: $url")
    val prefs: SharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
    prefs.edit().putString(KEY_INITIAL_URL, url).apply()
    Log.d("DeepLinkIntent", "URL saved to SharedPreferences successfully")
  }

  fun getInitialUrl(): String? {
    Log.d("DeepLinkIntent", "getInitialUrl() called")
    
    // First check static variable (fastest)
    val urlFromIntent = initialIntent?.data?.toString()
    if (urlFromIntent != null) {
      Log.d("DeepLinkIntent", "✅ Found URL from static intent: $urlFromIntent")
      return urlFromIntent
    }
    
    Log.d("DeepLinkIntent", "Static intent is null, checking SharedPreferences...")
    
    // Fallback to SharedPreferences
    val prefs: SharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
    val urlFromPrefs = prefs.getString(KEY_INITIAL_URL, null)
    if (urlFromPrefs != null) {
      Log.d("DeepLinkIntent", "✅ Found URL from SharedPreferences: $urlFromPrefs")
    } else {
      Log.d("DeepLinkIntent", "⚠️ No URL found in SharedPreferences")
    }
    return urlFromPrefs
  }

  fun clearInitialUrl() {
    Log.d("DeepLinkIntent", "clearInitialUrl() called")
    initialIntent = null
    val prefs: SharedPreferences = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
    prefs.edit().remove(KEY_INITIAL_URL).apply()
    Log.d("DeepLinkIntent", "✅ Cleared stored deep link URL")
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "main"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return ReactActivityDelegateWrapper(
          this,
          BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
          object : DefaultReactActivityDelegate(
              this,
              mainComponentName,
              fabricEnabled
          ){})
  }

  /**
    * Align the back button behavior with Android S
    * where moving root activities to background instead of finishing activities.
    * @see <a href="https://developer.android.com/reference/android/app/Activity#onBackPressed()">onBackPressed</a>
    */
  override fun invokeDefaultOnBackPressed() {
      if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
          if (!moveTaskToBack(false)) {
              // For non-root activities, use the default implementation to finish them.
              super.invokeDefaultOnBackPressed()
          }
          return
      }

      // Use the default back button implementation on Android S
      // because it's doing more than [Activity.moveTaskToBack] in fact.
      super.invokeDefaultOnBackPressed()
  }
}
