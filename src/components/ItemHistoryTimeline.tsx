import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { History, Calendar } from 'lucide-react';
import { ShopItem } from '../types';

interface ItemHistoryTimelineProps {
  item: ShopItem;
}

export function ItemHistoryTimeline({ item }: ItemHistoryTimelineProps) {
  const appearances = item.history?.appearances || [];

  return (
    <div className="mt-4">
      {appearances.length > 0 && (
        <div className="relative pl-6 space-y-3">
          <div className="absolute left-[11px] top-0 bottom-0 w-px bg-black/10 dark:bg-white/10" />
          
          {appearances.map((appearance, index) => (
            <motion.div
              key={appearance.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-black/40 dark:bg-white/40" />
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-black/50 dark:text-white/50" />
                  <span className="text-sm font-medium text-black/70 dark:text-white/70">
                    {format(new Date(appearance.date), 'MMM d, yyyy')}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <img 
                    src="https://fortnite-api.com/images/vbuck.png" 
                    alt="V-Bucks" 
                    className="w-4 h-4" 
                  />
                  <span className="text-sm font-medium text-blue-500">
                    {appearance.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 