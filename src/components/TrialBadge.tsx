import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme, typography, spacing, shadows } from '../design-system';

interface TrialBadgeProps {
  daysRemaining: number;
  tasksRemaining: number;
  onUpgrade: () => void;
}

export const TrialBadge: React.FC<TrialBadgeProps> = ({
  daysRemaining,
  tasksRemaining,
  onUpgrade,
}) => {
  const { colors } = useTheme();
  const isLowDays = daysRemaining < 3;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      alignSelf: 'center',
      marginBottom: spacing['2xl'],
    },
    badgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: colors.trialBg,
      borderRadius: 999,
      ...shadows.shadowSm,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    icon: {
      fontSize: 16,
      color: colors.trialText,
    },
    text: {
      ...typography.caption,
      fontWeight: '500',
      color: colors.trialText,
    },
  }), [colors]);

  // Pulse animation when days < 3
  useEffect(() => {
    if (isLowDays) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isLowDays, scaleAnim]);

  return (
    <TouchableOpacity
      onPress={onUpgrade}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.badgeContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.icon}>⚡</Text>
          <Text style={styles.text}>
            {daysRemaining} days, {tasksRemaining} tasks remaining
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
