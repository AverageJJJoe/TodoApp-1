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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Localization from 'expo-localization';
import { useUserPreferencesStore } from '../stores/userPreferencesStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

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

  const {
    preferences,
    isLoading,
    loadPreferences,
    updatePreferences,
  } = useUserPreferencesStore();

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
      const session = useAuthStore.getState().session;
      if (!session?.user?.id) {
        Alert.alert('Error', 'No authenticated session found. Please sign in.');
        setIsSendingEmail(false);
        return;
      }

      // Get user_id from users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('auth_id', session.user.id)
        .single();

      if (userError || !user) {
        Alert.alert(
          'Error',
          `User not found: ${userError?.message || 'No user record'}`
        );
        setIsSendingEmail(false);
        return;
      }

      const userId = user.id;
      const userEmail = user.email;

      // Query tasks
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

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
          to: userEmail,
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Delivery Time</Text>
          <Text style={styles.sectionDescription}>
            Choose what time you want to receive your daily email
          </Text>

          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timePickerButtonText}>
              {formatTime(selectedTime)}
            </Text>
            <Text style={styles.changeTimeText}>Tap to change</Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
            />
          )}

          {Platform.OS === 'ios' && showTimePicker && (
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timezone</Text>
          <Text style={styles.timezoneText}>{selectedTimezone}</Text>
          <Text style={styles.timezoneHint}>
            Using your device's system timezone
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Email</Text>
          <Text style={styles.sectionDescription}>
            Send a test email with your current tasks
          </Text>
          <TouchableOpacity
            style={[
              styles.testEmailButton,
              isSendingEmail && styles.testEmailButtonDisabled,
            ]}
            onPress={handleSendTestEmail}
            disabled={isSendingEmail}
          >
            {isSendingEmail ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.testEmailButtonText}>Send Test Email</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  backButton: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  timePickerButton: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  timePickerButtonText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 4,
  },
  changeTimeText: {
    fontSize: 12,
    color: '#888',
  },
  doneButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timezoneText: {
    fontSize: 18,
    color: '#000',
    marginTop: 8,
    fontWeight: '500',
  },
  timezoneHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  footer: {
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testEmailButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 12,
  },
  testEmailButtonDisabled: {
    opacity: 0.6,
  },
  testEmailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

