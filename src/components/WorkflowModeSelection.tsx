import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { colors, typography, spacing } from '../design-system';

interface WorkflowModeSelectionProps {
  onComplete: (mode: 'fresh-start' | 'carry-over') => void;
  onBack: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const WorkflowModeSelection: React.FC<WorkflowModeSelectionProps> = ({
  onComplete,
  onBack,
}) => {
  const [selectedMode, setSelectedMode] = useState<
    'fresh-start' | 'carry-over'
  >('carry-over');

  // Animation values
  const questionOpacity = useRef(new Animated.Value(0)).current;
  const questionTranslateY = useRef(new Animated.Value(10)).current;
  const freshStartCardOpacity = useRef(new Animated.Value(0)).current;
  const freshStartCardTranslateY = useRef(new Animated.Value(10)).current;
  const carryOverCardOpacity = useRef(new Animated.Value(0)).current;
  const carryOverCardTranslateY = useRef(new Animated.Value(10)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(10)).current;

  // Card selection animations (checkmarks only, border handled via style)
  const freshStartCheckmarkScale = useRef(new Animated.Value(0)).current;
  const carryOverCheckmarkScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial fade-in animations
    Animated.parallel([
      Animated.timing(questionOpacity, {
        toValue: 1,
        duration: 300,
        delay: 0,
        useNativeDriver: true,
      }),
      Animated.timing(questionTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 0,
        useNativeDriver: true,
      }),
      Animated.timing(freshStartCardOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(freshStartCardTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(carryOverCardOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(carryOverCardTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleModeSelect = (mode: 'fresh-start' | 'carry-over') => {
    setSelectedMode(mode);

    // Animate checkmark scales
    if (mode === 'fresh-start') {
      Animated.parallel([
        Animated.spring(freshStartCheckmarkScale, {
          toValue: 1,
          stiffness: 260,
          damping: 20,
          useNativeDriver: true,
        }),
        Animated.timing(carryOverCheckmarkScale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(carryOverCheckmarkScale, {
          toValue: 1,
          stiffness: 260,
          damping: 20,
          useNativeDriver: true,
        }),
        Animated.timing(freshStartCheckmarkScale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Centered content */}
      <View style={styles.contentContainer}>
        {/* Question text */}
        <Animated.View
          style={{
            opacity: questionOpacity,
            transform: [{ translateY: questionTranslateY }],
          }}
        >
          <Text style={styles.questionText}>Choose your style</Text>
        </Animated.View>

        {/* Fresh Start card */}
        <Animated.View
          style={{
            opacity: freshStartCardOpacity,
            transform: [{ translateY: freshStartCardTranslateY }],
          }}
        >
          <TouchableOpacity
            onPress={() => handleModeSelect('fresh-start')}
            style={[
              styles.modeCard,
              {
                borderColor:
                  selectedMode === 'fresh-start'
                    ? colors.primary
                    : colors.separator,
                backgroundColor:
                  selectedMode === 'fresh-start'
                    ? colors.primaryLight
                    : colors.card,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🗓️</Text>
              {selectedMode === 'fresh-start' && (
                <Animated.View
                  style={{
                    transform: [{ scale: freshStartCheckmarkScale }],
                  }}
                >
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </Animated.View>
              )}
            </View>
            <Text style={styles.cardTitle}>Fresh Start</Text>
            <Text style={styles.cardDescription}>
              Clean slate every morning
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Carry Over card */}
        <Animated.View
          style={{
            opacity: carryOverCardOpacity,
            transform: [{ translateY: carryOverCardTranslateY }],
          }}
        >
          <TouchableOpacity
            onPress={() => handleModeSelect('carry-over')}
            style={[
              styles.modeCard,
              {
                borderColor:
                  selectedMode === 'carry-over'
                    ? colors.primary
                    : colors.separator,
                backgroundColor:
                  selectedMode === 'carry-over'
                    ? colors.primaryLight
                    : colors.card,
              },
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>✅</Text>
              {selectedMode === 'carry-over' && (
                <Animated.View
                  style={{
                    transform: [{ scale: carryOverCheckmarkScale }],
                  }}
                >
                  <Text style={styles.checkmarkIcon}>✓</Text>
                </Animated.View>
              )}
            </View>
            <Text style={styles.cardTitle}>Carry Over</Text>
            <Text style={styles.cardDescription}>
              Tasks persist until completed
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Get Started button */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          }}
        >
          <TouchableOpacity
            onPress={() => onComplete(selectedMode)}
            style={styles.continueButton}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
  },
  backButton: {
    padding: spacing.sm,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -spacing.sm,
  },
  backButtonText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  questionText: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  modeCard: {
    width: '100%',
    maxWidth: SCREEN_WIDTH * 0.8,
    padding: spacing.xl,
    borderRadius: spacing.radiusLg,
    borderWidth: 2,
    marginBottom: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  cardIcon: {
    fontSize: 32,
  },
  checkmarkIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '600',
  },
  cardTitle: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    ...typography.body,
    color: colors.textSecondary,
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

