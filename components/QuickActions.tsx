'use client';

import { memo } from 'react';
import { Trash2, CheckCircle, RotateCcw } from 'lucide-react';
import { Todo } from '@/types';

interface QuickActionsProps {
  todos: Todo[];
  onClearCompleted: () => void;
  onCompleteAll: () => void;
}

export const QuickActions = memo(function QuickActions({ 
  todos, 
  onClearCompleted, 
  onCompleteAll 
}: QuickActionsProps) {
  const hasCompleted = todos.some(t => t.completed);
  const hasActive = todos.some(t => !t.completed);
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);

  if (todos.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {hasActive && (
        <button
          onClick={onCompleteAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20 border border-[var(--accent)]/20 transition-all"
        >
          <CheckCircle className="w-3.5 h-3.5" />
          {allCompleted ? 'Reset All' : 'Complete All'}
        </button>
      )}
      
      {hasCompleted && (
        <button
          onClick={onClearCompleted}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/20 border border-[var(--accent-danger)]/20 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Done
        </button>
      )}
    </div>
  );
});
