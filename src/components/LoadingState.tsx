import { motion } from 'framer-motion';

export function LoadingState() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="aspect-square rounded-xl bg-gradient-to-br from-black/[0.02] to-transparent dark:from-white/[0.02] animate-pulse"
        />
      ))}
    </div>
  );
} 