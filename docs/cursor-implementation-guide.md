# Cursor Implementation Guide: Lovable to React Native Translation

## 🎯 CRITICAL INSTRUCTION FOR CURSOR

You are replicating a **pixel-perfect** design from Lovable (web) to React Native + NativeWind.

**Source**: `design-system-complete.md` (uploaded file)

**Your Task**: Build components that look IDENTICAL to the Lovable version, using React Native + NativeWind instead of React web + Tailwind.

---

## 📦 Step 1: Install Required Dependencies

### Core Dependencies (Add to package.json)

```bash
# NativeWind & Styling
npm install nativewind@^4.0.0
npm install tailwindcss@^3.4.17
npm install class-variance-authority@^0.7.1
npm install clsx@^2.1.1
npm install tailwind-merge@^2.6.0

# Animations
npm install react-native-reanimated@^3.6.0
npm install react-native-gesture-handler@^2.14.0

# UI Components
npm install @gorhom/bottom-sheet@^4.5.0
npm install react-native-safe-area-context@^4.8.0
npm install @expo/vector-icons@^13.0.0

# Date/Time
npm install date-fns@^3.6.0

# State Management
npm install @tanstack/react-query@^5.83.0
npm install zustand@^4.5.0

# Forms
npm install react-hook-form@^7.61.1
npm install zod@^3.25.76
npm install @hookform/resolvers@^3.10.0

# Notifications
npm install react-native-toast-message@^2.2.0
```

---

## 🎨 Step 2: Create NativeWind Theme Configuration

### Create `tailwind.config.js` (Root of Project)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Copy EXACT colors from Lovable design-system-complete.md
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(0, 0%, 0%)",
        primary: {
          DEFAULT: "hsl(211, 100%, 50%)",
          hover: "hsl(218, 100%, 42%)",
          light: "hsl(211, 100%, 95%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        text: {
          primary: "hsl(0, 0%, 0%)",
          secondary: "hsl(240, 2%, 44%)",
          tertiary: "hsl(240, 2%, 56%)",
        },
        surface: "hsl(240, 20%, 97%)",
        separator: "hsl(240, 5%, 78%)",
        success: "hsl(145, 72%, 49%)",
        destructive: "hsl(4, 90%, 58%)",
        warning: "hsl(32, 100%, 50%)",
        priority: {
          high: "hsl(4, 90%, 58%)",
          medium: "hsl(32, 100%, 50%)",
          low: "hsl(211, 100%, 50%)",
        },
        "carried-over": "hsl(0, 0%, 98%)",
        card: "hsl(0, 0%, 100%)",
        border: "hsl(240, 5%, 78%)",
        input: "hsl(240, 5%, 78%)",
        ring: "hsl(211, 100%, 50%)",
      },
      spacing: {
        // EXACT spacing from Lovable (4pt base system)
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      borderRadius: {
        // EXACT border radius from Lovable
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
      },
      fontSize: {
        // iOS-style typography scale
        "title-large": ["34px", { lineHeight: "1.2", fontWeight: "700" }],
        "title-medium": ["28px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-large": ["17px", { lineHeight: "1.5", fontWeight: "400" }],
        body: ["15px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        footnote: ["11px", { lineHeight: "1.3", fontWeight: "400" }],
      },
      fontFamily: {
        // iOS system fonts
        system: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        // Lovable shadow values (use elevation in React Native)
        sm: "0 1px 3px rgba(0, 0, 0, 0.08)",
        md: "0 2px 8px rgba(0, 0, 0, 0.12)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.16)",
        fab: "0 4px 16px rgba(0, 123, 255, 0.32)",
      },
    },
  },
  plugins: [],
};
```

---

## 🔧 Step 3: Create Design Tokens Utilities

### Create `src/theme/tokens.ts`

```typescript
// Design Tokens from Lovable - Translated to React Native

