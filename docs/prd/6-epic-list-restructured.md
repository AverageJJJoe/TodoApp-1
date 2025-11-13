# 6. Epic List - RESTRUCTURED

| Epic ID | Epic Name | Stories | Estimated Hours | Dependencies | Status |
|---------|-----------|---------|-----------------|--------------|--------|
| E1 | Foundation & Authentication | 6 stories (+ 1 enhancement) | 14 hours | None | ✅ **COMPLETE** |
| E2 | Core Task Management | 6 stories | 16 hours | E1 complete | ✅ **COMPLETE** |
| E3 | Email Delivery System | 5 stories (4 done, 1 optional) | 12 hours | E1, E2 complete | ✅ **COMPLETE** |
| E4 | Monetization & Payments | 8 stories (1 done, 7 deferred) | 20 hours | E1, E2, E3 complete | ✅ **PARTIAL** (Story 4.1 complete, 4.2-4.8 deferred until Month 4+) |
| E5 | Workflow Modes & Polish | 4 stories | 10 hours | E4 Story 4.1 complete | ✅ **COMPLETE** |
| E6 | Design System Integration & UI Polish | 4 stories | 16 hours | Can run parallel with E3-E5 | ✅ **COMPLETE** |
| E7 | Pre-Launch Polish | 9 stories (4 done, 4 approved, 1 deferred) | 15-20 hours | E1-E6 complete | 🔄 **IN PROGRESS** |
| E8 | Sentry Crash Logging, PostHog Analytics & Loops SMTP Integration | 6 stories (4 complete, 1 in progress, 1 optional) | 15-20 hours | E7 complete (post-launch) | 🔄 **IN PROGRESS** (Sentry ✅, PostHog ✅, Loops 🔄 REVISED APPROACH 2025-01-28) |
| E9 | Post-Launch Design Refinements | 2 stories | 5-7 hours | E7 complete (post-launch) | 🔄 **NOT STARTED** |

**📋 Sequencing Plan:** See `docs/development-sequencing-plan.md` for detailed execution strategy (hybrid approach: design-first + parallel execution)

**Total:** 50 stories, ~139-157 hours development time (E8-E9 are post-launch)

**Note:** Story 1.2.5 (Testing Framework Setup) was added to ensure test infrastructure is established early.

**Key Changes from v1.1:**
- Broke down 31 large stories into 28 smaller, focused stories
- Each story now 2-4 hours instead of 8-12 hours
- Clear dependencies and build order
- Every story is testable independently

---
