import { useState, useEffect } from 'react';

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = 'recent-searches';

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addRecentSearch = (query: string) => {
    if (!query.trim() || query.length < 2) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      return updated;
    });
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentSearches([]);
  };

  return { recentSearches, addRecentSearch, clearRecentSearches };
} 