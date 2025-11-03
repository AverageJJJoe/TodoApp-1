import Constants from 'expo-constants';

/**
 * Cohort assignment utility functions
 * 
 * STRATEGY: Free Until Traction (Updated 2025-02-11)
 * 
 * All users are assigned to 'free_launch' cohort with grandfather_status = true
 * (free forever) during the launch period. This allows focus on product quality
 * and retention validation before introducing monetization.
 * 
 * Original tiered monetization logic is preserved below (commented) for future
 * re-enablement when traction thresholds are met:
 * - 500+ weekly active users
 * - 50+ App Store reviews
 * - 4.5+ star average
 * - 20%+ D30 retention
 * 
 * To re-enable monetization: Uncomment the original logic in assignCohort()
 */

export interface CohortAssignmentResult {
  cohort: string;
  grandfatherStatus: boolean;
  trialExpiresAt: Date | null;
  trialStartedAt: Date | null;
}

/**
 * Calculates the number of weeks since launch date
 * @param launchDate - The launch date as a Date object
 * @returns Number of whole weeks since launch (rounded down)
 */
export function calculateWeeksSinceLaunch(launchDate: Date): number {
  const now = new Date();
  const diffInMs = now.getTime() - launchDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  const weeksSinceLaunch = Math.floor(diffInDays / 7);
  return Math.max(0, weeksSinceLaunch); // Ensure non-negative
}

/**
 * Assigns a cohort based on weeks since launch
 * 
 * CURRENT STRATEGY (Free Until Traction): All users get free_launch + grandfathered
 * 
 * @param weeksSinceLaunch - Number of weeks since launch (currently unused but kept for future)
 * @returns Cohort assignment result with all fields
 */
export function assignCohort(
  weeksSinceLaunch: number
): CohortAssignmentResult {
  // Free Until Traction Strategy: All users are free forever during launch
  return {
    cohort: 'free_launch',
    grandfatherStatus: true,
    trialExpiresAt: null,
    trialStartedAt: null,
  };

  /* ORIGINAL MONETIZATION LOGIC (Preserved for future re-enablement)
   * 
   * Uncomment below and remove return above when traction thresholds are met
   * 
  // Weeks 1-3: Default to 'free_launch' (fallback for early users)
  if (weeksSinceLaunch < 4) {
    return {
      cohort: 'free_launch',
      grandfatherStatus: false,
      trialExpiresAt: null,
      trialStartedAt: null,
    };
  }

  // Weeks 4-6: 'free_launch' with grandfather_status = true (free forever)
  if (weeksSinceLaunch >= 4 && weeksSinceLaunch <= 6) {
    return {
      cohort: 'free_launch',
      grandfatherStatus: true,
      trialExpiresAt: null,
      trialStartedAt: null,
    };
  }

  // Weeks 7-8: 50/50 random split between 'early_freemium_2.99' or 'early_freemium_4.99' with 30-day trial
  if (weeksSinceLaunch >= 7 && weeksSinceLaunch <= 8) {
    const now = new Date();
    const trialExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const cohort = Math.random() < 0.5 ? 'early_freemium_2.99' : 'early_freemium_4.99';

    return {
      cohort,
      grandfatherStatus: false,
      trialExpiresAt,
      trialStartedAt: now,
    };
  }

  // Week 9+: 'paid_cohort_v1' with 30-day trial
  const now = new Date();
  const trialExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    cohort: 'paid_cohort_v1',
    grandfatherStatus: false,
    trialExpiresAt,
    trialStartedAt: now,
  };
  */
}

/**
 * Gets the launch date from app configuration
 * @returns Launch date as Date object, or null if not configured
 */
export function getLaunchDate(): Date | null {
  const launchDateStr = Constants.expoConfig?.extra?.launchDate as string | undefined;
  if (!launchDateStr) {
    return null;
  }
  const launchDate = new Date(launchDateStr);
  if (isNaN(launchDate.getTime())) {
    console.error('Invalid launchDate format in app.json. Expected ISO date string.');
    return null;
  }
  return launchDate;
}

