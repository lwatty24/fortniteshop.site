import { motion } from 'framer-motion';
import { X, Star, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ShopItem } from '../types';
import { rarityColors } from '../constants/rarity';

interface CompareItemsProps {
  items: [ShopItem, ShopItem];
  onClose: () => void;
}

export function CompareItems({ items, onClose }: CompareItemsProps) {
  const [item1, item2] = items;
  const rarity1 = rarityColors[item1.rarity.toLowerCase() as keyof typeof rarityColors] || rarityColors.common;
  const rarity2 = rarityColors[item2.rarity.toLowerCase() as keyof typeof rarityColors] || rarityColors.common;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl bg-white dark:bg-black/95 rounded-xl p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-5 h-5 text-black/70 dark:text-white/70" />
        </button>

        <div className="grid grid-cols-2 gap-8">
          {/* Item 1 */}
          <div className={`p-4 rounded-xl ${rarity1.border}`}>
            <img
              src={item1.image}
              alt={item1.name}
              className="w-full aspect-square object-cover rounded-lg mb-4"
            />
            <CompareDetails item={item1} />
          </div>

          {/* Item 2 */}
          <div className={`p-4 rounded-xl ${rarity2.border}`}>
            <img
              src={item2.image}
              alt={item2.name}
              className="w-full aspect-square object-cover rounded-lg mb-4"
            />
            <CompareDetails item={item2} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompareDetails({ item }: { item: ShopItem }) {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-black dark:text-white">{item.name}</h3>
      <p className="text-black/70 dark:text-white/70">{item.description}</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
          <div className="text-sm text-black/50 dark:text-white/50 mb-1">Type</div>
          <div className="font-medium text-black dark:text-white">{item.type}</div>
        </div>
        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
          <div className="text-sm text-black/50 dark:text-white/50 mb-1">Rarity</div>
          <div className="font-medium text-black dark:text-white">{item.rarity}</div>
        </div>
        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
          <div className="text-sm text-black/50 dark:text-white/50 mb-1">Price</div>
          <div className="font-medium text-blue-500 dark:text-blue-300">{item.price.toLocaleString()} V-Bucks</div>
        </div>
        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg">
          <div className="text-sm text-black/50 dark:text-white/50 mb-1">Released</div>
          <div className="font-medium text-black dark:text-white">
            {item.added ? format(new Date(item.added), 'MMM d, yyyy') : 'Unknown'}
          </div>
        </div>
      </div>
    </div>
  );
} 