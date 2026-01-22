'use client';

import { memo } from 'react';
import { Target, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  filter: 'all' | 'active' | 'completed';
}

const messages = {
  all: {
    title: 'NO ACTIVE MISSIONS',
    subtitle: 'Add your first objective to begin operations',
  },
  active: {
    title: 'ALL CLEAR',
    subtitle: 'All missions complete. Stand by for new orders.',
  },
  completed: {
    title: 'NO COMPLETED MISSIONS',
    subtitle: 'Complete tasks to see them here.',
  },
};

export const EmptyState = memo(function EmptyState({ filter }: EmptyStateProps) {
  const { title, subtitle } = messages[filter];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-[var(--accent)]/10 border border-[var(--border)] flex items-center justify-center">
          <Target className="w-8 h-8 text-[var(--accent)]" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-[var(--accent)]" />
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold uppercase tracking-wider text-[var(--foreground)]/80 mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--foreground)]/40 text-center max-w-xs">
        {subtitle}
      </p>

      {/* Decorative line */}
      <div className="mt-6 w-24 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
    </div>
  );
});
