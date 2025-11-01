import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore, Task } from '../stores/taskStore';

export const MainScreen = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskInput, setEditTaskInput] = useState('');
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  
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

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps: loadTasks is stable Zustand action

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTasks();
    } catch (error) {
      // Error is already handled in loadTasks and set in loadError state
      if (__DEV__) {
        console.error('Error refreshing tasks:', error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Sign out from Supabase (clears AsyncStorage automatically)
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        if (__DEV__) {
          console.error('Error signing out:', error);
        }
        Alert.alert('Error', 'Failed to sign out. Please try again.');
        setIsSigningOut(false);
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
      setIsSigningOut(false);
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

  const renderTaskItem = ({ item }: { item: Task }) => {
    const renderRightActions = () => {
      return (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable
        ref={(ref) => {
          if (ref) {
            swipeableRefs.current.set(item.id, ref);
          }
        }}
        renderRightActions={renderRightActions}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleEditTask(item)}
        >
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.text}</Text>
            <Text style={styles.taskTimestamp}>Just now</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TodoTomorrow</Text>
        {session?.user?.email && (
          <Text style={styles.email}>Signed in as: {session.user.email}</Text>
        )}
      </View>
      
      <View style={styles.content}>
        {isLoading && tasks.length === 0 && !refreshing ? (
          // Only show spinner on initial load when there are no tasks
          <ActivityIndicator size="large" color="#2563eb" />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskItem}
            contentContainerStyle={
              tasks.length === 0 && !isLoading
                ? styles.emptyListContainer
                : styles.taskList
            }
            ListEmptyComponent={
              loadError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{loadError}</Text>
                  <Text style={styles.errorHint}>Pull down to retry</Text>
                </View>
              ) : (
                <Text style={styles.emptyState}>🌅 Add your first task</Text>
              )
            }
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="#2563eb"
                colors={["#2563eb"]}
              />
            }
            scrollEnabled={true}
            nestedScrollEnabled={false}
            alwaysBounceVertical={Platform.OS === 'ios'}
          />
        )}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.signOutButton, isSigningOut && styles.signOutButtonDisabled]}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTask}
        accessible={true}
        accessibilityLabel="Add task"
        accessibilityRole="button"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

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
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    marginBottom: 40,
  },
  signOutButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  signOutButtonDisabled: {
    opacity: 0.6,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#fff',
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
    backgroundColor: '#fff',
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  taskInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#000',
    marginBottom: 20,
  },
  addTaskButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTaskButtonDisabled: {
    opacity: 0.5,
  },
  addTaskButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addTaskButtonTextDisabled: {
    color: '#ccc',
  },
  taskList: {
    paddingVertical: 10,
  },
  emptyListContainer: {
    flexGrow: 1,
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  taskItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  taskTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

