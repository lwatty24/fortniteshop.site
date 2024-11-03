import { useState, useEffect } from 'react';
import { Search, Sun, Moon, RefreshCw, Heart, Settings, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickActionsProps {
  onSearch: () => void;
  onThemeToggle: () => void;
  onRefresh: () => void;
  onWishlist: () => void;
  onSettings: () => void;
  theme: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Action {
  id: string;
  label: string;
  icon: JSX.Element;
  shortcut: string;
  action: () => void;
}

export function QuickActions({ 
  onSearch, 
  onThemeToggle, 
  onRefresh, 
  onWishlist,
  onSettings,
  theme,
  isOpen,
  onClose
}: QuickActionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions: Action[] = [
    {
      id: 'search',
      label: 'Search Items',
      icon: <Search className="w-4 h-4" />,
      shortcut: '/',
      action: onSearch
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      shortcut: '⌘T',
      action: onThemeToggle
    },
    {
      id: 'refresh',
      label: 'Refresh Shop',
      icon: <RefreshCw className="w-4 h-4" />,
      shortcut: '⌘R',
      action: onRefresh
    },
    {
      id: 'wishlist',
      label: 'View Wishlist',
      icon: <Heart className="w-4 h-4" />,
      shortcut: '⌘W',
      action: onWishlist
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      shortcut: '⌘,',
      action: onSettings
    }
  ];

  const filteredActions = actions.filter(action =>
    action.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => (i + 1) % filteredActions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
          break;
        case 'Enter':
          e.preventDefault();
          filteredActions[selectedIndex]?.action();
          onClose();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50
                     bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-xl 
                     border border-black/[0.06] dark:border-white/[0.06] shadow-2xl"
          >
            <div className="flex items-center gap-2 p-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <Command className="w-4 h-4 text-black/50 dark:text-white/50" />
              <input
                type="text"
                placeholder="Type a command..."
                className="flex-1 bg-transparent border-none outline-none 
                         text-black dark:text-white placeholder-black/50 
                         dark:placeholder-white/50"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(0);
                }}
                autoFocus
              />
            </div>
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {filteredActions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => {
                    action.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg
                           text-left text-sm
                           ${index === selectedIndex
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-black dark:text-white'
                  }`}
                >
                  {action.icon}
                  <span className="flex-1">{action.label}</span>
                  <kbd className="px-2 py-1 rounded bg-black/5 dark:bg-white/5 
                               text-black/50 dark:text-white/50 text-xs">
                    {action.shortcut}
                  </kbd>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 