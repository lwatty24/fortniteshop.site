import { motion, AnimatePresence } from 'framer-motion';
import { ShopSection as ShopSectionType } from '../types';
import { ItemCard } from './ItemCard';
import { JamTrackCard } from './JamTrackCard';
import { useWishlist } from '../contexts/WishlistContext';
import { spring } from '../constants/animations';

interface ShopSectionProps {
  section: ShopSectionType;
  onItemClick?: (item: ShopItem) => void;
  onCompare?: (item: ShopItem) => void;
  isRefreshing?: boolean;
  compareItems?: ShopItem[];
}

export const sectionAnimation = {
  initial: { 
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      ...spring
    }
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      ...spring,
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

export function ShopSection({ section, onItemClick, onCompare, isRefreshing, compareItems }: ShopSectionProps) {
  const { handleWishlist, isItemWishlisted } = useWishlist();

  return (
    <motion.div
      variants={sectionAnimation}
      initial="initial"
      animate={isRefreshing ? "loading" : "animate"}
      className="max-w-[1800px] mx-auto px-6"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        <AnimatePresence mode="popLayout">
          {section.items.map((item) => (
            <motion.div 
              key={item.id} 
              variants={item}
              initial="hidden"
              animate={isRefreshing ? "loading" : "show"}
              exit="exit"
              layout
              style={{ perspective: 1000 }}
            >
              {item.isJamTrack ? (
                <JamTrackCard
                  item={item}
                  onClick={() => onItemClick(item)}
                  isRefreshing={isRefreshing}
                />
              ) : (
                <ItemCard
                  item={item}
                  onClick={() => onItemClick?.(item)}
                  onCompare={onCompare ? () => onCompare(item) : undefined}
                  onWishlist={handleWishlist}
                  isRefreshing={isRefreshing}
                  isSelected={compareItems?.some(i => i.id === item.id)}
                  isWishlisted={isItemWishlisted(item.id)}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}