export const colors = {
  background: "rgb(255, 255, 255)",
  foreground: "rgb(0, 0, 0)",
  primary: "rgb(0, 123, 255)",
  primaryHover: "rgb(0, 96, 204)",
  primaryLight: "rgb(235, 245, 255)",
  primaryForeground: "rgb(255, 255, 255)",
  textPrimary: "rgb(0, 0, 0)",
  textSecondary: "rgb(113, 113, 122)",
  textTertiary: "rgb(143, 143, 153)",
  surface: "rgb(247, 247, 249)",
  separator: "rgb(199, 199, 204)",
  success: "rgb(52, 199, 89)",
  destructive: "rgb(255, 59, 48)",
  warning: "rgb(255, 149, 0)",
  priorityHigh: "rgb(255, 59, 48)",
  priorityMedium: "rgb(255, 149, 0)",
  priorityLow: "rgb(0, 123, 255)",
  carriedOver: "rgb(250, 250, 250)",
  card: "rgb(255, 255, 255)",
  border: "rgb(199, 199, 204)",
  input: "rgb(199, 199, 204)",
  ring: "rgb(0, 123, 255)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const fontSize = {
  titleLarge: 34,
  titleMedium: 28,
  bodyLarge: 17,
  body: 15,
  caption: 13,
  footnote: 11,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  fab: {
    shadowColor: "rgb(0, 123, 255)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 6,
  },
};
```

---

## 🎬 Step 4: Animation Configuration

### Create `src/animations/taskCompletion.ts`

```typescript
import {
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";

// Exact 600ms task completion animation from Lovable
export const taskCompletionAnimation = {
  // Phase 1: Checkbox fill (100ms)
  checkboxFill: () =>
    withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.ease),
    }),

  // Phase 2: Checkmark appear (150ms, delay 100ms)
  checkmarkAppear: () =>
    withDelay(
      100,
      withTiming(1, {
        duration: 150,
        easing: Easing.out(Easing.ease),
      })
    ),

  // Phase 3: Strikethrough (200ms, delay 150ms)
  strikethrough: () =>
    withDelay(
      150,
      withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      })
    ),

  // Phase 4: Fade out (300ms, delay 300ms)
  fadeOut: () =>
    withDelay(
      300,
      withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      })
    ),
};

// FAB bounce animation
export const fabBounce = () =>
  withSequence(
    withTiming(0.95, { duration: 100 }),
    withTiming(1.05, { duration: 100 }),
    withTiming(1, { duration: 100 })
  );
```

---

## 🧩 Step 5: Component Translation Patterns

### Pattern 1: Button Component

**Lovable (Web)**:
```tsx
<button className="bg-primary hover:bg-primary-hover text-primary-foreground px-lg py-md rounded-lg">
  Click Me
</button>
```

**Cursor (React Native)**:
```tsx
import { TouchableOpacity, Text } from "react-native";
import { colors, spacing, borderRadius } from "@/theme/tokens";

<TouchableOpacity
  className="bg-primary active:bg-primary-hover px-lg py-md rounded-lg"
  style={{
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  }}
  activeOpacity={0.8}
>
  <Text className="text-primary-foreground text-body font-medium">
    Click Me
  </Text>
</TouchableOpacity>
```

### Pattern 2: TaskCard Component

**Key Translation Points**:
1. `<div>` → `<View>`
2. `<button>` → `<TouchableOpacity>` or `<Pressable>`
3. `className` works with NativeWind, BUT also use `style={}` for shadows
4. Framer Motion → React Native Reanimated

**Example TaskCard (React Native)**:

```tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "@/theme/tokens";

interface TaskCardProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
    priority?: "high" | "medium" | "low";
    dueDate?: Date;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onDelete,
}) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!task.completed) {
      // Trigger 600ms completion animation
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.95, { duration: 300 });
      setTimeout(() => onToggle(task.id), 600);
    }
  };

  return (
    <Animated.View
      style={[
        {
          backgroundColor: colors.card,
          padding: spacing.md,
          borderRadius: borderRadius.lg,
          marginBottom: spacing.sm,
          ...shadows.sm,
        },
        animatedStyle,
      ]}
      className="bg-card p-md rounded-lg mb-sm"
    >
      <View className="flex-row items-center gap-md">
        {/* Checkbox */}
        <TouchableOpacity
          onPress={handlePress}
          className="w-6 h-6 rounded-md border-2 border-separator items-center justify-center"
          style={{
            borderColor: task.completed ? colors.primary : colors.separator,
            backgroundColor: task.completed ? colors.primary : "transparent",
          }}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={16} color={colors.primaryForeground} />
          )}
        </TouchableOpacity>

        {/* Task Text */}
        <Text
          className="flex-1 text-body text-text-primary"
          style={{
            textDecorationLine: task.completed ? "line-through" : "none",
            color: task.completed ? colors.textTertiary : colors.textPrimary,
            fontSize: 15,
          }}
        >
          {task.text}
        </Text>

        {/* Priority Badge (if exists) */}
        {task.priority && (
          <View
            className="px-sm py-xs rounded-md"
            style={{
              backgroundColor:
                task.priority === "high"
                  ? colors.priorityHigh
                  : task.priority === "medium"
                  ? colors.priorityMedium
                  : colors.priorityLow,
            }}
          >
            <Text className="text-xs text-white font-medium">
              {task.priority.toUpperCase()}
            </Text>
          </View>
        )}

        {/* Delete Button */}
        <TouchableOpacity onPress={() => onDelete(task.id)}>
          <Ionicons name="trash-outline" size={20} color={colors.destructive} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
```

---

## 📱 Step 6: Bottom Sheet Implementation

**Lovable uses**: Custom framer-motion sheet
**React Native uses**: `@gorhom/bottom-sheet`

### Create `src/components/AddTaskSheet.tsx`

```tsx
import React, { useRef } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { colors, spacing, borderRadius } from "@/theme/tokens";

