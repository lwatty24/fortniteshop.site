import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Calendar, Tag, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ShopItem } from '../types';
import { useEffect } from 'react';

interface CompareSetsProps {
  sets: [
    { name: string; items: ShopItem[] },
    { name: string; items: ShopItem[] }
  ];
  onClose: () => void;
  onItemClick: (item: ShopItem) => void;
}

export function CompareSets({ sets, onClose, onItemClick }: CompareSetsProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 dark:from-white/5 to-transparent pointer-events-none" />
        
        <div className="relative">
          <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.06] bg-white/30 dark:bg-black/30">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black/90 dark:text-white">Compare Sets</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                <X className="w-5 h-5 text-black/70 dark:text-white/70" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
            {sets.map((set, index) => (
              <div key={set.name} className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-black dark:text-white">{set.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-black/50 dark:text-white/50">
                      {set.items.length} Items
                    </span>
                    <div className="flex items-center gap-2 bg-blue-500/[0.08] px-3 py-1 rounded-lg">
                      <img 
                        src="https://fortnite-api.com/images/vbuck.png" 
                        alt="V-Bucks" 
                        className="w-4 h-4" 
                      />
                      <span className="text-sm font-bold text-blue-500/90 dark:text-blue-300">
                        {set.items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {set.items.map(item => (
                      <div
                        key={item.name}
                        onClick={() => onItemClick(item)}
                        className="flex items-center gap-3 p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] group hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-black dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50">
                              {item.type}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50">
                              {item.rarity}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg">
                          <img 
                            src="https://fortnite-api.com/images/vbuck.png"
                            alt="V-Bucks"
                            className="w-3.5 h-3.5"
                          />
                          <span className="text-xs font-bold text-blue-500 dark:text-blue-300">
                            {item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 