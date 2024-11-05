import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, RotateCcw, Trash2, Pencil } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { useCollections } from '../contexts/CollectionsContext';
import { Collection, ShopItem } from '../types';
import { ItemCard } from './ItemCard';
import { toast } from 'sonner';
import { useSearch } from '../hooks/useSearch';
import { EditCollectionModal } from './EditCollectionModal';

interface CollectionItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
}

export function CollectionItemsModal({ isOpen, onClose, collection }: CollectionItemsModalProps) {
  const { query, setQuery, results: searchResults, isSearching, performSearch } = useSearch();
  const { addItemToCollection, removeItemFromCollection, deleteCollection } = useCollections();
  const [activeTab, setActiveTab] = useState<'collection' | 'search'>('collection');
  const [localCollection, setLocalCollection] = useState(collection);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    performSearch(query);
  }, [query, performSearch]);

  useEffect(() => {
    setLocalCollection(collection);
  }, [collection]);

  const handleAddItem = async (item: ShopItem) => {
    const isDuplicate = localCollection.items.some(
      i => i.id === item.id || i.name.toLowerCase() === item.name.toLowerCase()
    );

    if (isDuplicate) {
      toast.error('This item is already in the collection');
      return;
    }

    try {
      await addItemToCollection(collection.id, item);
      setLocalCollection(prev => ({
        ...prev,
        items: [...prev.items, item]
      }));
      toast.success('Item added to collection');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item to collection');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItemFromCollection(collection.id, itemId);
      setLocalCollection(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
      toast.success('Item removed from collection');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item from collection');
    }
  };

  const handleDeleteCollection = async () => {
    setShowDeleteConfirm(true);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[80vh] bg-white dark:bg-gray-900 rounded-2xl shadow-xl 
                     flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-black/90 dark:text-white">
                  {collection.name}
                </h2>
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('collection')}
                    className={`px-4 py-2 rounded-l-lg transition-colors ${
                      activeTab === 'collection'
                        ? 'bg-blue-500 text-white'
                        : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70'
                    }`}
                  >
                    Collection ({localCollection.items.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('search')}
                    className={`px-4 py-2 rounded-r-lg transition-colors ${
                      activeTab === 'search'
                        ? 'bg-blue-500 text-white'
                        : 'bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70'
                    }`}
                  >
                    Add Items
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 rounded-lg hover:bg-blue-500/10 text-blue-500 transition-colors"
                  title="Edit Collection"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteCollection}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                  title="Delete Collection"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5 text-black/70 dark:text-white/70" />
                </button>
              </div>
            </div>

            {activeTab === 'search' && (
              <div className="p-6 border-b border-black/5 dark:border-white/5">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search items..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] 
                             border border-black/10 dark:border-white/10 
                             focus:border-blue-500/30 dark:focus:border-blue-400/30
                             text-black dark:text-white outline-none"
                  />
                  {isSearching ? (
                    <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
                  ) : (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {activeTab === 'collection' ? (
                  localCollection.items.map(item => (
                    <div key={item.id} className="relative group">
                      <ItemCard
                        key={item.id}
                        item={item}
                        showWishlistButton={false}
                        onClick={() => handleRemoveItem(item.id)}
                      />
                      <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 
                                       transition-colors rounded-xl pointer-events-none" />
                    </div>
                  ))
                ) : (
                  searchResults.map(item => (
                    <div key={item.id} className="relative group">
                      <ItemCard
                        item={item}
                        showWishlistButton={false}
                      />
                      <button
                        onClick={() => handleAddItem(item)}
                        className="absolute inset-0 flex items-center justify-center bg-blue-500/80 
                                 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                      >
                        <Plus className="w-8 h-8 text-white" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
          >
            <div className="p-6">
              <h3 className="text-xl font-bold text-black/90 dark:text-white mb-2">
                Delete Collection
              </h3>
              <p className="text-black/70 dark:text-white/70 mb-6">
                Are you sure you want to delete "{collection.name}"? This action cannot be undone 
                and all items in this collection will be removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 p-3 rounded-xl border border-black/10 dark:border-white/20 
                           text-black/70 dark:text-white/70 hover:bg-black/5 
                           dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await deleteCollection(collection.id);
                      toast.success('Collection deleted');
                      onClose();
                    } catch (error) {
                      console.error('Error deleting collection:', error);
                      toast.error('Failed to delete collection');
                    }
                  }}
                  className="flex-1 p-3 rounded-xl bg-red-500 hover:bg-red-600 
                           text-white font-medium transition-colors"
                >
                  Delete Collection
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {showEditModal && (
        <EditCollectionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          collection={collection}
        />
      )}
    </AnimatePresence>,
    document.body
  );
} 