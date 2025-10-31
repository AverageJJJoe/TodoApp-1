# Offline-First Sync Architecture

## Overview

TodoTomorrow must work completely offline. Users can add tasks, mark complete, and see full history without internet. Sync happens automatically when connection restores.

## Data Flow Diagram

```
LOCAL (AsyncStorage)          REMOTE (Supabase)
┌─────────────────────────────────────────────┐
│ ┌──────────────────┐                         │
│ │ Local Tasks List │────(optimistic)─────┐  │
│ │ (AsyncStorage)   │                     │  │
│ │                  │                     ▼  │
│ │ [               ]    ┌────────────────────┐ │
│ │ [TASK 1]        │    │  Supabase Tasks   │ │
│ │ [TASK 2]        │    │  (PostgreSQL)     │ │
│ │ [TASK 3 NEW]    │◄───┤                  │ │
│ └──────────────────┘    └────────────────────┘ │
│         │                                      │
│         │ (user offline)                       │
│         │ store locally                        │
│         │                                      │
│    ┌────▼──────────────────┐                  │
│    │ Sync Queue            │                  │
│    │ [                     ]│                  │
│    │ - CREATE task_3       │                  │
│    │ - UPDATE task_1 done  │                  │
│    │ - DELETE task_2       │                  │
│    └────┬──────────────────┘                  │
│         │                                      │
│    (internet restored)                        │
│         │                                      │
│         ▼                                      │
│    ┌─────────────────┐                        │
│    │ Apply sync queue│                        │
│    │ to Supabase     │                        │
│    │ (batch/single)  │                        │
│    └─────────────────┘                        │
└─────────────────────────────────────────────┘
```

## AsyncStorage Data Structure

Store offline data exactly matching Supabase schema. Example:

```typescript
// Store in AsyncStorage:
{
  "tasks": [
    {
      "id": "uuid-1",
      "text": "Buy groceries",
      "priority": "high",
      "due_date": "2025-10-31",
      "status": "open",
      "created_at": "2025-10-30T22:15:00Z",
      "updated_at": "2025-10-30T22:15:00Z",
      "synced": false  // Flag: not yet sent to server
    },
    {
      "id": "uuid-2",
      "text": "Review proposal",
      "priority": "medium",
      "due_date": null,
      "status": "completed",
      "created_at": "2025-10-29T18:00:00Z",
      "updated_at": "2025-10-30T21:30:00Z",
      "completed_at": "2025-10-30T21:30:00Z",
      "synced": true  // Already sent to server
    }
  ],
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "delivery_time": "06:00:00",
    "timezone": "America/New_York",
    "workflow_mode": "fresh_start",
    "trial_started_at": "2025-10-25T00:00:00Z",
    "trial_tasks_count": 5,
    "is_paid": false
  },
  "syncMetadata": {
    "lastSyncAt": "2025-10-30T22:00:00Z",
    "pendingCount": 3,
    "isOnline": false
  }
}
```

## Zustand Store Architecture

