# 3. User Interface Design Goals

## 3.1 Overall UX Vision

TodoTomorrow embraces Apple's design philosophy: radical simplicity with obsessive attention to detail. The interface should feel native, polished, and invisible - users capture thoughts with zero friction, then forget about the app until the next evening.

**Design Philosophy:**
- **Apple Minimalism**: Clean white space, subtle shadows, native feel
- **Things 3 Polish**: Delightful micro-interactions, considered typography
- **Speed Over Features**: Task creation in 2 taps maximum
- **Invisible When Right**: Best UX is when users don't notice the app

**Inspiration (DO THIS):**
- ✅ Apple Reminders: Simplicity, system font usage, native patterns
- ✅ Things 3: Polish, animations, "Today" view philosophy
- ✅ Clear app: Gesture-based, minimal chrome

**Anti-Inspiration (DON'T DO THIS):**
- ❌ Todoist: Feature density, overwhelming options
- ❌ Any.do: Over-animated, too many colors
- ❌ Microsoft To Do: Generic, cluttered

## 3.2 Key Interaction Paradigms

**Primary Interaction Flow:**
1. User opens app → Already on main screen (no navigation)
2. Taps floating "+" button (Apple-style FAB, bottom-right)
3. Types task → Taps "Add" (or Enter key)
4. Task appears instantly with subtle slide-in animation
5. Repeat throughout evening
6. Close app → Forget until tomorrow

**Completion Flow (Carry Over Mode):**
1. User taps checkbox next to completed task
2. Haptic feedback (light impact)
3. Strike-through animation (200ms)
4. Fade out (200ms)
5. Slide out and collapse (200ms)
6. Task moves to Archive tab

**Paywall Interaction Flow:**
1. **Trial Active (Days 1-26):** Subtle banner in Settings: "X days remaining"
2. **Trial Ending (Days 27-29):** Prominent modal on app open (dismissible)
3. **Trial Expired (Day 30+):** Hard paywall (non-dismissible, must choose action)
4. **Free Launch Cohort:** Optional support prompt (always dismissible, shown once post-Day 30)

## 3.3 Visual Language

**Color Palette:**
- Primary Blue: `#007AFF` (iOS system blue)
- Success Green: `#34C759` (iOS system green)
- Warning Orange: `#FF9500` (iOS system orange)
- Text Primary: `#000000` (pure black on white background)
- Text Secondary: `#8E8E93` (iOS secondary label)
- Background: `#FFFFFF` (pure white)
- Card Background: `#F2F2F7` (iOS system gray 6)

**Typography:**
- Primary: SF Pro Display (iOS), Roboto (Android), system font (Web)
- Task Text: 17pt regular
- Date Labels: 13pt regular
- Section Headers: 20pt semibold
- Buttons: 17pt semibold

**Spacing System:**
- Base unit: 8px
- Common spacing: 8px, 16px, 24px, 32px
- Screen margins: 16px (mobile), 24px (tablet)
- Task item padding: 16px vertical, 16px horizontal

## 3.4 Animation Principles

**Task Creation:**
- Slide in from bottom with spring animation (duration: 300ms)
- Cubic bezier easing: `(0.25, 0.1, 0.25, 1)`

**Task Completion:**
- Strike-through: 200ms linear
- Fade: 200ms ease-out
- Slide out: 200ms ease-in
- Total: 600ms

**Paywall Modal:**
- Fade in backdrop: 200ms ease-out
- Slide in from bottom: 300ms spring
- On dismiss: Reverse animations

**General Rules:**
- Never animate longer than 600ms
- Use spring animations for natural feel
- Haptic feedback on state changes
- No animations longer than 2 steps

## 3.5 Paywall Design Specifications

**Modal Structure:**
```
┌─────────────────────────────┐
│  🌅 [Headline]              │
│                             │
│  [Body text with stats]     │
│                             │
│  [Price callout]            │
│                             │
│  [Primary CTA Button]       │
│  [Secondary CTA Button]     │
│                             │
│  [Dismiss link if allowed]  │
└─────────────────────────────┘
```

**Paywall States:**

**State 1: Trial Active (Days 1-26)**
- Location: Settings tab, sticky banner at bottom
- Dismissible: Yes
- Text: "🌅 X days remaining in trial"
- CTA: Taps to open full paywall modal

**State 2: Trial Ending (Days 27-29)**
- Location: Full-screen modal on app open
- Dismissible: Yes (X button top-right)
- Headline: "🌅 Trial Ending Soon"
- Body: Cohort-specific messaging (see FR23)
- Primary CTA: "Unlock Premium" (blue button)
- Secondary CTA: "Maybe Later" (text link)

**State 3: Trial Expired (Day 30)**
- Location: Full-screen modal (blocking)
- Dismissible: No
- Headline: "🌅 Trial Complete"
- Body: "Continue with TodoTomorrow Premium for $X.XX—one time, forever."
- Stats: "You've captured [TASK_COUNT] tasks and received [EMAIL_COUNT] emails."
- Primary CTA: "Unlock Premium" (blue button)
- Secondary CTA: "Use Free Tier (50 tasks/month)" (text link)

**State 4: Free Launch Cohort (Optional, Post-Day 30)**
- Location: Modal (shown once, never repeats)
- Dismissible: Yes (always)
- Headline: "🌅 Love TodoTomorrow? ❤️"
- Body: "If you'd like to support ongoing development, you can opt-in to premium for $X.XX. Your free access is locked in forever—thanks for being early! 🎉"
- Primary CTA: "Support Development" (blue button)
- Secondary CTA: "Keep Free" (text link)
- Tertiary: "Not Now" (X button)

## 3.6 Screen Definitions

### 3.6.1 Main Screen (Active Tasks)

**Layout:**
```
┌─────────────────────────────────┐
│  TodoTomorrow              [⚙️]  │  ← Header
├─────────────────────────────────┤
│                                 │
│  🌅 Add your first task         │  ← Empty state
│                                 │
│          [or]                   │
│                                 │
│  ☑️ Complete presentation       │  ← Task items (Carry Over)
│  ☐ Call Sarah about project    │
│  ☐ Draft Q4 strategy doc        │
│                                 │
│                                 │
│                                 │
│                          [+]    │  ← Floating Action Button
└─────────────────────────────────┘
│ Active | Archive               │  ← Tab bar (Carry Over only)
└─────────────────────────────────┘
```

**Key Elements:**
- Header: App name left-aligned, Settings icon right-aligned
- Empty state: Friendly prompt with emoji
- Task list: Full-width cards with checkboxes (Carry Over mode only)
- FAB: Bottom-right, always accessible
- Tab bar: Only shown in Carry Over mode

### 3.6.2 Add Task Sheet

**Layout:**
```
┌─────────────────────────────────┐
│  Add Task                  [✕]  │  ← Sheet header
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │ What needs to be done?      ││  ← Text input
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  📅 Due Date (Optional)         │  ← Date picker trigger
│  🔥 Priority (Optional)         │  ← Priority picker
│                                 │
│                                 │
│           [Add Task]            │  ← Primary button
│                                 │
└─────────────────────────────────┘
```

**Behavior:**
- Slides up from bottom
- Keyboard auto-focuses on text input
- Can add task by pressing Enter
- Close by tapping X or swiping down

### 3.6.3 Settings Screen

**Layout:**
```
┌─────────────────────────────────┐
│  ← Settings                     │
├─────────────────────────────────┤
│                                 │
│  Account                        │
│  📧 Email: john@example.com     │
│                                 │
│  Preferences                    │
│  🕐 Email Time: 6:00 AM         │
│  🔄 Mode: Fresh Start           │
│                                 │
│  Subscription                   │
│  ✨ Premium (Trial: 23 days)    │  ← Trial banner
│  [Unlock Premium]               │
│                                 │
│  Support                        │
│  Privacy Policy                 │
│  Terms of Service               │
│  Contact Support                │
│                                 │
│  [Sign Out]                     │
│                                 │
└─────────────────────────────────┘
```

**Trial Banner States:**
- Days 1-26: "Premium (Trial: X days remaining)"
- Days 27-29: "⚠️ Premium (Trial ends in X days)" (orange badge)
- Day 30+: "Premium Expired" or "Premium Active" or "Free Forever 🎉" (cohort-dependent)

### 3.6.4 Archive Screen (Carry Over Mode Only)

**Layout:**
```
┌─────────────────────────────────┐
│  TodoTomorrow              [⚙️]  │
├─────────────────────────────────┤
│                                 │
│  ✅ Completed presentation      │
│     Oct 29, 2025 2:34 PM        │
│                                 │
│  ✅ Called Sarah                │
│     Oct 28, 2025 4:15 PM        │
│                                 │
│  ✅ Drafted strategy doc        │
│     Oct 28, 2025 11:23 AM       │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
│ Active | Archive               │
└─────────────────────────────────┘
```

**Key Elements:**
- Completed tasks with timestamps
- Read-only (no editing or deletion in MVP)
- Scrollable list, infinite scroll
- Empty state: "No completed tasks yet! 🎉"

---
