import { openDB } from 'idb';

const DB_NAME = 'fortnite-shop-cache';
const STORE_NAME = 'api-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const db = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});

export async function getCachedData(key: string) {
  const cache = await (await db).get(STORE_NAME, key);
  if (!cache) return null;
  
  if (Date.now() - cache.timestamp > CACHE_DURATION) {
    await (await db).delete(STORE_NAME, key);
    return null;
  }
  
  return cache.data;
}

export async function setCachedData(key: string, data: any) {
  await (await db).put(STORE_NAME, {
    data,
    timestamp: Date.now()
  }, key);
} 