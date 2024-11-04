import { openDB } from 'idb';
import { ShopSection } from '../types';

interface HistoryEntry {
  date: string;
  sections: ShopSection[];
  lastUpdated: string;
}

const DB_NAME = 'fortnite-shop-db';
const STORE_NAME = 'shop-history';
const DB_VERSION = 1;

let dbPromise = openDB<{
  'shop-history': {
    key: string;
    value: HistoryEntry;
  };
}>(DB_NAME, DB_VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'date' });
  },
});

export async function getAllHistory(): Promise<HistoryEntry[]> {
  const db = await dbPromise;
  return await db.getAll(STORE_NAME);
}

export async function addHistoryEntry(entry: HistoryEntry): Promise<void> {
  const db = await dbPromise;
  await db.put(STORE_NAME, entry);
}

export async function getHistoryEntry(date: string): Promise<HistoryEntry | undefined> {
  const db = await dbPromise;
  return await db.get(STORE_NAME, date);
} 