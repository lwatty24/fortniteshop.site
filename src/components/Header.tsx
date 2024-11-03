import { format } from 'date-fns';
import { RotateCcw, Calendar } from 'lucide-react';
import { ShopTimer } from './ShopTimer';

interface HeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export function Header({ isLoading, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-white/95 via-white/90 to-white/80 dark:from-black/95 dark:via-black/90 dark:to-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-black dark:from-white to-black/80 dark:to-white/80 bg-clip-text text-transparent">
              ITEM STORE
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 rounded-lg px-3 py-1.5">
                <Calendar className="w-4 h-4 text-black/70 dark:text-white/70" />
                <time className="text-sm font-medium text-black/70 dark:text-white/70">
                  {format(new Date(), 'MMM d, yyyy')}
                </time>
              </div>
              <ShopTimer />
            </div>
          </div>
          
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className={`w-5 h-5 text-black/70 dark:text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
} 