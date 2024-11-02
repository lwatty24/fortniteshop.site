import { useState, useEffect } from 'react';
import { ShopItem } from '../types';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (item: ShopItem) => {
    setWishlist(prev => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== itemId));
  };

  const isWishlisted = (itemId: string) => {
    return wishlist.some(item => item.id === itemId);
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isWishlisted
  };
} 