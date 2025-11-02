# TodoTomorrow - Complete Design System Documentation
## For Pixel-Perfect Replication in React Native

---

# Part 1: Complete Dependency List

## Core Framework
- **React**: `^18.3.1`
- **TypeScript**: `^5.8.3`
- **Build Tool**: Vite `^5.4.19`

## UI Component Libraries

### Radix UI Primitives (Full List)
```json
"@radix-ui/react-accordion": "^1.2.11",
"@radix-ui/react-alert-dialog": "^1.1.14",
"@radix-ui/react-aspect-ratio": "^1.1.7",
"@radix-ui/react-avatar": "^1.1.10",
"@radix-ui/react-checkbox": "^1.3.2",
"@radix-ui/react-collapsible": "^1.1.11",
"@radix-ui/react-context-menu": "^2.2.15",
"@radix-ui/react-dialog": "^1.1.14",
"@radix-ui/react-dropdown-menu": "^2.1.15",
"@radix-ui/react-hover-card": "^1.1.14",
"@radix-ui/react-label": "^2.1.7",
"@radix-ui/react-menubar": "^1.1.15",
"@radix-ui/react-navigation-menu": "^1.2.13",
"@radix-ui/react-popover": "^1.1.14",
"@radix-ui/react-progress": "^1.1.7",
"@radix-ui/react-radio-group": "^1.3.7",
"@radix-ui/react-scroll-area": "^1.2.9",
"@radix-ui/react-select": "^2.2.5",
"@radix-ui/react-separator": "^1.1.7",
"@radix-ui/react-slider": "^1.3.5",
"@radix-ui/react-slot": "^1.2.3",
"@radix-ui/react-switch": "^1.2.5",
"@radix-ui/react-tabs": "^1.1.12",
"@radix-ui/react-toast": "^1.2.14",
"@radix-ui/react-toggle": "^1.1.9",
"@radix-ui/react-toggle-group": "^1.1.10",
"@radix-ui/react-tooltip": "^1.2.7"
```

### Other UI Libraries
- **cmdk**: `^1.1.1` (Command palette)
- **vaul**: `^0.9.9` (Bottom sheet/drawer)
- **embla-carousel-react**: `^8.6.0` (Carousel)

## Styling & Animation
- **tailwindcss**: `^3.4.17`
- **tailwindcss-animate**: `^1.0.7`
- **autoprefixer**: `^10.4.21`
- **postcss**: `^8.5.6`
- **class-variance-authority**: `^0.7.1` (Component variants)
- **clsx**: `^2.1.1` (Conditional classes)
- **tailwind-merge**: `^2.6.0` (Merge Tailwind classes)
- **framer-motion**: `^12.23.24` (Advanced animations)
- **@tailwindcss/typography**: `^0.5.16` (Typography utilities)

## Icons
- **lucide-react**: `^0.462.0` (Primary icon library)

## State Management
- **@tanstack/react-query**: `^5.83.0` (Server state management)
- React Context API (Built-in, used for app state)

## Routing
- **react-router-dom**: `^6.30.1`

## Forms & Validation
- **react-hook-form**: `^7.61.1`
- **@hookform/resolvers**: `^3.10.0`
- **zod**: `^3.25.76` (Schema validation)

## Date/Time
- **date-fns**: `^3.6.0`
- **react-day-picker**: `^8.10.1`

## Notifications & Toasts
- **sonner**: `^1.7.4` (Toast notifications)

## Other Utilities
- **next-themes**: `^0.3.0` (Dark mode)
- **input-otp**: `^1.4.2` (OTP input)
- **react-resizable-panels**: `^2.1.9` (Resizable panels)
- **recharts**: `^2.15.4` (Charts)

## Complete package.json

```json
{
  "name": "todotomorrow",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.83.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.24",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.462.0",
    "next-themes": "^0.3.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@eslint/js": "^9.32.0",
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.16.5",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react-swc": "^3.11.0",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.32.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^15.15.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "typescript-eslint": "^8.38.0",
    "vite": "^5.4.19"
  }
}
```

---

# Part 2: CSS Variables & Design Tokens

## Complete index.css (EXACT COPY)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* TodoTomorrow Design System - Apple iOS & Things 3 Inspired */

