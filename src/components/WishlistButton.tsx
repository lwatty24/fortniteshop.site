import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShopItem } from '../types';

interface WishlistButtonProps {
  item: ShopItem;
  isWishlisted: boolean;
  onWishlist: (item: ShopItem) => void;
}

export function WishlistButton({ item, isWishlisted, onWishlist }: WishlistButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        onWishlist(item);
      }}
      className={`p-2 rounded-lg transition-colors ${
        isWishlisted 
          ? 'bg-red-500/20 text-red-400'
          : 'bg-black/20 dark:bg-white/10 hover:bg-black/30 dark:hover:bg-white/20 text-black/70 dark:text-white/70'
      }`}
    >
      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
    </motion.button>
  );
} 