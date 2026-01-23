'use client';

import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Calendar, Flag, Zap, Bell } from 'lucide-react';
import { Priority } from '@/types';

interface TodoInputProps {
  onAdd: (text: string, priority: Priority, dueDate: string | null, reminderTime: string | null) => void;
}

const priorities: { key: Priority; label: string; color: string }[] = [
  { key: 'low', label: 'LOW', color: 'text-[#00ff88]' },
  { key: 'medium', label: 'MED', color: 'text-[#ffaa00]' },
  { key: 'high', label: 'HIGH', color: 'text-[#ff3366]' },
];

export const TodoInput = memo(function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Ctrl+K to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = useCallback(() => {
    if (text.trim()) {
      onAdd(text.trim(), priority, dueDate || null, reminderTime || null);
      setText('');
      setDueDate('');
      setReminderTime('');
      setPriority('medium');
      setShowReminder(false);
    }
  }, [text, priority, dueDate, reminderTime, onAdd]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    // Quick priority shortcuts
    if (e.altKey) {
      if (e.key === '1') setPriority('low');
      if (e.key === '2') setPriority('medium');
      if (e.key === '3') setPriority('high');
    }
  }, [handleSubmit]);

  const cyclePriority = useCallback(() => {
    setPriority(prev => {
      if (prev === 'low') return 'medium';
      if (prev === 'medium') return 'high';
      return 'low';
    });
  }, []);

  return (
    <div className="space-y-2">
      {/* Main input */}
      <div className={`operator-card transition-all duration-200 ${isFocused ? 'glow-accent' : ''}`}>
        <div className="flex items-center gap-3 p-3">
          {/* Command icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-[var(--accent)]" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="New mission objective..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-[var(--foreground)]/30"
          />

          {/* Quick actions */}
          <div className="flex items-center gap-2">
            {/* Priority cycle button */}
            <button
              onClick={cyclePriority}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono ${
                priorities.find(p => p.key === priority)?.color
              } bg-[var(--foreground)]/5 hover:bg-[var(--foreground)]/10 transition-colors`}
              title="Click to cycle priority (Alt+1/2/3)"
            >
              <Flag className="w-3 h-3" />
              {priorities.find(p => p.key === priority)?.label}
            </button>

            {/* Date picker */}
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-8 h-8 opacity-0 absolute inset-0 cursor-pointer"
              />
              <div className={`w-8 h-8 rounded flex items-center justify-center ${
                dueDate ? 'bg-[var(--accent)]/20 text-[var(--accent)]' : 'bg-[var(--foreground)]/5 text-[var(--foreground)]/50'
              } hover:bg-[var(--foreground)]/10 transition-colors`}>
                <Calendar className="w-4 h-4" />
              </div>
            </div>

            {/* Reminder toggle */}
            <button
              onClick={() => setShowReminder(!showReminder)}
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                showReminder || reminderTime ? 'bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)]' : 'bg-[var(--foreground)]/5 text-[var(--foreground)]/50'
              } hover:bg-[var(--foreground)]/10`}
              title="Set reminder"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent)] text-black font-semibold text-xs uppercase tracking-wide disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--accent)]/90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Reminder time picker (expandable) */}
        {showReminder && (
          <div className="px-4 pb-3 pt-1 border-t border-[var(--border)]">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-[var(--accent-secondary)]" />
              <span className="text-xs text-[var(--foreground)]/60">Remind me at:</span>
              <input
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="flex-1 bg-[var(--foreground)]/5 border border-[var(--border)] rounded px-3 py-1.5 text-xs"
              />
              {reminderTime && (
                <button
                  onClick={() => setReminderTime('')}
                  className="text-xs text-[var(--accent-danger)] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Keyboard hint */}
        <div className="px-4 pb-2 flex items-center gap-4 text-[10px] text-[var(--foreground)]/30">
          <span className="flex items-center gap-1">
            <kbd>↵</kbd> Add
          </span>
          <span className="flex items-center gap-1">
            <kbd>Ctrl</kbd>+<kbd>K</kbd> Focus
          </span>
          <span className="flex items-center gap-1">
            <kbd>Alt</kbd>+<kbd>1-3</kbd> Priority
          </span>
        </div>
      </div>
    </div>
  );
});
