import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Globe, Lock, Link } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Collection } from '../types';
import { nanoid } from 'nanoid';

interface ShareCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: Collection;
  onUpdate: (collection: Collection) => void;
}

export function ShareCollectionModal({ isOpen, onClose, collection, onUpdate }: ShareCollectionModalProps) {
  const [isPublic, setIsPublic] = useState(collection.isPublic || false);
  const shareUrl = collection.shareId 
    ? `${window.location.origin}/collection/${collection.shareId}`
    : null;

  useEffect(() => {
    setIsPublic(collection.isPublic || false);
  }, [collection]);

  const handlePrivacyChange = async () => {
    try {
      const newShareId = !collection.shareId ? nanoid(10) : collection.shareId;
      const collectionRef = doc(db, 'collections', collection.id);
      
      const updates = {
        isPublic: !isPublic,
        shareId: newShareId,
      };

      await updateDoc(collectionRef, updates);
      onUpdate({ ...collection, ...updates });
      setIsPublic(!isPublic);
      toast.success(`Collection is now ${!isPublic ? 'public' : 'private'}`);
    } catch (error) {
      toast.error('Failed to update collection privacy');
    }
  };

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    }
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
              <h2 className="text-xl font-bold text-black/90 dark:text-white">Share Collection</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-black/70 dark:text-white/70" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="w-5 h-5 text-green-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-blue-500" />
                  )}
                  <div>
                    <h3 className="font-medium text-black/90 dark:text-white/90">
                      {isPublic ? 'Public' : 'Private'} Collection
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      {isPublic 
                        ? 'Anyone with the link can view this collection' 
                        : 'Only you can view this collection'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePrivacyChange}
                  className="px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 
                           hover:bg-black/10 dark:hover:bg-white/10 
                           text-sm font-medium transition-colors"
                >
                  Make {isPublic ? 'Private' : 'Public'}
                </button>
              </div>

              {isPublic && shareUrl && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                             border border-black/10 dark:border-white/10 
                             text-black/70 dark:text-white/70"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <Copy className="w-5 h-5 text-black/70 dark:text-white/70" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 