import { Todo } from '@/types';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  
  if (date.getTime() === today.getTime()) {
    return 'TODAY';
  }
  if (date.getTime() === tomorrow.getTime()) {
    return 'TMR';
  }
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export function isOverdue(dateString: string | null): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

export function formatReminderTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 0) return 'PAST';
  if (diffMins < 1) return 'NOW';
  if (diffMins < 60) return `${diffMins}m`;
  
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d`;
}

export function calculateStats(todos: Todo[]) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { total, completed, active, percentage };
}

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_THEME: 'KeyT',
  FILTER_ALL: 'Digit1',
  FILTER_ACTIVE: 'Digit2',
  FILTER_COMPLETED: 'Digit3',
};
