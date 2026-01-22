'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'premium-todo-theme';

export function useTheme() {
  const [isDark, setIsDark] = useState(true); // Default to dark for operator theme
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const isLight = stored === '"light"' || stored === 'light';
        setIsDark(!isLight);
        if (isLight) {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      }
    } catch (e) {
      console.error('Failed to load theme:', e);
    }
    setIsLoaded(true);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
        if (next) {
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
        }
      } catch (e) {
        console.error('Failed to save theme:', e);
      }
      return next;
    });
  }, []);

  return { isDark, toggleTheme, isLoaded };
}
