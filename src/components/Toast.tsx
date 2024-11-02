import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2 bg-white dark:bg-black/90 shadow-lg rounded-lg px-4 py-3 border border-black/10 dark:border-white/10">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-sm text-black/70 dark:text-white/70">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"
            >
              <X className="w-4 h-4 text-black/50 dark:text-white/50" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 