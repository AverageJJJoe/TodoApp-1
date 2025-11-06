import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  Animated,
  StatusBar,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore, Task } from '../stores/taskStore';
import { SettingsScreen } from './SettingsScreen';
import { TaskItem } from '../components/TaskItem';
import { useTheme, typography, spacing } from '../design-system';

export const MainScreen = () => {
  const { colors } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskInput, setEditTaskInput] = useState('');
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [fabPressed, setFabPressed] = useState(false);
  const [workflowMode, setWorkflowMode] = useState<'fresh_start' | 'carry_over'>('fresh_start');
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      height: 44, // Match Lovable: h-[44px]
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: spacing.lg, // Match Lovable: px-lg
      borderBottomWidth: 1,
      borderBottomColor: colors.separator, // Match Lovable: border-b border-separator
    },
    title: {
      ...typography.bodyLarge, // Match Lovable: text-body-large (NOT titleMedium)
      fontWeight: '600', // Match Lovable: font-semibold
      color: colors.textPrimary,
    },
    headerButton: {
      padding: spacing.sm, // Match Lovable: p-2
      marginHorizontal: -spacing.sm, // Match Lovable: -ml-2, -mr-2
      borderRadius: spacing.radiusLg, // Match Lovable: rounded-lg (for hover state)
    },
    headerIcon: {
      fontSize: 24, // Match Lovable: w-6 h-6
      color: colors.textPrimary,
      fontWeight: '400',
      lineHeight: 24,
    },
    tabBar: {
      flexDirection: 'row',
      height: 44, // Match iOS segmented control: h-[44px]
      borderTopWidth: 1,
      borderTopColor: colors.separator,
      backgroundColor: colors.background,
    },
    tabButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    tabButtonActive: {
      backgroundColor: colors.primary,
    },
    tabButtonText: {
      ...typography.body,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    tabButtonTextActive: {
      color: colors.primaryForeground, // White text on active tab
    },
    content: {
      flex: 1,
    },
    emptyListContainer: {
      flexGrow: 1,
      minHeight: '60%', // Match Lovable: min-h-[60vh]
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing['2xl'] as number, // Match Lovable: px-2xl
    },
    emptyStateContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyStateIconContainer: {
      marginBottom: spacing.lg, // Match Lovable spacing
    },
    emptyStateIcon: {
      fontSize: 48, // Match Lovable: w-12 h-12
      color: colors.textTertiary,
    },
    emptyStateLine1: {
      ...typography.bodyLarge,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    emptyStateLine2: {
      ...typography.bodyLarge,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    emptyStatePlus: {
      color: colors.primary,
      fontWeight: '600', // Match Lovable: font-semibold
    },
    fab: {
      position: 'absolute',
      bottom: 80, // Match Lovable: bottom-[80px]
      right: spacing.lg, // Match Lovable: right-lg
      width: 56, // Match Lovable: w-14 (14 * 4 = 56px)
      height: 56, // Match Lovable: h-14
      borderRadius: 28,
    },
    fabInner: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...colors.shadowFab, // Match Lovable: shadow-fab
    },
    fabText: {
      color: colors.background,
      fontSize: 28,
      fontWeight: '300',
      lineHeight: 32,
    },
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
      padding: 20,
      paddingBottom: 40,
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl, // 20px
    },
    modalTitle: {
      ...typography.titleMedium,
      fontSize: 20, // Override to 20px for modal title
      color: colors.textPrimary,
    },
    modalCloseButton: {
      fontSize: 24,
      color: colors.textSecondary,
      fontWeight: '300',
    },
    taskInput: {
      borderWidth: 1,
      borderColor: colors.separator,
      borderRadius: spacing.radiusSm,
      padding: spacing.lg, // 16px
      ...typography.bodyLarge,
      minHeight: 100,
      textAlignVertical: 'top',
      color: colors.textPrimary,
      marginBottom: spacing.xl, // 20px
    },
    addTaskButton: {
      backgroundColor: colors.primary,
      padding: spacing.lg, // 16px
      borderRadius: spacing.radiusSm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addTaskButtonDisabled: {
      opacity: 0.5,
    },
    addTaskButtonText: {
      color: colors.background,
      ...typography.bodyLarge,
      fontWeight: '600',
    },
    addTaskButtonTextDisabled: {
      color: colors.textTertiary,
    },
    taskList: {
      paddingTop: spacing.md, // Match Lovable: pt-md
      paddingHorizontal: spacing.lg, // Match Lovable: px-lg
      paddingBottom: spacing.md,
    },
    taskCardContainer: {
      marginBottom: 8, // Match Lovable: space-y-2 (8px gap)
    },
    taskCard: {
      backgroundColor: colors.card, // Match Lovable: bg-card
      borderRadius: spacing.radiusLg, // Match Lovable: rounded-lg
      overflow: 'hidden',
      ...colors.shadowSm, // Match Lovable: shadow-soft-sm
    },
    taskCardContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md, // Match Lovable: gap-md
      padding: spacing.lg, // Match Lovable: p-lg
    },
    checkboxContainer: {
      marginTop: 2, // Match Lovable: mt-[2px]
      flexShrink: 0,
    },
    checkbox: {
      width: 24, // Match Lovable: w-6
      height: 24, // Match Lovable: h-6
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.textTertiary, // Match Lovable: border-text-tertiary
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmark: {
      fontSize: 16,
      color: colors.background,
      fontWeight: 'bold',
    },
    taskContent: {
      flex: 1,
      minWidth: 0,
    },
    taskTextContainer: {
      position: 'relative',
    },
    taskText: {
      ...typography.bodyLarge,
      color: colors.textPrimary,
    },
    taskTextCompleted: {
      color: colors.separator, // Match archive design: #C6C6C8
      textDecorationLine: 'line-through',
    },
    strikethrough: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: '50%',
      height: 2,
      backgroundColor: colors.textTertiary,
      transformOrigin: 'left',
    },
    taskTimestamp: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: spacing.xs, // Match Lovable: mt-1
    },
    taskTimestampArchive: {
      ...typography.caption,
      color: colors.textTertiary,
      marginTop: spacing.xs, // Match Lovable: mt-1
    },
    archiveFooter: {
      padding: spacing.lg,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    archiveFooterText: {
      ...typography.caption,
      color: colors.textTertiary,
    },
    errorContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl, // 20px
    },
    errorText: {
      ...typography.bodyLarge,
      color: colors.destructive,
      textAlign: 'center',
      marginBottom: spacing.sm, // 8px
    },
    errorHint: {
      ...typography.body,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    deleteButton: {
      backgroundColor: colors.destructive,
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      height: '100%',
      borderRadius: spacing.radiusSm,
    },
    deleteButtonText: {
      color: colors.background,
      ...typography.bodyLarge,
      fontWeight: '600',
    },
  }), [colors]);
  
  // Empty state floating animation
  const emptyStateYAnim = useRef(new Animated.Value(0)).current;
  const emptyStateOpacityAnim1 = useRef(new Animated.Value(0)).current;
  const emptyStateOpacityAnim2 = useRef(new Animated.Value(0)).current;
  
  // FAB spring entrance animation
  const fabScaleAnim = useRef(new Animated.Value(0)).current;
  
  const session = useAuthStore((state) => state.session);
  
  // Select store values - split selectors to avoid infinite loops
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const isLoading = useTaskStore((state) => state.isLoading);
  const loadError = useTaskStore((state) => state.loadError);
  
  // Swipeable refs for closing swipe gesture after delete
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  // Load tasks and workflow mode on mount
  useEffect(() => {
    loadTasks();
    loadWorkflowMode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: loadTasks is stable Zustand action

  // Load workflow mode from database
  const loadWorkflowMode = async () => {
    try {
      const session = useAuthStore.getState().session;
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from('users')
        .select('workflow_mode')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (error) {
        if (__DEV__) {
          console.error('Error loading workflow mode:', error);
        }
        return;
      }

      if (data?.workflow_mode) {
        setWorkflowMode(data.workflow_mode as 'fresh_start' | 'carry_over');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading workflow mode:', error);
      }
    }
  };

  // Load completed/archived tasks when archive tab is active
  useEffect(() => {
    if (activeTab === 'archive') {
      if (workflowMode === 'carry_over') {
        loadCompletedTasks();
      } else if (workflowMode === 'fresh_start') {
        loadArchivedTasks();
      }
    }
  }, [workflowMode, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load completed tasks for archive view
  const loadCompletedTasks = async () => {
    try {
      const session = useAuthStore.getState().session;
      if (!session?.user?.id) return;

      // Get user id first
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (userError || !user) {
        if (__DEV__) {
          console.error('Error getting user for completed tasks:', userError);
        }
        return;
      }

      // Query completed tasks
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .is('deleted_at', null)
        .order('completed_at', { ascending: false });

      if (error) {
        if (__DEV__) {
          console.error('Error loading completed tasks:', error);
        }
        return;
      }

      if (data) {
        setCompletedTasks(data as Task[]);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading completed tasks:', error);
      }
    }
  };

  // Load archived tasks for archive view (Fresh Start mode)
  const loadArchivedTasks = async () => {
    try {
      const session = useAuthStore.getState().session;
      if (!session?.user?.id) return;

      // Get user id first
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (userError || !user) {
        if (__DEV__) {
          console.error('Error getting user for archived tasks:', userError);
        }
        return;
      }

      // Query archived tasks
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'archived')
        .is('deleted_at', null)
        .order('archived_at', { ascending: false });

      if (error) {
        if (__DEV__) {
          console.error('Error loading archived tasks:', error);
        }
        return;
      }

      if (data) {
        setArchivedTasks(data as Task[]);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading archived tasks:', error);
      }
    }
  };

  // Empty state floating animation - Match Lovable: y: [0, -4, 0], 3s ease-in-out infinite
  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(emptyStateYAnim, {
          toValue: -4,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(emptyStateYAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }
    ).start();
    
    // Staggered fade-in for text (match Lovable)
    Animated.parallel([
      Animated.timing(emptyStateOpacityAnim1, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(emptyStateOpacityAnim2, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [emptyStateYAnim, emptyStateOpacityAnim1, emptyStateOpacityAnim2]);

  // FAB spring entrance animation - Match Lovable: spring physics entrance
  useEffect(() => {
    Animated.spring(fabScaleAnim, {
      toValue: 1,
      tension: 260,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, [fabScaleAnim]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTasks();
      // If in archive tab, also refresh completed/archived tasks
      if (activeTab === 'archive') {
        if (workflowMode === 'carry_over') {
          await loadCompletedTasks();
        } else if (workflowMode === 'fresh_start') {
          await loadArchivedTasks();
        }
      }
    } catch (error) {
      // Error is already handled in loadTasks and set in loadError state
      if (__DEV__) {
        console.error('Error refreshing tasks:', error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddTask = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTaskInput('');
  };

  const handleSubmitTask = async () => {
    const trimmedText = taskInput.trim();
    if (!trimmedText) {
      return;
    }

    try {
      await addTask(trimmedText);
      // Success: task saved, close modal and clear input
      setTaskInput('');
      setIsModalVisible(false);
    } catch (error: any) {
      // Error: show error toast, task already removed from store
      if (__DEV__) {
        console.error('Error saving task:', error);
      }
      const errorMessage = error?.message || 'Failed to save task. Please try again.';
      Alert.alert(
        'Error',
        `Error saving task: ${errorMessage}`,
        [{ text: 'OK' }]
      );
    }
  };

  // Note: Task completion is handled by deleting completed tasks after animation
  // The actual status update would require a completeTask method in the store

  const handleDeleteTask = async (id: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel', onPress: () => {
          // Close swipe gesture on cancel
          swipeableRefs.current.get(id)?.close();
        }},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(id);
              // Success: Task already removed by optimistic update
              // Close swipe gesture
              swipeableRefs.current.get(id)?.close();
            } catch (error: any) {
              // Error: Task will be automatically restored by store's error handling
              if (__DEV__) {
                console.error('Error deleting task:', error);
              }
              Alert.alert(
                'Error',
                'Failed to delete task. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskInput(task.text);
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingTask(null);
    setEditTaskInput('');
  };

  const handleSaveTask = async () => {
    const trimmedText = editTaskInput.trim();
    if (!trimmedText) {
      return;
    }

    if (!editingTask || !editingTask.id) {
      return;
    }

    try {
      await updateTask(editingTask.id, trimmedText);
      // Success: task updated, close modal and clear state
      setIsEditModalVisible(false);
      setEditingTask(null);
      setEditTaskInput('');
    } catch (error: any) {
      // Error: show error alert, task text already reverted by store rollback
      if (__DEV__) {
        console.error('Error updating task:', error);
      }
      Alert.alert(
        'Error',
        'Failed to update task. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCompleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.status === 'completed') return;
    
    try {
      // Update task status to completed via Supabase
      const session = useAuthStore.getState().session;
      if (!session?.user?.id) {
        throw new Error('No authenticated session found');
      }

      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(), // Set completion timestamp
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      // Refresh tasks to reflect completion
      await loadTasks();
    } catch (error: any) {
      if (__DEV__) {
        console.error('Error completing task:', error);
      }
      Alert.alert('Error', 'Failed to complete task. Please try again.');
    }
  };

  const renderTaskItem = ({ item }: { item: Task; index: number }) => {
    const isArchiveMode = activeTab === 'archive';
    return (
      <TaskItem
        task={item}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
        onSwipeableRef={(ref) => {
          if (ref) {
            swipeableRefs.current.set(item.id, ref);
          }
        }}
        styles={styles}
        isArchive={isArchiveMode}
        workflowMode={workflowMode}
      />
    );
  };

  // Calculate stats for archive footer
  // Week starts on Monday (day 0 = Sunday, so Monday = day 1)
  const getArchiveStats = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    // Calculate Monday: if today is Sunday (0), go back 6 days; otherwise go back (day - 1) days
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday is start of week
    startOfWeek.setDate(now.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);
    
    const weekTasks = completedTasks.filter(task => {
      const completedAt = (task as any).completed_at;
      if (!completedAt) return false;
      const completedDate = new Date(completedAt);
      return completedDate >= startOfWeek && completedDate <= endOfWeek;
    });
    
    return weekTasks.length;
  };

  return (
    <View style={styles.container}>
      {/* Status bar spacing for Android */}
      {Platform.OS === 'android' && StatusBar.currentHeight && (
        <View style={{ height: StatusBar.currentHeight }} />
      )}
      {/* Header - Match Lovable: h-[44px], border separator, settings right */}
      <View style={styles.header}>
        <View style={styles.headerButton} />
        <Text style={styles.title}>TodoTomorrow</Text>
        <TouchableOpacity
          onPress={() => setIsSettingsVisible(true)}
          style={styles.headerButton}
          accessible={true}
          accessibilityLabel="Open settings"
          accessibilityRole="button"
        >
          <Text style={styles.headerIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Bar - Show for both Fresh Start and Carry Over modes */}
      <View style={styles.tabBar}>
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            style={[
              styles.tabButton,
              activeTab === 'active' && styles.tabButtonActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'active' && styles.tabButtonTextActive,
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('archive')}
            style={[
              styles.tabButton,
              activeTab === 'archive' && styles.tabButtonActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'archive' && styles.tabButtonTextActive,
              ]}
            >
              Archive
            </Text>
          </TouchableOpacity>
        </View>
      
      <View style={styles.content}>
        {isLoading && tasks.length === 0 && !refreshing ? (
          // Only show spinner on initial load when there are no tasks
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <FlatList
            data={
              activeTab === 'archive'
                ? workflowMode === 'fresh_start'
                  ? archivedTasks
                  : completedTasks // Carry Over: show completed tasks
                : tasks.filter((t) => t.status === 'open') // Active tab: only show open tasks
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => renderTaskItem({ item, index })}
            contentContainerStyle={
              ((activeTab === 'archive'
                ? workflowMode === 'fresh_start'
                  ? archivedTasks.length === 0
                  : completedTasks.length === 0
                : tasks.filter((t) => t.status === 'open').length === 0)
                && !isLoading)
                ? styles.emptyListContainer
                : styles.taskList
            }
            ListEmptyComponent={
              loadError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{loadError}</Text>
                  <Text style={styles.errorHint}>Pull down to retry</Text>
                </View>
              ) : activeTab === 'archive' ? (
                <View style={styles.emptyStateContainer}>
                  {/* Archive empty state */}
                  <Animated.Text 
                    style={[
                      styles.emptyStateLine1,
                      { opacity: emptyStateOpacityAnim1 },
                    ]}
                  >
                    {workflowMode === 'fresh_start'
                      ? 'No archived tasks yet! 📧'
                      : 'No completed tasks yet! 🎉'}
                  </Animated.Text>
                </View>
              ) : (
                <View style={styles.emptyStateContainer}>
                  {/* Match Lovable EmptyState: Moon icon with floating animation */}
                  <Animated.View 
                    style={[
                      styles.emptyStateIconContainer,
                      {
                        transform: [{ translateY: emptyStateYAnim }],
                      },
                    ]}
                  >
                    <Text style={styles.emptyStateIcon}>⚡</Text>
                  </Animated.View>
                  {/* Match Lovable text layout: Two separate lines with staggered fade-in */}
                  <Animated.Text 
                    style={[
                      styles.emptyStateLine1,
                      { opacity: emptyStateOpacityAnim1 },
                    ]}
                  >
                    Tap <Text style={styles.emptyStatePlus}>+</Text> to capture your first task
                  </Animated.Text>
                  <Animated.Text 
                    style={[
                      styles.emptyStateLine2,
                      { opacity: emptyStateOpacityAnim2 },
                    ]}
                  >
                    Add from anywhere - we'll deliver it tomorrow morning.
                  </Animated.Text>
                </View>
              )
            }
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            scrollEnabled={true}
            nestedScrollEnabled={false}
            alwaysBounceVertical={Platform.OS === 'ios'}
            ListFooterComponent={
              workflowMode === 'carry_over' && activeTab === 'archive' && completedTasks.length > 0 ? (
                <View style={styles.archiveFooter}>
                  <Text style={styles.archiveFooterText}>
                    📊 {getArchiveStats()} tasks this week
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>

      {/* Floating Action Button - Match Lovable: spring entrance, tap animation - Hidden on Archive tab */}
      {activeTab !== 'archive' && (
        <Animated.View
          style={[
            styles.fab,
            {
              transform: [{ scale: fabScaleAnim }],
            },
          ]}
        >
        <TouchableOpacity
          style={styles.fabInner}
          onPress={handleAddTask}
          onPressIn={() => {
            setFabPressed(true);
            Animated.timing(fabScaleAnim, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }).start();
          }}
          onPressOut={() => {
            setFabPressed(false);
            Animated.spring(fabScaleAnim, {
              toValue: 1,
              tension: 260,
              friction: 20,
              useNativeDriver: true,
            }).start();
          }}
          accessible={true}
          accessibilityLabel="Add task"
          accessibilityRole="button"
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Animated.View>
      )}

      {/* Bottom Sheet Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableOpacity
            style={styles.modalOverlayInner}
            activeOpacity={1}
            onPress={handleCloseModal}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Task</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Text style={styles.modalCloseButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.taskInput}
                placeholder="What needs to be done?"
                placeholderTextColor="#999"
                value={taskInput}
                onChangeText={setTaskInput}
                autoFocus={true}
                multiline={true}
              />
              <TouchableOpacity
                style={[
                  styles.addTaskButton,
                  !taskInput.trim() && styles.addTaskButtonDisabled,
                ]}
                onPress={handleSubmitTask}
                disabled={!taskInput.trim()}
              >
                <Text
                  style={[
                    styles.addTaskButtonText,
                    !taskInput.trim() && styles.addTaskButtonTextDisabled,
                  ]}
                >
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Edit Task Bottom Sheet Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseEditModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableOpacity
            style={styles.modalOverlayInner}
            activeOpacity={1}
            onPress={handleCloseEditModal}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Task</Text>
                <TouchableOpacity onPress={handleCloseEditModal}>
                  <Text style={styles.modalCloseButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.taskInput}
                placeholder="What needs to be done?"
                placeholderTextColor="#999"
                value={editTaskInput}
                onChangeText={setEditTaskInput}
                autoFocus={true}
                multiline={true}
              />
              <TouchableOpacity
                style={[
                  styles.addTaskButton,
                  (!editTaskInput.trim() || editTaskInput.trim() === editingTask?.text) && styles.addTaskButtonDisabled,
                ]}
                onPress={handleSaveTask}
                disabled={!editTaskInput.trim() || editTaskInput.trim() === editingTask?.text}
              >
                <Text
                  style={[
                    styles.addTaskButtonText,
                    (!editTaskInput.trim() || editTaskInput.trim() === editingTask?.text) && styles.addTaskButtonTextDisabled,
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={async () => {
          setIsSettingsVisible(false);
          // Reload workflow mode and tasks when settings closes (in case mode was changed)
          await loadWorkflowMode();
          await loadTasks();
        }}
      >
        <SettingsScreen onClose={async () => {
          setIsSettingsVisible(false);
          // Reload workflow mode and tasks when settings closes (in case mode was changed)
          await loadWorkflowMode();
          await loadTasks();
        }} />
      </Modal>
    </View>
  );
};

