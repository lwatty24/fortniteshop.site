import { ShopItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemCard } from './ItemCard';
import { Layers, ArrowUpDown, ChevronDown, Scale, Calculator } from 'lucide-react';
import { useState } from 'react';
import { SetDetails } from './SetDetails';
import { CompareSets } from './CompareSets';
import { BundleCalculator } from './BundleCalculator';

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'items-asc' | 'items-desc';

interface SetCollectionsProps {
  items: ShopItem[];
  onItemClick: (item: ShopItem) => void;
}

const setContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const setItem = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

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
    <div className="max-w-[1800px] mx-auto px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black/90 dark:text-white">Set Collections</h1>
        
        <button
          onClick={() => setIsCalculatorOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors"
        >
          <Calculator className="w-4 h-4" />
          <span>Bundle Calculator</span>
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mb-6">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/[0.03] dark:bg-white/5 border border-black/[0.06] dark:border-white/5">
          <ArrowUpDown className="w-4 h-4 text-black/40 dark:text-white/50" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-transparent text-sm text-black/60 dark:text-white/70 focus:outline-none appearance-none pr-6 pl-1"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right center',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="name-asc" className="bg-white dark:bg-[#1A1A1A] text-black/80 dark:text-white">Name (A-Z)</option>
            <option value="name-desc" className="bg-white dark:bg-[#1A1A1A] text-black/80 dark:text-white">Name (Z-A)</option>
            <option value="price-asc" className="bg-white dark:bg-[#1A1A1A] text-black/80 dark:text-white">Price (Low to High)</option>
            <option value="price-desc" className="bg-white dark:bg-[#1A1A1A] text-black/80 dark:text-white">Price (High to Low)</option>
            <option value="items-asc" className="bg-white dark:bg-[#1A1A1A] text-black/80 dark:text-white">Items (Fewest First)</option>
            <option value="items-desc" className="bg-white dark:bg-[#1A1A1A] text-black/80 dark:text-white">Items (Most First)</option>
          </select>
        </div>
      </div>

      <motion.div 
        variants={setContainer}
        initial="hidden"
        animate="show"
        className="grid gap-12 pt-6"
      >
        <AnimatePresence mode="popLayout">
          {sortedSets.map(([setName, setItems]) => (
            <motion.div
              key={setName}
              variants={setItem}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              className="bg-gradient-to-b from-black/[0.02] to-transparent dark:from-white/[0.03] dark:to-white/[0.01] rounded-2xl relative border border-black/[0.06] dark:border-white/[0.06]"
            >
              <div className="sticky top-[73px] z-20 bg-white/90 dark:bg-black/95 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/5 rounded-t-2xl">
                <div className="px-8 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedSet(expandedSet === setName ? null : setName)}
                      className="p-2 rounded-lg bg-black/[0.03] dark:bg-white/5 hover:bg-black/[0.05] dark:hover:bg-white/10 transition-colors"
                    >
                      <motion.div
                        animate={{ rotate: expandedSet === setName ? 180 : 0 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-black/50 dark:text-white/70" />
                      </motion.div>
                    </button>
                    <h2 className="text-2xl font-bold text-black/90 dark:text-white">{setName}</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleCompareToggle(setName)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedSets?.includes(setName)
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-black/[0.03] dark:bg-white/5 hover:bg-black/[0.05] dark:hover:bg-white/10 text-black/50 dark:text-white/70'
                      }`}
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                    <div className="text-sm text-black/50 dark:text-white/60">
                      {setItems.length} {setItems.length === 1 ? 'Item' : 'Items'}
                    </div>
                    <div className="flex items-center gap-2 bg-blue-500/[0.08] px-4 py-2 rounded-lg">
                      <img 
                        src="https://fortnite-api.com/images/vbuck.png" 
                        alt="V-Bucks" 
                        className="w-5 h-5" 
                      />
                      <span className="text-lg font-bold text-blue-500/90 dark:text-blue-300">
                        {setItems.reduce((sum, item) => sum + item.price, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10">
                <SetDetails
                  setName={setName}
                  items={setItems}
                  isExpanded={expandedSet === setName}
                  onToggle={() => setExpandedSet(expandedSet === setName ? null : setName)}
                />
              </div>
              
              <div className="relative z-0 p-8 pt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {setItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={item}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      layout
                      style={{ perspective: 1000 }}
                    >
                      <ItemCard 
                        item={item}
                        onClick={() => onItemClick(item)}
                        onCompare={undefined}
                        showWishlistButton={false}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

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