# Payment & Trial System

## Trial Logic

**Trigger:** First task creation  
**Duration:** 30 days OR 100 tasks (whichever first)  
**Status:** Stored in `users` table

```typescript
function calculateTrialStatus(user: User): TrialStatus {
  if (user.is_paid) {
    return { active: false, reason: 'paid' }
  }

  if (!user.trial_started_at) {
    return { active: false, reason: 'not_started' }
  }

  const daysElapsed = Math.floor(
    (Date.now() - new Date(user.trial_started_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  const daysRemaining = Math.max(0, 30 - daysElapsed)
  const tasksRemaining = Math.max(0, 100 - user.trial_tasks_count)

  const active = daysRemaining > 0 && tasksRemaining > 0

  return {
    active,
    daysRemaining,
    tasksRemaining,
    expiredReason: active ? null : daysRemaining === 0 ? 'days_expired' : 'tasks_expired'
  }
}
```

## Trial Task Counter

**Strategy:** Increment on server during sync, not on client

Why: Prevents fraud (client could artificially inflate count offline). Server is source-of-truth.

**Implementation:**

```sql
-- Increment trial_tasks_count when syncing new tasks
CREATE OR REPLACE FUNCTION increment_trial_tasks_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'open' AND NEW.synced IS FALSE THEN
    UPDATE users
    SET trial_tasks_count = trial_tasks_count + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_trial_on_task_create
AFTER INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION increment_trial_tasks_on_insert();
```

## Payment Platforms

### Platform 1: Stripe (PWA)

```typescript
// stripe-integration.ts
import Stripe from '@stripe/stripe-js'

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

async function createPaymentIntent(userId: string): Promise<string> {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })

  const { clientSecret } = await response.json()
  return clientSecret
}

async function processPaymentStripe(userId: string, email: string): Promise<boolean> {
  const stripe = await stripePromise
  const clientSecret = await createPaymentIntent(userId)

  const result = await stripe!.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement)!,
      billing_details: { email }
    }
  })

  if (result.paymentIntent?.status === 'succeeded') {
    // Server webhook will update user.is_paid = true
    return true
  }

  return false
}
```

**Webhook Handler (Edge Function):**

```typescript
// supabase/functions/stripe-webhook/index.ts
export async function handleStripeWebhook(event: any) {
  const { type, data } = event

  if (type === 'payment_intent.succeeded') {
    const { metadata, id: stripePaymentId } = data.object

    // Find user by Stripe ID in metadata
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        validation_status: 'valid',
        validated_at: new Date().toISOString()
      })
      .eq('external_transaction_id', stripePaymentId)
      .select()
      .single()

    if (payment) {
      await supabase
        .from('users')
        .update({
          is_paid: true,
          last_payment_at: new Date().toISOString()
        })
        .eq('id', payment.user_id)
    }
  }
}
```

### Platform 2: Apple IAP (iOS)

```typescript
// apple-iap-integration.ts
import { requestPurchase, purchaseUpdatedListener } from 'react-native-iap'

const APPLE_PRODUCT_ID = 'com.todomorning.subscription_month'

export async function processPaymentApple(userId: string): Promise<boolean> {
  try {
    await requestPurchase({ skus: [APPLE_PRODUCT_ID] })

    // Listen for purchase completion
    const subscription = purchaseUpdatedListener((purchase) => {
      if (purchase.purchaseStateAndroid === 'PurchasedAndroid' || purchase.isProductPurchaseIOS) {
        // Send receipt to server for validation
        validateAppleReceipt(userId, purchase.transactionReceipt)
      }
    })

    return true
  } catch (error) {
    console.error('Apple IAP error:', error)
    return false
  }
}

async function validateAppleReceipt(userId: string, receiptData: string): Promise<void> {
  // Call Supabase Edge Function to validate with Apple
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/validate-apple-receipt`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, receiptData })
    }
  )

  const result = await response.json()
  if (result.valid) {
    // Server marks user as paid
  }
}
```

### Platform 3: Google Play Billing (Android)

```typescript
// google-iap-integration.ts
import { 
  requestPurchase, 
  acknowledgePurchaseAndroid,
  validateReceiptAndroid 
} from 'react-native-iap'

const GOOGLE_PRODUCT_ID = 'com.todomorning.subscription_month'

export async function processPaymentGoogle(userId: string): Promise<boolean> {
  try {
    const sku = await requestPurchase({ skus: [GOOGLE_PRODUCT_ID] })

    // Acknowledge purchase
    if (sku?.purchaseToken) {
      await acknowledgePurchaseAndroid({
        token: sku.purchaseToken,
        packageName: 'com.todomorning'
      })

      // Validate receipt
      await validateGoogleReceipt(userId, sku.transactionReceipt)
      return true
    }

    return false
  } catch (error) {
    console.error('Google IAP error:', error)
    return false
  }
}

async function validateGoogleReceipt(userId: string, receiptData: string): Promise<void> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/validate-google-receipt`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, receiptData })
    }
  )

  const result = await response.json()
  if (result.valid) {
    // Server marks user as paid
  }
}
```

## Trial Enforcement (Client-Side)

```typescript
// components/TrialGate.tsx
import { useEffect, useState } from 'react'
import { useTaskStore } from '../store/taskStore'

export function TrialGate() {
  const user = useUserStore((s) => s.user)
  const [trialStatus, setTrialStatus] = useState(null)

  useEffect(() => {
    if (user) {
      const status = calculateTrialStatus(user)
      setTrialStatus(status)
    }
  }, [user])

  if (!trialStatus?.active) {
    return <PaymentRequired reason={trialStatus?.expiredReason} />
  }

  return (
    <div>
      <TrialBanner daysRemaining={trialStatus.daysRemaining} />
      {/* App content */}
    </div>
  )
}
```

---