@layer base {
  :root {
    /* iOS Color Palette */
    --background: 0 0% 100%;
    --foreground: 0 0% 0%;
    
    /* Apple Blue - Primary Actions */
    --primary: 211 100% 50%;
    --primary-hover: 218 100% 42%;
    --primary-light: 211 100% 95%;
    --primary-foreground: 0 0% 100%;
    
    /* Neutrals - iOS Gray Scale */
    --text-primary: 0 0% 0%;
    --text-secondary: 240 2% 44%;
    --text-tertiary: 240 2% 56%;
    --surface: 240 20% 97%;
    --separator: 240 5% 78%;
    
    /* Semantic Colors */
    --success: 145 72% 49%;
    --destructive: 4 90% 58%;
    --warning: 32 100% 50%;
    
    /* Priority Colors (Things 3) */
    --priority-high: 4 90% 58%;
    --priority-medium: 32 100% 50%;
    --priority-low: 211 100% 50%;
    
    /* Carried Over Background */
    --carried-over: 0 0% 98%;
    
    /* Card & Surface */
    --card: 0 0% 100%;
    --card-foreground: 0 0% 0%;
    
    /* Input & Border */
    --input: 240 5% 78%;
    --border: 240 5% 78%;
    --ring: 211 100% 50%;
    
    /* Shadows - Soft Things 3 Style */
    --shadow-sm: 0 1px 3px hsl(0 0% 0% / 0.08);
    --shadow-md: 0 2px 8px hsl(0 0% 0% / 0.12);
    --shadow-lg: 0 8px 24px hsl(0 0% 0% / 0.16);
    --shadow-fab: 0 4px 16px hsl(211 100% 50% / 0.32);
    
    /* Border Radius */
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
    
    /* Spacing System (4pt base) */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 12px;
    --space-lg: 16px;
    --space-xl: 20px;
    --space-2xl: 24px;
    --space-3xl: 32px;
    
    /* Trial Badge */
    --trial-bg: 48 100% 96%;
    --trial-text: 32 100% 50%;
  }

  .dark {
    --background: 0 0% 7%;
    --foreground: 0 0% 98%;
    --text-primary: 0 0% 98%;
    --text-secondary: 240 5% 84%;
    --text-tertiary: 240 4% 65%;
    --surface: 240 6% 10%;
    --card: 240 6% 10%;
    --card-foreground: 0 0% 98%;
    --separator: 240 4% 16%;
    --border: 240 4% 16%;
    --input: 240 4% 16%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Typography Scale */
  .text-title-large {
    font-size: 34px;
    line-height: 1.2;
    font-weight: 700;
  }
  
  .text-title-medium {
    font-size: 28px;
    line-height: 1.3;
    font-weight: 600;
  }
  
  .text-body-large {
    font-size: 17px;
    line-height: 1.5;
    font-weight: 400;
  }
  
  .text-body {
    font-size: 15px;
    line-height: 1.4;
    font-weight: 400;
  }
  
  .text-caption {
    font-size: 13px;
    line-height: 1.3;
    font-weight: 400;
  }
  
  .text-footnote {
    font-size: 11px;
    line-height: 1.2;
    font-weight: 400;
  }
}

@layer utilities {
  /* Soft Shadows */
  .shadow-soft-sm {
    box-shadow: var(--shadow-sm);
  }
  
  .shadow-soft-md {
    box-shadow: var(--shadow-md);
  }
  
  .shadow-soft-lg {
    box-shadow: var(--shadow-lg);
  }
  
  .shadow-fab {
    box-shadow: var(--shadow-fab);
  }
  
  /* Safe Area Padding (iOS) */
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  /* Smooth Transitions */
  .transition-smooth {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Glass Effect */
  .glass {
    backdrop-filter: blur(10px);
    background-color: hsl(var(--background) / 0.8);
  }
}
```

---

# Part 3: Tailwind Configuration

## Complete tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          hover: "hsl(var(--primary-hover))",
          light: "hsl(var(--primary-light))",
          foreground: "hsl(var(--primary-foreground))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
        },
        surface: "hsl(var(--surface))",
        separator: "hsl(var(--separator))",
        success: "hsl(var(--success))",
        destructive: "hsl(var(--destructive))",
        warning: "hsl(var(--warning))",
        priority: {
          high: "hsl(var(--priority-high))",
          medium: "hsl(var(--priority-medium))",
          low: "hsl(var(--priority-low))",
        },
        carriedOver: "hsl(var(--carried-over))",
        trial: {
          bg: "hsl(var(--trial-bg))",
          text: "hsl(var(--trial-text))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
      },
      keyframes: {
        // Task Completion Animation (600ms signature)
        "checkbox-fill": {
          "0%": { transform: "scale(0)", backgroundColor: "transparent" },
          "100%": { transform: "scale(1)", backgroundColor: "hsl(var(--primary))" },
        },
        "checkmark-appear": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "strikethrough": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        "task-fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-20px)" },
        },
        // FAB Bounce
        "fab-bounce": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
          "70%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        // Bottom Sheet Slide
        "sheet-slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "sheet-slide-down": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(100%)" },
        },
        // Empty State Float
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        // Fade In
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Shimmer (Loading)
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        // Task Completion (600ms total)
        "checkbox-fill": "checkbox-fill 0.1s ease-out forwards",
        "checkmark-appear": "checkmark-appear 0.15s ease-out 0.1s forwards",
        "strikethrough": "strikethrough 0.2s ease-out 0.15s forwards",
        "task-fade-out": "task-fade-out 0.3s ease-in-out 0.3s forwards",
        
        // FAB
        "fab-bounce": "fab-bounce 0.2s ease-out",
        
        // Bottom Sheet
        "sheet-slide-up": "sheet-slide-up 0.3s ease-out",
        "sheet-slide-down": "sheet-slide-down 0.25s ease-in",
        
        // Empty State
        "float": "float 3s ease-in-out infinite",
        
        // General
        "fade-in": "fade-in 0.3s ease-out",
        "shimmer": "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

---

# Part 4: Shadcn/UI Components Used

## Components List

### 1. Button
- **Location**: `src/components/ui/button.tsx`
- **Customizations**: Uses semantic design tokens
- **Variants**: default, destructive, outline, secondary, ghost, link
- **Sizes**: default, sm, lg, icon

### 2. Input
- **Location**: `src/components/ui/input.tsx`
- **Customizations**: Uses semantic tokens for borders and focus states

### 3. Label
- **Location**: `src/components/ui/label.tsx`
- **Customizations**: Minimal, uses default styling

### 4. Checkbox
- **Location**: `src/components/ui/checkbox.tsx`
- **Customizations**: Uses primary color for checked state

### 5. Sheet
- **Location**: `src/components/ui/sheet.tsx`
- **Usage**: Bottom sheet for adding tasks
- **Customizations**: Integrated with framer-motion for custom animations

### 6. Toast / Sonner
- **Location**: `src/components/ui/toast.tsx`, `src/components/ui/sonner.tsx`, `src/components/ui/toaster.tsx`
- **Usage**: Toast notifications (though not heavily used in current implementation)

### Other Shadcn Components Available (Not Currently Used Extensively)
- Accordion, Alert Dialog, Alert, Aspect Ratio, Avatar
- Badge, Breadcrumb, Calendar, Card, Carousel
- Chart, Collapsible, Command, Context Menu, Dialog
- Drawer, Dropdown Menu, Form, Hover Card, Input OTP
- Menubar, Navigation Menu, Pagination, Popover, Progress
- Radio Group, Resizable, Scroll Area, Select, Separator
- Sidebar, Skeleton, Slider, Switch, Table
- Tabs, Textarea, Toggle, Toggle Group, Tooltip

---

# Part 5: Custom Components Architecture

## 1. TaskItem (Task Card Component)

**Location**: `src/components/TaskItem.tsx`

**Dependencies**: 
- `framer-motion` (animations)
- `lucide-react` (Calendar, Flag, Trash2 icons)

**Props Interface**:
```typescript
interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isArchive?: boolean;
}

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: Date;
  carriedOver?: boolean;
  createdAt: Date;
}
```

**Key Tailwind Patterns**:
- **Container**: `bg-card rounded-lg shadow-soft-sm overflow-hidden relative`
- **Inner Padding**: `flex items-start gap-md p-lg`
- **Carried Over State**: `bg-carriedOver` (subtle background change)
- **Checkbox**: `w-6 h-6 rounded-full border-2 flex items-center justify-center`
- **Checkbox Border**: `border-text-tertiary` (unchecked), `border-success bg-success` (checked)
- **Task Text**: `text-body-large text-text-primary` (active), `text-separator line-through` (completed)
- **Metadata Badge**: `inline-flex items-center gap-1 px-2 py-1 bg-surface rounded text-caption text-text-secondary`
- **Priority Indicator**: `w-2 h-2 rounded-full bg-priority-{high|medium|low}`
- **Delete Background**: `absolute inset-0 bg-destructive rounded-lg flex items-center justify-end px-lg`

**Animations**:
- **Swipe to Delete**: Horizontal drag with constraint `dragConstraints={{ left: -100, right: 0 }}`
- **Completion Sequence** (600ms total):
  1. Checkbox fill animation
  2. Checkmark appear (delay 0.1s)
  3. Strikethrough (delay 0.15s)
  4. Fade out (delay 0.3s)

**Interactive States**:
- Drag gesture for delete
- Tap/click on checkbox to complete
- Disabled state in archive mode

---

## 2. AddTaskSheet (Bottom Sheet)

**Location**: `src/components/AddTaskSheet.tsx`

**Dependencies**:
- `framer-motion` (sheet animations)
- `lucide-react` (Calendar, Flag, X icons)

**Props Interface**:
```typescript
interface AddTaskSheetProps {
  onClose: () => void;
  onSubmit: (text: string, priority?: "high" | "medium" | "low", dueDate?: Date) => void;
}
```

**Key Tailwind Patterns**:
- **Backdrop**: `fixed inset-0 bg-black/50 z-40`
- **Sheet Container**: `fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-xl shadow-soft-lg safe-bottom`
- **Drag Handle**: `w-10 h-1 bg-separator rounded-full`
- **Header**: `flex items-center justify-between px-lg pb-md`
- **Title**: `text-xl font-semibold text-text-primary`
- **Close Button**: `p-2 -mr-2 hover:bg-surface rounded-lg transition-colors`
- **Textarea**: `w-full min-h-[80px] px-md py-md bg-surface border border-separator rounded-lg text-body-large text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`
- **Priority Button**: `px-3 py-1 rounded-full text-caption capitalize` with conditional `bg-primary text-white` (selected) or `bg-surface text-text-secondary` (unselected)
- **Submit Button**: `w-full py-md bg-primary hover:bg-primary-hover disabled:bg-surface disabled:text-text-tertiary text-white font-semibold rounded-lg transition-colors shadow-soft-sm`

**Animations**:
- **Sheet Slide Up**: `initial={{ y: "100%" }}`, `animate={{ y: 0 }}`
- **Backdrop Fade**: `initial={{ opacity: 0 }}`, `animate={{ opacity: 1 }}`
- **Drag to Close**: Vertical drag with threshold at 100px offset
- **Priority Picker**: `initial={{ opacity: 0, height: 0 }}`, `animate={{ opacity: 1, height: "auto" }}`

---

## 3. TaskList

**Location**: `src/components/TaskList.tsx`

**Dependencies**:
- `framer-motion` (stagger animations)
- `TaskItem` component

**Props Interface**:
```typescript
interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isArchive?: boolean;
}
```

**Key Tailwind Patterns**:
- **Container**: `px-lg pt-md space-y-2`
- **Item Wrapper**: Framer motion with staggered entry
  - `initial={{ opacity: 0, y: 10 }}`
  - `animate={{ opacity: 1, y: 0 }}`
  - `transition={{ delay: index * 0.05, duration: 0.2 }}`

---

## 4. EmptyState

**Location**: `src/components/EmptyState.tsx`

**Key Patterns**:
- **Container**: `flex flex-col items-center justify-center min-h-[60vh] px-2xl`
- **Emoji**: `text-[80px] animate-float` (floats up and down infinitely)
- **Title**: `text-title-medium font-semibold text-text-primary text-center mb-md`
- **Subtitle**: `text-body-large text-text-secondary text-center`

**Animations**:
- Float animation on emoji (3s ease-in-out infinite)
- Fade-in on text elements with stagger

---

## 5. TrialBadge

**Location**: `src/components/TrialBadge.tsx`

**Key Patterns**:
- **Container**: `mx-auto mb-2xl px-lg py-2 bg-trial-bg rounded-full shadow-soft-sm`
- **Icon**: `w-4 h-4 text-trial-text` with `fill="currentColor"`
- **Text**: `text-caption font-medium text-trial-text`
- **Pulse Animation** (when days < 3): `scale: [1, 1.02, 1]` repeating every 2 seconds

---

## 6. TodoApp (Main App Component)

**Location**: `src/components/TodoApp.tsx`

**State Management**:
```typescript
const [tasks, setTasks] = useState<Task[]>([]);
const [screen, setScreen] = useState<"login" | "onboarding-1" | "onboarding-2" | "onboarding-3" | "main" | "settings">("login");
const [mode, setMode] = useState<"fresh-start" | "carry-over">("carry-over");
const [activeTab, setActiveTab] = useState<"active" | "archive">("active");
```

**Key Layout Patterns**:
- **Main Container**: `min-h-screen bg-background flex flex-col`
- **Header**: `sticky top-0 z-10 bg-background border-b border-separator safe-top`
- **Header Inner**: `flex items-center justify-between h-[44px] px-lg`
- **Header Title**: `text-body-large font-semibold text-text-primary`
- **Icon Buttons**: `p-2 -ml-2 hover:bg-surface rounded-lg transition-colors`
- **Tabs (Carry Over Mode)**: `flex h-[44px] border-t border-separator`
- **Tab Button**: `flex-1 text-body font-medium transition-all` with `text-white bg-primary` (active) or `text-text-secondary bg-background` (inactive)
- **Main Content**: `flex-1 overflow-y-auto pb-24`
- **FAB (Floating Action Button)**: `fixed bottom-[80px] right-lg z-20 w-14 h-14 bg-primary hover:bg-primary-hover rounded-full shadow-fab flex items-center justify-center text-white`
- **Trial Badge Container**: `fixed bottom-0 left-0 right-0 safe-bottom`

---

## 7. Onboarding Screens

### OnboardingWelcome
- **Location**: `src/components/OnboardingWelcome.tsx`
- **Layout**: Centered with emoji, title, subtitle, CTA button, and pagination dots
- **Skip Button**: `absolute top-lg right-lg text-caption text-text-tertiary`
- **Emoji**: `text-6xl mb-xl` with spring animation
- **CTA Button**: `w-full max-w-sm h-[50px] bg-primary hover:bg-primary-hover text-white rounded-radius-sm font-medium transition-colors`
- **Pagination Dots**: `w-2 h-2 rounded-full` with `bg-primary` (active) or `bg-surface` (inactive)

### DeliveryTimePicker
- **Location**: `src/components/DeliveryTimePicker.tsx`
- **Time Input**: `w-full h-[60px] px-lg text-center text-4xl font-semibold bg-surface border border-separator rounded-lg`

### WorkflowModeSelection
- **Location**: `src/components/WorkflowModeSelection.tsx`
- **Mode Cards**: Large selectable cards with icons and descriptions
- **Selected State**: Border highlight with primary color

---

## 8. EmailLogin

**Location**: `src/components/EmailLogin.tsx`

**Key Patterns**:
- **Logo**: `w-[120px] h-[120px]` (imported image)
- **Title**: `text-title-large font-bold text-text-primary text-center mb-md`
- **Input**: Email input with validation and focus states
- **Submit Button**: Disabled state when email is invalid
- **Success State**: Checkmark animation with green background

---

## 9. UpgradeModal

**Location**: `src/components/UpgradeModal.tsx`

**Key Patterns**:
- **Modal Backdrop**: Semi-transparent overlay
- **Pricing Display**: Large, prominent pricing with feature list
- **CTA Button**: Primary button for upgrade action

---

# Part 6: Layout Patterns & Spacing

## Main Container Patterns

### Full-Screen Container
```tsx
<div className="min-h-screen bg-background flex flex-col">
  {/* Content */}
