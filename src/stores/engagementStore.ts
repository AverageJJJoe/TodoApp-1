import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@engagement_data';

interface EngagementData {
  appOpens: number;
  tasksAdded: number;
  tasksCompleted: number;
  installDate: string | null; // ISO string
  lastPromptDate: string | null; // ISO string
  promptCount: number;
}

interface EngagementStore extends EngagementData {
  incrementAppOpens: () => Promise<void>;
  incrementTasksAdded: () => Promise<void>;
  incrementTasksCompleted: () => Promise<void>;
  calculateEngagementScore: () => number;
  checkPromptEligibility: () => boolean;
  recordPromptShown: () => Promise<void>;
  loadEngagementData: () => Promise<void>;
  // Dev-only testing helpers
  setTestData?: (data: Partial<EngagementData>) => Promise<void>;
  resetEngagementData?: () => Promise<void>;
}

const DEFAULT_DATA: EngagementData = {
  appOpens: 0,
  tasksAdded: 0,
  tasksCompleted: 0,
  installDate: null,
  lastPromptDate: null,
  promptCount: 0,
};

export const useEngagementStore = create<EngagementStore>((set, get) => ({
  ...DEFAULT_DATA,

  loadEngagementData: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as EngagementData;
        set(data);
      } else {
        // First time - set install date
        const now = new Date().toISOString();
        const initialData = { ...DEFAULT_DATA, installDate: now };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        set(initialData);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading engagement data:', error);
      }
      // On error, initialize with defaults
      const now = new Date().toISOString();
      const initialData = { ...DEFAULT_DATA, installDate: now };
      set(initialData);
    }
  },

  incrementAppOpens: async () => {
    const current = get();
    const updated = {
      ...current,
      appOpens: current.appOpens + 1,
      // Set install date on first open if not set
      installDate: current.installDate || new Date().toISOString(),
    };
    set(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving engagement data:', error);
      }
    }
  },

  incrementTasksAdded: async () => {
    const current = get();
    const updated = {
      ...current,
      tasksAdded: current.tasksAdded + 1,
    };
    set(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving engagement data:', error);
      }
    }
  },

  incrementTasksCompleted: async () => {
    const current = get();
    const updated = {
      ...current,
      tasksCompleted: current.tasksCompleted + 1,
    };
    set(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving engagement data:', error);
      }
    }
  },

  calculateEngagementScore: () => {
    const state = get();
    if (!state.installDate) return 0;

    const installDate = new Date(state.installDate);
    const now = new Date();
    const daysSinceInstall = Math.floor(
      (now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Points calculation:
    // App opens: +2 points each
    // Tasks added: +3 points each
    // Tasks completed: +2 points each
    // Decay: -1 point per day (max 30 days)
    const opensPoints = state.appOpens * 2;
    const addedPoints = state.tasksAdded * 3;
    const completedPoints = state.tasksCompleted * 2;
    const decayPoints = Math.min(daysSinceInstall, 30);

    const score = opensPoints + addedPoints + completedPoints - decayPoints;
    return Math.max(0, score); // Ensure score is never negative
  },

  checkPromptEligibility: () => {
    const state = get();
    
    // Check install date exists
    if (!state.installDate) return false;

    const installDate = new Date(state.installDate);
    const now = new Date();
    const daysSinceInstall = Math.floor(
      (now.getTime() - installDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Eligibility checks:
    // 1. Minimum 2 days since install
    if (daysSinceInstall < 2) return false;

    // 2. Minimum 3 app opens
    if (state.appOpens < 3) return false;

    // 3. Engagement score >= 16
    const score = get().calculateEngagementScore();
    if (score < 16) return false;

    // 4. Last prompt >= 90 days ago (or never prompted)
    if (state.lastPromptDate) {
      const lastPromptDate = new Date(state.lastPromptDate);
      const daysSinceLastPrompt = Math.floor(
        (now.getTime() - lastPromptDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastPrompt < 90) return false;
    }

    // 5. Lifetime prompt count < 3
    if (state.promptCount >= 3) return false;

    return true;
  },

  recordPromptShown: async () => {
    const current = get();
    const updated = {
      ...current,
      lastPromptDate: new Date().toISOString(),
      promptCount: current.promptCount + 1,
    };
    set(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving engagement data:', error);
      }
    }
  },

  // Dev-only testing helpers
  ...(__DEV__ ? {
    setTestData: async (data: Partial<EngagementData>) => {
      const current = get();
      const updated = { ...current, ...data };
      set(updated);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log('✅ Test data set:', updated);
      } catch (error) {
        console.error('Error setting test data:', error);
      }
    },
    resetEngagementData: async () => {
      const now = new Date().toISOString();
      const resetData = { ...DEFAULT_DATA, installDate: now };
      set(resetData);
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
        console.log('✅ Engagement data reset');
      } catch (error) {
        console.error('Error resetting engagement data:', error);
      }
    },
  } : {}),
}));

