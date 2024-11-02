import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ShopItem } from '../types';
import { X, Star, Tag, Package, Skull, Download, Heart, Sparkles, History } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { rarityColors } from '../constants/rarity';
import { useWishlist } from '../contexts/WishlistContext';
import { WishlistButton } from './WishlistButton';

interface ItemDetailsProps {
  item: ShopItem;
  onClose: () => void;
}

export function ItemDetails({ item, onClose }: ItemDetailsProps) {
  const rarity = rarityColors[item.rarity.toLowerCase() as keyof typeof rarityColors] || rarityColors.common;

  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const { isItemWishlisted, handleWishlist } = useWishlist();

  const isWishlisted = isItemWishlisted(item);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleDownload = async () => {
    try {
      const response = await fetch(item.featuredImage || item.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only calculate position when zooming in
    if (!isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setCursorPosition({ x, y });
      setMousePosition({ x, y });
    }
    
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Smooth cursor movement
    setCursorPosition({ x, y });
    
    // Smooth image movement with dampening
    setMousePosition(prev => ({
      x: prev.x + (x - prev.x) * 0.1,
      y: prev.y + (y - prev.y) * 0.1,
    }));
  };

  const renderBundleItems = () => {
    if (!item.isBundle || !item.bundleItems?.length) return null;

    return (
      <div className="bg-black/40 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-white/90" />
          <span className="text-lg font-bold text-white">
            Included Items
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {item.bundleItems.map((bundleItem) => (
            <div 
              key={bundleItem.id}
              className="flex items-center gap-3 bg-black/40 p-2 rounded-lg"
            >
              <img 
                src={bundleItem.image}
                alt={bundleItem.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <div className="text-sm font-medium text-white">{bundleItem.name}</div>
                <div className="text-xs text-white/70">{bundleItem.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", bounce: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl"
      >
        <div className={`relative rounded-xl overflow-hidden ${rarity.glow}`}>
          <div className={`relative bg-gradient-to-br ${rarity.gradient} p-[1px]`}>
            <div className="relative bg-white dark:bg-black/95 rounded-xl">
              {/* Rarity gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${rarity.gradient} opacity-[0.03]`} />
              
              {/* Content */}
              <div className="relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/10 dark:bg-black/40 hover:bg-black/20 dark:hover:bg-white/10 transition-all duration-200"
                >
                  <X className="w-5 h-5 text-black/70 dark:text-white/90" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                  {/* Image Section */}
                  <div 
                    className="relative aspect-[3/4] rounded-lg overflow-hidden bg-black/40 group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => isZoomed && setIsZoomed(false)}
                  >
                    <motion.img
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ 
                        scale: isZoomed ? 2.5 : 1,
                        opacity: 1,
                        x: isZoomed ? `${-mousePosition.x}%` : 0,
                        y: isZoomed ? `${-mousePosition.y}%` : 0,
                      }}
                      transition={{ 
                        scale: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.4 },
                        x: { type: "spring", stiffness: 100, damping: 30 },
                        y: { type: "spring", stiffness: 100, damping: 30 }
                      }}
                      src={item.featuredImage || item.image}
                      alt={item.name}
                      className={`w-full h-full object-cover cursor-zoom-${isZoomed ? 'out' : 'in'}`}
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      onClick={handleImageClick}
                    />
                    
                    {/* Zoom indicator */}
                    <div className={`absolute inset-0 transition-opacity duration-200 ${isZoomed ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'}`}>
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-medium text-white/90">Click to zoom</span>
                      </div>
                    </div>
                    
                    {item.isFortnitemares && (
                      <div className="absolute top-4 right-4 bg-orange-500/20 backdrop-blur-sm p-2 rounded-lg">
                        <Skull className="w-5 h-5 text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-wide text-black dark:text-white mb-2">
                        {item.name}
                      </h2>
                      <p className="text-lg text-black/70 dark:text-white/70">{item.description}</p>
                    </div>

                    <div className="space-y-6">
                      {/* Main Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/5 dark:bg-black/40 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="w-5 h-5 text-black/70 dark:text-white/90" />
                            <span className="text-sm text-black/50 dark:text-white/50">Type</span>
                          </div>
                          <span className="text-lg font-bold text-black dark:text-white uppercase">
                            {item.type}
                          </span>
                        </div>

                        <div className="bg-black/5 dark:bg-black/40 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Star className="w-5 h-5 text-black/70 dark:text-white/90" />
                            <span className="text-sm text-black/50 dark:text-white/50">Rarity</span>
                          </div>
                          <span className="text-lg font-bold text-black dark:text-white uppercase">
                            {item.rarity}
                          </span>
                        </div>

                        {item.price && (
                          <div className="bg-black/5 dark:bg-black/40 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <img 
                                src="https://fortnite-api.com/images/vbuck.png" 
                                alt="V-Bucks"
                                className="w-5 h-5"
                              />
                              <span className="text-sm text-black/50 dark:text-white/50">Price</span>
                            </div>
                            <span className="text-lg font-bold text-blue-500 dark:text-blue-300">
                              {item.price.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {item.series && (
                          <div className="bg-black/5 dark:bg-black/40 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <Sparkles className="w-5 h-5 text-black/70 dark:text-white/90" />
                              <span className="text-sm text-black/50 dark:text-white/50">Series</span>
                            </div>
                            <span className="text-lg font-bold text-black dark:text-white uppercase">
                              {item.series}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Wishlist Status */}
                      <div className={`rounded-lg p-4 ${
                        isWishlisted 
                          ? 'bg-red-500/10 dark:bg-red-500/20' 
                          : 'bg-black/5 dark:bg-black/40'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Heart 
                              className={`w-5 h-5 ${
                                isWishlisted 
                                  ? 'text-red-500 dark:text-red-400' 
                                  : 'text-black/70 dark:text-white/90'
                              }`} 
                            />
                            <span className={`text-lg font-bold uppercase ${
                              isWishlisted 
                                ? 'text-red-500 dark:text-red-400' 
                                : 'text-black dark:text-white'
                            }`}>
                              Wishlist
                            </span>
                          </div>
                          <WishlistButton
                            item={item}
                            isWishlisted={isWishlisted}
                            onWishlist={handleWishlist}
                            size="lg"
                          />
                        </div>
                      </div>

                      {/* Set Info */}
                      {item.set && (
                        <div className="bg-black/5 dark:bg-black/40 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Tag className="w-5 h-5 text-black/70 dark:text-white/90" />
                            <span className="text-lg font-bold text-black dark:text-white uppercase">
                              {item.set}
                            </span>
                          </div>
                          {item.setImage && (
                            <img 
                              src={item.setImage} 
                              alt={item.set}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      )}

                      {/* History Info */}
                      <div className="bg-black/5 dark:bg-black/40 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <History className="w-5 h-5 text-black/70 dark:text-white/90" />
                          <span className="text-lg font-bold text-black dark:text-white uppercase">
                            History
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-black dark:text-white mb-1">
                              {item.history?.occurrences ?? 0}
                            </div>
                            <div className="text-xs text-black/50 dark:text-white/50 uppercase">
                              Appearances
                            </div>
                          </div>
                          <div className="text-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                            <div className="text-sm font-bold text-black dark:text-white mb-1">
                              {item.history?.firstSeen ? 
                                format(new Date(item.history.firstSeen), 'MMM d, yyyy') : 
                                format(new Date(item.added), 'MMM d, yyyy')
                              }
                            </div>
                            <div className="text-xs text-black/50 dark:text-white/50 uppercase">
                              First Seen
                            </div>
                          </div>
                          <div className="text-center p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                            <div className="text-sm font-bold text-black dark:text-white mb-1">
                              {item.history?.lastSeen ?
                                formatDistanceToNow(new Date(item.history.lastSeen), { addSuffix: true }) :
                                'New'
                              }
                            </div>
                            <div className="text-xs text-black/50 dark:text-white/50 uppercase">
                              Last Available
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
