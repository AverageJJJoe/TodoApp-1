# Development Sequencing Plan
**Status:** Active  
**Last Updated:** 2025-02-11  
**Author:** PM (John) + SM (Bob)

## Executive Summary

This plan optimizes development sequencing to balance revenue priorities with technical efficiency and product quality. The strategy uses parallel execution where safe, design-first where necessary to avoid rework, and clear coordination points to ensure smooth handoffs.

**Key Principle:** Design system foundation early, revenue work in parallel, zero rework.

---

## Current Status

### Completed Epics
- ✅ **Epic 1:** Foundation & Authentication (14 hours) - COMPLETE
- ✅ **Epic 2:** Core Task Management (16 hours) - COMPLETE  
- ✅ **Epic 3:** Email Delivery System (12 hours) - COMPLETE

### Next Up
- **Epic 4:** Monetization & Payments (20 hours) - READY TO START
- **Epic 6:** Design System Integration (16 hours) - READY TO START

---

## Sequencing Strategy: Hybrid Approach

### Phase 1: Foundation Setup (Now - 9 hours)

**Immediate Start (No Dependencies):**

1. **Story 6.1: Design System Foundation** (5 hours)
   - **Status:** Can start immediately
   - **Dependencies:** ✅ Epic 1 & Epic 2 complete
   - **Deliverables:**
     - Design tokens extracted (colors, typography, spacing)
     - Design system constants file created
     - Existing screens (Auth, Task Management) updated with design system
   - **Impact:** Establishes design foundation for all future work

2. **Story 6.2: Settings Screen Design** (4 hours)
   - **Status:** Can start immediately
   - **Dependencies:** ✅ Epic 3 complete (Settings screen exists)
   - **Deliverables:**
     - iOS Settings-style design applied to existing Settings screen
     - Design system components demonstrated
   - **Impact:** Completes design polish for Epic 3 work, validates design system

**Phase 1 Completion Criteria:**
- ✅ Design system constants available
- ✅ Existing screens updated with design system
- ✅ Design system validated on Settings screen

**Estimated Duration:** 1-2 days (assuming full-time focus)

---

### Phase 2: Parallel Execution Track (~27 hours total)

**Track A: Design System Completion (7 hours)**

**Purpose:** Complete design system before Epic 4 & Epic 5 UI work begins

3. **Story 6.3: Onboarding Design** (3 hours)
   - **Status:** Start after Phase 1 complete
   - **Dependencies:** ✅ Phase 1 complete
   - **Coordinates with:** Epic 5, Story 5.1 (Onboarding flow)
   - **Deliverables:**
     - Onboarding screens designed with design system
     - Design specs ready for Epic 5 implementation
   - **Critical:** Must complete before Epic 5, Story 5.1 UI work begins

4. **Story 6.4: Payment & Archive Design** (4 hours)
   - **Status:** Start after Story 6.3 complete
   - **Dependencies:** ✅ Story 6.3 complete
   - **Coordinates with:** Epic 4 (paywall screens), Epic 5 (archive screen)
   - **Deliverables:**
     - Paywall modal design (Epic 4)
     - Archive screen design (Epic 5)
     - Design specs ready for implementation
   - **Critical:** Must complete before Epic 4, Stories 4.4-4.5 (UI work) begins

**Track B: Epic 4 Backend/Logic (Can Start in Parallel - 8 hours)**

**Purpose:** Begin revenue-critical work without blocking on design

5. **Story 4.1: Cohort Assignment on Signup** (2 hours)
   - **Status:** Can start immediately after Phase 1
   - **Dependencies:** ✅ Epic 1, Epic 2, Epic 3 complete
   - **Type:** Backend/database logic (no UI dependency)
   - **Deliverables:** Cohort assignment logic, database migration

6. **Story 4.2: Trial Days Remaining Display** (2 hours)
   - **Status:** After Story 4.1 complete
   - **Dependencies:** ✅ Story 4.1 complete
   - **Type:** Backend logic + basic UI (can use basic styling initially)
   - **Deliverables:** Trial calculation logic, display component

7. **Story 4.3: Task Limit Enforcement** (2 hours)
   - **Status:** After Story 4.2 complete
   - **Dependencies:** ✅ Story 4.2 complete
   - **Type:** Backend validation logic (no UI dependency initially)
   - **Deliverables:** Task limit check logic, enforcement rules

8. **Story 4.7: Receipt Validation** (2 hours)
   - **Status:** Can start after Story 4.1
   - **Dependencies:** ✅ Story 4.1 complete (needs cohort logic)
   - **Type:** Backend validation (no UI dependency)
   - **Deliverables:** Receipt validation logic

**Track B Total:** 8 hours (can execute parallel with Track A)

**Phase 2 Completion Criteria:**
- ✅ Design system complete (Stories 6.3-6.4 done)
- ✅ Epic 4 backend logic complete (Stories 4.1-4.3, 4.7 done)
- ✅ Ready for Epic 4 UI work with design system in place

**Estimated Duration:** 2-3 days (with parallel execution)

---

### Phase 3: Revenue UI Implementation (After Phase 2 - 12 hours)

**Prerequisites:** ✅ Phase 2 complete (design system ready)

9. **Story 4.4: Paywall Screen Design** (3 hours)
   - **Status:** After Story 6.4 complete
   - **Dependencies:** ✅ Story 6.4 complete (design specs ready)
   - **Deliverables:** Paywall screen with design system applied

10. **Story 4.5: Paywall Trigger Logic** (3 hours)
    - **Status:** After Story 4.4 complete
    - **Dependencies:** ✅ Story 4.4 complete
    - **Deliverables:** Paywall trigger conditions, display logic

