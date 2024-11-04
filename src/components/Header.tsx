import { format } from 'date-fns';
import { RotateCcw, Calendar, Search, Sun, Moon, X } from 'lucide-react';
import { ShopTimer } from './ShopTimer';

interface HeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  theme: string;
  onThemeToggle: () => void;
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
}

export function Header({ isLoading, onRefresh, theme, onThemeToggle, query, setQuery, isSearching }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-white/95 via-white/90 to-white/80 dark:from-black/95 dark:via-black/90 dark:to-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo Section */}
          <div className="flex-none">
            <div className="flex flex-col">
              <h1 className="relative flex items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 
                                rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 
                                group-hover:duration-200" />
                  <div className="relative flex items-center">
                    <span className="text-4xl font-black tracking-tight text-black dark:text-white">
                      Fortnite
                    </span>
                    <div className="mx-1.5 h-8 w-px bg-gradient-to-b from-black/0 via-black/10 to-black/0 
                                  dark:from-white/0 dark:via-white/10 dark:to-white/0" />
                    <span className="text-4xl font-black tracking-tight bg-gradient-to-br 
                                  from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      Shop
                    </span>
                    <div className="relative ml-3">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 
                                    rounded-full opacity-25 blur-sm" />
                      <span className="relative px-2 py-0.5 text-[0.65rem] font-bold rounded-full 
                                    bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500
                                    text-white tracking-wider">
                        BETA
                      </span>
                    </div>
                  </div>
                </div>
              </h1>
              <div className="relative mt-1">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/10 to-violet-500/0 
                              rounded blur-sm" />
                <span className="relative text-[0.7rem] font-medium text-black/50 dark:text-white/50 
                              tracking-[0.2em] uppercase">
                  Item Shop Tracker
                </span>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter items..."
              className="w-full px-4 py-2 pl-10 rounded-xl
                       bg-black/5 dark:bg-white/5 
                       hover:bg-black/10 dark:hover:bg-white/10
                       focus:bg-black/10 dark:focus:bg-white/10
                       border border-transparent
                       focus:border-blue-500/20 dark:focus:border-blue-400/20
                       text-black/70 dark:text-white/70 
                       placeholder-black/40 dark:placeholder-white/40
                       outline-none
                       transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg
                         hover:bg-black/5 dark:hover:bg-white/5
                         text-black/40 dark:text-white/40
                         hover:text-black/70 dark:hover:text-white/70
                         transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/70 dark:text-blue-400/70 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-br from-black/5 via-black/3 to-black/5 dark:from-white/5 dark:via-white/3 dark:to-white/5">
                <Calendar className="w-4 h-4 text-black/50 dark:text-white/50" />
                <time className="text-sm font-medium text-black/70 dark:text-white/70">
                  {format(new Date(), 'MMM d, yyyy')}
                </time>
              </div>
              
              <div className="h-6 w-px bg-black/5 dark:bg-white/5" />
              
              <div className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-violet-500/5">
                <ShopTimer />
              </div>
            </div>

            <div className="h-6 w-px bg-black/5 dark:bg-white/5" />
            
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-black/70 dark:text-white/70" />
              ) : (
                <Moon className="w-5 h-5 text-black/70 dark:text-white/70" />
              )}
            </button>
            
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className={`w-5 h-5 text-black/70 dark:text-white/70 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 