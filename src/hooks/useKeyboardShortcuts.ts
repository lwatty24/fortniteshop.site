import { useEffect } from 'react';

interface ShortcutConfig {
  onSearch?: () => void;
  onClose?: () => void;
  onRefresh?: () => void;
  onThemeToggle?: () => void;
  onWishlist?: () => void;
}

export function useKeyboardShortcuts({
  onSearch,
  onClose,
  onRefresh,
  onThemeToggle,
  onWishlist
}: ShortcutConfig) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case '/':
          e.preventDefault();
          onSearch?.();
          break;
        case 'escape':
          onClose?.();
          break;
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onRefresh?.();
          }
          break;
        case 't':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onThemeToggle?.();
          }
          break;
        case 'w':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onWishlist?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSearch, onClose, onRefresh, onThemeToggle, onWishlist]);
} 