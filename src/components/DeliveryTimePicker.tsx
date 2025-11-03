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
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, typography, spacing } from '../design-system';

interface DeliveryTimePickerProps {
  onContinue: (time: string) => void;
  onBack: () => void;
  onSkip: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DeliveryTimePicker: React.FC<DeliveryTimePickerProps> = ({
  onContinue,
  onBack,
  onSkip,
}) => {
  const [selectedTime, setSelectedTime] = useState<Date>(() => {
    const defaultTime = new Date();
    defaultTime.setHours(6, 0, 0, 0);
    return defaultTime;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Animation values
  const questionOpacity = useRef(new Animated.Value(0)).current;
  const questionTranslateY = useRef(new Animated.Value(10)).current;
  const timeContainerOpacity = useRef(new Animated.Value(0)).current;
  const timeContainerScale = useRef(new Animated.Value(0.9)).current;
  const tipOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Fade-in animations with staggered delays
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
      Animated.timing(timeContainerOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(timeContainerScale, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tipOpacity, {
        toValue: 1,
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

  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (date) {
      // Round to nearest hour (set minutes to 0) since cron job runs hourly
      const roundedDate = new Date(date);
      roundedDate.setMinutes(0, 0, 0);
      setSelectedTime(roundedDate);
    }
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  const formatTimeForDisplay = (date: Date): string => {
    const hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    // Always show :00 for minutes since we only allow hours
    return `${displayHours}:00 ${ampm}`;
  };

  const formatTimeForDatabase = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    // Always set minutes to 00 since cron job runs hourly
    return `${hours}:00:00`;
  };

  const handleContinue = () => {
    onContinue(formatTimeForDatabase(selectedTime));
  };

  return (
    <View style={styles.container}>
      {/* Header with back and skip buttons */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSkip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Centered content */}
      <View style={styles.contentContainer}>
        {/* Question text with fade-in */}
        <Animated.View
          style={{
            opacity: questionOpacity,
            transform: [{ translateY: questionTranslateY }],
          }}
        >
          <Text style={styles.questionText}>
            When should we email{'\n'}your morning list?
          </Text>
        </Animated.View>

        {/* Time picker container with fade-in and scale */}
        <Animated.View
          style={[
            styles.timePickerContainer,
            {
              opacity: timeContainerOpacity,
              transform: [{ scale: timeContainerScale }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.timeDisplayContainer}
            activeOpacity={0.8}
          >
            <Text style={styles.timeDisplayText}>
              {formatTimeForDisplay(selectedTime)}
            </Text>
          </TouchableOpacity>

          {/* iOS: Show picker inline, Android: Show as modal */}
          {showTimePicker && Platform.OS === 'ios' && (
            <View style={styles.iosPickerContainer}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                minuteInterval={60}
                onChange={handleTimeChange}
                style={styles.timePicker}
              />
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                style={styles.doneButton}
                activeOpacity={0.8}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}

          {showTimePicker && Platform.OS === 'android' && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="default"
              minuteInterval={60}
              onChange={handleTimeChange}
            />
          )}
        </Animated.View>

        {/* Tip text with fade-in */}
        <Animated.View
          style={{
            opacity: tipOpacity,
          }}
        >
          <Text style={styles.tipText}>
            Most people choose between 5-7 AM
          </Text>
        </Animated.View>

        {/* Continue button with fade-in */}
        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
            width: '100%',
            maxWidth: 384,
            alignSelf: 'center',
          }}
        >
          <TouchableOpacity
            onPress={handleContinue}
            style={styles.continueButton}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
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
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.lg + 24, // Account for status bar on Android
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
  skipButton: {
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
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
  },
  questionText: {
    fontSize: 20,
    lineHeight: 20 * 1.3,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  timePickerContainer: {
    width: '100%',
    maxWidth: 384,
    marginBottom: spacing.xl,
    alignSelf: 'center',
  },
  timeDisplayContainer: {
    width: '100%',
    height: 60,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.separator,
    borderRadius: spacing.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timeDisplayText: {
    fontSize: 36,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  iosPickerContainer: {
    marginTop: spacing.md,
  },
  timePicker: {
    height: 200,
  },
  doneButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.bodyLarge,
    color: colors.primaryForeground,
    fontWeight: '500',
  },
  tipText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['3xl'],
  },
  continueButton: {
    width: '100%',
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

