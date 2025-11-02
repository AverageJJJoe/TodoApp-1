# TodoMorning App UI - Lovable Prompt

## 🎯 Project Overview

Build the **TodoMorning** mobile app UI as a Progressive Web App (PWA) with native-like feel. Design must capture the elegance of Apple's iOS design language combined with the thoughtful details of Things 3 - clean, minimal, but with delightful micro-interactions.

**Core Experience**: Ultra-fast task capture with beautiful, satisfying animations. The app should feel invisible until the moment you need it.

---

## 🎨 Design Philosophy

### Apple Aesthetic Principles
- **Clarity**: Every element serves a purpose. No decoration for decoration's sake.
- **Deference**: UI defers to content. Let tasks breathe with white space.
- **Depth**: Subtle layers and motion create hierarchy without clutter.
- **Restraint**: Use color sparingly for maximum impact.

### Things 3 Influence
- **Soft shadows**: Never harsh, always subtle depth
- **Gentle animations**: 300-600ms spring animations
- **Thoughtful empty states**: Beautiful, encouraging, never boring
- **Polish everywhere**: Every tap, swipe, transition feels considered
- **Color as accent**: Blue for primary actions, gray for rest

### Key References
- iOS Reminders app (navigation, gestures)
- Things 3 (animations, list appearance, completion UX)
- Apple Notes (input experience, keyboard handling)
- Clear app (gestural interface inspiration)

---

## 📱 App Structure & Screens

### Screen Inventory (9 Screens)

1. **Email Login** - Simple, single input
2. **Welcome** - Onboarding intro
3. **Delivery Time Picker** - Time wheel selector
4. **Workflow Mode Selection** - Fresh Start vs Carry Over
5. **Main Screen (Fresh Start)** - Single view, no tabs
6. **Main Screen (Carry Over)** - Tabbed with Active/Archive
7. **Archive Screen** - Completed tasks (Carry Over only)
8. **Settings** - Account, delivery, mode toggle
9. **Trial/Payment Modal** - Upgrade flow

---

## 🎨 Design System

### Colors (System-Native Palette)

```css
/* Primary (iOS-style blues) */
--primary: #007AFF;           /* Apple blue */
--primary-hover: #0051D5;     /* Pressed state */
--primary-light: #E5F1FF;     /* Backgrounds */

/* Neutrals */
--text-primary: #000000;      /* Black (labels) */
--text-secondary: #6E6E73;    /* Gray (secondary text) */
--text-tertiary: #8E8E93;     /* Light gray (placeholders) */
--background: #FFFFFF;        /* White */
--surface: #F2F2F7;           /* iOS grouped background */
--separator: #C6C6C8;         /* Divider lines */

/* Semantic Colors */
--success: #34C759;           /* Green checkmark */
--destructive: #FF3B30;       /* Red (delete) */
--warning: #FF9500;           /* Orange (trial warning) */

/* Priority Colors (Things 3-inspired) */
--priority-high: #FF3B30;     /* Red flag */
--priority-medium: #FF9500;   /* Orange flag */
--priority-low: #007AFF;      /* Blue flag */

/* Shadows (Soft, Things 3-style) */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
--shadow-md: 0 2px 8px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);
```

### Typography (SF Pro / System Fonts)

```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif;

/* Hierarchy */
--title-large: 34px / 1.2 / 700;     /* Screen titles */
--title-medium: 28px / 1.3 / 600;    /* Section headers */
--body-large: 17px / 1.5 / 400;      /* Task text */
--body: 15px / 1.4 / 400;            /* Secondary info */
--caption: 13px / 1.3 / 400;         /* Labels, hints */
--footnote: 11px / 1.2 / 400;        /* Timestamps */
```

### Spacing System (4pt base, iOS-aligned)

```
--space-xs: 4px;    /* Tight inline spacing */
--space-sm: 8px;    /* Icon-text gap */
--space-md: 12px;   /* Card padding */
--space-lg: 16px;   /* List item height */
--space-xl: 20px;   /* Section margins */
--space-2xl: 24px;  /* Screen padding */
--space-3xl: 32px;  /* Large vertical space */
```

### Border Radius

```
--radius-sm: 8px;   /* Buttons, small cards */
--radius-md: 12px;  /* Cards, inputs */
--radius-lg: 16px;  /* Modals, large cards */
--radius-xl: 20px;  /* Bottom sheets */
```

---

## 🖼️ Screen Specifications

### 1. Email Login Screen

