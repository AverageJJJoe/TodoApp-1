import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '../design-system';

interface OnboardingWelcomeProps {
  onContinue: () => void;
  onSkip: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  onContinue,
  onSkip,
}) => {
  // Spring animation for emoji
  const emojiScale = useRef(new Animated.Value(0)).current;
  
  // Fade-in animations for text elements
  const headlineOpacity = useRef(new Animated.Value(0)).current;
  const headlineTranslateY = useRef(new Animated.Value(10)).current;
  
  const bodyOpacity = useRef(new Animated.Value(0)).current;
  const bodyTranslateY = useRef(new Animated.Value(10)).current;
  
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Emoji spring animation on mount
    Animated.spring(emojiScale, {
      toValue: 1,
      stiffness: 260,
      damping: 20,
      useNativeDriver: true,
    }).start();

    // Text fade-in animations with staggered delays
    Animated.parallel([
      Animated.timing(headlineOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headlineTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(bodyOpacity, {
        toValue: 1,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bodyTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <TouchableOpacity
        onPress={onSkip}
        style={styles.skipButton}
        activeOpacity={0.7}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Emoji with spring animation */}
      <Animated.Text
        style={[
          styles.emoji,
          {
            transform: [{ scale: emojiScale }],
          },
        ]}
      >
        🌙
      </Animated.Text>

      {/* Headline with fade-in animation */}
      <Animated.View
        style={{
          opacity: headlineOpacity,
          transform: [{ translateY: headlineTranslateY }],
        }}
      >
        <Text style={styles.headline}>
          Capture tonight,{'\n'}conquer tomorrow
        </Text>
      </Animated.View>

      {/* Body text with fade-in animation */}
      <Animated.View
        style={[
          styles.bodyContainer,
          {
            opacity: bodyOpacity,
            transform: [{ translateY: bodyTranslateY }],
          },
        ]}
      >
        <Text style={styles.bodyText}>
          No more midnight todo list panic. Just add tasks before bed.
        </Text>
      </Animated.View>

      {/* Continue button with fade-in animation */}
      <Animated.View
        style={{
          opacity: buttonOpacity,
          transform: [{ translateY: buttonTranslateY }],
        }}
      >
        <TouchableOpacity
          onPress={onContinue}
          style={styles.continueButton}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Pagination dots */}
      <View style={styles.paginationContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    backgroundColor: colors.background,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  skipButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  headline: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bodyContainer: {
    maxWidth: SCREEN_WIDTH * 0.8,
    marginBottom: spacing['3xl'],
  },
  bodyText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  continueButton: {
    width: '100%',
    maxWidth: SCREEN_WIDTH * 0.8,
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    ...typography.bodyLarge,
    color: colors.primaryForeground,
    fontWeight: '500',
  },
  paginationContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});

