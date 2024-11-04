import { format } from 'date-fns';
import { RotateCcw, Calendar, Store } from 'lucide-react';
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
            <div className="flex flex-col">
              <h1 className="text-[1.7rem] font-extrabold tracking-tight flex items-baseline gap-3">
                <span className="relative">
                  <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Fortnite Shop
                  </span>
                  <div className="absolute -bottom-px left-0 right-0 h-[1px] bg-gradient-to-r from-violet-600/40 via-blue-600/40 to-cyan-500/40" />
                </span>
                <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-cyan-500/10 text-violet-600/70 dark:text-violet-400/70">
                  BETA
                </span>
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <Store className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                <span className="text-xs font-medium text-black/40 dark:text-white/40">
                  Track daily item shop rotations and history
                </span>
              </div>
            </div>
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