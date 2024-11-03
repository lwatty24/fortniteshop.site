import { ShopItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemCard } from './ItemCard';
import { Layers, ArrowUpDown, ChevronDown, Scale, Calculator } from 'lucide-react';
import { useState } from 'react';
import { SetDetails } from './SetDetails';
import { CompareSets } from './CompareSets';
import { BundleCalculator } from './BundleCalculator';
import { setContainerVariants, setItemVariants } from '../constants/animations';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'items-asc' | 'items-desc';

interface SetCollectionsProps {
  items: ShopItem[];
  onItemClick: (item: ShopItem) => void;
}

export function SetCollections({ items, onItemClick }: SetCollectionsProps) {
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [expandedSet, setExpandedSet] = useState<string | null>(null);
  const [selectedSets, setSelectedSets] = useState<[string, string] | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const setGroups = items.reduce((groups: Record<string, ShopItem[]>, item) => {
    if (!item.set) return groups;
    if (!groups[item.set]) groups[item.set] = [];
    groups[item.set].push(item);
    return groups;
  }, {});

  const sortedSets = Object.entries(setGroups).sort(([nameA, itemsA], [nameB, itemsB]) => {
    const priceA = itemsA.reduce((sum, item) => sum + item.price, 0);
    const priceB = itemsB.reduce((sum, item) => sum + item.price, 0);

    switch (sortOption) {
      case 'price-asc':
        return priceA - priceB;
      case 'price-desc':
        return priceB - priceA;
      case 'items-asc':
        return itemsA.length - itemsB.length;
      case 'items-desc':
        return itemsB.length - itemsA.length;
      case 'name-asc':
        return nameA.localeCompare(nameB);
      case 'name-desc':
        return nameB.localeCompare(nameA);
      default:
        return 0;
    }
  });

  const handleCompareToggle = (setName: string) => {
    setSelectedSets(prev => {
      if (!prev) return [setName, ''];
      if (prev[0] === setName) return null;
      if (prev[1] === '') return [prev[0], setName];
      return [setName, ''];
    });
  };

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl 
                     bg-white/50 dark:bg-black/50 backdrop-blur-xl
                     border border-black/[0.06] dark:border-white/[0.06] 
                     hover:bg-white/70 dark:hover:bg-black/70 
                     transition-colors"
          >
            <Calculator className="w-4 h-4 text-black/50 dark:text-white/50" />
            <span className="text-sm text-black/70 dark:text-white/70">Bundle Calculator</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedSets.map(([setName, items]) => (
          <motion.div
            key={setName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group relative bg-gradient-to-b from-white/50 to-white/30 
                     dark:from-black/50 dark:to-black/30 backdrop-blur-xl 
                     rounded-2xl border border-black/[0.06] dark:border-white/[0.06] 
                     overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-transparent 
                          dark:from-white/[0.02] pointer-events-none" />
            
            <div className="relative px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06]
                          bg-white/30 dark:bg-black/30">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setExpandedSet(expandedSet === setName ? null : setName)}
                  className="flex items-center gap-2 text-lg font-medium 
                           text-black/90 dark:text-white/90 
                           hover:text-black dark:hover:text-white transition-colors"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedSet === setName ? 'rotate-180' : ''
                    }`}
                  />
                  {setName}
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-black/40 dark:text-white/40">
                    {items.length} items
                  </span>
                  <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg">
                    <img 
                      src="https://fortnite-api.com/images/vbuck.png"
                      alt="V-Bucks"
                      className="w-3.5 h-3.5"
                    />
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-300">
                      {items.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <SetDetails 
              setName={setName}
              items={items}
              isExpanded={expandedSet === setName}
            />

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {items.map((item) => (
                  <ItemCard 
                    key={item.id}
                    item={item}
                    onClick={() => onItemClick(item)}
                    showWishlistButton={false}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSets && selectedSets[1] !== '' && (
          <CompareSets
            sets={[
              { name: selectedSets[0], items: setGroups[selectedSets[0]] },
              { name: selectedSets[1], items: setGroups[selectedSets[1]] }
            ]}
            onClose={() => setSelectedSets(null)}
            onItemClick={onItemClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalculatorOpen && (
          <BundleCalculator
            items={items}
            onClose={() => setIsCalculatorOpen(false)}
            onItemClick={onItemClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}  