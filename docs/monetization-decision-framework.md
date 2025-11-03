# Monetization Decision Framework
**Document Type:** Strategic Decision Guide  
**Date:** February 11, 2025  
**Status:** Active  
**Strategy:** Free Until Traction

---

## Executive Summary

TodoMorning will remain **completely free** until proven product-market fit is achieved through objective traction thresholds. This framework defines when it's justified to introduce monetization complexity.

**Key Principle:** If D30 retention is <10%, charging money won't fix the problem - it will hide it.  
If D30 retention is >20%, you have product-market fit - monetization is justified.

---

## Traction Thresholds

Before adding payment systems, you must hit **TWO or more** of these thresholds:

### ✅ Threshold 1: Active User Base
- **500+ weekly active users** (not downloads - ACTIVE)
- Measured as: Users who opened app at least once in past 7 days
- Why: Proves sustainable usage, not just curiosity downloads

### ✅ Threshold 2: Review Volume
- **50+ App Store/Play Store reviews**
- Why: Proves users are engaged enough to leave feedback
- Note: Quality matters - 50 one-star reviews is a red flag, not validation

### ✅ Threshold 3: Review Quality
- **4.5+ star average rating**
- Why: Proves users actually value the app
- Note: If rating is <4.0, fix product before monetizing

### ✅ Threshold 4: Retention Validation
- **20%+ D30 retention proven**
- Measured as: Users who sign up, then open app again on Day 30+
- Why: This is the core product-market fit metric
- Critical: If <10%, charging won't help - the product isn't sticky

### ✅ Threshold 5: Organic Demand
- **Users organically asking "how do I support this?"**
- Measured as: Support emails, social mentions, reviews asking about payment
- Why: Proves users value it enough to pay without coercion
- Note: This is the strongest signal - when users ASK to pay

---

## Decision Matrix

| Active Users | Reviews | Rating | D30 Retention | Organic Demand | **Decision** |
|-------------|---------|--------|---------------|----------------|--------------|
| ✅ 500+ | ✅ 50+ | 4.2 | 15% | ❌ No | **WAIT** - Close but not proven |
| ✅ 800+ | ✅ 60+ | ✅ 4.6 | ✅ 22% | ❌ No | **PROCEED** - Strong metrics |
| ✅ 600+ | ✅ 80+ | ✅ 4.5 | ✅ 25% | ✅ Yes | **PROCEED** - All signals strong |
| ✅ 300+ | 30 | 4.7 | ✅ 18% | ✅ Yes | **PROCEED** - Organic demand trumps volume |
| 200 | ✅ 50+ | 4.0 | 12% | ❌ No | **WAIT** - Retention too low |
| ✅ 700+ | ✅ 70+ | 3.8 | ✅ 21% | ❌ No | **WAIT** - Rating too low, fix product first |

**Rule of Thumb:** Hit 2+ thresholds = justified to monetize.  
**Strongest Signal:** Organic demand + strong retention = green light.

---

## Why These Thresholds?

### The Math Check

**Scenario: 500 downloads, 20% D30 retention**
- 100 active users at Month 2
- 10-12% conversion = 10-12 paid users
- Revenue: 12 × $4.99 = $60 gross → $42 net (after 30% platform fees)
- **Verdict:** Still thin, but justified if retention is proven

**Scenario: 200 downloads, 10% D30 retention**
- 20 active users at Month 2
- 10% conversion = 2 paid users
- Revenue: 2 × $4.99 = $10 gross → $7 net
- **Verdict:** Not worth building payment infrastructure

**Scenario: 1000 downloads, 30% D30 retention**
- 300 active users at Month 2
- 10% conversion = 30 paid users
- Revenue: 30 × $4.99 = $150 gross → $105 net
- **Verdict:** Clearly justified

---

## What Happens When Thresholds Are Met?

### Month 4+ Launch (If thresholds met)