</div>
```

### Centered Content
```tsx
<div className="min-h-screen bg-background flex flex-col items-center justify-center px-2xl">
  {/* Content */}
</div>
```

### App Header (Sticky)
```tsx
<header className="sticky top-0 z-10 bg-background border-b border-separator safe-top">
  <div className="flex items-center justify-between h-[44px] px-lg">
    {/* Header content */}
  </div>
</header>
```

### Main Scrollable Content
```tsx
<main className="flex-1 overflow-y-auto pb-24">
  {/* Scrollable content */}
  {/* pb-24 ensures content doesn't get hidden by fixed footer */}
</main>
```

### Fixed Bottom Element
```tsx
<div className="fixed bottom-0 left-0 right-0 safe-bottom">
  {/* Fixed bottom content */}
</div>
```

## Consistent Spacing Scale

All spacing uses the custom spacing scale from CSS variables:

- **Between major sections**: `space-y-3xl` (32px) or `space-y-2xl` (24px)
- **Between related items**: `space-y-lg` (16px) or `gap-lg`
- **Between form fields**: `space-y-md` (12px) or `gap-md`
- **Between small elements**: `space-y-sm` (8px) or `gap-sm`
- **Tiny gaps**: `gap-xs` (4px)

**Padding patterns**:
- **Card padding**: `p-lg` (16px)
- **Page horizontal padding**: `px-lg` (16px) or `px-2xl` (24px)
- **Button padding**: `px-md py-2` or `py-md`
- **Input padding**: `px-md py-md`

## Screen Layouts by Type

### Task List Screen
```tsx
<div className="min-h-screen bg-background flex flex-col">
  {/* Sticky Header */}
  <header className="sticky top-0 z-10 bg-background border-b border-separator safe-top">
    <div className="flex items-center justify-between h-[44px] px-lg">
      <button>{/* Menu */}</button>
      <h1 className="text-body-large font-semibold text-text-primary">Title</h1>
      <button>{/* Settings */}</button>
    </div>
  </header>

  {/* Scrollable Content */}
  <main className="flex-1 overflow-y-auto pb-24">
    <div className="px-lg pt-md space-y-2">
      {/* Task items */}
    </div>
  </main>

  {/* FAB */}
  <motion.button className="fixed bottom-[80px] right-lg z-20 w-14 h-14 bg-primary rounded-full shadow-fab">
    <Plus />
  </motion.button>

  {/* Trial Badge (Fixed Footer) */}
  <div className="fixed bottom-0 left-0 right-0 safe-bottom">
    <TrialBadge />
  </div>
