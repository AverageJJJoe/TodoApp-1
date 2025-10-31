# Frontend Component Architecture

## App Navigation Structure

```
App
├── AuthStack (if not logged in)
│   ├── AuthScreen
│   │   ├── EmailInput
│   │   └── MagicLinkVerification
│   └── OnboardingStack
│       ├── WorkflowModeSelection
│       ├── DeliveryTimeConfiguration
│       └── TutorialSlides
│
└── MainStack (if logged in)
    ├── TasksScreen (Home)
    │   ├── TaskInput
    │   ├── TaskList
    │   ├── TaskItem (with completion animation)
    │   ├── EmptyState
    │   └── SyncIndicator
    │
    ├── ArchiveScreen (if carry_over mode)
    │   └── CompletedTasksList
    │
    ├── SettingsStack
    │   ├── SettingsScreen
    │   │   ├── DeliveryTimeEditor
    │   │   ├── WorkflowModeToggle
    │   │   ├── TrialStatus
    │   │   └── PaymentButton
    │   │
    │   └── PaymentScreen
    │       ├── TrialBanner
    │       ├── PricingCards
    │       └── PurchaseButton
    │
    └── ProfileStack
        └── ProfileScreen
            ├── UserEmail
            ├── LogoutButton
            └── Version Info
```

## Core Component Examples

See original front-end-architecture.md for detailed component implementations.

---