11. **Story 4.6: Stripe Payment Integration** (4 hours)
    - **Status:** After Story 4.5 complete
    - **Dependencies:** ✅ Story 4.5 complete
    - **Deliverables:** Stripe integration, payment flow

12. **Story 4.8: Payment Status Sync** (2 hours)
    - **Status:** After Story 4.6 complete
    - **Dependencies:** ✅ Story 4.6 complete
    - **Deliverables:** Payment status synchronization

**Phase 3 Total:** 12 hours

**Estimated Duration:** 1.5-2 days

---

### Phase 4: Workflow Modes & Polish (After Phase 3 - 10 hours)

**Epic 5: Workflow Modes & Polish**

**Prerequisites:** ✅ Epic 4 complete, ✅ Story 6.3-6.4 complete (design ready)

13. **Story 5.1: Onboarding Flow** (3 hours)
    - **Status:** After Story 6.3 complete
    - **Dependencies:** ✅ Story 6.3 complete (design specs ready)
    - **Deliverables:** Onboarding screens using design system

14. **Story 5.2: Workflow Mode Selection** (2 hours)
    - **Status:** After Story 5.1 complete
    - **Dependencies:** ✅ Story 5.1 complete
    - **Deliverables:** Mode selection UI

15. **Story 5.3: Archive Screen** (3 hours)
    - **Status:** After Story 6.4 complete
    - **Dependencies:** ✅ Story 6.4 complete (design specs ready)
    - **Deliverables:** Archive screen using design system

16. **Story 5.4: Mode-Specific Email Logic** (2 hours)
    - **Status:** After Story 5.3 complete
    - **Dependencies:** ✅ Story 5.3 complete
    - **Deliverables:** Email formatting by workflow mode

**Estimated Duration:** 1.5-2 days

---

## Critical Path Dependencies

### Must Complete Before Epic 4 UI Work:
- ✅ Story 6.4 (Payment & Archive Design) → Before Stories 4.4-4.5

### Must Complete Before Epic 5 UI Work:
- ✅ Story 6.3 (Onboarding Design) → Before Story 5.1
- ✅ Story 6.4 (Archive Design) → Before Story 5.3

### Safe to Run Parallel:
- ✅ Stories 4.1-4.3, 4.7 (Epic 4 backend) can run parallel with Stories 6.3-6.4

---

## Timeline Summary

| Phase | Duration | Stories | Key Deliverable |
|-------|----------|---------|-----------------|
| **Phase 1** | 1-2 days | 6.1, 6.2 | Design system foundation |
| **Phase 2** | 2-3 days | 6.3, 6.4, 4.1-4.3, 4.7 | Design complete + Epic 4 backend |
| **Phase 3** | 1.5-2 days | 4.4-4.6, 4.8 | Revenue UI complete |
| **Phase 4** | 1.5-2 days | 5.1-5.4 | Workflow modes complete |
| **Total** | **6-9 days** | **16 stories** | **MVP Complete** |

---

## Coordination Points & Handoffs

### Handoff 1: Design System → Epic 4 UI
- **From:** Story 6.4 complete
- **To:** Stories 4.4-4.5 ready to start
- **Deliverable:** Design specs for paywall screens
- **Communication:** Design specs reviewed, dev team ready

### Handoff 2: Design System → Epic 5 UI
- **From:** Stories 6.3-6.4 complete
- **To:** Stories 5.1, 5.3 ready to start
- **Deliverable:** Design specs for onboarding & archive screens
- **Communication:** Design specs reviewed, dev team ready

### Handoff 3: Epic 4 Backend → Epic 4 UI
- **From:** Stories 4.1-4.3, 4.7 complete
- **To:** Stories 4.4-4.5 ready to start
- **Deliverable:** Backend logic ready, API endpoints available
- **Communication:** Backend logic tested, APIs documented

---

## Risk Mitigation

### Risk 1: Design System Delay Blocks Revenue Work
**Mitigation:** Epic 4 backend stories (4.1-4.3, 4.7) can proceed in parallel - zero dependency on design system

### Risk 2: Rework if Design Comes Too Late
**Mitigation:** Stories 6.3-6.4 must complete before Epic 4/5 UI work - enforced in sequencing plan

### Risk 3: Parallel Work Conflicts
**Mitigation:** Clear coordination points defined, backend work separated from UI work

---

## Success Metrics

### Phase 1 Success:
- Design system constants file created and tested
- Existing screens updated and visually consistent
- Design system validated

### Phase 2 Success:
- All design specs complete for Epic 4 & Epic 5 screens
- Epic 4 backend logic complete and tested
- Zero blockers for UI implementation

### Phase 3 Success:
- Revenue features complete with design system applied
- Payment flow working end-to-end
- Paywall displaying correctly

### Phase 4 Success:
- All Epic 5 screens using design system
- Workflow modes functional
- MVP feature-complete

---

## Notes for Development Team

1. **Start Phase 1 immediately** - No dependencies, establishes foundation
2. **Track B (Epic 4 backend) can begin immediately after Phase 1** - No design dependency
3. **Track A (Design 6.3-6.4) must complete before Epic 4/5 UI work** - Critical to avoid rework
4. **Use design specs from Stories 6.3-6.4** - Don't implement Epic 4/5 UI screens until specs ready
5. **Parallel execution safe for:** Backend logic, database work, API endpoints
6. **Sequential execution required for:** UI screens, visual components, user-facing flows

---

## Questions or Issues?

If blockers arise or dependencies shift, update this document immediately and notify PM + SM for sequencing adjustment.

**Document Owner:** PM (John)  
**Last Review:** 2025-02-11  
**Next Review:** After Phase 1 complete