**Layout:**
```
┌─────────────────────────┐
│                         │ ← 80px top padding
│         🌅              │ ← App icon (80px)
│     TodoMorning         │ ← Title (34px, bold)
│                         │
│  Evening brain dump,    │ ← Subtitle (17px, gray)
│   morning clarity.      │
│                         │
│  ┌───────────────────┐  │ ← Email input
│  │  name@email.com   │  │   (50px height, rounded)
│  └───────────────────┘  │
│                         │
│   [Send Magic Link]     │ ← Primary button (50px)
│                         │
│   We'll email you a     │ ← Helper text (13px)
│   secure login link     │
│                         │
└─────────────────────────┘
```

**Interactions:**
- Email input focuses on load (keyboard auto-shows)
- Real-time validation (red border if invalid)
- Button disabled until valid email entered
- Loading spinner replaces button text on submit
- Success: "Check your email!" with checkmark animation

**Design Details:**
- White background
- Icon has subtle shadow
- Input has light gray border (focus: blue border)
- Button: Full-width, primary blue, subtle shadow
- Generous vertical spacing (32px between elements)

---

### 2. Onboarding Flow (3 Steps)

**Welcome Screen:**
```
┌─────────────────────────┐
│         🌙              │ ← Large icon
│                         │
│  Capture tonight,       │ ← Headline (28px, bold)
│  conquer tomorrow       │
│                         │
│  No more midnight       │ ← Body text (17px)
│  todo list panic.       │
│  Just add tasks         │
│  before bed.            │
│                         │
│      [Continue]         │ ← Primary button
│                         │
│       ○ ○ ●             │ ← Page indicators
└─────────────────────────┘
```

**Delivery Time Picker:**
```
┌─────────────────────────┐
│  When should we email   │ ← Question (20px)
│    your morning list?   │
│                         │
│  ┌───────────────────┐  │ ← iOS-style time picker
│  │     06 : 00       │  │   (Wheels or native input)
│  │                   │  │
│  │    Hours  Minutes │  │
│  └───────────────────┘  │
│                         │
│   Most people choose    │ ← Tip (13px, gray)
│   between 5-7 AM        │
│                         │
│      [Continue]         │
│                         │
│       ○ ● ○             │
└─────────────────────────┘
```

**Workflow Mode Selection:**
```
┌─────────────────────────┐
│    Choose your style    │ ← Question (20px)
│                         │
│  ┌───────────────────┐  │ ← Mode card 1
│  │  🗓️ Fresh Start   │  │
│  │                   │  │
│  │  Clean slate      │  │   (White card, border)
│  │  every morning    │  │   (Tap to select)
│  └───────────────────┘  │
│                         │
│  ┌───────────────────┐  │ ← Mode card 2
│  │  ✅ Carry Over   │  │
│  │                   │  │
│  │  Tasks persist    │  │   (Selected: blue border
│  │  until complete   │  │    + checkmark)
│  └───────────────────┘  │
│                         │
│      [Get Started]      │
│                         │
│       ○ ○ ●             │
└─────────────────────────┘
```

**Interaction Notes:**
- Swipe left/right to navigate steps (optional)
- "Skip" button in top-right (small, gray)
- Page indicators show progress
- Back button on steps 2-3 (top-left chevron)

---

### 3. Main Screen - Fresh Start Mode

**Empty State:**
```
┌─────────────────────────┐
│  ☰              🔔      │ ← Header (hamburger, bell)
│                         │
│                         │
│         🌙              │ ← Icon (48px, light gray)
│                         │
│    Tap + to add         │ ← Empty state text
│  your first task        │   (17px, gray)
│                         │
│                         │
│                         │
│                         │
│                         │
│                    ╭───╮│ ← FAB (+) button
│                    │ + ││   (56px circle)
│                    ╰───╯│   (bottom-right)
│                         │
│  ⚡ 30 days, 99 tasks  │ ← Trial badge
│      remaining          │   (bottom, centered)
└─────────────────────────┘
```

**With Tasks:**
```
┌─────────────────────────┐
│  ☰         Today    🔔  │ ← Header
│─────────────────────────│
│                         │
│  ○ Email Sarah re:      │ ← Task item
│    proposal             │   (Checkbox + text)
│                         │
│  ○ Review Q4 budget     │ ← Task with metadata
│    📅 Oct 20            │   (Date badge)
│                         │
│  ○ Call John 🔴         │ ← Task with priority
│                         │   (High = red dot)
│                         │
│  ○ Draft article        │ ← Plain task
│                         │
│                         │
│                    ╭───╮│ ← FAB
│                    │ + ││
│                    ╰───╯│
│                         │
│  ⚡ 30 days, 96 tasks  │
└─────────────────────────┘
```

