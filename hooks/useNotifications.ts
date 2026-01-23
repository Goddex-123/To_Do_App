'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Todo } from '@/types';

export function useNotifications(
  todos: Todo[],
  onReminderSent: (id: string) => void
) {
  const permissionRef = useRef<NotificationPermission>('default');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      permissionRef.current = Notification.permission;
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          permissionRef.current = permission;
        });
      }
    }
  }, []);

  // Send a notification
  const sendNotification = useCallback((title: string, body: string, todoId: string) => {
    if (permissionRef.current !== 'granted') return;

    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: todoId, // Prevents duplicate notifications
      requireInteraction: true, // Keep notification until user interacts
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Play a sound effect (optional)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2telezo0S6PL0N2EcVZQaYSQsL2yk3hsaHJ/joSEeHd0d3+KjIqHg395fYGGiYqJhoF+fIGHiouKh4J/fYGGiYqKh4N/fYGGiYqJhoJ/fYGGiYqJh4J/fYGGiYqJhoJ/fYGGiYqJh4J/fYGGiYqJhoJ/fYGGiYqJh4J/fYGGiYqJhoJ/fYGGiYqJh4J/fYGGiYqJhoJ/fYGGiYqJh4J/');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore if audio fails
    } catch {}

    onReminderSent(todoId);
  }, [onReminderSent]);

  // Check for due reminders every 10 seconds
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
          sendNotification(
            '⏰ Task Reminder',
            todo.text,
            todo.id
          );
        }
      });
    };

    // Check immediately
    checkReminders();

    // Then check every 10 seconds
    intervalRef.current = setInterval(checkReminders, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [todos, sendNotification]);

  // Request permission manually
  const requestPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      permissionRef.current = permission;
      return permission;
    }
    return 'denied' as NotificationPermission;
  }, []);

  return {
    permission: permissionRef.current,
    requestPermission,
    sendNotification,
  };
}
