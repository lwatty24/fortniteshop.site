import { useState, useRef, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import { searchCosmetics } from '../api/fortnite';
import type { ShopItem } from '../types';
import { sanitizeInput } from '../utils/security';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 200);
  const [results, setResults] = useState<ShopItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRequestRef = useRef<AbortController | null>(null);
  const hasSearched = useRef(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    if (searchRequestRef.current) {
      searchRequestRef.current.abort();
    }

    searchRequestRef.current = new AbortController();
    setIsSearching(true);

    try {
      const sanitizedQuery = sanitizeInput(searchQuery);
      const searchResults = await searchCosmetics(sanitizedQuery);
      setResults(searchResults);
      hasSearched.current = true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
        setResults([]);
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    isSearching,
    performSearch,
    hasSearched
  };
} 