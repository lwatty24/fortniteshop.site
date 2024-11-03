import { useState, useMemo } from 'react';
import { format, subDays, addDays, isFuture, isAfter, startOfDay } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Package, 
  User, 
  Music, 
  Paintbrush, 
  Axe, 
  Plane, 
  Music2, 
  Image, 
  Sparkles 
} from 'lucide-react';
import { ShopSection } from './ShopSection';
import { motion } from 'framer-motion';
import { useShopHistory } from '../hooks/useShopHistory';


export function ShopHistory() {
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const { getShopForDate, getAvailableDates } = useShopHistory();
  const availableDates = getAvailableDates();
  
  const historyData = getShopForDate(format(selectedDate, 'yyyy-MM-dd'));

  const navigateDate = (days: number) => {
    const currentIndex = availableDates.indexOf(format(selectedDate, 'yyyy-MM-dd'));
    const newIndex = currentIndex + (days > 0 ? -1 : 1); // Reverse direction for intuitive navigation
    
    if (newIndex >= 0 && newIndex < availableDates.length) {
      setSelectedDate(new Date(availableDates[newIndex]));
    }
  };

  const sectionIcons = useMemo(() => ({
    'Outfit': <User className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Bundle': <Package className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Emote': <Music className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Wrap': <Paintbrush className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Pickaxe': <Axe className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Glider': <Plane className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Music': <Music2 className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Loading': <Image className="w-5 h-5 text-black/50 dark:text-white/50" />,
    'Contrail': <Sparkles className="w-5 h-5 text-black/50 dark:text-white/50" />
  }), []);

  return (
    <div className="max-w-[1800px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black/90 dark:text-white/90">
            Shop History
          </h2>
          <p className="text-sm text-black/50 dark:text-white/50">
            Browse previous item shop rotations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate(1)}
            className="p-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 
                     dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={availableDates.indexOf(format(selectedDate, 'yyyy-MM-dd')) === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 
                        dark:bg-white/10 border border-transparent dark:border-white/10">
            <Calendar className="w-5 h-5 text-black/70 dark:text-white/90" />
            <span className="text-black/70 dark:text-white/90 font-medium">
              {format(selectedDate, 'MMM d, yyyy')}
            </span>
          </div>
          
          <button
            onClick={() => navigateDate(-1)}
            className="p-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 
                     dark:hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={availableDates.indexOf(format(selectedDate, 'yyyy-MM-dd')) === availableDates.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!historyData?.sections ? (
        <div className="text-center py-12 text-black/50 dark:text-white/50">
          No shop data available for this date
        </div>
      ) : (
        <div className="space-y-12">
          {historyData.sections.map((section) => (
            <div key={section.name} className="bg-black/[0.02] dark:bg-white/[0.02] rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {sectionIcons[section.name] || <Package className="w-5 h-5 text-black/50 dark:text-white/50" />}
                  <div>
                    <h3 className="text-lg font-bold text-black/80 dark:text-white/80">
                      {section.name}
                    </h3>
                    <p className="text-sm text-black/50 dark:text-white/50">
                      {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ShopSection
                  key={section.name}
                  section={section}
                  isHistorical
                />
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 