**Phase 1: Announcement**
1. Email all existing users: "You're grandfathered - free forever. Thanks for being early!"
2. Update App Store listing: "Now $4.99 - early users stay free"
3. Post on X/Twitter: "TodoMorning is now paid. But if you're reading this, you're grandfathered in free forever."

**Phase 2: New Users**
1. New users see $4.99 immediately upon signup
2. No trial period needed - reviews prove value
3. Simple one-time payment (no subscriptions)

**Phase 3: Database Migration**
1. Mark all existing users: `is_grandfathered = true`
2. New users: `is_grandfathered = false`, `cohort = 'paid_cohort_v1'`
3. Re-enable original cohort assignment logic (currently simplified in code)

---

## What If Thresholds Aren't Met by Month 3?

**This is fine. Actually, this is valuable data.**

If you don't hit thresholds by Month 3, it means:
- Product-market fit isn't proven
- Charging money wouldn't help - it would just hide the problem
- Focus should be on product iteration, not monetization

**Actions:**
1. Analyze why retention is low
2. Interview users who churned
3. Iterate on core features (email delivery reliability, UX, onboarding)
4. Re-evaluate thresholds at Month 6

**Don't charge prematurely** - it's better to stay free and fix the product.

---

## Monitoring & Evaluation

### Monthly Check-In (Months 1-3)

**Week 4 Evaluation:**
- Check all 5 thresholds
- If 2+ met → Prep for monetization
- If <2 met → Continue free, iterate product

**Decision Document:**
Create a simple tracker:
```
Month 1: Active Users: ___, Reviews: ___, Rating: ___, D30 Retention: ___, Organic Demand: ___
Month 2: Active Users: ___, Reviews: ___, Rating: ___, D30 Retention: ___, Organic Demand: ___
Month 3: Active Users: ___, Reviews: ___, Rating: ___, D30 Retention: ___, Organic Demand: ___

Decision: [ ] Proceed to monetization | [ ] Continue free | [ ] Re-evaluate at Month 6
```

---

## Code Re-enablement Process

When thresholds are met, re-enable tiered monetization:

1. **Uncomment original logic** in `src/lib/cohortAssignment.ts`
   - Remove simplified "always free" return statement
   - Restore original week-based cohort assignment

2. **Update database** for existing users:
   ```sql
   UPDATE users 
   SET is_grandfathered = TRUE 
   WHERE created_at < [MONETIZATION_LAUNCH_DATE];
   ```

3. **Update PRD Section 1.3** to reflect active monetization

4. **Build payment infrastructure** (Stories 4.6-4.8) if not already done

---

## Red Flags: Don't Monetize If...

❌ **D30 retention < 10%** - Product isn't sticky, charging won't help  
❌ **Rating < 4.0** - Users don't value it enough  
❌ **< 50 reviews after 3 months** - Not enough engagement  
❌ **No organic demand** - Users aren't asking to pay  
❌ **< 200 active users** - Too small a base  

If you see these, **focus on product, not payments**.

---

## Success Metrics Post-Monetization

Once monetization is enabled, track:

- **Conversion rate:** Target 10%+ of new signups
- **Revenue per user:** Target $4-5 net per paying user
- **Churn rate:** Should be near 0% (one-time payment)
- **Grandfathered user satisfaction:** Should remain high (they're advocates)

---

## Summary

**The Framework:**
1. Launch free (Months 1-3)
2. Monitor 5 traction thresholds
3. If 2+ thresholds met → Monetize
4. If <2 thresholds met → Keep free, iterate product
5. Grandfather all existing users when monetizing

**The Philosophy:**
Validate product-market fit through retention, not revenue.  
If people don't use it free, they won't pay for it.  
If people use it free and keep coming back, they'll pay.

---

**Document Owner:** John (PM)  
**Last Updated:** February 11, 2025  
**Next Review:** Month 3 milestone (or when thresholds are met)

