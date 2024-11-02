import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useWishlist } from '../contexts/WishlistContext';
import { ShopItem } from '../types';

export function useWishlistNotifications(shopData: ShopItem[]) {
  const { wishlist } = useWishlist();
  const prevShopDataRef = useRef<ShopItem[]>([]);

  useEffect(() => {
    if (!wishlist || !shopData.length) return;

    // Only check for notifications if we have previous shop data
    if (prevShopDataRef.current.length > 0) {
      const newlyAvailableItems = shopData.filter(item => 
        wishlist.some(wishedItem => wishedItem.id === item.id) && 
        !prevShopDataRef.current.some(prevItem => prevItem.id === item.id)
      );

      newlyAvailableItems.forEach(item => {
        toast.success(
          `${item.name} is back!`,
          {
            description: `Available for ${item.price.toLocaleString()} V-Bucks`,
            duration: 5000,
            dismissible: true,
            action: {
              label: 'View',
              onClick: () => {
                window.location.hash = 'wishlist';
              }
            },
          }
        );
      });
    }

    // Update previous shop data reference
    prevShopDataRef.current = shopData;
  }, [shopData]);
} 