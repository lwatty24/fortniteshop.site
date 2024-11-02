import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Package, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ShopItem } from '../types';
import { rarityColors } from '../constants/rarity';
import { useEffect } from 'react';

interface CompareModalProps {
  items: [ShopItem, ShopItem];
  onClose: () => void;
}

export function CompareModal({ items, onClose }: CompareModalProps) {
  const [item1, item2] = items;
  const rarity1 = rarityColors[item1.rarity.toLowerCase() as keyof typeof rarityColors] || rarityColors.common;
  const rarity2 = rarityColors[item2.rarity.toLowerCase() as keyof typeof rarityColors] || rarityColors.common;

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-black/95 rounded-xl overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/10 dark:from-white/5 to-transparent pointer-events-none" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="w-5 h-5 text-black/70 dark:text-white/70" />
        </button>

        <div className="grid grid-cols-2">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className={`p-4 ${index === 0 ? 'border-r border-black/5 dark:border-white/5' : ''}`}
            >
              <div className={`aspect-square rounded-xl overflow-hidden mb-4 ${index === 0 ? rarity1.border : rarity2.border} transition-all duration-300 group relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  src={item.featuredImage || item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute bottom-0 inset-x-0 p-4 text-white text-sm font-medium"
                >
                  Click to view details
                </motion.div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-black/70 dark:text-white/70">{item.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <CompareDetail 
                    icon={<Star className="w-4 h-4" />} 
                    label="Rarity" 
                    value={item.rarity}
                    item={item}
                  />
                  <CompareDetail 
                    icon={<Package className="w-4 h-4" />} 
                    label="Type" 
                    value={item.type} 
                  />
                  <CompareDetail 
                    icon={<img src="https://fortnite-api.com/images/vbuck.png" className="w-4 h-4" />} 
                    label="Price" 
                    value={`${item.price.toLocaleString()}`}
                    highlight
                  />
                  <CompareDetail 
                    icon={<Calendar className="w-4 h-4" />} 
                    label="Released" 
                    value={item.added ? format(new Date(item.added), 'MMM d, yyyy') : 'Unknown'} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CompareDetail({ 
  icon, 
  label, 
  value, 
  highlight = false,
  item
}: { 
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: boolean;
  item?: ShopItem;
}) {
  const getRarityColor = () => {
    if (label === "Rarity" && item) {
      const rarity = rarityColors[item.rarity.toLowerCase() as keyof typeof rarityColors] || rarityColors.common;
      return rarity.text;
    }
    return highlight ? 'text-blue-500 dark:text-blue-300' : 'text-black dark:text-white';
  };

  return (
    <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg">
      <div className="flex items-center gap-1.5 text-black/50 dark:text-white/50 mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className={`text-sm font-medium ${getRarityColor()}`}>
        {value}
      </div>
    </div>
  );
} 