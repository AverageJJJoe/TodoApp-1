import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { useTheme, typography, spacing, shadows } from '../design-system';
import { trackPaywallViewed } from '../lib/posthog';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining: number;
  tasksRemaining: number;
  cohort?: string; // For cohort-specific messaging
  onUpgrade?: () => void; // Payment handler (placeholder - actual payment logic in Epic 4)
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  daysRemaining,
  tasksRemaining,
  cohort,
  onUpgrade,
}) => {
  const { colors } = useTheme();
  
  const styles = useMemo(() => StyleSheet.create({
    backdropContainer: {
      ...StyleSheet.absoluteFillObject,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: spacing.radiusLg,
      width: '100%',
      maxWidth: 400,
      maxHeight: '90%',
      ...shadows.shadowLg,
    },
    closeButton: {
      position: 'absolute',
      top: spacing.lg,
      right: spacing.lg,
      zIndex: 10,
      padding: spacing.sm,
      borderRadius: spacing.radiusSm,
    },
    closeButtonText: {
      fontSize: 20,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    scrollContent: {
      padding: spacing['2xl'],
      paddingTop: spacing['3xl'],
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: spacing.xl,
    },
    iconText: {
      fontSize: 32,
      color: colors.primary,
    },
    title: {
      ...typography.titleMedium,
      fontWeight: '600',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    subtitle: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    subtitleBold: {
      fontWeight: '600',
      color: colors.textPrimary,
    },
    pricingContainer: {
      backgroundColor: colors.surface,
      borderRadius: spacing.radiusMd,
      padding: spacing.xl,
      marginBottom: spacing.xl,
      alignItems: 'center',
    },
    pricingLabel: {
      ...typography.caption,
      color: colors.textTertiary,
      marginBottom: spacing.xs,
    },
    pricingRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: spacing.xs,
    },
    pricingAmount: {
      ...typography.titleLarge,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    pricingSuffix: {
      ...typography.bodyLarge,
      color: colors.textSecondary,
      marginLeft: spacing.xs,
    },
    pricingCancel: {
      ...typography.caption,
      color: colors.textTertiary,
    },
    featuresContainer: {
      marginBottom: spacing['3xl'],
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    checkmarkCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(52, 199, 89, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    checkmark: {
      fontSize: 12,
      color: colors.success,
      fontWeight: '700',
    },
    featureText: {
      ...typography.body,
      color: colors.textPrimary,
      flex: 1,
    },
    primaryButton: {
      width: '100%',
      height: 50,
      backgroundColor: colors.primary,
      borderRadius: spacing.radiusSm,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    primaryButtonText: {
      ...typography.body,
      fontWeight: '500',
      color: colors.primaryForeground,
    },
    secondaryButton: {
      width: '100%',
      height: 50,
      backgroundColor: 'transparent',
      borderRadius: spacing.radiusSm,
      justifyContent: 'center',
      alignItems: 'center',
    },
    secondaryButtonText: {
      ...typography.body,
      fontWeight: '500',
      color: colors.textSecondary,
    },
  }), [colors]);
  
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.95)).current;
  const modalTranslateY = useRef(new Animated.Value(20)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;

  const features = [
    'Unlimited tasks',
    'Daily email delivery',
    'Priority & due dates',
    'Archive history',
    'Email support',
    'No ads, ever',
  ];

  // Get pricing based on cohort (default to $4.99)
  const getPricing = () => {
    if (cohort === 'early_freemium_2.99') {
      return { price: '$2.99', label: 'Early Bird' };
    }
    if (cohort === 'early_freemium_4.99') {
      return { price: '$4.99', label: 'Early Supporter' };
    }
    return { price: '$4.99', label: null };
  };

  const pricing = getPricing();

  // Track paywall_viewed event when modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        trackPaywallViewed({
          cohort: cohort || undefined,
          days_remaining: daysRemaining,
          tasks_remaining: tasksRemaining,
        });
      } catch (trackError) {
        // Don't fail paywall display if tracking fails
        if (__DEV__) {
          console.error('Failed to track paywall_viewed event:', trackError);
        }
      }
    }
  }, [isOpen, cohort, daysRemaining, tasksRemaining]);

  // Modal animations
  useEffect(() => {
    if (isOpen) {
      // Entry animation
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(modalScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(modalTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 0.95,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalTranslateY, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, backdropOpacity, modalScale, modalTranslateY, modalOpacity]);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      // Placeholder - actual payment logic will be in Epic 4
      console.log('Upgrade clicked - integrate with payment provider');
      onClose();
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.backdropContainer}
      >
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </TouchableOpacity>

      {/* Modal Content */}
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              opacity: modalOpacity,
              transform: [
                { scale: modalScale },
                { translateY: modalTranslateY },
              ],
            },
          ]}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Icon Circle */}
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>⚡</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Upgrade to Pro</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Your trial has <Text style={styles.subtitleBold}>{daysRemaining} days</Text> and{' '}
              <Text style={styles.subtitleBold}>{tasksRemaining} tasks</Text> remaining
            </Text>

            {/* Pricing Section */}
            <View style={styles.pricingContainer}>
              {pricing.label && (
                <Text style={styles.pricingLabel}>{pricing.label}</Text>
              )}
              <Text style={styles.pricingLabel}>Just</Text>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingAmount}>{pricing.price}</Text>
                <Text style={styles.pricingSuffix}>/month</Text>
              </View>
              <Text style={styles.pricingCancel}>Cancel anytime</Text>
            </View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={feature} style={styles.featureItem}>
                  <View style={styles.checkmarkCircle}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* CTA Buttons */}
            <TouchableOpacity
              onPress={handleUpgrade}
              style={styles.primaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {cohort?.includes('early') ? 'Start Pro Now' : 'Unlock Premium'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.secondaryButton}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};
