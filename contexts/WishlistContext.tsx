import { createContext, useContext, useState, useEffect } from 'react';
import { ShopItem } from '../types';
import { Toast } from '../components/Toast';
import { useNotifications } from '../contexts/NotificationContext';

interface WishlistContextType {
  wishlist: ShopItem[];
  isItemWishlisted: (id: string) => boolean;
  handleWishlist: (item: ShopItem) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isSubscribed, email } = useNotifications();
  const [wishlist, setWishlist] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('wishlisted-items');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    localStorage.setItem('wishlisted-items', JSON.stringify(wishlist));
  }, [wishlist]);

  const isItemWishlisted = (id: string) => wishlist.some(item => item.id === id);

  const handleWishlist = (item: ShopItem) => {
    setWishlist(prev => {
      const isRemoving = isItemWishlisted(item.id);
      const message = isRemoving
        ? `${item.name} removed from wishlist`
        : `${item.name} added to wishlist${isSubscribed ? ' - You\'ll be notified when it returns!' : ''}`;

      setToast({ show: true, message });
      
      if (isRemoving) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });

    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isItemWishlisted, handleWishlist }}>
      {children}
      <Toast 
        message={toast.message}
        isVisible={toast.show}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}; 