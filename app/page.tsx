'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Terminal, Shield, Wifi, Bell } from 'lucide-react';
import {
  OperatorBackground,
  ThemeToggle,
  FilterTabs,
  ToastContainer,
  EmptyState,
  TodoInput,
  TodoList,
  StatsCard,
} from '@/components';
import { QuickActions } from '@/components/QuickActions';
import { useTodos } from '@/hooks/useTodos';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useNotifications } from '@/hooks/useNotifications';
import { Priority } from '@/types';

export default function Home() {
  const {
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
  } = useTodos();

  const { isDark, toggleTheme, isLoaded: themeLoaded } = useTheme();
  const { toasts, showToast, removeToast } = useToast();
  const [currentTime, setCurrentTime] = useState<string>('');

  // Notifications hook
  useNotifications(todos, (id) => {
    markReminderSent(id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      showToast(`⏰ Reminder: ${todo.text}`, 'info');
    }
  });

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Memoized counts for filters
  const counts = useMemo(() => ({
    all: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  // Count active reminders
  const activeReminders = useMemo(() => 
    todos.filter(t => t.reminderTime && !t.reminderSent && !t.completed).length,
  [todos]);

  const handleAddTodo = useCallback((text: string, priority: Priority, dueDate: string | null, reminderTime: string | null) => {
    addTodo(text, priority, dueDate, reminderTime);
    if (reminderTime) {
      showToast('Mission objective added with reminder ⏰', 'success');
    } else {
      showToast('Mission objective added', 'success');
    }
  }, [addTodo, showToast]);

  const handleDeleteTodo = useCallback((id: string) => {
    deleteTodo(id);
    showToast('Objective removed', 'info');
  }, [deleteTodo, showToast]);

  const handleToggleTodo = useCallback((id: string) => {
    const todo = todos.find((t) => t.id === id);
    toggleTodo(id);
    if (todo && !todo.completed) {
      showToast('Mission complete ✓', 'success');
    }
  }, [todos, toggleTodo, showToast]);

  const handleClearCompleted = useCallback(() => {
    clearCompleted();
    showToast('Completed missions cleared', 'info');
  }, [clearCompleted, showToast]);

  const handleCompleteAll = useCallback(() => {
    completeAll();
    showToast('All missions marked complete', 'success');
  }, [completeAll, showToast]);

  // Loading state
  if (!isLoaded || !themeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[var(--foreground)]/50">
            Initializing...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <OperatorBackground />
      
      <main className="relative min-h-screen py-6 px-4 sm:py-8 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <h1 className="text-lg font-bold uppercase tracking-wider text-[var(--foreground)]">
                  TaskFlow
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-[var(--foreground)]/40">
                  Command Center
                </p>
              </div>
            </div>

            {/* Right side - Status + Theme */}
            <div className="flex items-center gap-4">
              {/* Status indicators */}
              <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3 h-3 text-[var(--accent)]" />
                  <span className="text-[var(--foreground)]/50">ONLINE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-[var(--accent)]" />
                  <span className="text-[var(--foreground)]/50">SECURE</span>
                </div>
                {activeReminders > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3 h-3 text-[var(--accent-secondary)] animate-pulse" />
                    <span className="text-[var(--accent-secondary)]">{activeReminders} ALERT{activeReminders > 1 ? 'S' : ''}</span>
                  </div>
                )}
                <div className="px-2 py-1 rounded bg-[var(--foreground)]/5 text-[var(--accent)]">
                  {currentTime}
                </div>
              </div>

              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>
          </header>

          {/* Stats Card */}
          <StatsCard todos={todos} />

          {/* Input */}
          <TodoInput onAdd={handleAddTodo} />

          {/* Filters & Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <FilterTabs
              filter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />
            <QuickActions
              todos={todos}
              onClearCompleted={handleClearCompleted}
              onCompleteAll={handleCompleteAll}
            />
          </div>

          {/* Todo List or Empty State */}
          {filteredTodos.length > 0 ? (
            <TodoList
              todos={filteredTodos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onEdit={editTodo}
              onReorder={reorderTodos}
            />
          ) : (
            <EmptyState filter={filter} />
          )}

          {/* Footer */}
          <footer className="text-center pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--foreground)]/5 text-[10px] uppercase tracking-widest text-[var(--foreground)]/30">
              <span>System v1.0</span>
              <span>•</span>
              <span>{todos.length} objectives loaded</span>
              {activeReminders > 0 && (
                <>
                  <span>•</span>
                  <span className="text-[var(--accent-secondary)]">{activeReminders} reminders active</span>
                </>
              )}
            </div>
          </footer>
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
