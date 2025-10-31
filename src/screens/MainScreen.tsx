import React, { useState } from 'react';
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
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useTaskStore, Task } from '../stores/taskStore';

export const MainScreen = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);

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

  const handleSubmitTask = () => {
    const trimmedText = taskInput.trim();
    if (trimmedText) {
      addTask(trimmedText);
      setTaskInput('');
      setIsModalVisible(false);
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => {
    return (
      <View style={styles.taskItem}>
        <Text style={styles.taskText}>{item.text}</Text>
        <Text style={styles.taskTimestamp}>Just now</Text>
      </View>
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
        {tasks.length === 0 ? (
          <Text style={styles.emptyState}>🌅 Add your first task</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={renderTaskItem}
            contentContainerStyle={styles.taskList}
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
        <TouchableOpacity
          style={styles.modalOverlay}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
});