**Task Input Mode (Bottom Sheet):**
```
┌─────────────────────────┐
│  ─                      │ ← Drag handle (top)
│                         │
│  Add Task               │ ← Sheet title
│                         │
│  ┌───────────────────┐  │ ← Text input (focused)
│  │ Type your task... │  │   (Auto-grow height)
│  └───────────────────┘  │   (Keyboard shows - includes native voice input)
│                         │
│  📅 Add Date            │ ← Optional metadata
│  🏴 Add Priority        │   (Tap to expand)
│                         │
│         [Add]           │ ← Primary button
│                         │
└─────────────────────────┘
    (Keyboard visible with native mic button for voice input)
```

**Design Details:**
- **Header**: 44px height, white background, subtle bottom shadow
- **Task Items**: 
  - 60px min height
  - 16px padding
  - White background
  - Swipe left reveals delete (red)
  - Tap checkbox: Completion animation (600ms)
  - Long-press: Reorder mode (haptic feedback)
- **FAB**: 
  - 56px circle
  - Primary blue
  - Drop shadow (0 4px 16px rgba(0,122,255,0.32))
  - Tap: Scale to 0.95, then bounce back
  - Spawns bottom sheet
- **Input Field**:
  - Native keyboard appears on focus
  - iOS: Includes dictation button (mic icon) automatically
  - Android: Includes voice input button automatically
  - Users can type OR speak using native voice input
  - Perfect for driving use cases!
