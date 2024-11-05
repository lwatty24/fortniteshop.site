import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopSection as ShopSectionComponent } from './components/ShopSection';
import { ErrorState } from './components/ErrorState';
import { TabGroup } from './components/TabGroup';
import { ShopSection, ShopItem } from './types';
import { format } from 'date-fns';
import { RotateCcw, Search, Sun, Moon, Heart, Clock, Calendar } from 'lucide-react';
import { fetchShopData } from './api/fortnite';
import { ItemDetails } from './components/ItemDetails';
import { useTheme } from './contexts/ThemeContext';
import { CompareItems } from './components/CompareItems';
import { ItemCard } from './components/ItemCard';
import { CompareModal } from './components/CompareModal';
import { SetCollections } from './components/SetCollections';
import { WishlistProvider } from './contexts/WishlistContext';
import { WishlistTab } from './components/WishlistTab';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationSettings } from './components/NotificationSettings';
import { NotificationProvider } from './contexts/NotificationContext';
import { Toaster } from 'sonner';
import { useWishlistNotifications } from './hooks/useWishlistNotifications';
import { ShopHistory } from './components/ShopHistory';
import { useShopHistory } from './hooks/useShopHistory';
import { ShopTimer } from './components/ShopTimer';
import { QuickActions } from './components/QuickActions';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { performanceMonitor } from './services/performance';
import * as LazyComponents from './components/LazyComponents';
import { analytics } from './services/analytics';
import { errorTracker } from './services/errorTracking';
import { Header } from './components/Header';
import { useSearch } from './hooks/useSearch';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './components/ProfilePage';
import { CollectionsProvider } from './contexts/CollectionsContext';
import { SharedCollectionView } from './components/SharedCollectionView';


function App() {
  const [shopData, setShopData] = useState<ShopSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Fortnitemares');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [compareItems, setCompareItems] = useState<ShopItem[]>([]);
  const { addToHistory } = useShopHistory();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const { query, setQuery, isSearching, results } = useSearch();

  const loadShopData = async () => {
    try {
      analytics.track('shop_data_load_started');
      setIsLoading(true);
      setIsRefreshing(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const data = await performanceMonitor.measureAsync('shop_data_load', 
        fetchShopData(controller.signal)
      );
      clearTimeout(timeoutId);
      
      setShopData(data);
      addToHistory(data);
      setActiveTab(data[0]?.name || 'Featured');
      
      analytics.track('shop_data_load_success', {
        sections: data.length,
        items: data.reduce((acc, section) => acc + section.items.length, 0)
      });
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(err.message);
      errorTracker.trackError(error, { 
        component: 'App',
        action: 'loadShopData' 
      });
      setError(error.message || 'An unexpected error occurred');
      analytics.track('shop_data_load_error', { error: error.message });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadShopData();
  }, []);

  useWishlistNotifications(shopData.flatMap(section => section.items));

  const tabs = useMemo(() => [
    'Sets', 
    'History', 
    ...new Set(
      shopData
        .filter(section => section.name !== 'Jam Tracks' && section.name !== 'Bundle')
        .map(section => section.name)
    ),
    'Bundle',
  ], [shopData]);
  const activeSection = shopData.find(section => section.name === activeTab);

  console.log('Available sections:', shopData.map(s => s.name));

  const filteredShopData = useMemo(() => {
    if (!query) return shopData;
    
    return shopData.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(section => section.items.length > 0);
  }, [shopData, query]);

  const handleCompare = (item: ShopItem) => {
    setCompareItems(prev => {
      if (prev.find(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      }
      if (prev.length >= 2) {
        return [prev[1], item];
      }
      return [...prev, item];
    });
  };

  const content = activeTab === 'Wishlist' ? (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponents.WishlistTab onItemClick={setSelectedItem} />
    </Suspense>
  ) : activeTab === 'Sets' ? (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponents.SetCollections 
        items={shopData.flatMap(section => section.items)}
        onItemClick={setSelectedItem}
      />
    </Suspense>
  ) : activeTab === 'History' ? (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponents.ShopHistory />
    </Suspense>
  ) : filteredShopData.find(s => s.name === activeTab) ? (
    <Suspense fallback={<LoadingSkeleton />}>
      <LazyComponents.ShopSectionComponent
        section={filteredShopData.find(s => s.name === activeTab)}
        onItemClick={setSelectedItem}
        onCompare={handleCompare}
        isRefreshing={isRefreshing}
        compareItems={compareItems}
      />
    </Suspense>
  ) : null;

  useKeyboardShortcuts({
    onSearch: () => setShowSearch(true),
    onClose: () => {
      setSelectedItem(null);
      setShowQuickActions(false);
    },
    onRefresh: loadShopData,
    onThemeToggle: toggleTheme,
    onWishlist: () => setActiveTab('Wishlist'),
    onQuickActions: () => setShowQuickActions(true)
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#1A1A1A] transition-colors">
      <Toaster 
        position="bottom-right"
        theme={theme === 'dark' ? 'dark' : 'light'}
        closeButton
        richColors
        dismissible
        expand={false}
      />
      <Header 
        isLoading={isLoading} 
        onRefresh={loadShopData}
        theme={theme}
        onThemeToggle={toggleTheme}
        query={query}
        setQuery={setQuery}
        isSearching={isSearching}
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <main className="relative">
              {error ? (
                <ErrorState message={error} onRetry={loadShopData} />
              ) : (
                <>
                  <div className="py-8">
                    <div className="max-w-[1800px] mx-auto px-6">
                      <TabGroup
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                      />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {content}
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </main>
          } 
        />
        <Route 
          path="/profile" 
          element={<ProfilePage />} 
        />
        <Route path="/collection/:shareId" element={<SharedCollectionView />} />
      </Routes>

      <AnimatePresence>
        {selectedItem && (
          <Suspense fallback={<LoadingSkeleton />}>
            <LazyComponents.ItemDetails
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          </Suspense>
        )}

        {compareItems.length === 2 && (
          <Suspense fallback={<LoadingSkeleton />}>
            <LazyComponents.CompareModal
              items={[compareItems[0], compareItems[1]]}
              onClose={() => setCompareItems([])}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <QuickActions
        onSearch={() => setShowSearch(true)}
        onThemeToggle={toggleTheme}
        onRefresh={loadShopData}
        onWishlist={() => setActiveTab('Wishlist')}
        onSettings={() => {}}
        theme={theme}
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
      />
    </div>
  );
}

export default function AppWithProviders() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <ThemeProvider>
          <WishlistProvider>
            <CollectionsProvider>
              <App />
            </CollectionsProvider>
          </WishlistProvider>
        </ThemeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}