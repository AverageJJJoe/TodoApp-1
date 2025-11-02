import React, { useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { OnboardingWelcome } from '../components/OnboardingWelcome';
import { DeliveryTimePicker } from '../components/DeliveryTimePicker';
import { WorkflowModeSelection } from '../components/WorkflowModeSelection';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../design-system';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slideAnim] = useState(new Animated.Value(0));

  const { updatePreferences } = useUserPreferencesStore();
  const { session } = useAuthStore();

  // Get system timezone (simple fallback)
  const getSystemTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  };

  const handleContinueFromStep1 = () => {
    animateSlide(1);
    setCurrentStep(2);
  };

  const handleContinueFromStep2 = (time: string) => {
    setSelectedTime(time);
    animateSlide(1);
    setCurrentStep(3);
  };

  const handleCompleteStep3 = async (mode: 'fresh-start' | 'carry-over') => {
    try {
      // Save delivery time preference if set
      if (selectedTime) {
        const timezone = getSystemTimezone();
        await updatePreferences(selectedTime, timezone);
      }

      // Save workflow mode to database
      // NOTE: This will be fully implemented in Epic 5, Story 5.1
      // For now, we'll attempt to save it
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
                workflow_mode: mode, // Set workflow mode during creation
                // Other fields use defaults from schema
              },
            ])
            .select('id')
            .single();

          if (!createError && newUser) {
            userId = newUser.id;
          }
        } else if (!userError && user) {
          userId = user.id;
          
          // Update workflow mode for existing user
          await supabase
            .from('users')
            .update({ workflow_mode: mode })
            .eq('id', userId);
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
    animateSlide(-1);
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  };

  const animateSlide = (direction: number) => {
    Animated.timing(slideAnim, {
      toValue: direction,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(0);
    });
  };

  // Slide transition animation
  const slideStyle = {
    transform: [
      {
        translateX: slideAnim.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {currentStep === 1 && (
        <Animated.View style={[styles.screenContainer, slideStyle]}>
          <OnboardingWelcome
            onContinue={handleContinueFromStep1}
            onSkip={handleSkip}
          />
        </Animated.View>
      )}

      {currentStep === 2 && (
        <Animated.View style={[styles.screenContainer, slideStyle]}>
          <DeliveryTimePicker
            onContinue={handleContinueFromStep2}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        </Animated.View>
      )}

      {currentStep === 3 && (
        <Animated.View style={[styles.screenContainer, slideStyle]}>
          <WorkflowModeSelection
            onComplete={handleCompleteStep3}
            onBack={handleBack}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
});