</div>
```

### Onboarding Screen
```tsx
<div className="min-h-screen bg-background flex flex-col items-center justify-center px-2xl">
  <button className="absolute top-lg right-lg text-caption text-text-tertiary">Skip</button>
  
  <motion.div className="text-6xl mb-xl">🌙</motion.div>
  
  <h1 className="text-title-medium font-semibold text-text-primary text-center mb-md">
    Title
  </h1>
  
  <p className="text-body-large text-text-secondary text-center mb-3xl max-w-sm">
    Subtitle
  </p>
  
  <button className="w-full max-w-sm h-[50px] bg-primary text-white rounded-radius-sm">
    Continue
  </button>
  
  <div className="flex gap-2 mt-xl">
    <div className="w-2 h-2 rounded-full bg-primary" />
    <div className="w-2 h-2 rounded-full bg-surface" />
    <div className="w-2 h-2 rounded-full bg-surface" />
  </div>
</div>
```

---

# Part 7: Animation Timings & Sequences

## Task Completion Animation (Signature 600ms Sequence)

This is the **most important animation** in the app. It runs in 4 stages:

### Stage 1: Checkbox Fill (100ms)
```tsx
<motion.div
  animate={{
    borderColor: "hsl(var(--primary))",
    backgroundColor: "hsl(var(--primary))",
  }}
  transition={{ duration: 0.1, ease: "easeOut" }}
/>
```

### Stage 2: Checkmark Appear (150ms, delay 100ms)
```tsx
<motion.svg
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.1, duration: 0.15, ease: "easeOut" }}
/>
```

### Stage 3: Strikethrough (200ms, delay 150ms)
```tsx
<motion.span
  className="absolute left-0 top-1/2 h-[2px] bg-text-tertiary"
  initial={{ scaleX: 0, originX: 0 }}
  animate={{ scaleX: 1 }}
  transition={{ delay: 0.15, duration: 0.2, ease: "easeOut" }}
  style={{ width: "100%" }}
/>
```

### Stage 4: Fade Out Entire Card (300ms, delay 300ms)
```tsx
<motion.div
  animate={{
    opacity: [1, 1, 1, 0],
    y: [0, 0, 0, -20],
  }}
  transition={{
    duration: 0.6,
    times: [0, 0.5, 0.5, 1],
  }}
/>
```

**Total: 600ms** (0.1 + 0.05 + 0.05 + 0.3 = 0.6s)

**Usage in Code**:
```typescript
const handleComplete = () => {
  setIsCompleting(true);
  setTimeout(() => {
    onToggle(task.id);
  }, 600); // Must match total animation duration
};
```

---

## Bottom Sheet Animations

### Sheet Slide Up (300ms)
```tsx
<motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", damping: 30, stiffness: 300 }}
/>
```

### Backdrop Fade (matches sheet timing)
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
/>
```

### Drag to Close
```tsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.y > 100) {
      onClose();
    }
  }}
/>
```

---

## FAB (Floating Action Button) Animations

### Initial Appearance
```tsx
<motion.button
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20,
  }}
/>
```

### Tap/Hover
```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
/>
```

---

## Task List Stagger Animation

```tsx
<motion.div
  key={task.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    delay: index * 0.05,  // 50ms stagger per item
    duration: 0.2 
  }}
  layout
/>
```

---

## Swipe to Delete Animation

### Swipe Gesture
```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(event, info) => {
    if (info.offset.x < -80) {
      // Trigger delete
      setIsDeleting(true);
      setTimeout(() => onDelete(task.id), 300);
    }
  }}
  exit={{ opacity: 0, x: -100 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

---

## Onboarding Animations

### Emoji Pop-in (Spring)
```tsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", duration: 0.6 }}
  className="text-6xl mb-xl"
>
  🌙
</motion.div>
```

### Text Fade-in (Stagger)
```tsx
<motion.h1
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
/>

<motion.p
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
/>

