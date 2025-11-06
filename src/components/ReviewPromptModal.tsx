import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme, typography, spacing } from '../design-system';

interface ReviewPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onYes: () => void;
  onNo: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ReviewPromptModal: React.FC<ReviewPromptModalProps> = ({
  visible,
  onClose,
  onYes,
  onNo,
}) => {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        modalOverlay: {
          flex: 1,
        },
        modalOverlayInner: {
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalContent: {
          backgroundColor: colors.background,
          borderRadius: spacing.radiusLg,
          padding: spacing.xl,
          width: '85%',
          maxWidth: 400,
          alignItems: 'center',
        },
        modalTitle: {
          ...typography.titleMedium,
          fontSize: 22,
          color: colors.textPrimary,
          textAlign: 'center',
          marginBottom: spacing.md,
        },
        modalSubtitle: {
          ...typography.body,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: spacing.xl,
        },
        buttonContainer: {
          flexDirection: 'row',
          gap: spacing.md,
          width: '100%',
        },
        button: {
          flex: 1,
          padding: spacing.lg,
          borderRadius: spacing.radiusSm,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 50,
        },
        primaryButton: {
          backgroundColor: colors.primary,
        },
        secondaryButton: {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.separator,
        },
        primaryButtonText: {
          ...typography.bodyLarge,
          color: colors.background,
          fontWeight: '600',
        },
        secondaryButtonText: {
          ...typography.bodyLarge,
          color: colors.textPrimary,
          fontWeight: '600',
        },
      }),
    [colors]
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.modalOverlayInner}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>Enjoying TodoTomorrow?</Text>
            <Text style={styles.modalSubtitle}>
              Your feedback helps us improve! ⭐
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={onNo}
              >
                <Text style={styles.secondaryButtonText}>Not really</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onYes}
              >
                <Text style={styles.primaryButtonText}>Yes, love it!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

