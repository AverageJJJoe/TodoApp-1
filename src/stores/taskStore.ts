import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';

export interface Task {
  id: string;
  text: string;
  status: 'open' | 'completed' | 'archived';
  created_at: string; // ISO timestamp
  user_id?: string; // UUID from users table (optional, populated when saved to Supabase)
}

interface TaskStore {
  tasks: Task[];
  addTask: (text: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  addTask: async (text: string) => {
    // Get session from auth store
    const session = useAuthStore.getState().session;
    
    if (!session?.user?.id) {
      throw new Error('No authenticated session found');
    }

    // Get user_id from users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', session.user.id)
      .single();

    if (userError || !user) {
      throw new Error(`User not found: ${userError?.message || 'No user record'}`);
    }

    const userId = user.id;

    // Create task optimistically (add to local state immediately)
    const localId = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 11);
    const newTask: Task = {
      id: localId,
      text,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    // Add to local state optimistically
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));

    // Attempt to save to Supabase
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: userId,
          text,
          status: 'open',
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      // Remove task from local state on failure
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== localId),
      }));
      throw error;
    }

    // Update task with server-generated ID and user_id if data is returned
    if (data && data.length > 0) {
      const createdTask = data[0];
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === localId
            ? { ...t, id: createdTask.id, user_id: createdTask.user_id }
            : t
        ),
      }));
    }
  },
}));

