import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Trash2 } from 'lucide-react';
import { ShopItem } from '../types';
import { useState } from 'react';
import { rarityColors } from '../constants/rarity';

interface BundleCalculatorProps {
  onClose: () => void;
  onAddItem: (item: ShopItem) => void;
  items: ShopItem[];
}

export function BundleCalculator({ onClose, onAddItem, items }: BundleCalculatorProps) {
  const [selectedItems, setSelectedItems] = useState<ShopItem[]>([]);
  
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const suggestedDiscount = Math.floor(totalPrice * 0.2); // 20% bundle discount
  const finalPrice = totalPrice - suggestedDiscount;

  const handleAddItem = (item: ShopItem) => {
    if (!selectedItems.find(i => i.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

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
        <div className="p-6 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black/90 dark:text-white">Bundle Calculator</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5 text-black/70 dark:text-white/70" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          {/* Selected Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black/80 dark:text-white/80">Selected Items</h3>
            <div className="space-y-2">
              {selectedItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="font-medium text-black dark:text-white">{item.name}</div>
                      <div className="flex items-center gap-1">
                        <img 
                          src="https://fortnite-api.com/images/vbuck.png" 
                          alt="V-Bucks" 
                          className="w-4 h-4" 
                        />
                        <span className="text-sm text-blue-500">{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bundle Summary */}
            <div className="mt-6 p-4 rounded-lg bg-blue-500/10">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black/60 dark:text-white/60">Total Price</span>
                  <span className="font-medium text-black/80 dark:text-white/80">{totalPrice.toLocaleString()} V-Bucks</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black/60 dark:text-white/60">Bundle Discount</span>
                  <span className="font-medium text-green-500">-{suggestedDiscount.toLocaleString()} V-Bucks</span>
                </div>
                <div className="pt-2 border-t border-blue-500/20">
                  <div className="flex justify-between">
                    <span className="font-medium text-black/80 dark:text-white/80">Final Price</span>
                    <span className="font-bold text-blue-500">{finalPrice.toLocaleString()} V-Bucks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Items */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-black/80 dark:text-white/80">Available Items</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div 
                  key={item.id}
                  onClick={() => handleAddItem(item)}
                  className="flex items-center justify-between p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="font-medium text-black dark:text-white">{item.name}</div>
                      <div className="flex items-center gap-1">
                        <img 
                          src="https://fortnite-api.com/images/vbuck.png" 
                          alt="V-Bucks" 
                          className="w-4 h-4" 
                        />
                        <span className="text-sm text-blue-500">{item.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-black/40 dark:text-white/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 