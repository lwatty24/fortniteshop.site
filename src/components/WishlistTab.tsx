import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, Loader2, X, Heart, ChevronRight, Clock } from 'lucide-react';
import { searchCosmetics } from '../api/fortnite';
import { useWishlist } from '../contexts/WishlistContext';
import { ItemCard } from './ItemCard';
import type { ShopItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useSearch } from '../hooks/useSearch';

interface WishlistTabProps {
  onItemClick: (item: ShopItem) => void;
}

const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { opacity: 0, y: -20 }
};

const fadeIn = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: { opacity: 0 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { opacity: 0, scale: 0.95 }
};

export function WishlistTab({ onItemClick }: WishlistTabProps) {
  const { 
    query, 
    setQuery, 
    results: searchResults, 
    isSearching, 
    performSearch 
  } = useSearch();
  const [showSearch, setShowSearch] = useState(false);
  const { wishlist, handleWishlist } = useWishlist();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      setQuery(searchQuery);
      if (searchQuery.length >= 2) {
        addRecentSearch(searchQuery);
      }
    }
  }, [setQuery, addRecentSearch]);

  const handleCloseSearch = () => {
    setQuery('');
    setShowSearch(false);
  };

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 space-y-8">
      <AnimatePresence mode="wait">
        {!showSearch ? (
          <motion.div
            key="search-button"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <button
              onClick={() => setShowSearch(true)}
              className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/5 via-blue-400/5 to-blue-300/5 
                        hover:from-blue-500/10 hover:via-blue-400/10 hover:to-blue-300/10 
                        border border-blue-500/10 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative px-6 py-4 flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-400/10">
                    <Search className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-blue-500/70 dark:text-blue-400/70">
                      Search Cosmetics
                    </span>
                    <span className="text-xs text-black/40 dark:text-white/40">
                      Find and add items to your wishlist
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:hidden">
                  <div className="h-8 w-[1px] bg-blue-500/10" />
                  <ChevronRight className="w-4 h-4 text-blue-500/40" />
                </div>
              </div>
            </button>

            {wishlist && wishlist.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5">
                <Heart className="w-5 h-5 text-pink-500/70" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black/70 dark:text-white/70">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-xs text-black/40 dark:text-white/40">
                    in your wishlist
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="search-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-black dark:via-blue-950/30 dark:to-black backdrop-blur-xl" />
            
            <div className="relative h-full flex flex-col">
              <div className="flex-none border-b border-black/5 dark:border-white/5">
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-400/10">
                        <Search className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <h2 className="text-xl font-semibold bg-gradient-to-br from-black to-black/70 dark:from-white dark:to-white/70 bg-clip-text text-transparent">
                        Search Cosmetics
                      </h2>
                    </div>
                    <button
                      onClick={handleCloseSearch}
                      className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 
                               text-black/70 dark:text-white/70 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="relative space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/20 via-blue-400/20 to-blue-300/20 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name..."
                        autoFocus
                        className="w-full px-6 py-4 pl-14 rounded-2xl 
                                 bg-white/60 dark:bg-black/60
                                 border border-black/5 dark:border-white/5
                                 text-lg text-black/90 dark:text-white/90 
                                 placeholder-black/40 dark:placeholder-white/40 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20
                                 transition-all duration-200"
                      />
                      {isSearching ? (
                        <Loader2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 
                                          text-blue-500/70 dark:text-blue-400/70 animate-spin" />
                      ) : (
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 
                                         text-blue-500/70 dark:text-blue-400/70" />
                      )}
                    </div>

                    {!query && recentSearches.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-black/50 dark:text-white/50">
                            Recent Searches
                          </span>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-blue-500/70 hover:text-blue-500 dark:text-blue-400/70 dark:hover:text-blue-400 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((query) => (
                            <button
                              key={query}
                              onClick={() => handleSearch(query)}
                              className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 
                                       hover:bg-black/10 dark:hover:bg-white/10
                                       text-sm text-black/70 dark:text-white/70
                                       transition-colors flex items-center gap-2"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              {query}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto px-4 py-6">
                  {query.length >= 2 && (
                    <motion.div 
                      variants={fadeIn}
                      initial="initial"
                      animate="animate"
                      exit="exit"
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
                            variants={scaleIn}
                            layout
                          >
                            {searchResults.map(item => (
                              <motion.div
                                key={item.id}
                                layout
                                variants={scaleIn}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                layoutId={item.id}
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