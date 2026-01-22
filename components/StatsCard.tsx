'use client';

import { memo, useMemo } from 'react';
import { Activity, CheckCircle, Clock, AlertTriangle, Zap, Radio } from 'lucide-react';
import { Todo } from '@/types';

interface StatsCardProps {
  todos: Todo[];
}

export const StatsCard = memo(function StatsCard({ todos }: StatsCardProps) {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;
    const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = todos.filter(t => {
      if (!t.dueDate || t.completed) return false;
      return new Date(t.dueDate) < today;
    }).length;
    
    const dueToday = todos.filter(t => {
      if (!t.dueDate || t.completed) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      return due.getTime() === today.getTime();
    }).length;
    
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, active, highPriority, overdue, dueToday, completionRate };
  }, [todos]);

  return (
    <div className="operator-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="w-4 h-4 text-[var(--accent)]" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-slow" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider holo-text">
            Mission Status
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio className="w-3 h-3 text-[var(--accent)] animate-pulse-slow" />
          <span className="text-xs font-mono text-[var(--accent)]">LIVE</span>
        </div>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatItem 
          label="TOTAL" 
          value={stats.total} 
          icon={<Zap className="w-3.5 h-3.5" />}
        />
        <StatItem 
          label="ACTIVE" 
          value={stats.active} 
          icon={<Clock className="w-3.5 h-3.5" />}
          highlight={stats.active > 0}
        />
        <StatItem 
          label="DONE" 
          value={stats.completed} 
          icon={<CheckCircle className="w-3.5 h-3.5" />}
          success
        />
        <StatItem 
          label="URGENT" 
          value={stats.highPriority} 
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          danger={stats.highPriority > 0}
        />
      </div>

      {/* Progress bar with glow */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--foreground)]/60">Completion Rate</span>
          <span className="font-mono font-bold holo-text">{stats.completionRate}%</span>
        </div>
        <div className="h-2.5 bg-[var(--foreground)]/10 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-secondary)] to-[var(--accent)] transition-all duration-500 ease-out animate-progress-glow rounded-full"
            style={{ 
              width: `${stats.completionRate}%`,
              backgroundSize: '200% 100%',
            }}
          />
          {/* Shimmer overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
              transform: 'translateX(-100%)',
            }}
          />
        </div>
      </div>

      {/* Alerts row */}
      {(stats.overdue > 0 || stats.dueToday > 0) && (
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex gap-4">
          {stats.overdue > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-danger)] animate-pulse-slow" />
              <span className="text-[var(--accent-danger)] font-mono">{stats.overdue} OVERDUE</span>
            </div>
          )}
          {stats.dueToday > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-warning)]" />
              <span className="text-[var(--accent-warning)] font-mono">{stats.dueToday} DUE TODAY</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  highlight?: boolean;
  success?: boolean;
  danger?: boolean;
}

const StatItem = memo(function StatItem({ label, value, icon, highlight, success, danger }: StatItemProps) {
  let colorClass = 'text-[var(--foreground)]/60';
  if (success) colorClass = 'text-[var(--accent)]';
  if (danger) colorClass = 'text-[var(--accent-danger)]';
  if (highlight) colorClass = 'text-[var(--accent-secondary)]';

  return (
    <div className="text-center group">
      <div className={`flex justify-center mb-1 ${colorClass} transition-transform duration-200 group-hover:scale-110`}>
        {icon}
      </div>
      <div className={`text-2xl font-bold font-mono ${colorClass} ${danger ? 'animate-pulse-slow' : ''}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--foreground)]/40">
        {label}
      </div>
    </div>
  );
});
