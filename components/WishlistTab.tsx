import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, Loader2, X } from 'lucide-react';
import { searchCosmetics } from '../api/fortnite';
import { useWishlist } from '../contexts/WishlistContext';
import { ItemCard } from './ItemCard';
import type { ShopItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface WishlistTabProps {
  onItemClick: (item: ShopItem) => void;
}

export function WishlistTab({ onItemClick }: WishlistTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<ShopItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { wishlist, handleWishlist } = useWishlist();

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchCosmetics(debouncedQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleCloseSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 space-y-8">
      <AnimatePresence mode="wait">
        {!showSearch ? (
          <motion.button
            key="search-button"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 
                      hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <Search className="w-5 h-5 text-black/70 dark:text-white/70" />
            <span className="text-sm text-black/70 dark:text-white/70">Search Cosmetics</span>
          </motion.button>
        ) : (
          <motion.div
            key="search-section"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="fixed inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl"
          >
            <div className="h-full flex flex-col">
              <div className="flex-none px-4 pt-6 pb-4 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/50 backdrop-blur-lg">
                <div className="max-w-3xl mx-auto space-y-4">
                  {/* Search Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-black/90 dark:text-white/90">
                      Search Cosmetics
                    </h2>
                    <button
                      onClick={handleCloseSearch}
                      className="p-2 rounded-full bg-black/5 dark:bg-white/5 
                               hover:bg-black/10 dark:hover:bg-white/10 
                               text-black/70 dark:text-white/70 
                               transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search all Fortnite cosmetics..."
                      autoFocus
                      className="w-full px-4 py-4 pl-12 rounded-2xl 
                               bg-black/5 dark:bg-white/5 
                               border border-black/5 dark:border-white/5 
                               text-lg text-black/90 dark:text-white/90 
                               placeholder-black/50 dark:placeholder-white/50 
                               focus:outline-none focus:bg-black/10 dark:focus:bg-white/10
                               transition-colors"
                    />
                    {isSearching ? (
                      <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
                                        text-black/50 dark:text-white/50 animate-spin" />
                    ) : (
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 
                                       text-black/50 dark:text-white/50" />
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Results */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-4 py-6">
                  {searchQuery.length >= 2 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 animate-spin mb-4 text-black/30 dark:text-white/30" />
                          <p className="text-sm text-black/50 dark:text-white/50">Searching...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <div className="mb-6">
                            <span className="text-sm font-medium text-black/50 dark:text-white/50">
                              Found {searchResults.length} items
                            </span>
                          </div>
                          <motion.div 
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                            layout
                          >
                            {searchResults.map(item => (
                              <motion.div
                                key={item.id}
                                layout
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ItemCard
                                  key={item.id}
                                  item={{
                                    ...item,
                                    lastSeen: item.lastSeen || item.added
                                  }}
                                  onClick={() => {
                                    handleWishlist(item);
                                    onItemClick({
                                      ...item,
                                      lastSeen: item.lastSeen || item.added
                                    });
                                    handleCloseSearch();
                                  }}
                                  isWishlisted={wishlist?.some(w => w.id === item.id)}
                                  onWishlist={() => handleWishlist(item)}
                                  showWishlistButton={true}
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                          <p className="text-lg font-medium text-black/70 dark:text-white/70 mb-2">
                            No items found
                          </p>
                          <p className="text-sm text-black/50 dark:text-white/50">
                            Try searching for something else
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {wishlist?.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onClick={() => onItemClick(item)}
            onWishlist={() => handleWishlist(item)}
            isWishlisted={true}
            showWishlistButton={true}
          />
        ))}
      </div>
    </div>
  );
} 