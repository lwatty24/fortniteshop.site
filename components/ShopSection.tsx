import { motion, AnimatePresence } from 'framer-motion';
import { ShopSection as ShopSectionType } from '../types';
import { ItemCard } from './ItemCard';
import { JamTrackCard } from './JamTrackCard';
import { useWishlist } from '../contexts/WishlistContext';

interface ShopSectionProps {
  section: ShopSectionType;
  onItemClick?: (item: ShopItem) => void;
  onCompare?: (item: ShopItem) => void;
  isRefreshing?: boolean;
  compareItems?: ShopItem[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  loading: {
    opacity: 0.5,
    transition: {
      duration: 0.3
    }
  }
};

const item = {
  hidden: { 
    opacity: 0,
    rotateX: -15,
    translateY: 50
  },
  show: { 
    opacity: 1,
    rotateX: 0,
    translateY: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  loading: {
    opacity: 0.5,
    scale: 0.98,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    rotateX: 15,
    translateY: -50,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

export function ShopSection({ section, onItemClick, onCompare, isRefreshing, compareItems }: ShopSectionProps) {
  const { handleWishlist, isItemWishlisted } = useWishlist();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={isRefreshing ? "loading" : "show"}
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