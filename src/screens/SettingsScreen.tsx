import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  Switch,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Localization from 'expo-localization';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { colors, typography, spacing } from '../design-system';
import {
  calculateWeeksSinceLaunch,
  assignCohort,
  getLaunchDate,
} from '../lib/cohortAssignment';

interface SettingsScreenProps {
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const [selectedTime, setSelectedTime] = useState<Date>(() => {
    // Default to 06:00 AM
    const defaultTime = new Date();
    defaultTime.setHours(6, 0, 0, 0);
    return defaultTime;
  });
  const [selectedTimezone, setSelectedTimezone] = useState<string>('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [workflowMode, setWorkflowMode] = useState<'fresh_start' | 'carry_over'>('carry_over');
  const [isLoadingWorkflowMode, setIsLoadingWorkflowMode] = useState(true);

  const {
    preferences,
    isLoading,
    loadPreferences,
    updatePreferences,
  } = useUserPreferencesStore();

  const { session, clearSession } = useAuthStore();

  // Get user email from session
  useEffect(() => {
    if (session?.user?.email) {
      setUserEmail(session.user.email);
    }
  }, [session]);

  // Get system timezone on mount
  useEffect(() => {
    const systemTimezone = Localization.getLocales()[0]?.timeZone || 
                           Intl.DateTimeFormat().resolvedOptions().timeZone || 
                           'UTC';
    setSelectedTimezone(systemTimezone);
  }, []);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
    loadWorkflowMode();
  }, [loadPreferences]);

  // Update selected time when preferences are loaded
  useEffect(() => {
    if (preferences?.delivery_time) {
      // Parse TIME string (HH:mm:ss) to Date
      const [hours, minutes] = preferences.delivery_time.split(':').map(Number);
      const time = new Date();
      time.setHours(hours, minutes || 0, 0, 0);
      setSelectedTime(time);
    }
    if (preferences?.timezone) {
      setSelectedTimezone(preferences.timezone);
    }
  }, [preferences]);

  // Load workflow mode from database
  const loadWorkflowMode = async () => {
    try {
      setIsLoadingWorkflowMode(true);
      const currentSession = useAuthStore.getState().session;
      if (!currentSession?.user?.id) {
        setIsLoadingWorkflowMode(false);
        return;
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('workflow_mode')
        .eq('auth_id', currentSession.user.id)
        .maybeSingle();

      if (error) {
        if (__DEV__) {
          console.error('Error loading workflow mode:', error);
        }
        setIsLoadingWorkflowMode(false);
        return;
      }

      if (user?.workflow_mode) {
        setWorkflowMode(user.workflow_mode as 'fresh_start' | 'carry_over');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading workflow mode:', error);
      }
    } finally {
      setIsLoadingWorkflowMode(false);
    }
  };

  // Handle workflow mode toggle
  const handleWorkflowModeToggle = async (value: boolean) => {
    // value = true means "carry-over", false means "fresh-start"
    const previousMode = workflowMode; // Store previous value for rollback
    const newMode: 'fresh_start' | 'carry_over' = value ? 'carry_over' : 'fresh_start';
    setWorkflowMode(newMode); // Optimistically update UI

    try {
      const currentSession = useAuthStore.getState().session;
      if (!currentSession?.user?.id) {
        Alert.alert('Error', 'No authenticated session found.');
        setWorkflowMode(previousMode); // Revert on error
        return;
      }

      // Get user id
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', currentSession.user.id)
        .maybeSingle();

      if (userError || !user) {
        if (__DEV__) {
          console.error('Error getting user for workflow mode update:', userError);
        }
        Alert.alert('Error', 'Failed to update workflow mode.');
        setWorkflowMode(previousMode); // Revert on error
        return;
      }

      // Update workflow mode in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ workflow_mode: newMode })
        .eq('id', user.id);

      if (updateError) {
        if (__DEV__) {
          console.error('Error updating workflow mode:', updateError);
        }
        Alert.alert('Error', 'Failed to update workflow mode.');
        setWorkflowMode(previousMode); // Revert on error
        return;
      }

      if (__DEV__) {
        console.log('✅ Workflow mode updated to:', newMode);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error toggling workflow mode:', error);
      }
      Alert.alert('Error', 'Failed to update workflow mode.');
      setWorkflowMode(previousMode); // Revert on error
    }
  };

  // Format time for display (12-hour format)
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  // Convert Date to TIME format (HH:mm:ss) for database
  const formatTimeForDatabase = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}:00`;
  };

  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (date) {
      setSelectedTime(date);
    }
    if (Platform.OS === 'android' && event.type === 'dismissed') {
      setShowTimePicker(false);
    }
  };

  // HTML escaping function to prevent XSS
  const escapeHTML = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const handleSendTestEmail = async () => {
    try {
      setIsSendingEmail(true);

      // Get current user session
      const currentSession = useAuthStore.getState().session;
      if (!currentSession?.user?.id) {
        Alert.alert('Error', 'No authenticated session found. Please sign in.');
        setIsSendingEmail(false);
        return;
      }

      // Get user_id from users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('auth_id', currentSession.user.id)
        .maybeSingle();

      // If user doesn't exist, create it (should be handled by trigger, but fallback here)
      let userId: number;
      if (userError?.code === 'PGRST116' || !user) {
        // PGRST116 = no rows returned, user doesn't exist yet
        if (__DEV__) {
          console.log('⚠️ User record not found in SettingsScreen, creating one...');
        }
        
        // Create user record
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([
            {
              auth_id: currentSession.user.id,
              email: currentSession.user.email || '',
              // Other fields use defaults from schema
            },
          ])
          .select('id')
          .single();

        if (createError || !newUser) {
          Alert.alert(
            'Error',
            `Failed to create user record: ${createError?.message || 'Unknown error'}`
          );
          setIsSendingEmail(false);
          return;
        }
        
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
          // Cohort assignment failure should not block email sending
          if (__DEV__) {
            console.error('Failed to assign cohort:', error);
          }
        }
      } else if (userError) {
        Alert.alert(
          'Error',
          `User query error: ${userError.message}`
        );
        setIsSendingEmail(false);
        return;
      } else {
        userId = user.id;
      }

      // Get email (use session email as fallback if user record doesn't have it)
      const email = user?.email || currentSession.user.email || '';

      // Query tasks - only include open tasks (exclude completed, archived, deleted)
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'open') // Only open tasks (excludes 'completed' and 'archived')
        .is('deleted_at', null) // Exclude soft-deleted tasks
        .is('archived_at', null) // Explicitly exclude archived tasks
        .is('completed_at', null) // Explicitly exclude completed tasks
        .order('created_at', { ascending: true }); // Match email order (oldest first)

      if (tasksError) {
        Alert.alert('Error', `Failed to load tasks: ${tasksError.message}`);
        setIsSendingEmail(false);
        return;
      }

      // Check if tasks exist
      if (!tasks || tasks.length === 0) {
        Alert.alert(
          'No Tasks',
          'No tasks to send. Add some tasks first!',
          [{ text: 'OK' }]
        );
        setIsSendingEmail(false);
        return;
      }

      // Generate task list HTML
      const taskListHTML = tasks
        .map(
          (task) =>
            `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHTML(task.text)}</li>`
        )
        .join('');

      // Generate full email HTML using template structure
      const emailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Daily Tasks</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; line-height: 1.6; color: #333; background-color: #FFFFFF;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; background-color: #FFFFFF;">
    <tr>
      <td style="padding: 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse;">
          <!-- Header Section -->
          <tr>
            <td style="padding: 20px; text-align: left;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #333;">Good morning! ☀️</h2>
            </td>
          </tr>
          
          <!-- Task List Section -->
          <tr>
            <td style="padding: 0 20px 20px 20px;">
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${taskListHTML}
              </ul>
            </td>
          </tr>
          
          <!-- Footer Section -->
          <tr>
            <td style="padding: 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; font-size: 12px; color: #999;">Open TodoTomorrow to manage your tasks</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      // Generate subject line
      const taskCount = tasks.length;
      const subject = `Your ${taskCount} Todo${taskCount !== 1 ? 's' : ''} for Today`;

      // Call Edge Function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: subject,
          html: emailHTML,
        },
      });

      if (error) {
        Alert.alert(
          'Error',
          `Failed to send email: ${error.message || 'Unknown error'}`
        );
        setIsSendingEmail(false);
        return;
      }

      // Check if response indicates success
      if (data?.error) {
        Alert.alert(
          'Error',
          `Email sending failed: ${data.error}${data.details ? ` - ${data.details}` : ''}`
        );
        setIsSendingEmail(false);
        return;
      }

      // Success!
      Alert.alert(
        'Success',
        'Email sent successfully! Check your inbox.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      if (__DEV__) {
        console.error('Error sending test email:', error);
      }
      Alert.alert(
        'Error',
        error?.message || 'Failed to send email. Please try again.'
      );
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const deliveryTime = formatTimeForDatabase(selectedTime);
      await updatePreferences(deliveryTime, selectedTimezone);
      
      // Show confirmation
      Alert.alert(
        'Success',
        'Preferences saved successfully',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error: any) {
      if (__DEV__) {
        console.error('Error saving preferences:', error);
      }
      Alert.alert(
        'Error',
        error?.message || 'Failed to save preferences. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase (clears AsyncStorage automatically)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (__DEV__) {
          console.error('Error signing out:', error);
        }
        Alert.alert('Error', 'Failed to sign out. Please try again.');
        return;
      }
      
      // Clear session from Zustand store
      clearSession();
      
      if (__DEV__) {
        console.log('✅ Successfully signed out');
      }
      
      // Navigation back to AuthScreen happens automatically via App.tsx session check
    } catch (error: any) {
      if (__DEV__) {
        console.error('Error during sign out:', error);
      }
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  // Helper component for section header
  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  // Helper component for cell row
  const CellRow = ({
    label,
    value,
    valueColor,
    showDisclosure,
    onPress,
    children,
    isLast = false,
  }: {
    label?: string;
    value?: string;
    valueColor?: string;
    showDisclosure?: boolean;
    onPress?: () => void;
    children?: React.ReactNode;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.cell, !isLast && styles.cellBorder]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.cellContent}>
        {label && <Text style={styles.cellLabel}>{label}</Text>}
        {children || (value && (
          <Text style={[styles.cellValue, valueColor && { color: valueColor }]}>
            {value}
          </Text>
        ))}
      </View>
      {showDisclosure && <Text style={styles.disclosureIndicator}>›</Text>}
    </TouchableOpacity>
  );

  // Helper component for grouped section
  const GroupedSection = ({
    children,
  }: {
    children: React.ReactNode;
  }) => (
    <View style={styles.groupedSection}>{children}</View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Status bar spacing for Android */}
        {Platform.OS === 'android' && StatusBar.currentHeight && (
          <View style={{ height: StatusBar.currentHeight }} />
        )}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status bar spacing for Android */}
      {Platform.OS === 'android' && StatusBar.currentHeight && (
        <View style={{ height: StatusBar.currentHeight }} />
      )}
      {/* Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ACCOUNT Section */}
        {userEmail && (
          <>
            <SectionHeader title="ACCOUNT" />
            <GroupedSection>
              <CellRow
                label={userEmail}
                showDisclosure={true}
                isLast={true}
              />
            </GroupedSection>
          </>
        )}

        {/* DELIVERY Section */}
        <SectionHeader title="DELIVERY" />
        <GroupedSection>
          <CellRow
            label="Morning Time"
            value={formatTime(selectedTime)}
            valueColor={colors.primary}
            showDisclosure={true}
            onPress={() => setShowTimePicker(true)}
            isLast={!selectedTimezone}
          />
          {selectedTimezone && (
            <CellRow
              label="Timezone"
              value={selectedTimezone}
              valueColor={colors.textSecondary}
              isLast={true}
            />
          )}
        </GroupedSection>

        {/* WORKFLOW Section */}
        <SectionHeader title="WORKFLOW" />
        <GroupedSection>
          <View style={styles.cell}>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Mode</Text>
              <View style={styles.workflowModeContainer}>
                <Text style={styles.workflowModeValue}>
                  {workflowMode === 'fresh_start' ? 'Fresh Start' : 'Carry Over'}
                </Text>
                <Switch
                  value={workflowMode === 'carry_over'}
                  onValueChange={handleWorkflowModeToggle}
                  trackColor={{ false: colors.separator, true: colors.primary }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.separator}
                  style={styles.workflowSwitch}
                />
              </View>
            </View>
          </View>
        </GroupedSection>

        {/* Time Picker (iOS) */}
        {showTimePicker && (
          <View style={styles.timePickerContainer}>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* TEST EMAIL Section */}
        <SectionHeader title="TEST EMAIL" />
        <GroupedSection>
          <TouchableOpacity
            style={[styles.cell, styles.cellBorder, styles.testEmailCell]}
            onPress={handleSendTestEmail}
            disabled={isSendingEmail}
            activeOpacity={0.7}
          >
            {isSendingEmail ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.testEmailCellText}>Send Test Email</Text>
            )}
          </TouchableOpacity>
        </GroupedSection>

        {/* Save Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    ...colors.shadowSm,
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  backButtonContainer: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButton: {
    ...typography.bodyLarge,
    color: colors.primary,
    fontWeight: '400',
  },
  title: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.md,
  },
  sectionHeaderText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupedSection: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.xl,
    borderRadius: spacing.radiusMd,
    overflow: 'hidden',
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
  },
  cellBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  cellContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cellLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  cellValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  disclosureIndicator: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
  timePickerContainer: {
    backgroundColor: colors.background,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: spacing.radiusMd,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginHorizontal: spacing.xl,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    ...typography.bodyLarge,
    color: colors.background,
    fontWeight: '600',
  },
  testEmailCell: {
    justifyContent: 'center',
  },
  testEmailCellText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['3xl'],
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...typography.bodyLarge,
    color: colors.background,
    fontWeight: '600',
  },
  signOutContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['3xl'],
  },
  signOutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingVertical: spacing.lg,
  },
  signOutButtonText: {
    ...typography.body,
    color: colors.destructive,
    fontWeight: '400',
  },
  workflowModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  workflowModeValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  workflowSwitch: {
    marginLeft: spacing.sm,
  },
});