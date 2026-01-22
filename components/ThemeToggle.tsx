'use client';

import { memo } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = memo(function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="w-10 h-10 rounded-lg bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 border border-[var(--border)] flex items-center justify-center transition-all group"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-[var(--accent)] group-hover:scale-110 transition-transform" />
      ) : (
        <Sun className="w-4 h-4 text-[var(--accent)] group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
});