interface AddTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export const AddTaskSheet: React.FC<AddTaskSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [taskText, setTaskText] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (taskText.trim()) {
      onSubmit(taskText);
      setTaskText("");
      onClose();
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={["50%"]}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
      )}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.separator }}
    >
      <View className="p-lg">
        <Text className="text-title-medium font-semibold text-text-primary mb-md">
          Add New Task
        </Text>

        <TextInput
          value={taskText}
          onChangeText={setTaskText}
          placeholder="What needs to be done?"
          placeholderTextColor={colors.textTertiary}
          multiline
          className="bg-surface rounded-lg p-md text-body text-text-primary mb-lg"
          style={{
            backgroundColor: colors.surface,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            fontSize: 15,
            minHeight: 100,
          }}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-primary rounded-lg py-md items-center"
          style={{
            backgroundColor: colors.primary,
            borderRadius: borderRadius.lg,
            paddingVertical: spacing.md,
          }}
          activeOpacity={0.8}
        >
          <Text className="text-primary-foreground text-body font-semibold">
            Add Task
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};
```

---

## 🎯 Step 7: Cursor Implementation Prompt

**Copy this prompt and paste it into Cursor**:

```
I need you to build a React Native + NativeWind app that EXACTLY replicates the Lovable design documented in design-system-complete.md.

CRITICAL RULES:
1. Read design-system-complete.md FIRST before writing any code
2. Use the EXACT color values from the design tokens (colors object in tokens.ts)
3. Use the EXACT spacing scale (spacing.xs = 4px, spacing.md = 12px, etc.)
4. Use the EXACT border radius values (borderRadius.lg = 16px, etc.)
5. Use the EXACT typography scale (fontSize.body = 15px, etc.)
6. Implement the EXACT 600ms task completion animation sequence
7. Match the EXACT shadow values using elevation for Android

TRANSLATION PATTERNS:
- <div> → <View>
- <button> → <TouchableOpacity> or <Pressable>
- <input> → <TextInput>
- <p>, <h1>, <span> → <Text>
- className works with NativeWind, but ALSO use style={{}} for shadows and complex styles
- Framer Motion → React Native Reanimated
- lucide-react icons → @expo/vector-icons (Ionicons)

START BY:
1. Setting up tailwind.config.js with the theme from design-system-complete.md
2. Creating src/theme/tokens.ts with all design tokens
3. Creating src/animations/taskCompletion.ts with the 600ms animation
4. Building TaskCard component using the patterns I showed you
5. Building AddTaskSheet using @gorhom/bottom-sheet

For EACH component you build:
- Show me the Lovable version (from design-system-complete.md)
- Show me your React Native translation
- Explain which design tokens you used
- Confirm spacing, colors, and animations match EXACTLY

Begin with: "I've read the design system. Let me start by setting up the theme configuration..."
```

---

## ✅ Checklist for Cursor

When building each component, verify:

- [ ] Colors match EXACTLY (use colors object from tokens.ts)
- [ ] Spacing matches EXACTLY (use spacing.md, spacing.lg, etc.)
- [ ] Border radius matches EXACTLY (use borderRadius.lg, etc.)
- [ ] Typography matches EXACTLY (fontSize.body = 15px, etc.)
- [ ] Shadows implemented correctly (iOS shadowOffset + Android elevation)
- [ ] Animations use React Native Reanimated with EXACT timings
- [ ] Icons use @expo/vector-icons with correct size (24px → size={24})
- [ ] Interactive states work (active, pressed, disabled)
- [ ] Component looks identical to Lovable screenshot

---

## 🚀 Expected Outcome

After following this guide, Cursor should produce components that:

1. **Look identical** to Lovable (same colors, spacing, typography)
2. **Animate identically** (same 600ms task completion sequence)
3. **Feel identical** (same touch interactions, gestures)
4. **Work identically** (same functionality, same behavior)

**The key difference**: Instead of web technologies (React + Tailwind + Framer Motion), you're using mobile technologies (React Native + NativeWind + Reanimated).

---

## 🆘 Troubleshooting

**If Cursor's output still doesn't match**:

1. **Verify tokens.ts**: Colors must be RGB values, not HSL
2. **Check spacing**: NativeWind uses numbers (12) not strings ("12px")
3. **Confirm shadows**: Must use both shadowOffset (iOS) and elevation (Android)
4. **Test animations**: Must use React Native Reanimated, not Animated API
5. **Validate icons**: Must use @expo/vector-icons, not lucide-react

**Still not matching?**
- Take a screenshot of Lovable component
- Take a screenshot of Cursor's component
- Compare side-by-side
- Identify the SPECIFIC difference (color? spacing? animation?)
- Ask Cursor to fix that ONE specific thing

---

## 📝 Summary

**What you have**: Lovable design system (web-based)
**What you need**: React Native equivalent
**This guide**: Exact translation patterns + configuration + implementation examples

Follow this guide step-by-step, and Cursor will replicate the Lovable design pixel-perfectly. 🎯