<motion.button
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
/>
```

---

## Empty State Float

```tsx
<motion.div
  animate={{ y: [0, -4, 0] }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  className="text-[80px]"
>
  ✅
</motion.div>
```

---

## Trial Badge Pulse (When Days < 3)

```tsx
<motion.button
  animate={isLowDays ? {
    scale: [1, 1.02, 1],
  } : {}}
  transition={isLowDays ? {
    repeat: Infinity,
    duration: 2,
  } : {}}
/>
```

---

# Part 8: Typography Scale

## Font Family

**Primary**: `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Roboto', sans-serif`

**Font Smoothing** (Applied globally):
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

## Typography Classes & Usage

### `.text-title-large`
- **Size**: 34px
- **Line Height**: 1.2
- **Weight**: 700 (Bold)
- **Usage**: Main screen headings, login screen title
- **Example**: "TodoTomorrow"

### `.text-title-medium`
- **Size**: 28px
- **Line Height**: 1.3
- **Weight**: 600 (Semibold)
- **Usage**: Onboarding screen headings
- **Example**: "Capture tonight, conquer tomorrow"

### `.text-body-large`
- **Size**: 17px
- **Line Height**: 1.5
- **Weight**: 400 (Regular)
- **Usage**: Task text, body paragraphs, onboarding subtitles
- **Example**: Task item text, "No more midnight todo list panic"

### `.text-body`
- **Size**: 15px
- **Line Height**: 1.4
- **Weight**: 400 (Regular)
- **Usage**: Secondary body text, tab labels
- **Example**: "Active", "Archive"

### `.text-caption`
- **Size**: 13px
- **Line Height**: 1.3
- **Weight**: 400 (Regular)
- **Usage**: Small labels, timestamps, hints, metadata
- **Example**: "Completed Nov 2", "(from yesterday)", priority labels

### `.text-footnote`
- **Size**: 11px
- **Line Height**: 1.2
- **Weight**: 400 (Regular)
- **Usage**: Very small text, legal disclaimers
- **Example**: Footer notes (not heavily used)

## Text Color Classes

### `.text-text-primary`
- **Color**: `hsl(0 0% 0%)` (light mode), `hsl(0 0% 98%)` (dark mode)
- **Usage**: Main content, headings, primary task text
- **Weight**: 90% of text uses this color

### `.text-text-secondary`
- **Color**: `hsl(240 2% 44%)` (light mode), `hsl(240 5% 84%)` (dark mode)
- **Usage**: Secondary labels, tab labels, icon colors, metadata
- **Example**: Date badges, priority button labels

### `.text-text-tertiary`
- **Color**: `hsl(240 2% 56%)` (light mode), `hsl(240 4% 65%)` (dark mode)
- **Usage**: Placeholders, disabled text, very low-priority text
- **Example**: "Type your task..." placeholder, "Skip" button

## Practical Typography Examples

### Page Heading
```tsx
<h1 className="text-title-large font-bold text-text-primary text-center mb-md">
  TodoTomorrow
</h1>
```

### Section Heading
```tsx
<h2 className="text-title-medium font-semibold text-text-primary text-center mb-md">
  Capture tonight, conquer tomorrow
</h2>
```

### Body Text
```tsx
<p className="text-body-large text-text-secondary text-center mb-3xl max-w-sm">
  No more midnight todo list panic. Just add tasks before bed.
</p>
```

### Task Text
```tsx
<p className="text-body-large text-text-primary">
  Buy groceries
</p>
```

### Metadata/Caption
```tsx
<span className="text-caption text-text-secondary">
  Due Nov 5
</span>
```

### Very Small Text
```tsx
<p className="text-caption text-text-tertiary mt-1">
  (from yesterday)
</p>
```

---

# Part 9: Color Usage Guide

## Primary Colors

### `bg-primary` / `text-primary` / `border-primary`
- **Value**: `hsl(211 100% 50%)` - Apple Blue
- **Usage**: 
  - Action buttons (Add task, Continue)
  - Active tab background
  - Focus rings
  - Selected priority badges
  - Checkbox when checked
- **Examples**: 
  ```tsx
  <button className="bg-primary text-white">Add</button>
  <div className="border-primary border-2" />
  ```

### `bg-primary-hover`
- **Value**: `hsl(218 100% 42%)` - Darker blue
- **Usage**: Hover state for primary buttons
- **Example**: 
  ```tsx
  <button className="bg-primary hover:bg-primary-hover">Continue</button>
  ```

### `bg-primary-light`
- **Value**: `hsl(211 100% 95%)` - Very light blue
- **Usage**: Subtle highlights, selected item backgrounds (not used extensively)

### `text-primary-foreground`
- **Value**: `hsl(0 0% 100%)` - White
- **Usage**: Text on primary-colored backgrounds
- **Example**: 
  ```tsx
  <button className="bg-primary text-primary-foreground">Add Task</button>
  ```

---

## Text Colors

### `text-text-primary`
- **Value**: `hsl(0 0% 0%)` (light), `hsl(0 0% 98%)` (dark)
- **Usage**: All main content - headings, task text, button labels, primary UI text
- **Coverage**: ~90% of all text

### `text-text-secondary`
- **Value**: `hsl(240 2% 44%)` (light), `hsl(240 5% 84%)` (dark)
- **Usage**: Subtitles, captions, secondary labels, icon colors, tab labels
- **Examples**: Calendar icon, "Add Priority" label, date badges

### `text-text-tertiary`
- **Value**: `hsl(240 2% 56%)` (light), `hsl(240 4% 65%)` (dark)
- **Usage**: Placeholders, disabled text, "Skip" buttons, italic notes
- **Examples**: Input placeholders, unchecked checkbox borders, "(from yesterday)"

---

## Surface & Background Colors

### `bg-background`
- **Value**: `hsl(0 0% 100%)` (light), `hsl(0 0% 7%)` (dark)
- **Usage**: Main page background
- **Always used on**: Root `<body>`, main containers

### `bg-surface`
- **Value**: `hsl(240 20% 97%)` (light), `hsl(240 6% 10%)` (dark)
- **Usage**: 
  - Card backgrounds (alternative to `bg-card`)
  - Input backgrounds
  - Badge backgrounds
  - Hover states for icon buttons
  - Inactive UI elements
- **Examples**: 
  ```tsx
  <textarea className="bg-surface" />
  <span className="bg-surface px-2 py-1 rounded">Low</span>
  <button className="hover:bg-surface">Icon</button>
  ```

### `bg-card`
- **Value**: `hsl(0 0% 100%)` (light), `hsl(240 6% 10%)` (dark)
- **Usage**: Task card backgrounds, bottom sheet backgrounds, modal backgrounds
- **Examples**: 
  ```tsx
  <div className="bg-card rounded-lg shadow-soft-sm">Task Item</div>
  ```

### `text-card-foreground`
- **Value**: `hsl(0 0% 0%)` (light), `hsl(0 0% 98%)` (dark)
- **Usage**: Text on card backgrounds (usually same as `text-text-primary`)

---

## Border & Separator Colors

### `border-border` / `border-separator`
- **Value**: `hsl(240 5% 78%)` (light), `hsl(240 4% 16%)` (dark)
- **Usage**: 
  - All borders (inputs, cards, headers)
  - Divider lines
  - Drag handle
- **Examples**: 
  ```tsx
  <header className="border-b border-separator" />
  <input className="border border-separator" />
  <div className="w-10 h-1 bg-separator rounded-full" /> {/* Drag handle */}
  ```

### `border-input`
- **Value**: Same as `border-separator`
- **Usage**: Input field borders specifically

---

## Semantic Colors

### `bg-success` / `text-success`
- **Value**: `hsl(145 72% 49%)` - Green
- **Usage**: Completed task checkmarks, success states
- **Example**: 
  ```tsx
  <div className="border-success bg-success" /> {/* Completed checkbox */}
  ```

### `bg-destructive` / `text-destructive`
- **Value**: `hsl(4 90% 58%)` - Red
- **Usage**: Delete backgrounds, error states, destructive actions
- **Example**: 
  ```tsx
  <div className="bg-destructive" /> {/* Swipe-to-delete background */}
  ```

### `bg-warning` / `text-warning`
- **Value**: `hsl(32 100% 50%)` - Orange
- **Usage**: Warning states, medium priority (not used extensively in current UI)

---

## Priority Colors

### `bg-priority-high`
- **Value**: `hsl(4 90% 58%)` - Red (same as destructive)
- **Usage**: High priority indicator dot
- **Example**: 
  ```tsx
  <span className="w-2 h-2 rounded-full bg-priority-high" />
  ```

### `bg-priority-medium`
- **Value**: `hsl(32 100% 50%)` - Orange (same as warning)
- **Usage**: Medium priority indicator dot

### `bg-priority-low`
- **Value**: `hsl(211 100% 50%)` - Blue (same as primary)
- **Usage**: Low priority indicator dot

---

## Special Purpose Colors

### `bg-carriedOver`
- **Value**: `hsl(0 0% 98%)` - Subtle off-white
- **Usage**: Background tint for tasks carried over from yesterday
- **Example**: 
  ```tsx
  <div className={`p-lg ${task.carriedOver ? 'bg-carriedOver' : ''}`}>
  ```

### `bg-trial-bg` / `text-trial-text`
- **Value**: `hsl(48 100% 96%)` (background), `hsl(32 100% 50%)` (text) - Yellow tones
- **Usage**: Trial badge styling
- **Example**: 
  ```tsx
  <div className="bg-trial-bg">
    <span className="text-trial-text">30 days remaining</span>
  </div>
  ```

### `ring-ring`
- **Value**: `hsl(211 100% 50%)` - Same as primary
- **Usage**: Focus rings on inputs and interactive elements
- **Example**: 
  ```tsx
  <input className="focus:ring-2 focus:ring-ring" />
  ```

---

## Complete Color Usage Map

| Element | Background | Text | Border | Other |
|---------|-----------|------|--------|-------|
| **Page** | `bg-background` | `text-foreground` | - | - |
| **Primary Button** | `bg-primary` | `text-white` | - | `hover:bg-primary-hover` |
| **Secondary Button** | `bg-surface` | `text-text-secondary` | - | - |
| **Task Card** | `bg-card` | `text-text-primary` | - | `shadow-soft-sm` |
| **Completed Task** | `bg-card` | `text-separator` | - | `line-through` |
| **Input** | `bg-surface` | `text-text-primary` | `border-separator` | `focus:ring-ring` |
| **Header** | `bg-background` | - | `border-b border-separator` | - |
| **Icon Button** | - | `text-text-primary` | - | `hover:bg-surface` |
| **Tab Active** | `bg-primary` | `text-white` | - | - |
| **Tab Inactive** | `bg-background` | `text-text-secondary` | - | - |
| **Badge** | `bg-surface` | `text-text-secondary` | - | `rounded` |
| **Delete Background** | `bg-destructive` | `text-white` | - | - |
| **Checkbox Checked** | `bg-success` | - | `border-success` | - |
| **Checkbox Unchecked** | - | - | `border-text-tertiary` | - |
| **Priority High** | `bg-priority-high` | - | - | Dot indicator |
| **FAB** | `bg-primary` | `text-white` | - | `shadow-fab` |
| **Bottom Sheet** | `bg-card` | - | - | `shadow-soft-lg` |
| **Backdrop** | `bg-black/50` | - | - | Overlay |

---

# Part 10: Border Radius & Shadows

## Border Radius Scale

### `rounded-sm`
- **Value**: `8px` (from `var(--radius-sm)`)
- **Usage**: Buttons, small badges, onboarding CTA buttons
- **Example**: 
  ```tsx
  <button className="rounded-sm">Continue</button>
  ```

### `rounded-md`
- **Value**: `12px` (from `var(--radius-md)`)
- **Usage**: Default for most components (not used as much as `rounded-lg`)

### `rounded-lg`
- **Value**: `16px` (from `var(--radius-lg)`)
- **Usage**: Task cards, input fields, textareas, icon button hover states
- **Examples**: 
  ```tsx
  <div className="bg-card rounded-lg">Task Card</div>
  <textarea className="rounded-lg" />
  <button className="hover:bg-surface rounded-lg">Icon</button>
  ```

### `rounded-xl`
- **Value**: `20px` (from `var(--radius-xl)`)
- **Usage**: Bottom sheet top corners
- **Example**: 
  ```tsx
  <div className="rounded-t-xl">Bottom Sheet</div>
  ```

### `rounded-full`
- **Usage**: 
  - Checkboxes (`w-6 h-6 rounded-full`)
  - Priority dots (`w-2 h-2 rounded-full`)
  - FAB (`rounded-full`)
  - Badge pills (`rounded-full`)
  - Drag handle (`rounded-full`)
  - Trial badge (`rounded-full`)

---

## Shadow System

### `shadow-soft-sm`
- **Value**: `0 1px 3px hsl(0 0% 0% / 0.08)`
- **Usage**: Task cards, trial badge
- **Intensity**: Very subtle, barely visible
- **Example**: 
  ```tsx
  <div className="shadow-soft-sm">Task Card</div>
  ```

### `shadow-soft-md`
- **Value**: `0 2px 8px hsl(0 0% 0% / 0.12)`
- **Usage**: Not heavily used in current implementation
- **Intensity**: Medium elevation

### `shadow-soft-lg`
- **Value**: `0 8px 24px hsl(0 0% 0% / 0.16)`
- **Usage**: Bottom sheet, modals
- **Intensity**: High elevation for overlays
- **Example**: 
  ```tsx
  <div className="shadow-soft-lg">Bottom Sheet</div>
  ```

### `shadow-fab`
- **Value**: `0 4px 16px hsl(211 100% 50% / 0.32)` - Blue glow shadow
- **Usage**: FAB (Floating Action Button) only
- **Intensity**: Colored shadow matching primary blue
- **Example**: 
  ```tsx
  <button className="shadow-fab">FAB</button>
  ```

---

## Complete Visual Hierarchy

| Element | Border Radius | Shadow |
|---------|--------------|--------|
| **Task Card** | `rounded-lg` (16px) | `shadow-soft-sm` |
| **FAB** | `rounded-full` | `shadow-fab` (blue glow) |
| **Bottom Sheet** | `rounded-t-xl` (20px top) | `shadow-soft-lg` |
| **Button (Primary)** | `rounded-sm` (8px) | `shadow-soft-sm` |
| **Input/Textarea** | `rounded-lg` (16px) | None (border only) |
| **Badge** | `rounded` or `rounded-full` | None |
| **Icon Button Hover** | `rounded-lg` (16px) | None |
| **Checkbox** | `rounded-full` | None |
| **Priority Dot** | `rounded-full` | None |
| **Trial Badge** | `rounded-full` | `shadow-soft-sm` |
| **Drag Handle** | `rounded-full` | None |

---

# Part 11: Interactive States

## Button States

### Primary Button
```tsx
<button className="
  bg-primary 
  text-primary-foreground 
  hover:bg-primary-hover 
  disabled:bg-surface 
  disabled:text-text-tertiary 
  transition-colors
  shadow-soft-sm
">
  Add Task
</button>
```

**States**:
- **Default**: Blue background, white text, subtle shadow
- **Hover**: Darker blue
- **Active/Press**: Scale animation via framer-motion `whileTap={{ scale: 0.95 }}`
- **Disabled**: Gray background, tertiary text color, no pointer events

---

### Icon Button (Ghost)
```tsx
<button className="
  p-2 
  -ml-2 
  hover:bg-surface 
  rounded-lg 
  transition-colors
">
  <Menu className="w-6 h-6 text-text-primary" />
</button>
```

**States**:
- **Default**: Transparent, icon in primary text color
- **Hover**: Surface background
- **Active**: No special state (relies on hover)

---

### Tab Button
```tsx
<button className={`
  flex-1 
  text-body 
  font-medium 
  transition-all 
  ${activeTab === "active" 
    ? "text-white bg-primary" 
    : "text-text-secondary bg-background"
  }
`}>
  Active
</button>
```

**States**:
- **Active**: Primary background, white text
- **Inactive**: Transparent background, secondary text
- **Transition**: Smooth color transition

---

## Input States

### Text Input / Textarea
```tsx
<input className="
  w-full 
  px-md 
  py-md 
  bg-surface 
  border 
  border-separator 
  rounded-lg 
  text-body-large 
  text-text-primary 
  placeholder:text-text-tertiary 
  focus:outline-none 
  focus:ring-2 
  focus:ring-ring 
  focus:border-transparent
" />
```

**States**:
- **Default**: Surface background, separator border
- **Focus**: Blue ring (2px), border becomes transparent
- **Error**: Not implemented in current design (would use `border-destructive`)
- **Disabled**: Not heavily used, would add `disabled:opacity-50 disabled:cursor-not-allowed`

---

## Checkbox States

### Custom Checkbox (Task Item)
```tsx
<button onClick={handleComplete} disabled={isCompleting || isArchive}>
  <motion.div className={`
    w-6 h-6 
    rounded-full 
    border-2 
    flex 
    items-center 
    justify-center 
    ${isArchive || task.completed
      ? "border-success bg-success"
      : "border-text-tertiary"
    }
  `}>
    {/* Checkmark SVG appears when checked */}
  </motion.div>
</button>
```

**States**:
- **Unchecked**: Transparent center, tertiary border
- **Checking** (animation): Border turns primary, background fills primary
- **Checked**: Success green border and background, white checkmark
- **Disabled** (archive mode): Same as checked but not clickable

---

## Card States (Task Item)

### Swipe Interaction
```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 0 }}
  dragElastic={0.2}
  onDragEnd={handleSwipe}
>
  {/* Card content */}
</motion.div>
```

**States**:
- **Default**: Resting position
- **Dragging**: Follows finger/cursor, reveals red delete background
- **Threshold Reached** (< -80px): Triggers delete animation
- **Released Before Threshold**: Springs back to resting position

---

## FAB States

```tsx
<motion.button
  className="
    bg-primary 
    hover:bg-primary-hover 
    rounded-full 
    shadow-fab
  "
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
>
  <Plus />
</motion.button>
```

**States**:
- **Default**: Primary blue, blue glow shadow
- **Hover**: Slightly darker blue, scales to 1.05
- **Tap/Press**: Scales down to 0.95
- **Disabled**: Not applicable (always active on active tab)

---

## Priority Badge States

```tsx
<button className={`
  px-3 
  py-1 
  rounded-full 
  text-caption 
  capitalize 
  ${priority === p
    ? "bg-primary text-white"
    : "bg-surface text-text-secondary"
  }
`}>
  {p}
</button>
```

**States**:
- **Selected**: Primary background, white text
- **Unselected**: Surface background, secondary text
- **Hover**: Not defined (could add `hover:bg-surface/80` for unselected)

---

# Part 12: Example Component Implementations

## 1. Complete TaskItem Component

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Flag, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: Date;
  carriedOver?: boolean;
  createdAt: Date;
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isArchive?: boolean;
}

