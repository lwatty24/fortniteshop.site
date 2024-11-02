import { motion } from 'framer-motion';
import { ShopItem } from '../types';
import { format } from 'date-fns';
import { Package, Tag, Calendar, Hash, ChevronRight } from 'lucide-react';

interface SetDetailsProps {
  setName: string;
  items: ShopItem[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function SetDetails({ setName, items, isExpanded }: SetDetailsProps) {
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const rarityDistribution = items.reduce((acc: Record<string, number>, item) => {
    acc[item.rarity] = (acc[item.rarity] || 0) + 1;
    return acc;
  }, {});
  
  const typeDistribution = items.reduce((acc: Record<string, number>, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const firstRelease = items.reduce((earliest, item) => {
    if (!item.added) return earliest;
    const date = new Date(item.added);
    return !earliest || date < earliest ? date : earliest;
  }, null as Date | null);

  // Get the set ID from the first item that has one
  const setId = items.find(item => item.set)?.set || 'None';

  const latestRelease = items.reduce((latest, item) => {
    if (!item.history?.lastSeen) return latest;
    const date = new Date(item.history.lastSeen);
    return !latest || date > latest ? date : latest;
  }, null as Date | null);

  const averagePrice = Math.round(totalPrice / items.length);

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : 0 }}
      className="overflow-hidden"
    >
      <div className="p-8 pt-6 pb-8 bg-gradient-to-b from-black/[0.02] to-transparent dark:from-white/[0.02] dark:to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rarity Distribution */}
          <div className="bg-gradient-to-br from-white to-white/50 dark:from-black/40 dark:to-black/20 backdrop-blur-xl rounded-2xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-black/40 dark:text-white/40" />
                <h3 className="text-sm font-medium text-black/60 dark:text-white/60">
                  Rarity Distribution
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(rarityDistribution).map(([rarity, count]) => (
                <div key={rarity} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-black/70 dark:text-white/70 flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-black/30 dark:text-white/30" />
                      {rarity}
                    </span>
                    <span className="text-sm font-medium text-black/40 dark:text-white/40 tabular-nums">
                      {count}
                    </span>
                  </div>
                  <div className="h-1 bg-black/[0.03] dark:bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / items.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500/30 to-blue-400/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Type Distribution */}
          <div className="bg-gradient-to-br from-white to-white/50 dark:from-black/40 dark:to-black/20 backdrop-blur-xl rounded-2xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-black/40 dark:text-white/40" />
                <h3 className="text-sm font-medium text-black/60 dark:text-white/60">
                  Type Distribution
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(typeDistribution).map(([type, count]) => (
                <div key={type} className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-black/70 dark:text-white/70 flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3 text-black/30 dark:text-white/30" />
                      {type}
                    </span>
                    <span className="text-sm font-medium text-black/40 dark:text-white/40 tabular-nums">
                      {count}
                    </span>
                  </div>
                  <div className="h-1 bg-black/[0.03] dark:bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / items.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500/30 to-blue-400/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Set Information */}
          <div className="bg-gradient-to-br from-white to-white/50 dark:from-black/40 dark:to-black/20 backdrop-blur-xl rounded-2xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
            <div className="px-5 py-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black/40 dark:text-white/40" />
                <h3 className="text-sm font-medium text-black/60 dark:text-white/60">
                  Set Information
                </h3>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50 dark:text-white/50">Set ID</span>
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-black/30 dark:text-white/30" />
                  <span className="text-sm font-medium text-black/70 dark:text-white/70 font-mono">
                    {setId}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50 dark:text-white/50">First Seen</span>
                <span className="text-sm font-medium text-black/70 dark:text-white/70 tabular-nums">
                  {firstRelease ? format(firstRelease, 'MMM d, yyyy') : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50 dark:text-white/50">Last Seen</span>
                <span className="text-sm font-medium text-black/70 dark:text-white/70 tabular-nums">
                  {latestRelease ? format(latestRelease, 'MMM d, yyyy') : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50 dark:text-white/50">Total Items</span>
                <span className="text-sm font-medium text-black/70 dark:text-white/70 tabular-nums">
                  {items.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50 dark:text-white/50">Total Price</span>
                <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-lg">
                  <img 
                    src="https://fortnite-api.com/images/vbuck.png" 
                    alt="V-Bucks" 
                    className="w-4 h-4" 
                  />
                  <span className="text-sm font-medium text-blue-500 dark:text-blue-400 tabular-nums">
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50 dark:text-white/50">Average Price</span>
                <div className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-lg">
                  <img 
                    src="https://fortnite-api.com/images/vbuck.png" 
                    alt="V-Bucks" 
                    className="w-4 h-4" 
                  />
                  <span className="text-sm font-medium text-blue-500 dark:text-blue-400 tabular-nums">
                    {averagePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 