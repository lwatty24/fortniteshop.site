import { useState, useEffect } from 'react';
import { ShopSection } from '../types';
import { format, isAfter } from 'date-fns';
import { getAllHistory, addHistoryEntry } from '../utils/db';

interface HistoryEntry {
  date: string;
  sections: ShopSection[];
  lastUpdated: string;
}

export function useShopHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getAllHistory();
        setHistory(data.sort((a, b) => 
          isAfter(new Date(a.date), new Date(b.date)) ? -1 : 1
        ));
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  const addToHistory = async (sections: ShopSection[]) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const timestamp = now.toISOString();
    
    const entry = { date: today, sections, lastUpdated: timestamp };
    
    try {
      await addHistoryEntry(entry);
      setHistory(prev => {
        const filtered = prev.filter(e => e.date !== today);
        return [entry, ...filtered].sort((a, b) => 
          isAfter(new Date(a.date), new Date(b.date)) ? -1 : 1
        );
      });
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const getShopForDate = (date: string) => {
    return history.find(entry => entry.date === date);
  };

  const getAvailableDates = () => {
    return history.map(entry => entry.date).sort();
  };

  return { 
    history, 
    addToHistory, 
    getShopForDate, 
    getAvailableDates,
    isLoading 
  };
} 