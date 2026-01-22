'use client';

import { motion } from 'framer-motion';
import { progressVariants } from '@/lib/animations';
import { TodoStats } from '@/types';

interface ProgressBarProps {
  stats: TodoStats;
}

export const ProgressBar = ({ stats }: ProgressBarProps) => {
  const { completed, total, percentage } = stats;

  return (
    <div className="space-y-3">
      {/* Stats row */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          Progress
        </span>
        <span className="font-medium text-slate-900 dark:text-white">
          {completed}/{total} completed
        </span>
      </div>

      {/* Progress bar container */}
      <div className="relative h-2 rounded-full bg-slate-200/50 dark:bg-white/10 overflow-hidden backdrop-blur-sm">
        {/* Animated progress fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          variants={progressVariants}
          initial="initial"
          animate="animate"
          custom={percentage}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'linear',
          }}
        />
      </div>

      {/* Percentage display */}
      <div className="flex justify-center">
        <motion.span
          key={percentage}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
};
