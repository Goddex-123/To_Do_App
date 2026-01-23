'use client';

import { memo, useState, useRef, useCallback } from 'react';
import { Check, Trash2, GripVertical, Calendar, Pencil, X, ChevronRight, Bell, BellOff } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types';
import { formatDate, isOverdue, formatReminderTime } from '@/lib/utils';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

export const TodoCard = memo(function TodoCard({ todo, onToggle, onDelete, onEdit }: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showReminderEdit, setShowReminderEdit] = useState(false);
  const [editReminder, setEditReminder] = useState(todo.reminderTime || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleSave = useCallback(() => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, { text: editText.trim() });
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  }, [editText, todo.text, todo.id, onEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  }, [handleSave, todo.text]);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleReminderSave = useCallback(() => {
    onEdit(todo.id, { 
      reminderTime: editReminder || null,
      reminderSent: false // Reset reminder sent status when updating
    });
    setShowReminderEdit(false);
  }, [editReminder, todo.id, onEdit]);

  const clearReminder = useCallback(() => {
    onEdit(todo.id, { reminderTime: null, reminderSent: false });
    setEditReminder('');
    setShowReminderEdit(false);
  }, [todo.id, onEdit]);

  const overdue = isOverdue(todo.dueDate) && !todo.completed;
  const hasActiveReminder = todo.reminderTime && !todo.reminderSent && !todo.completed;
  
  const priorityStyles = {
    high: 'badge-high',
    medium: 'badge-medium', 
    low: 'badge-low',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group operator-card transition-all duration-200 ${
        isDragging ? 'glow-accent scale-[1.02] z-50' : 'z-0'
      } ${todo.completed ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 p-1 text-[var(--foreground)]/30 hover:text-[var(--accent)] cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-[var(--accent)] border-[var(--accent)]'
              : 'border-[var(--foreground)]/30 hover:border-[var(--accent)]'
          }`}
        >
          {todo.completed && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
              <button onClick={handleSave} className="p-1 text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setEditText(todo.text); setIsEditing(false); }} className="p-1 text-[var(--foreground)]/50 hover:bg-[var(--foreground)]/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ChevronRight className={`w-3 h-3 flex-shrink-0 ${todo.completed ? 'text-[var(--accent)]' : 'text-[var(--foreground)]/30'}`} />
              <span
                className={`text-sm font-medium cursor-pointer ${
                  todo.completed ? 'line-through text-[var(--foreground)]/40' : ''
                }`}
                onDoubleClick={startEdit}
              >
                {todo.text}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2">
          <span className={`badge ${priorityStyles[todo.priority]}`}>
            {todo.priority}
          </span>
          
          {todo.dueDate && (
            <div className={`flex items-center gap-1 text-xs font-mono ${
              overdue ? 'text-[var(--accent-danger)]' : 'text-[var(--foreground)]/50'
            }`}>
              <Calendar className="w-3 h-3" />
              {formatDate(todo.dueDate)}
            </div>
          )}

          {/* Reminder indicator */}
          {hasActiveReminder && (
            <div className="flex items-center gap-1 text-xs font-mono text-[var(--accent-secondary)]">
              <Bell className="w-3 h-3 animate-pulse" />
              {formatReminderTime(todo.reminderTime!)}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Reminder button */}
          <button
            onClick={() => {
              setEditReminder(todo.reminderTime || '');
              setShowReminderEdit(!showReminderEdit);
            }}
            className={`p-1.5 rounded transition-colors ${
              hasActiveReminder 
                ? 'text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/10' 
                : 'text-[var(--foreground)]/50 hover:text-[var(--accent-secondary)] hover:bg-[var(--accent-secondary)]/10'
            }`}
            title={hasActiveReminder ? 'Edit reminder' : 'Set reminder'}
          >
            {hasActiveReminder ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={startEdit}
            className="p-1.5 text-[var(--foreground)]/50 hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-[var(--foreground)]/50 hover:text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/10 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reminder edit section */}
      {showReminderEdit && (
        <div className="px-4 pb-3 pt-1 border-t border-[var(--border)] flex items-center gap-3">
          <Bell className="w-4 h-4 text-[var(--accent-secondary)]" />
          <span className="text-xs text-[var(--foreground)]/60">Remind at:</span>
          <input
            type="datetime-local"
            value={editReminder}
            onChange={(e) => setEditReminder(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="flex-1 bg-[var(--foreground)]/5 border border-[var(--border)] rounded px-3 py-1.5 text-xs"
          />
          <button
            onClick={handleReminderSave}
            className="px-3 py-1 bg-[var(--accent-secondary)] text-black text-xs font-semibold rounded"
          >
            Save
          </button>
          {todo.reminderTime && (
            <button
              onClick={clearReminder}
              className="text-xs text-[var(--accent-danger)] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
});
