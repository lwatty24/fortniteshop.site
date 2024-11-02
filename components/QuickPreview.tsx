import { motion } from 'framer-motion';
import { ShopItem } from '../types';
import { rarityColors } from '../constants/rarity';
import { Package, Star } from 'lucide-react';
import { Portal } from './Portal';

interface QuickPreviewProps {
  item: ShopItem;
  x: number;
  y: number;
}

export function QuickPreview({ item, x, y }: QuickPreviewProps) {
  const rarity = rarityColors[item.rarity.toLowerCase() as keyof typeof rarityColors] || rarityColors.common;
  
  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="fixed w-80 pointer-events-none"
        style={{ 
          left: Math.min(x + 20, window.innerWidth - 340), 
          top: Math.min(y + 20, window.innerHeight - 400),
          zIndex: 9999
        }}
      >
        <div className={`${rarity.border} rounded-xl overflow-hidden bg-white dark:bg-black/95 shadow-2xl`}>
          <div className="relative">
            <img 
              src={item.featuredImage || item.image} 
              alt={item.name}
              className="w-full aspect-square object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-[0.03]`} />
          </div>
          
          <div className="p-4 space-y-3">
            <p className="text-sm text-black/60 dark:text-white/60">{item.description}</p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5">
                <Star className="w-4 h-4 text-black/50 dark:text-white/50" />
                <span className="text-sm text-black/70 dark:text-white/70">{item.rarity}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-black/5 dark:bg-white/5">
                <Package className="w-4 h-4 text-black/50 dark:text-white/50" />
                <span className="text-sm text-black/70 dark:text-white/70">{item.type}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Portal>
  );
} 