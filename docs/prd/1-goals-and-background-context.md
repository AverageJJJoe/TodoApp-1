# 1. Goals and Background Context

## 1.1 Goals

1. **Launch MVP in 4 weeks** - Ship functional PWA + native apps (if approved) by Week 4
2. **Validate product-market fit** - Achieve 300-500 downloads in Month 1 with 20% Day-30 retention
3. **Validate monetization readiness** - Prove product-market fit (20%+ D30 retention, 500+ active users) before introducing payments
4. **Build organic audience** - Grow X (Twitter) following through build-in-public strategy (50-100 engaged followers)
5. **Establish competitive positioning** - Position as "the anti-Todoist" for simplicity-seeking email users
6. **Prove product-market fit first** - Validate 20%+ D30 retention and 500+ active users before monetization
7. **Maximize adoption through free launch** - Focus on product quality and retention, defer payment complexity until traction proven

## 1.2 Background Context

TodoTomorrow solves a problem experienced by email-native knowledge workers: capturing sporadic evening brain dumps without cluttering their inbox or requiring manual intervention.

**The Problem:** During busy reactive daytimes, there's no time for planning. But during evenings (bed, car, waiting for kids), strategic ideas for tomorrow surface sporadically. Existing solutions fail:
- **Email drafts** - Users forget to send them, tasks never arrive in morning inbox
- **Todoist** - Too complex with overwhelming features, clutters inbox with individual reminder emails
- **TodoMailer** - Sends one email per task immediately, creating inbox spam

**The Solution:** TodoTomorrow is a mobile-first capture tool that automatically batches evening brain dumps into one clean morning email at the user's chosen time (default 6:00 AM), delivering a consolidated daily action plan directly to their inbox.

**Why This Matters:** Email remains the universal productivity hub for knowledge workers. The app doesn't try to replace email—it bridges mobile capture to email delivery. Competitive analysis reveals no existing solution offers automatic batched email delivery, creating a genuine blue ocean opportunity.

**Strategic Context:** This indie maker project targets a niche within the $50B+ productivity software market. Success is defined as sustainable solo-dev income ($500-2000/month), validated through X build-in-public strategy and Product Hunt launch.

## 1.3 Monetization Strategy Overview

TodoTomorrow uses a **"Free Until Traction" strategy** to prioritize product-market fit validation before introducing monetization complexity:

**Phase 1 (Months 1-3):** Launch completely FREE
- No payment code, no paywalls, no trials, no limits
- Focus 100% on product quality and retention validation
- All users automatically grandfathered as `free_launch` cohort with `grandfather_status = true` (free forever)
- Target: Prove product-market fit through retention, not revenue

**Phase 2 (Month 4+, IF traction thresholds met):** Introduce one-time payment
- Announce: "TodoMorning is now $4.99 one-time payment"
- Grandfather ALL existing users: FREE FOREVER (goodwill + advocates)
- New users: $4.99 immediately upon signup (no trial needed - reviews prove value)
- Target: Sustainable revenue from proven product value

**Traction Thresholds (Decision Framework):**
Before adding payments, must hit **TWO or more** of these:
- ✅ 500+ weekly active users (not downloads - ACTIVE)
- ✅ 50+ App Store/Play Store reviews
- ✅ 4.5+ star average rating
- ✅ 20%+ D30 retention proven
- ✅ Users organically asking "how do I support this?"

**Rationale:**
If D30 retention is <10%, charging money won't fix the problem - it will hide it.
If D30 retention is >20%, you have product-market fit - monetization is justified.
Building payment infrastructure for $35/month revenue (100 users × 10% conversion) is premature optimization.

**Future Cohort Strategy (When re-enabled):**
Original tiered monetization logic preserved in codebase for future re-enablement:
- `free_launch`: All launch users (grandfathered forever)
- `paid_cohort_v1`: Post-traction users (one-time $4.99)

See `docs/monetization-decision-framework.md` for detailed traction thresholds and decision process.

## 1.4 Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| October 14, 2025 | 1.0 | Initial PRD creation from Project Brief | John (PM) |
| October 14, 2025 | 1.0.1 | Renamed from Night Owl Todo to TodoTomorrow | John (PM) |
| October 30, 2025 | 1.1 | Updated monetization strategy: tiered freemium launch, cohort tracking, grandfather status, A/B pricing tests | John (PM) |
| October 31, 2025 | 1.2 | Restructured all stories to be 2-4 hours each, testable independently, and building sequentially | John (PM) |
| January 27, 2025 | 1.3 | Updated Story 3.5: Changed cron frequency from "every minute" to "hourly" to align with architecture. Updated AC to reflect timezone-aware query implementation and empty state email handling. | John (PM) |
| February 11, 2025 | 1.4 | **PIVOT:** Simplified monetization strategy to "Free Until Traction". Removed tiered freemium complexity. Updated Goals 3, 6, 7. Focus shifted to product-market fit validation before monetization. Original strategy preserved in codebase for future re-enablement. | John (PM) |

---
