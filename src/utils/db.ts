import { ShopSection } from '../types';

interface HistoryEntry {
  date: string;
  sections: ShopSection[];
  lastUpdated: string;
}

const STORAGE_KEY = 'shop-history';

export async function getAllHistory(): Promise<HistoryEntry[]> {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export async function addHistoryEntry(entry: HistoryEntry): Promise<void> {
  const history = await getAllHistory();
  const filtered = history.filter(e => e.date !== entry.date);
  const newHistory = [entry, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
}

export async function getHistoryEntry(date: string): Promise<HistoryEntry | undefined> {
  const history = await getAllHistory();
  return history.find(entry => entry.date === date);
} 