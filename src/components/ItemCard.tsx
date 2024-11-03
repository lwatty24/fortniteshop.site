import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShopItem } from '../types';
import { Skull, Scale, Heart } from 'lucide-react';
import { rarityColors } from '../constants/rarity';
import { RarityPulse } from './RarityPulse';
import { AnimatePresence } from 'framer-motion';
import { QuickPreview } from './QuickPreview';
import { WishlistButton } from './WishlistButton';
import { format } from 'date-fns';

interface ItemCardProps {
  item: ShopItem;
  onClick?: () => void;
  isRefreshing?: boolean;
  onCompare?: () => void;
  onWishlist?: (item: ShopItem) => void;
  isSelected?: boolean;
  isWishlisted?: boolean;
  showWishlistButton?: boolean;
  isTouchDevice?: boolean;
}

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const ItemCard = React.memo(function ItemCard({ 
  item: shopItem, 
  onClick, 
  onCompare, 
  onWishlist, 
  isRefreshing, 
  isSelected, 
  isWishlisted, 
  showWishlistButton = true, 
  isTouchDevice = false 
}: ItemCardProps) {
  const rarity = rarityColors[(shopItem.rarity || 'common').toLowerCase() as keyof typeof rarityColors] || rarityColors.common;
  const [showPreview, setShowPreview] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const previewTimeoutRef = useRef<NodeJS.Timeout>();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const { scrollY } = useScroll({ 
    target: cardRef,
    layoutEffect: false
  });

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isRefreshing) {
      setMousePosition({ x: e.clientX, y: e.clientY });
      previewTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, 1250); // 2.5 second delay
    }
  };

  const handleMouseLeave = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }
    setShowPreview(false);
  };

  const imageY = useTransform(scrollY, [0, 1], ["0%", "-10%"]);

  const handleCompareClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onCompare?.();
  }, [onCompare]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isTouchDevice) {
      e.preventDefault();
      setShowPreview(true);
    }
  };

  return (
    <motion.div
      variants={floatingAnimation}
      initial="initial"
      animate="animate"
      whileHover={{ scale: isRefreshing ? 1 : 1.02, y: -5 }}
      whileTap={{ scale: isRefreshing ? 1 : 0.98 }}
      className={`group cursor-pointer ${rarity.glow} transition-all duration-300 ${isRefreshing ? 'opacity-50' : 'opacity-100'} touch-manipulation`}
      onClick={isRefreshing ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={(e) => {
        if (!isRefreshing) {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={() => setShowPreview(false)}
    >
      <div className={`relative rounded-xl bg-gradient-to-br ${rarity.gradient} p-[1.5px] overflow-hidden`}>
        <RarityPulse color={rarity.color} />
        <div className={`relative bg-white dark:bg-black/95 rounded-xl`}>
          {/* Rarity gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-[0.03]`} />
          
          {/* Content */}
          <div className="relative z-10 p-3">
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              {showWishlistButton && onWishlist && (
                <WishlistButton
                  item={shopItem}
                  isWishlisted={isWishlisted}
                  onWishlist={onWishlist}
                />
              )}
              
              {onCompare && (
                <button
                  onClick={handleCompareClick}
                  className={`p-2 rounded-lg transition-all duration-200
                    ${isSelected 
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-black/20 hover:bg-black/30 text-white'
                    }`}
                >
                  <Scale className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="aspect-square rounded-lg overflow-hidden mb-3">
              <motion.div
                style={{ y: imageY }}
                className="w-full h-full"
              >
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  src={shopItem.image}
                  alt={shopItem.name}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable="false"
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold text-black dark:text-white truncate">{shopItem.name}</h3>
                {shopItem.price && (
                  <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded-lg">
                    <img 
                      src="https://fortnite-api.com/images/vbuck.png"
                      alt="V-Bucks"
                      className="w-4 h-4 select-none pointer-events-none"
                      draggable="false"
                    />
                    <span className="text-sm font-bold text-blue-500 dark:text-blue-300">
                      {shopItem.price.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70">
                  {shopItem.type}
                </span>
                <span className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70">
                  {shopItem.rarity}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showPreview && (
          <QuickPreview 
            item={shopItem} 
            x={mousePosition.x} 
            y={mousePosition.y} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});