const TaskItem = ({ task, onToggle, onDelete, isArchive }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [swipeX, setSwipeX] = useState(0);

  const handleComplete = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onToggle(task.id);
    }, 600);
  };

  const handleSwipe = (event: any, info: any) => {
    if (info.offset.x < -80) {
      setIsDeleting(true);
      setTimeout(() => onDelete(task.id), 300);
    } else {
      setSwipeX(0);
    }
  };

  const priorityColors = {
    high: "bg-priority-high",
    medium: "bg-priority-medium",
    low: "bg-priority-low",
  };

  return (
    <motion.div
      className="relative"
      initial={false}
      animate={{ x: swipeX }}
      drag="x"
      dragConstraints={{ left: -100, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleSwipe}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Delete Background */}
      <div className="absolute inset-0 bg-destructive rounded-lg flex items-center justify-end px-lg">
        <Trash2 className="w-5 h-5 text-white" />
      </div>

      {/* Task Card */}
      <motion.div
        className="bg-card rounded-lg shadow-soft-sm overflow-hidden relative"
        animate={isCompleting ? {
          opacity: [1, 1, 1, 0],
          y: [0, 0, 0, -20],
        } : {}}
        transition={{
          duration: 0.6,
          times: [0, 0.5, 0.5, 1],
        }}
      >
        <div className={`flex items-start gap-md p-lg ${task.carriedOver ? 'bg-carriedOver' : ''}`}>
          {/* Custom Checkbox */}
          <button
            onClick={handleComplete}
            className="relative flex-shrink-0 mt-[2px]"
            disabled={isCompleting || isArchive}
          >
            <motion.div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isArchive || task.completed
                  ? "border-success bg-success"
                  : "border-text-tertiary"
              }`}
              animate={isCompleting ? {
                borderColor: "hsl(var(--primary))",
                backgroundColor: "hsl(var(--primary))",
              } : {}}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              <AnimatePresence>
                {(isCompleting || isArchive || task.completed) && (
                  <motion.svg
                    initial={isCompleting ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.15, ease: "easeOut" }}
                    className="w-4 h-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <motion.p
              className={`text-body-large relative ${
                isArchive || task.completed ? "text-separator line-through" : "text-text-primary"
              }`}
              animate={isCompleting ? {
                color: "hsl(var(--text-tertiary))",
              } : {}}
            >
              {task.text}
              
              {/* Strikethrough Line */}
              <AnimatePresence>
                {isCompleting && !isArchive && (
                  <motion.span
                    className="absolute left-0 top-1/2 h-[2px] bg-text-tertiary"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.15, duration: 0.2, ease: "easeOut" }}
                    style={{ width: "100%" }}
                  />
                )}
              </AnimatePresence>
            </motion.p>

            {/* Archive timestamp */}
            {isArchive && (
              <p className="text-caption text-text-tertiary mt-1">
                Completed {new Date(task.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  ...(new Date().getTime() - task.createdAt.getTime() > 7 * 24 * 60 * 60 * 1000 && { year: 'numeric' })
                })}
              </p>
            )}

            {/* Carried Over Label */}
            {task.carriedOver && (
              <p className="text-caption text-text-tertiary italic mt-1">
                (from yesterday)
              </p>
            )}

            {/* Metadata */}
            {(task.dueDate || task.priority) && (
              <div className="flex items-center gap-2 mt-2">
                {task.dueDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface rounded text-caption text-text-secondary">
                    <Calendar className="w-3 h-3" />
                    {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
                {task.priority && (
                  <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskItem;
```

