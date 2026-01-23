// Type definitions for the To-Do app

export type Priority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  reminderTime: string | null; // ISO datetime string for when to remind
  reminderSent: boolean; // Track if reminder was already sent
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  percentage: number;
}
