'use client';

import { memo } from 'react';
import { FilterType } from '@/types';

interface FilterTabsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'ALL' },
  { key: 'active', label: 'ACTIVE' },
  { key: 'completed', label: 'DONE' },
];

export const FilterTabs = memo(function FilterTabs({ filter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--foreground)]/5">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`relative px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
            filter === key
              ? 'bg-[var(--accent)] text-black'
              : 'text-[var(--foreground)]/50 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5'
          }`}
        >
          <span className="flex items-center gap-2">
            {label}
            <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
              filter === key
                ? 'bg-black/20'
                : 'bg-[var(--foreground)]/10'
            }`}>
              {counts[key]}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
});
