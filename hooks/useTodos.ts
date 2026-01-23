'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Todo, Priority, FilterType } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'taskflow-missions';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage - set loaded immediately
  useEffect(() => {
    // Set loaded first to prevent blocking
    setIsLoaded(true);
    
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Migrate old todos
          const migrated = parsed.map((t: Todo) => ({
            ...t,
            reminderTime: t.reminderTime ?? null,
            reminderSent: t.reminderSent ?? false,
          }));
          setTodos(migrated);
        }
      }
    } catch (e) {
      console.error('Failed to load todos:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      } catch (e) {
        console.error('Failed to save todos:', e);
      }
    }
  }, [todos, isLoaded]);

  // Memoized filtered todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = useCallback((text: string, priority: Priority, dueDate: string | null, reminderTime: string | null = null) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      dueDate,
      reminderTime,
      reminderSent: false,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  const editTodo = useCallback((id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const markReminderSent = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, reminderSent: true } : t))
    );
  }, []);

  const reorderTodos = useCallback((newTodos: Todo[]) => {
    setTodos(newTodos);
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const completeAll = useCallback(() => {
    const allCompleted = todos.every(t => t.completed);
    setTodos((prev) => prev.map((t) => ({ ...t, completed: !allCompleted })));
  }, [todos]);

  return {
    todos,
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    markReminderSent,
    reorderTodos,
    clearCompleted,
    completeAll,
    isLoaded,
  };
}