```typescript
// store/taskStore.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Task {
  id: string
  text: string
  priority?: 'high' | 'medium' | 'low'
  due_date?: string
  status: 'open' | 'completed'
  created_at: string
  updated_at: string
  completed_at?: string
  synced: boolean
}

interface SyncQueue {
  operation: 'CREATE' | 'UPDATE' | 'DELETE'
  taskId: string
  taskData?: Task
  timestamp: number
}

interface TaskStore {
  // State
  tasks: Task[]
  syncQueue: SyncQueue[]
  isOnline: boolean
  isSyncing: boolean
  
  // Local operations (immediate)
  addTask: (text: string, priority?: string) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  completeTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  
  // Sync operations
  syncWithServer: () => Promise<void>
  setOnlineStatus: (online: boolean) => void
  
  // Initialization
  loadFromStorage: () => Promise<void>
  saveToStorage: () => Promise<void>
}

export const useTaskStore = create<TaskStore>()(
  subscribeWithSelector((set, get) => ({
    tasks: [],
    syncQueue: [],
    isOnline: true,
    isSyncing: false,

    addTask: async (text: string, priority?: string) => {
      const { tasks } = get()
      const newTask: Task = {
        id: generateUUID(),
        text,
        priority: priority as any,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced: false
      }

      // Optimistic update: add to local state immediately
      set((state) => ({
        tasks: [...state.tasks, newTask],
        syncQueue: [
          ...state.syncQueue,
          {
            operation: 'CREATE',
            taskId: newTask.id,
            taskData: newTask,
            timestamp: Date.now()
          }
        ]
      }))

      // Persist to AsyncStorage
      await get().saveToStorage()

      // Auto-sync if online
      if (get().isOnline) {
        await get().syncWithServer()
      }
    },

    completeTask: async (id: string) => {
      const { tasks } = get()
      const task = tasks.find((t) => t.id === id)

      if (!task) return

      const updated: Task = {
        ...task,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced: false
      }

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        syncQueue: [
          ...state.syncQueue,
          {
            operation: 'UPDATE',
            taskId: id,
            taskData: updated,
            timestamp: Date.now()
          }
        ]
      }))

      await get().saveToStorage()

      if (get().isOnline) {
        await get().syncWithServer()
      }
    },

    syncWithServer: async () => {
      const { syncQueue, isOnline, isSyncing } = get()

      if (!isOnline || isSyncing || syncQueue.length === 0) return

      set({ isSyncing: true })

      try {
        // Batch sync operations
        for (const item of syncQueue) {
          try {
            if (item.operation === 'CREATE') {
              await supabase.from('tasks').insert([item.taskData!])
            } else if (item.operation === 'UPDATE') {
              await supabase
                .from('tasks')
                .update(item.taskData!)
                .eq('id', item.taskId)
            } else if (item.operation === 'DELETE') {
              await supabase.from('tasks').delete().eq('id', item.taskId)
            }

            // Mark as synced
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === item.taskId ? { ...t, synced: true } : t
              ),
              syncQueue: state.syncQueue.filter((q) => q.taskId !== item.taskId)
            }))
          } catch (error) {
            console.error(`Failed to sync ${item.operation} for ${item.taskId}:`, error)
            // Keep in queue, retry next time
            break
          }
        }

        await get().saveToStorage()
      } finally {
        set({ isSyncing: false })
      }
    },

    setOnlineStatus: (online: boolean) => {
      set({ isOnline: online })
      if (online) {
        get().syncWithServer()
      }
    },

    saveToStorage: async () => {
      const { tasks, syncQueue } = get()
      try {
        await AsyncStorage.setItem(
          'tasks_store',
          JSON.stringify({ tasks, syncQueue, lastSyncAt: new Date().toISOString() })
        )
      } catch (error) {
        console.error('Failed to save to AsyncStorage:', error)
      }
    },

    loadFromStorage: async () => {
      try {
        const data = await AsyncStorage.getItem('tasks_store')
        if (data) {
          const { tasks, syncQueue } = JSON.parse(data)
          set({ tasks, syncQueue })
        }
      } catch (error) {
        console.error('Failed to load from AsyncStorage:', error)
      }
    }
  }))
)
```

## Conflict Resolution

**Strategy:** Last-Write-Wins (LWW)

For single-user apps, LWW is sufficient:
1. Client updates task locally (set `updated_at` to client timestamp)
2. Server receives sync, compares `updated_at` timestamps
3. If client `updated_at` > server `updated_at`, accept client version
4. Otherwise keep server version

If needed post-MVP, implement vector clocks for causal ordering.

## Online/Offline Detection

```typescript
// hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { useTaskStore } from '../store/taskStore'

export function useNetworkStatus() {
  const setOnlineStatus = useTaskStore((state) => state.setOnlineStatus)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable
      setOnlineStatus(isOnline)
    })

    return () => unsubscribe()
  }, [setOnlineStatus])
}
```

## Multi-Device Sync

**On first login on new device:**

```typescript
async function handleFirstLoginNewDevice(userId: string) {
  // User logs in on new device
  // 1. Fetch all tasks from Supabase
  const { data: remoteTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)

  // 2. Clear local AsyncStorage
  await AsyncStorage.removeItem('tasks_store')

  // 3. Load remote tasks as local source-of-truth
  set({ tasks: remoteTasks || [], syncQueue: [] })
  await get().saveToStorage()
}
```

---
