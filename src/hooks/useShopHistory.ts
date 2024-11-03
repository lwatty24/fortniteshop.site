import { useState, useEffect } from 'react';
import { ShopSection } from '../types';
import { format, isAfter, startOfDay, isSameDay } from 'date-fns';

interface HistoryEntry {
  date: string;
  sections: ShopSection[];
  lastUpdated: string;
}

export function useShopHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    const saved = localStorage.getItem('shop-history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shop-history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (sections: ShopSection[]) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const timestamp = now.toISOString();
    
    setHistory(prev => {
      const existingTodayEntry = prev.find(entry => entry.date === today);
      
      if (existingTodayEntry) {
        const hasShopChanged = JSON.stringify(existingTodayEntry.sections) !== JSON.stringify(sections);
        if (!hasShopChanged) return prev;
      }

      const sortedHistory = prev
        .filter(entry => entry.date !== today)
        .sort((a, b) => isAfter(new Date(a.date), new Date(b.date)) ? -1 : 1);

      return [
        { date: today, sections, lastUpdated: timestamp },
        ...sortedHistory
      ].slice(0, 30);
    });
  };

  const getShopForDate = (date: string) => {
    return history.find(entry => entry.date === date);
  };

  const getAvailableDates = () => {
    return history.map(entry => entry.date).sort();
  };

  return { history, addToHistory, getShopForDate, getAvailableDates };
} 