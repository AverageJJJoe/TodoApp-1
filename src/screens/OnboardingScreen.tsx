import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { OnboardingWelcome } from '../components/OnboardingWelcome';
import { DeliveryTimePicker } from '../components/DeliveryTimePicker';
import { WorkflowModeSelection } from '../components/WorkflowModeSelection';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../design-system';
import {
  calculateWeeksSinceLaunch,
  assignCohort,
  getLaunchDate,
} from '../lib/cohortAssignment';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { updatePreferences } = useUserPreferencesStore();
  const { session } = useAuthStore();

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenContainer: {
      flex: 1,
      width: SCREEN_WIDTH,
    },
  }), [colors]);

  // Get system timezone (simple fallback)
  const getSystemTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  };

  const handleContinueFromStep1 = () => {
    setCurrentStep(2);
  };

  const handleContinueFromStep2 = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleCompleteStep3 = async (mode: 'fresh-start' | 'carry-over') => {
    try {
      // Save delivery time preference if set
      if (selectedTime) {
        const timezone = getSystemTimezone();
        await updatePreferences(selectedTime, timezone);
      }

      // Convert hyphen format to underscore format for database
      // Component uses: 'fresh-start' | 'carry-over'
      // Database requires: 'fresh_start' | 'carry_over'
      const dbMode = mode === 'fresh-start' ? 'fresh_start' : 'carry_over';

      // Save workflow mode to database
      if (session?.user?.id) {
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', session.user.id)
          .maybeSingle(); // Use maybeSingle() to handle missing user records gracefully

        // If user doesn't exist, create it (should be handled by trigger, but fallback here)
        let userId: number | null = null;
        if (userError?.code === 'PGRST116' || !user) {
          // PGRST116 = no rows returned, user doesn't exist yet
          if (__DEV__) {
            console.log('⚠️ User record not found in OnboardingScreen, creating one...');
          }
          
          // Create user record
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([
              {
                auth_id: session.user.id,
                email: session.user.email || '',
                workflow_mode: dbMode, // Set workflow mode during creation (use underscore format)
                // Other fields use defaults from schema
              },
            ])
            .select('id')
            .single();

          if (!createError && newUser) {
            userId = newUser.id;

            // Assign cohort after user creation (idempotency check: only if still default)
            try {
              const launchDate = getLaunchDate();
              if (launchDate) {
                const { data: currentUser, error: cohortCheckError } = await supabase
                  .from('users')
                  .select('cohort')
                  .eq('id', newUser.id)
                  .maybeSingle();

                if (!cohortCheckError && currentUser?.cohort === 'free_launch') {
                  const weeksSinceLaunch = calculateWeeksSinceLaunch(launchDate);
                  const cohortData = assignCohort(weeksSinceLaunch);

                  const { error: cohortUpdateError } = await supabase
                    .from('users')
                    .update({
                      cohort: cohortData.cohort,
                      grandfather_status: cohortData.grandfatherStatus,
                      trial_started_at: cohortData.trialStartedAt?.toISOString() || null,
                      trial_expires_at: cohortData.trialExpiresAt?.toISOString() || null,
                    })
                    .eq('id', newUser.id);

                  if (cohortUpdateError) {
                    if (__DEV__) {
                      console.error('Failed to assign cohort:', cohortUpdateError);
                    }
                  } else if (__DEV__) {
                    console.log('✅ Cohort assigned:', cohortData);
                  }
                }
              }
            } catch (error) {
              // Cohort assignment failure should not block onboarding
              if (__DEV__) {
                console.error('Failed to assign cohort:', error);
              }
            }
          }
        } else if (!userError && user) {
          userId = user.id;
          
          // Update workflow mode for existing user
          const { error: updateError } = await supabase
            .from('users')
            .update({ workflow_mode: dbMode }) // Use underscore format
            .eq('id', userId);

          if (updateError && __DEV__) {
            console.error('Failed to update workflow_mode:', updateError);
          }
        }
        
        // Note: If user creation/update fails, we still continue (graceful degradation)
        // The workflow mode will be set when user next interacts with the app
      }

      // Navigate to MainScreen
      onComplete();
    } catch (error) {
      // If save fails, still complete onboarding (graceful degradation)
      console.error('Failed to save preferences:', error);
      onComplete();
    }
  };

  const handleSkip = () => {
    // Skip to end of onboarding (set defaults)
    // For skip, we'll use defaults: 06:00:00, system timezone, carry-over mode
    onComplete();
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  return (
    <View style={styles.container}>
      {currentStep === 1 && (
        <View style={styles.screenContainer}>
          <OnboardingWelcome
            onContinue={handleContinueFromStep1}
            onSkip={handleSkip}
          />
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.screenContainer}>
          <DeliveryTimePicker
            onContinue={handleContinueFromStep2}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        </View>
      )}

      {currentStep === 3 && (
        <View style={styles.screenContainer}>
          <WorkflowModeSelection
            onComplete={handleCompleteStep3}
            onBack={handleBack}
          />
        </View>
      )}
    </View>
  );
};

