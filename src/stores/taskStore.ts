import { create } from 'zustand';

export interface Task {
  id: string;
  text: string;
  status: 'open' | 'completed' | 'archived';
  created_at: string; // ISO timestamp
}

interface TaskStore {
  tasks: Task[];
  addTask: (text: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (text: string) => {
    const id = Date.now().toString() + '-' + Math.random().toString(36).substring(2, 11);
    const newTask: Task = {
      id,
      text,
      status: 'open',
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },
}));

