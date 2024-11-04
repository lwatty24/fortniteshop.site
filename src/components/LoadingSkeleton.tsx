import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 p-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative aspect-[3/4] rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 dark:from-white/5 dark:to-white/20 animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="h-4 bg-black/10 dark:bg-white/10 rounded-full w-2/3 animate-pulse" />
            <div className="h-3 bg-black/10 dark:bg-white/10 rounded-full w-1/2 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
} 