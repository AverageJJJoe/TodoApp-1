import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import {
  calculateWeeksSinceLaunch,
  assignCohort,
  getLaunchDate,
} from '../lib/cohortAssignment';

export interface Task {
  id: string;
  text: string;
  status: 'open' | 'completed' | 'archived';
  created_at: string; // ISO timestamp
  updated_at?: string; // ISO timestamp (optional, populated when task is updated)
  user_id?: string; // UUID from users table (optional, populated when saved to Supabase)
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  loadError: string | null;
  addTask: (text: string) => Promise<void>;
  loadTasks: () => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTask: (id: string, text: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  loadError: null,
  loadTasks: async () => {
    // Get session from auth store
    const session = useAuthStore.getState().session;
    
    if (!session?.user?.id) {
      set({ loadError: 'No authenticated session found' });
      return;
    }

    // Clear any previous errors
    set({ loadError: null, isLoading: true });

    try {
      // Get user_id from users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', session.user.id)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle missing records gracefully

      // If user doesn't exist, create it (should be handled by trigger, but fallback here)
      let userId: number;
      if (userError?.code === 'PGRST116' || !user) {
        // PGRST116 = no rows returned, user doesn't exist yet
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
          // Cohort assignment failure should not block task loading
          if (__DEV__) {
            console.error('Failed to assign cohort:', error);
          }
        }
      } else if (userError) {
        throw new Error(`User query error: ${userError.message}`);
      } else {
        userId = user.id;
      }

      // Query tasks from Supabase
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Update store state with tasks
      set({ tasks: data || [], isLoading: false });
    } catch (error: any) {
      set({
        loadError: error.message || 'Failed to load tasks',
        isLoading: false,
      });
    }
  },
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
        .maybeSingle(); // Use maybeSingle() instead of single() to handle missing records gracefully

      // If user doesn't exist, create it (should be handled by trigger, but fallback here)
      if (userError?.code === 'PGRST116' || !user) {
        // PGRST116 = no rows returned, user doesn't exist yet
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

        // Assign cohort after user creation (idempotency check: only if still default)
        try {
          const launchDate = getLaunchDate();
          if (launchDate) {
            const { data: currentUser, error: cohortCheckError } = await supabase
              .from('users')
              .select('cohort')
              .eq('id', user.id)
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
                .eq('id', user.id);

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
          // Cohort assignment failure should not block user creation
          if (__DEV__) {
            console.error('Failed to assign cohort:', error);
          }
        }
      } else if (userError) {
        throw new Error(`User query error: ${userError.message}`);
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
  deleteTask: async (id: string) => {
    // Store original task for rollback
    const taskToDelete = get().tasks.find((t) => t.id === id);
    
    if (!taskToDelete) {
      // Task not found, nothing to delete
      return;
    }

    // Optimistic update: Remove from local state immediately
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));

    try {
      // Get session and validate
      const session = useAuthStore.getState().session;
      if (!session?.user?.id) {
        throw new Error('No authenticated session found');
      }

      // Soft delete in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Success: Task already removed from local state
    } catch (error: any) {
      // Rollback: Restore task to list
      set((state) => ({
        tasks: [...state.tasks, taskToDelete].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
      }));
      throw error; // Re-throw for UI error handling
    }
  },
  updateTask: async (id: string, text: string) => {
    // Store original task for rollback
    const taskToUpdate = get().tasks.find((t) => t.id === id);
    
    if (!taskToUpdate) {
      throw new Error('Task not found');
    }

    const originalText = taskToUpdate.text;
    const originalUpdatedAt = taskToUpdate.updated_at || taskToUpdate.created_at;

    // Optimistic update: Update local state immediately
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, text, updated_at: new Date().toISOString() }
          : t
      ),
    }));

    try {
      // Get session and validate (for consistency, though RLS handles auth)
      const session = useAuthStore.getState().session;
      if (!session?.user?.id) {
        throw new Error('No authenticated session found');
      }

      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ 
          text: text, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Success: Task already updated in local state
    } catch (error: any) {
      // Rollback: Restore original text
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? { ...t, text: originalText, updated_at: originalUpdatedAt }
            : t
        ),
      }));
      throw error; // Re-throw for UI error handling
    }
  },
}));