---

## 2. Complete AddTaskSheet Component

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Flag, X } from "lucide-react";

interface AddTaskSheetProps {
  onClose: () => void;
  onSubmit: (text: string, priority?: "high" | "medium" | "low", dueDate?: Date) => void;
}

const AddTaskSheet = ({ onClose, onSubmit }: AddTaskSheetProps) => {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low" | undefined>();
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const handleSubmit = () => {
    if (taskText.trim()) {
      onSubmit(taskText.trim(), priority);
      setTaskText("");
      setPriority(undefined);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-xl shadow-soft-lg safe-bottom"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) {
            onClose();
          }
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-md pb-2">
          <div className="w-10 h-1 bg-separator rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-lg pb-md">
          <h2 className="text-xl font-semibold text-text-primary">Add Task</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="px-lg pb-lg space-y-lg">
          {/* Text Input */}
          <textarea
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your task..."
            className="w-full min-h-[80px] px-md py-md bg-surface border border-separator rounded-lg text-body-large text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />

          <p className="text-caption text-text-tertiary -mt-md">
            💡 Tip: Use native keyboard mic button for voice input while driving!
          </p>

          {/* Metadata Options */}
          <div className="space-y-2">
            {/* Priority Picker */}
            <button
              onClick={() => setShowPriorityPicker(!showPriorityPicker)}
              className="flex items-center gap-2 px-md py-2 hover:bg-surface rounded-lg transition-colors w-full"
            >
              <Flag className="w-5 h-5 text-text-secondary" />
              <span className="text-body text-text-secondary">
                {priority ? `Priority: ${priority}` : "Add Priority"}
              </span>
            </button>

            {/* Priority Options */}
            {showPriorityPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex gap-2 pl-9"
              >
                {(["high", "medium", "low"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriority(p);
                      setShowPriorityPicker(false);
                    }}
                    className={`px-3 py-1 rounded-full text-caption capitalize ${
                      priority === p
                        ? "bg-primary text-white"
                        : "bg-surface text-text-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleSubmit}
            disabled={!taskText.trim()}
            className="w-full py-md bg-primary hover:bg-primary-hover disabled:bg-surface disabled:text-text-tertiary text-white font-semibold rounded-lg transition-colors shadow-soft-sm"
          >
            Add
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default AddTaskSheet;
```

---

## 3. Main TodoApp Layout

```tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Menu, Settings as SettingsIcon } from "lucide-react";
import TaskList from "./TaskList";
import AddTaskSheet from "./AddTaskSheet";
import TrialBadge from "./TrialBadge";
import EmptyState from "./EmptyState";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
  dueDate?: Date;
  carriedOver?: boolean;
  createdAt: Date;
}

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mode, setMode] = useState<"fresh-start" | "carry-over">("carry-over");
  const [activeTab, setActiveTab] = useState<"active" | "archive">("active");
  const [daysRemaining] = useState(30);
  const [tasksRemaining] = useState(99);

  const handleAddTask = (taskText: string, priority?: "high" | "medium" | "low") => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false,
      priority,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setIsSheetOpen(false);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    setTimeout(() => {
      setTasks(prev => prev.filter(task => task.id !== id));
    }, 600);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const displayTasks = mode === "carry-over" && activeTab === "archive" ? completedTasks : activeTasks;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-separator safe-top">
        <div className="flex items-center justify-between h-[44px] px-lg">
          <button className="p-2 -ml-2 hover:bg-surface rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-text-primary" />
          </button>
          <h1 className="text-body-large font-semibold text-text-primary">
            {mode === "carry-over" ? "TodoTomorrow" : "Today"}
          </h1>
          <button className="p-2 -mr-2 hover:bg-surface rounded-lg transition-colors">
            <SettingsIcon className="w-6 h-6 text-text-primary" />
          </button>
        </div>

        {/* Tabs for Carry Over mode */}
        {mode === "carry-over" && (
          <div className="flex h-[44px] border-t border-separator">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 text-body font-medium transition-all ${
                activeTab === "active"
                  ? "text-white bg-primary"
                  : "text-text-secondary bg-background"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("archive")}
              className={`flex-1 text-body font-medium transition-all ${
                activeTab === "archive"
                  ? "text-white bg-primary"
                  : "text-text-secondary bg-background"
              }`}
            >
              Archive
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {displayTasks.length === 0 ? (
          <EmptyState 
            onAddTask={() => setIsSheetOpen(true)}
            isArchive={mode === "carry-over" && activeTab === "archive"}
          />
        ) : (
          <TaskList
            tasks={displayTasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            isArchive={mode === "carry-over" && activeTab === "archive"}
          />
        )}
      </main>

      {/* FAB */}
      {!(mode === "carry-over" && activeTab === "archive") && (
        <motion.button
          className="fixed bottom-[80px] right-lg z-20 w-14 h-14 bg-primary hover:bg-primary-hover rounded-full shadow-fab flex items-center justify-center text-white"
          onClick={() => setIsSheetOpen(true)}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      )}

      {/* Trial Badge */}
      <div className="fixed bottom-0 left-0 right-0 safe-bottom">
        <TrialBadge
          daysRemaining={daysRemaining}
          tasksRemaining={tasksRemaining}
          onUpgrade={() => {/* Handle upgrade */}}
        />
      </div>

      {/* Add Task Bottom Sheet */}
      <AnimatePresence>
        {isSheetOpen && (
          <AddTaskSheet
            onClose={() => setIsSheetOpen(false)}
            onSubmit={handleAddTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TodoApp;
```

---

# Part 13: React Native Translation Notes

## Key Differences to Account For

### 1. **No Tailwind CSS in React Native**
You'll need to translate all Tailwind classes to StyleSheet:

**Web (Tailwind)**:
```tsx
<div className="bg-primary text-white px-4 py-2 rounded-lg">
```

**React Native**:
```tsx
<View style={[styles.button, styles.primaryButton]}>
  <Text style={styles.buttonText}>
```

```tsx
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 8,     // py-2
    borderRadius: 16,       // rounded-lg
  },
  primaryButton: {
    backgroundColor: 'hsl(211, 100%, 50%)', // bg-primary
  },
  buttonText: {
    color: '#FFFFFF', // text-white
  },
});
```

### 2. **Framer Motion → React Native Animated / Reanimated**
Replace all framer-motion with either:
- **React Native Animated** (built-in, more basic)
- **React Native Reanimated** (recommended, more powerful, closer to framer-motion)

**Web (Framer Motion)**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
```

**React Native (Reanimated)**:
```tsx
<Animated.View
  entering={FadeInUp.delay(200).duration(300)}
>
```

### 3. **HTML Elements → React Native Components**
| Web | React Native |
|-----|-------------|
| `<div>` | `<View>` |
| `<button>` | `<TouchableOpacity>` or `<Pressable>` |
| `<input>` | `<TextInput>` |
| `<textarea>` | `<TextInput multiline>` |
| `<p>`, `<h1>`, `<span>` | `<Text>` |
| `<img>` | `<Image>` |

### 4. **Gesture Handling**
Replace framer-motion drag with **React Native Gesture Handler**:

**Web (Framer)**:
```tsx
<motion.div
  drag="x"
  dragConstraints={{ left: -100, right: 0 }}
  onDragEnd={handleSwipe}
>
```

**React Native (Gesture Handler)**:
```tsx
<PanGestureHandler onGestureEvent={handleGesture}>
  <Animated.View style={[styles.card, animatedStyle]}>
```

### 5. **Safe Areas**
Replace custom CSS classes with **react-native-safe-area-context**:

**Web**:
```css
.safe-top { padding-top: env(safe-area-inset-top); }
```

**React Native**:
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView edges={['top']}>
```

### 6. **Bottom Sheet**
Replace custom framer-motion sheet with **@gorhom/bottom-sheet**:

**Web**: Custom AddTaskSheet with framer-motion

**React Native**:
```tsx
import BottomSheet from '@gorhom/bottom-sheet';

<BottomSheet
  snapPoints={['25%', '50%', '90%']}
  enablePanDownToClose
>
```

### 7. **Icons**
Replace lucide-react with **react-native-vector-icons** or **@expo/vector-icons**:

**Web**:
```tsx
import { Plus, Menu } from "lucide-react";
<Plus className="w-6 h-6" />
```

**React Native**:
```tsx
import { Ionicons } from '@expo/vector-icons';
<Ionicons name="add" size={24} color="#000" />
```

### 8. **Shadows**
iOS and Android handle shadows differently:

**iOS**:
```tsx
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.12,
shadowRadius: 8,
```

**Android**:
```tsx
elevation: 4,
```

**Cross-platform**: Use **react-native-shadow-2** library for consistent shadows.

### 9. **Font Loading**
Use **expo-font** or **react-native-vector-icons**:

```tsx
import * as Font from 'expo-font';

await Font.loadAsync({
  'SF-Pro-Text': require('./assets/fonts/SFProText-Regular.ttf'),
});
```

### 10. **Transitions**
All `transition-colors`, `transition-all` need to be manual animations:

```tsx
const animatedValue = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  backgroundColor: interpolateColor(
    animatedValue.value,
    [0, 1],
    ['hsl(240, 20%, 97%)', 'hsl(211, 100%, 50%)']
  ),
}));
```

---

## Recommended React Native Libraries

```json
{
  "dependencies": {
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "@gorhom/bottom-sheet": "^4.x",
    "react-native-safe-area-context": "^4.x",
    "@expo/vector-icons": "^13.x",
    "react-native-svg": "^13.x",
    "date-fns": "^3.6.0"
  }
}
```

---

# Summary Checklist

✅ **Dependencies**: All listed with exact versions  
✅ **CSS Variables**: Complete :root and .dark definitions  
✅ **Tailwind Config**: Full configuration with animations  
✅ **Shadcn Components**: Listed with usage notes  
✅ **Custom Components**: Documented with props and patterns  
✅ **Layout Patterns**: Screen structures and spacing  
✅ **Animations**: All timings and sequences with exact values  
✅ **Typography**: Complete scale with usage examples  
✅ **Colors**: Every color with usage context  
✅ **Border Radius**: All values with usage  
✅ **Shadows**: All shadow types with values  
✅ **Interactive States**: All button, input, and element states  
✅ **Example Implementations**: 3 complete copy-pasteable components  
✅ **React Native Notes**: Translation guide for key differences

---

This documentation should enable pixel-perfect replication of the TodoTomorrow design in React Native or any other framework. Good luck with your implementation!