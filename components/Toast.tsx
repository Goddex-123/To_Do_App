'use client';

import { memo, useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Toast as ToastType } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colors = {
  success: 'border-[#00ff88]/30 text-[#00ff88]',
  error: 'border-[#ff3366]/30 text-[#ff3366]',
  info: 'border-[#00b4ff]/30 text-[#00b4ff]',
};

export const ToastContainer = memo(function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
});

const ToastItem = memo(function ToastItem({ 
  toast, 
  onRemove 
}: { 
  toast: ToastType; 
  onRemove: (id: string) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = icons[toast.type];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-[var(--surface)] border backdrop-blur-sm transition-all duration-200 ${
        colors[toast.type]
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium text-[var(--foreground)]">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 p-1 rounded hover:bg-[var(--foreground)]/10 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
});
