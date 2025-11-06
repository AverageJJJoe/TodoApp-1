import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Task } from '../stores/taskStore';
import { colors, typography, spacing } from '../design-system';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete?: (id: string) => void; // Optional completion handler
  onSwipeableRef?: (ref: Swipeable | null) => void;
  styles: ReturnType<typeof StyleSheet.create>;
  isArchive?: boolean; // Archive mode - tasks are read-only, show completed state
  workflowMode?: 'fresh_start' | 'carry_over'; // Workflow mode - checkbox only visible in carry_over
}

// Format archive/completion date for archive view
const formatArchiveDate = (timestamp: string | null, prefix: 'Archived' | 'Completed'): string => {
  if (!timestamp) return 'Just now';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins < 1 ? 'Just now' : `${prefix} ${diffMins}m ago`;
    }
    return `${prefix} ${diffHours}h ago`;
  } else if (diffDays === 1) {
    return `${prefix} yesterday`;
  } else if (diffDays < 7) {
    return `${prefix} ${diffDays}d ago`;
  } else {
    // Use short date format for older tasks
    const isCurrentYear = date.getFullYear() === now.getFullYear();
    return `${prefix} ${date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(isCurrentYear ? {} : { year: 'numeric' }),
    })}`;
  }
};

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onEdit, 
  onDelete,
  onComplete,
  onSwipeableRef,
  styles: componentStyles,
  isArchive = false,
  workflowMode,
}) => {
  // Animation values for completion sequence (600ms total)
  const checkboxBorderAnim = useRef(new Animated.Value(0)).current;
  const checkboxBgAnim = useRef(new Animated.Value(0)).current;
  const checkmarkScaleAnim = useRef(new Animated.Value(0)).current;
  const checkmarkOpacityAnim = useRef(new Animated.Value(0)).current;
  const strikethroughScaleAnim = useRef(new Animated.Value(0)).current;
  const cardOpacityAnim = useRef(new Animated.Value(1)).current;
  const cardTranslateYAnim = useRef(new Animated.Value(0)).current;
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.status === 'completed');

  const handleComplete = () => {
    if (isCompleting || isCompleted || task.status === 'completed') return;
    
    // Trigger haptic feedback immediately on tap (0ms)
    // Use notification style for more reliable feedback across devices
    try {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Use Success notification style for a clear, reliable vibration
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      // Fallback to impact style if notification fails
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (fallbackError) {
        // Silently fail if haptics aren't available (simulator, web, etc.)
        if (__DEV__) {
          console.log('Haptic feedback not available:', fallbackError);
        }
      }
    }
    
    setIsCompleting(true);
    
    // Phase 1: Checkbox fill (100ms)
    Animated.parallel([
      Animated.timing(checkboxBorderAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false, // Color animations don't support native driver
      }),
      Animated.timing(checkboxBgAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();

    // Phase 2: Checkmark appear (150ms, delay 100ms)
    Animated.parallel([
      Animated.timing(checkmarkScaleAnim, {
        toValue: 1,
        duration: 150,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(checkmarkOpacityAnim, {
        toValue: 1,
        duration: 150,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Phase 3: Strikethrough (200ms, delay 150ms)
    Animated.timing(strikethroughScaleAnim, {
      toValue: 1,
      duration: 200,
      delay: 150,
      useNativeDriver: true,
    }).start();

    // Phase 4: Fade out card (300ms, delay 300ms)
    Animated.parallel([
      Animated.timing(cardOpacityAnim, {
        toValue: 0,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateYAnim, {
        toValue: -20,
        duration: 300,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Remove task after animation completes (600ms total)
      setIsCompleted(true);
      // Call completion handler if provided (parent should handle store update)
      if (onComplete) {
        onComplete(task.id);
      }
    });
  };

  const checkboxBorderColor = checkboxBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.textTertiary, colors.primary],
  });

  const checkboxBgColor = checkboxBgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', colors.primary],
  });

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={componentStyles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Text style={componentStyles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const isTaskCompleted = isCompleted || task.status === 'completed' || isArchive;
  
  // In archive mode, always show completed state
  const archiveCheckboxStyle = isArchive
    ? {
        borderColor: colors.success,
        backgroundColor: colors.success,
      }
    : {};

  // Task content - same for both archive and active modes
  const taskContent = (
      <Animated.View 
        style={[
          componentStyles.taskCardContainer,
          {
            opacity: cardOpacityAnim,
            transform: [{ translateY: cardTranslateYAnim }],
          },
        ]}
      >
        {/* Task Card - Match Lovable: bg-card rounded-lg shadow-soft-sm */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => !isCompleting && !isArchive && onEdit(task)}
          style={componentStyles.taskCard}
          disabled={isCompleting || isArchive}
        >
          <View style={componentStyles.taskCardContent}>
            {/* Custom Checkbox - Match Lovable: w-6 h-6 rounded-full border-2 - Only show in carry_over mode */}
            {workflowMode === 'carry_over' && (
              <TouchableOpacity
                style={componentStyles.checkboxContainer}
                onPress={isArchive ? undefined : handleComplete}
                disabled={isCompleting || isTaskCompleted || isArchive}
              >
              <Animated.View 
                style={[
                  componentStyles.checkbox,
                  isArchive
                    ? archiveCheckboxStyle
                    : {
                        borderColor: checkboxBorderColor,
                        backgroundColor: checkboxBgColor,
                      },
                ]}
              >
                {/* Checkmark - Always show in archive mode, or during completion */}
                {(isArchive || isCompleting || isTaskCompleted) && (
                  <Animated.View
                    style={[
                      {
                        transform: [{ scale: isArchive ? 1 : checkmarkScaleAnim }],
                        opacity: isArchive ? 1 : checkmarkOpacityAnim,
                      },
                    ]}
                  >
                    <Text style={componentStyles.checkmark}>✓</Text>
                  </Animated.View>
                )}
              </Animated.View>
            </TouchableOpacity>
            )}

            {/* Task Content */}
            <View style={componentStyles.taskContent}>
              <View style={componentStyles.taskTextContainer}>
                <Text 
                  style={[
                    componentStyles.taskText,
                    (isTaskCompleted || isArchive) && componentStyles.taskTextCompleted,
                  ]}
                >
                  {task.text}
                </Text>
                {/* Strikethrough line - Match Lovable (only during completion animation, not in archive) */}
                {isCompleting && !isArchive && (
                  <Animated.View
                    style={[
                      componentStyles.strikethrough,
                      {
                        transform: [{ scaleX: strikethroughScaleAnim }],
                      },
                    ]}
                  />
                )}
              </View>
              {isArchive ? (
                <Text style={componentStyles.taskTimestampArchive}>
                  {formatArchiveDate(
                    (task as any).archived_at || (task as any).completed_at || null,
                    (task as any).archived_at ? 'Archived' : 'Completed'
                  )}
                </Text>
              ) : (
                <Text style={componentStyles.taskTimestamp}>Just now</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
  );

  // In archive mode, disable swipe-to-delete and wrap in plain View
  // In active mode, wrap in Swipeable for swipe-to-delete
  return isArchive ? (
    <View>{taskContent}</View>
  ) : (
    <Swipeable
      ref={onSwipeableRef || undefined}
      renderRightActions={renderRightActions}
    >
      {taskContent}
    </Swipeable>
  );
};