- **Trial Badge**:
  - 20px padding, rounded pill
  - Light yellow background (#FFF9E6)
  - Small text (13px)

---

### 4. Main Screen - Carry Over Mode

**Layout (Tabbed):**
```
┌─────────────────────────┐
│  ☰    TodoMorning   🔔  │ ← Header
│─────────────────────────│
│  Active  │  Archive     │ ← Tab bar (segmented)
│─────────────────────────│
│                         │
│  ○ Call John 🔴         │ ← Uncompleted task
│    (from yesterday)     │   (Carried over note)
│                         │
│  ○ Follow up with Sarah │ ← Another carryover
│    (from yesterday)     │
│                         │
│  ○ Email vendor         │ ← New task (today)
│                         │
│  ○ Review Q4 budget     │
│    📅 Oct 20            │
│                         │
│                    ╭───╮│ ← FAB
│                    │ + ││
│                    ╰───╯│
│                         │
│  ⚡ 27 days, 93 tasks  │
└─────────────────────────┘
```

**Archive Tab:**
```
┌─────────────────────────┐
│  ☰    TodoMorning   🔔  │
│─────────────────────────│
│  Active  │  Archive     │ ← Archive selected
│─────────────────────────│
│                         │
│  ✓ Email Sarah          │ ← Completed (checkmark)
│    Completed 2h ago     │   (Gray text, strikethrough)
│                         │
│  ✓ Book dentist         │
│    Completed yesterday  │
│                         │
│  ✓ Pay electricity      │
│    Completed 3 days ago │
│                         │
│  ✓ Order birthday gift  │
│    Completed Oct 12     │
│                         │
│                         │ ← No FAB on Archive
│  📊 4 tasks this week   │ ← Stats footer
└─────────────────────────┘
```

**Design Details:**
- **Tab Bar**: 
  - iOS segmented control style
  - 44px height
  - Selected tab: solid blue background
  - Unselected: transparent with gray text
  - Smooth slide animation (200ms)
- **Carried Over Tasks**:
  - Italic gray text below task: "(from yesterday)"
  - Slightly different background (#F9F9F9)
  - No visual clutter - just subtle distinction
- **Archive Items**:
  - Green checkmark (not empty circle)
  - Strikethrough text (#C6C6C8)
  - Timestamp in gray (13px)
  - Swipe left: "Delete Forever" (red)
  - Tap: View details modal (read-only)

---

### 5. Settings Screen

**Layout:**
```
┌─────────────────────────┐
│  ← Settings             │ ← Nav bar with back button
│─────────────────────────│
│                         │
│  ACCOUNT                │ ← Section header (caps)
│  ┌───────────────────┐  │
│  │ name@email.com    │  │ ← Email row (gray)
│  │                 > │  │
│  └───────────────────┘  │
│                         │
│  DELIVERY               │
│  ┌───────────────────┐  │
│  │ Morning Time      │  │ ← Time setting
│  │ 6:00 AM         > │  │
│  └───────────────────┘  │
│                         │
│  WORKFLOW               │
│  ┌───────────────────┐  │
│  │ Mode              │  │ ← Mode toggle
│  │ Fresh Start     ○ │  │   (Toggle switch)
│  └───────────────────┘  │
│                         │
│  ABOUT                  │
│  ┌───────────────────┐  │
│  │ Version           │  │
│  │ 1.0.0             │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Privacy Policy  > │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Terms of Use    > │  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ Support         > │  │
│  └───────────────────┘  │
│                         │
│  [Sign Out]             │ ← Destructive button
└─────────────────────────┘
```

**Design Details:**
- **iOS Settings Style**: Grouped table view
- **Background**: Light gray (#F2F2F7)
- **Cells**: White with 1px separator
- **Section Headers**: All caps, 13px, gray
- **Disclosure Indicators**: Right-pointing chevron (>)
- **Toggle Switch**: iOS-style, blue when on
- **Sign Out Button**: Red text, centered, at bottom

---

## 🎬 Animations & Micro-interactions

### Task Completion Animation (600ms total)

**The Signature Moment** - Inspired by Things 3, refined for TodoMorning:

```
Frame-by-frame breakdown:

0ms     : Tap detected on checkbox
0ms     : Haptic feedback (light impact)
0-100ms : Checkbox fills with blue (ease-out)
100ms   : Checkmark appears (scale from 0 to 1)
150ms   : Task text begins strikethrough (left to right)
300ms   : Strikethrough complete
300ms   : Start fade out (opacity 1 → 0)
450ms   : Start slide up (translateY: 0 → -20px)
600ms   : Task removed from DOM
600ms   : Tasks below slide up to fill gap (spring animation)
```

**CSS/Framer Motion:**
```jsx
// Checkbox fill
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.1, ease: "easeOut" }}
/>

// Strikethrough
<motion.div
  initial={{ scaleX: 0, originX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ delay: 0.1, duration: 0.2 }}
/>

// Fade + Slide
<motion.div
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3, ease: "easeInOut" }}
/>
```

**Key Details:**
- **Haptic**: Critical for tactile satisfaction
- **Timing**: Fast enough to feel responsive, slow enough to appreciate
- **Spring physics**: Tasks sliding up use spring (not linear)
- **In Carry Over mode**: After animation, task moves to Archive (not deleted)

---

### Other Animations

**FAB (Floating Action Button):**
- Tap: Scale 0.95 → 1.05 → 1.0 (bounce, 200ms)
- On scroll: Hide (slide down + fade out, 150ms)
- Scroll up: Show (slide up + fade in, 200ms)

**Bottom Sheet (Task Input):**
- Slide up from bottom (300ms ease-out)
- Background dim (opacity 0 → 0.5, 300ms)
- Dismiss: Slide down + dim out (250ms ease-in)
- Drag to dismiss (follows finger, spring physics)

**Swipe Actions:**
- Swipe left on task: Red delete button slides in
- Swipe threshold: 80px (past this, auto-completes swipe)
- Release before threshold: Snaps back with spring
- Delete: Tap or swipe all the way → Completion animation

**Loading States:**
- Skeleton screens (not spinners)
- Task list: 3-4 gray rectangles with shimmer effect
- Shimmer: Gradient moves left-to-right (1.5s loop)

**Empty States:**
- Icon + text fade in (staggered, 100ms delay)
- Icon has subtle float animation (up/down 4px, 3s loop)

**Tab Switching:**
- Selected tab background slides (not crossfade)
- Content crossfades (200ms)
- Smooth, not jarring

---

## 🎯 Component Library

### 1. Task Item Component

**Props:**
```typescript
interface TaskItemProps {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  dueDate?: Date;
  carriedOver?: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}
```

**Layout:**
```jsx
<div className="task-item">
  <Checkbox checked={completed} onChange={onToggle} />
  <div className="task-content">
    <p className="task-text">{text}</p>
    {carriedOver && <span className="carried-over-label">(from yesterday)</span>}
    <div className="task-metadata">
      {dueDate && <DateBadge date={dueDate} />}
      {priority && <PriorityIndicator priority={priority} />}
    </div>
  </div>
</div>
```

**Variants:**
- Default: White background, gray text
- Completed: Strikethrough, checkmark, faded
- Carried Over: Light gray background, italic label
- High Priority: Red dot indicator

---

### 2. Floating Action Button (FAB)

**Props:**
```typescript
interface FABProps {
  onClick: () => void;
  visible: boolean;
  label?: string;
}
```

**Design:**
- 56px × 56px circle
- Primary blue background (#007AFF)
- White "+" icon (32px)
- Drop shadow (Things 3-style soft)
- Position: Fixed, bottom-right (16px from edges)

**States:**
- Default: visible, shadow
- Hover: Lift 2px, shadow darkens
- Pressed: Scale 0.95
- Hidden: translateY(80px), opacity 0

---

### 3. Bottom Sheet (Task Input)

**Props:**
```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: string) => void;
}
```

**Features:**
- Drag-to-dismiss (gesture handling)
- Auto-height based on content
- Keyboard avoidance (shifts up when keyboard shows)
- Backdrop dim (0.5 opacity)
- Rounded top corners (20px)

---

### 4. Trial Badge

**Props:**
```typescript
interface TrialBadgeProps {
  daysRemaining: number;
  tasksRemaining: number;
  onUpgrade: () => void;
}
```

**Design:**
- Pill shape (fully rounded)
- Light yellow background (#FFF9E6)
- Warning icon (⚡) + text
- Tap to open upgrade modal
- Pulse animation when < 3 days remain

---

## 📱 Responsive & Platform-Specific

### iOS-Specific
- Bottom safe area padding (home indicator)
- Haptic feedback on actions
- Swipe-back gesture from left edge
- Native share sheet for exporting tasks
- Dark mode support (use iOS semantic colors)

### Android-Specific
- Material ripple effect on buttons
- Android back button handling
- Status bar color adaptation
- Floating snackbar for notifications

### PWA Features
- Install prompt after 3 sessions
- Offline mode (local storage fallback)
- Push notifications for morning delivery
- "Add to Home Screen" banner

---

## ⚡ Performance Optimizations

### Key Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 2.5s
- Task add latency: < 100ms (optimistic updates)
- Completion animation: Solid 60fps

### Techniques
- Virtual scrolling for 100+ tasks
- Lazy load Archive tab
- Debounce text input (300ms)
- Memoize task item renders
- Use CSS transforms (not top/left for animations)
- RequestAnimationFrame for smooth animations

---

## ✅ Accessibility (WCAG AA)

### Requirements
- All interactive elements: 44px min touch target
- Color contrast: 4.5:1 for text, 3:1 for UI
- VoiceOver/TalkBack: Proper labels and hints
- Keyboard navigation: Tab order, focus indicators
- Reduced motion: Respect `prefers-reduced-motion`
- Font scaling: Support up to 200% text size

### Specific Implementations
- Checkbox: aria-label "Mark task complete"
- FAB: aria-label "Add new task"
- Task item: aria-label includes task text + metadata
- Empty state: Descriptive text, not just icon
- Form validation: Error messages, not just colors

---

## 🚀 Lovable Build Instructions

**To Lovable AI:**

Build the TodoMorning app UI as a single-page PWA using the specifications above. This should feel like a native iOS/Android app with:

1. **Apple-level polish**: Every animation, every interaction should feel intentional
2. **Things 3 quality**: Soft shadows, spring animations, satisfying completion UX
3. **Minimal but delightful**: Less is more, but details matter
4. **Blazing fast**: Optimistic updates, instant feedback, 60fps animations

**Tech Stack:**
- React 18 + TypeScript
- Framer Motion for animations
- Tailwind CSS (custom Apple-inspired config)
- Lucide React for icons
- React Hook Form for input handling
- Local storage for offline mode

**Priority Components to Build:**
1. **Task Item** with 600ms completion animation (signature UX!)
2. **FAB** with proper spring physics
3. **Bottom Sheet** with drag-to-dismiss and native keyboard input
4. **Empty States** with subtle floating animation
5. **Tab Bar** for Carry Over mode

**Design System:**
- Use provided iOS color palette
- SF Pro font stack (system-ui fallback)
- 4pt spacing grid
- Soft shadows (never harsh)
- 60fps target for all animations

**Modes to Support:**
- Fresh Start: Single view, clean slate daily
- Carry Over: Tabs for Active/Archive

**Critical Animations:**
- Task completion (600ms, multi-step, haptic)
- FAB bounce on tap
- Bottom sheet slide-up
- Tab switching
- Swipe actions

**Start with:**
1. Main screen (Fresh Start mode) with empty state
2. FAB + bottom sheet for adding tasks
3. Task list with completion animation
4. Then expand to Carry Over mode with tabs

Make it feel like a premium iOS app that Apple would be proud to feature. Clean, fast, delightful. 🌅

---

**Let's build something beautiful!**
