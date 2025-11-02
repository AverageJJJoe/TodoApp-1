import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Task } from '../stores/taskStore';
import { colors, typography, spacing } from '../design-system';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete?: (id: string) => void; // Optional completion handler
  onSwipeableRef?: (ref: Swipeable | null) => void;
  styles: ReturnType<typeof StyleSheet.create>;
}

export const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onEdit, 
  onDelete,
  onComplete,
  onSwipeableRef,
  styles: componentStyles,
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

  const isTaskCompleted = isCompleted || task.status === 'completed';

  return (
    <Swipeable
      ref={onSwipeableRef || undefined}
      renderRightActions={renderRightActions}
    >
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
          onPress={() => !isCompleting && onEdit(task)}
          style={componentStyles.taskCard}
          disabled={isCompleting}
        >
          <View style={componentStyles.taskCardContent}>
            {/* Custom Checkbox - Match Lovable: w-6 h-6 rounded-full border-2 */}
            <TouchableOpacity
              style={componentStyles.checkboxContainer}
              onPress={handleComplete}
              disabled={isCompleting || isTaskCompleted}
            >
              <Animated.View 
                style={[
                  componentStyles.checkbox,
                  {
                    borderColor: checkboxBorderColor,
                    backgroundColor: checkboxBgColor,
                  },
                ]}
              >
                {/* Checkmark - Match Lovable animation */}
                {(isCompleting || isTaskCompleted) && (
                  <Animated.View
                    style={{
                      transform: [{ scale: checkmarkScaleAnim }],
                      opacity: checkmarkOpacityAnim,
                    }}
                  >
                    <Text style={componentStyles.checkmark}>✓</Text>
                  </Animated.View>
                )}
              </Animated.View>
            </TouchableOpacity>

            {/* Task Content */}
            <View style={componentStyles.taskContent}>
              <View style={componentStyles.taskTextContainer}>
                <Text 
                  style={[
                    componentStyles.taskText,
                    isTaskCompleted && componentStyles.taskTextCompleted,
                  ]}
                >
                  {task.text}
                </Text>
                {/* Strikethrough line - Match Lovable */}
                {isCompleting && (
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
              <Text style={componentStyles.taskTimestamp}>Just now</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
};

