'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { Todo } from '@/types';

export function useNotifications(
  todos: Todo[],
  onReminderSent: (id: string) => void
) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const processedRef = useRef<Set<string>>(new Set());

  // Check permission on mount (non-blocking)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request permission (user-triggered)
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied' as NotificationPermission;
    }
    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm;
  }, []);

  // Send a notification
  const sendNotification = useCallback((todo: Todo) => {
    // Prevent duplicate notifications
    if (processedRef.current.has(todo.id)) return;
    
    if (permission !== 'granted') {
      // Still mark as sent to avoid repeated attempts
      onReminderSent(todo.id);
      return;
    }

    try {
      const notification = new Notification('⏰ Task Reminder', {
        body: todo.text,
        icon: '/To_Do_App/favicon.ico',
        tag: todo.id,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (e) {
      console.error('Notification failed:', e);
    }

    processedRef.current.add(todo.id);
    onReminderSent(todo.id);
  }, [permission, onReminderSent]);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      todos.forEach((todo) => {
        if (
          todo.reminderTime &&
          !todo.reminderSent &&
          !todo.completed &&
          new Date(todo.reminderTime) <= now
        ) {
          sendNotification(todo);
        }
      });
    };

    // Check immediately
    checkReminders();

    // Then check every 15 seconds
    intervalRef.current = setInterval(checkReminders, 15000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [todos, sendNotification]);

  return {
    permission,
    requestPermission,
  };
}
