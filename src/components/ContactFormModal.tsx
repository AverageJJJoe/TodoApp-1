import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, typography, spacing } from '../design-system';
import { useAuthStore } from '../stores/authStore';

interface ContactFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; message: string }) => Promise<void>;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const { session } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill email from session
  useEffect(() => {
    if (visible && session?.user?.email) {
      setEmail(session.user.email);
    }
  }, [visible, session]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setName('');
      setMessage('');
      setIsSubmitting(false);
      // Keep email pre-filled for next time
    }
  }, [visible]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    // Validate message (required)
    if (!message.trim()) {
      Alert.alert('Error', 'Message is required');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      // Success handling is done in parent component
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableOpacity
          style={styles.modalOverlayInner}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View 
            style={styles.modalContent} 
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Us</Text>
              <TouchableOpacity onPress={handleClose} disabled={isSubmitting}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Name Field (Optional) */}
              <TextInput
                style={styles.input}
                placeholder="Your name (optional)"
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
                editable={!isSubmitting}
                autoCapitalize="words"
              />

              {/* Email Field */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                editable={!isSubmitting}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Message Field (Required) */}
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="How can we help?"
                placeholderTextColor={colors.textTertiary}
                value={message}
                onChangeText={setMessage}
                editable={!isSubmitting}
                multiline={true}
                textAlignVertical="top"
              />

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.sendButton,
                    isSubmitting && styles.sendButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <Text style={styles.sendButtonText}>Send</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalOverlayInner: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.8,
    minHeight: Math.min(500, SCREEN_HEIGHT * 0.6),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    ...typography.titleMedium,
    fontSize: 20,
    color: colors.textPrimary,
  },
  modalCloseButton: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.separator,
    borderRadius: spacing.radiusSm,
    padding: spacing.lg,
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  button: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  cancelButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  cancelButtonText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    ...typography.bodyLarge,
    color: colors.background,
    fontWeight: '600',
  },
});

