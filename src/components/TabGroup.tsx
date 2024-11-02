import { motion } from 'framer-motion';
import { 
  User, Pickaxe, Plane, Music, Package, 
  ScrollText, Palette, Sparkles, Gamepad2, ShoppingBag, Layers, Heart 
} from 'lucide-react';

interface TabGroupProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const getTabIcon = (tabName: string) => {
  switch (tabName.toLowerCase()) {
    case 'outfit': return <User className="w-5 h-5" />;
    case 'pickaxe': return <Pickaxe className="w-5 h-5" />;
    case 'glider': return <Plane className="w-5 h-5" />;
    case 'emote': return <Music className="w-5 h-5" />;
    case 'wrap': return <ScrollText className="w-5 h-5" />;
    case 'bundle': return <Package className="w-5 h-5" />;
    case 'backbling': return <ShoppingBag className="w-5 h-5" />;
    case 'contrail': return <Sparkles className="w-5 h-5" />;
    case 'loadingscreen': return <Palette className="w-5 h-5" />;
    case 'toy': return <Gamepad2 className="w-5 h-5" />;
    case 'sets': return <Layers className="w-4 h-4" />;
    default: return <Package className="w-5 h-5" />;
  }
};

export function TabGroup({ tabs, activeTab, onTabChange }: TabGroupProps) {
  return (
    <div className="overflow-x-auto relative z-10">
      <div className="min-w-max flex justify-between items-center max-w-[1800px] mx-auto px-6">
        <motion.div layout className="flex items-center gap-2">
          {tabs.map(tab => (
            <motion.button
              layout
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                ${activeTab === tab 
                  ? 'text-black dark:text-white font-medium shadow-lg shadow-black/5 dark:shadow-white/5' 
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/50 dark:text-white/50'
                }`}
            >
              <motion.div
                animate={{ 
                  scale: activeTab === tab ? 1.1 : 1,
                  opacity: activeTab === tab ? 1 : 0.5
                }}
                transition={{ duration: 0.2 }}
              >
                {getTabIcon(tab)}
              </motion.div>
              <span className="text-sm font-medium">{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>
        <motion.div layout className="flex items-center">
          <motion.button
            layout
            onClick={() => onTabChange('Wishlist')}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
              ${activeTab === 'Wishlist'
                ? 'text-red-500 font-medium shadow-lg shadow-red-500/5' 
                : 'hover:bg-black/5 dark:hover:bg-white/5 text-black/50 dark:text-white/50'
              }`}
          >
            <motion.div
              animate={{ 
                scale: activeTab === 'Wishlist' ? 1.1 : 1,
                opacity: activeTab === 'Wishlist' ? 1 : 0.5
              }}
              transition={{ duration: 0.2 }}
            >
              <Heart className={`w-5 h-5 ${activeTab === 'Wishlist' ? 'fill-current' : ''}`} />
            </motion.div>
            <span className="text-sm font-medium">Wishlist</span>
            {activeTab === 'Wishlist' && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 bg-red-500/20 rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}