import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useCollections } from '../contexts/CollectionsContext';

interface NewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewCollectionModal({ isOpen, onClose }: NewCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { addCollection } = useCollections();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCollection(name, description);
    onClose();
    setName('');
    setDescription('');
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
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <h2 className="text-xl font-bold text-black/90 dark:text-white">Create New Collection</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-black/70 dark:text-white/70" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                           border border-black/10 dark:border-white/10 
                           focus:border-blue-500/50 dark:focus:border-blue-400/50
                           text-black dark:text-white outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                           border border-black/10 dark:border-white/10 
                           focus:border-blue-500/50 dark:focus:border-blue-400/50
                           text-black dark:text-white outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 p-3 rounded-xl border border-black/10 dark:border-white/10 
                           hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 
                           text-white font-medium hover:from-blue-600 hover:to-violet-600 
                           transition-all"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 