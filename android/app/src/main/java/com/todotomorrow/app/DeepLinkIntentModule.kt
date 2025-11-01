package com.todotomorrow.app

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.app.Activity

class DeepLinkIntentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  
  init {
    Log.d("DeepLinkIntent", "DeepLinkIntentModule initialized")
  }
  
  override fun getName(): String {
    Log.d("DeepLinkIntent", "DeepLinkIntentModule.getName() called")
    return "DeepLinkIntent"
  }

  @ReactMethod
  fun getInitialURL(promise: Promise) {
    Log.d("DeepLinkIntent", "DeepLinkIntentModule.getInitialURL() called from JavaScript")
    val activity: Activity? = reactApplicationContext.currentActivity
    
    Log.d("DeepLinkIntent", "Current activity is null: ${activity == null}")
    
    if (activity != null) {
      Log.d("DeepLinkIntent", "Activity class: ${activity.javaClass.name}")
      if (activity is MainActivity) {
        Log.d("DeepLinkIntent", "✅ Activity is MainActivity, calling getInitialUrl()")
        val url = activity.getInitialUrl()
        if (url != null) {
          Log.d("DeepLinkIntent", "✅ Returning URL to JavaScript: $url")
          promise.resolve(url)
        } else {
          Log.d("DeepLinkIntent", "⚠️ getInitialUrl() returned null")
          promise.resolve(null)
        }
      } else {
        Log.d("DeepLinkIntent", "❌ Activity is not MainActivity, it's: ${activity.javaClass.name}")
        promise.reject("NO_ACTIVITY", "Current activity is not MainActivity")
      }
    } else {
      Log.d("DeepLinkIntent", "❌ Current activity is null")
      promise.reject("NO_ACTIVITY", "Current activity is not available")
    }
  }

  @ReactMethod
  fun clearInitialURL() {
    Log.d("DeepLinkIntent", "DeepLinkIntentModule.clearInitialURL() called from JavaScript")
    val activity: Activity? = reactApplicationContext.currentActivity
    if (activity != null && activity is MainActivity) {
      Log.d("DeepLinkIntent", "✅ Clearing URL from MainActivity")
      activity.clearInitialUrl()
    } else {
      Log.d("DeepLinkIntent", "⚠️ Cannot clear URL - activity is null or not MainActivity")
    }
  }
}

