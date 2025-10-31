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

    // Get user_id from users table, create if doesn't exist
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', session.user.id)
      .single();

    // If user doesn't exist, create it (should be handled by trigger, but fallback here)
    if (userError || !user) {
      if (__DEV__) {
        console.log('⚠️ User record not found, creating one...');
      }
      
      // Create user record
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            auth_id: session.user.id,
            email: session.user.email || '',
            // Other fields use defaults from schema
          },
        ])
        .select('id')
        .single();

      if (createError || !newUser) {
        throw new Error(`Failed to create user record: ${createError?.message || 'Unknown error'}`);
      }

      user = newUser;
      if (__DEV__) {
        console.log('✅ User record created successfully');
      }
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

