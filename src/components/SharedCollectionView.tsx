import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection as firestoreCollection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Collection } from '../types';
import { ItemCard } from './ItemCard';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function SharedCollectionView() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [owner, setOwner] = useState<{ displayName: string; photoURL: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const collectionsRef = firestoreCollection(db, 'collections');
        const q = query(collectionsRef, where('shareId', '==', shareId), where('isPublic', '==', true));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          navigate('/404');
          return;
        }

        const collectionData = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
          createdAt: querySnapshot.docs[0].data().createdAt.toDate(),
          updatedAt: querySnapshot.docs[0].data().updatedAt.toDate()
        } as Collection;
        
        setCollection(collectionData);

        // Fetch owner details
        const userDoc = await getDoc(doc(db, 'users', collectionData.userId));
        if (userDoc.exists()) {
          setOwner({
            displayName: userDoc.data().displayName,
            photoURL: userDoc.data().fullPhotoURL,
          });
        }
      } catch (error) {
        console.error('Error fetching shared collection:', error);
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [shareId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-black/70 dark:text-white/70 
                 hover:text-black dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl p-8 
                 border border-white/10 dark:border-white/5"
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black/90 dark:text-white mb-2">
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-black/60 dark:text-white/60 mb-4">
                {collection.description}
              </p>
            )}
            <div className="flex items-center gap-6">
              {owner && (
                <div className="flex items-center gap-2">
                  {owner.photoURL ? (
                    <img 
                      src={owner.photoURL} 
                      alt={owner.displayName}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5 text-black/50 dark:text-white/50" />
                  )}
                  <span className="text-sm font-medium text-black/70 dark:text-white/70">
                    Created by {owner.displayName}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-black/50 dark:text-white/50">
                <Calendar className="w-4 h-4" />
                {format(collection.createdAt, 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {collection.items.map((item, index) => (
            <ItemCard
              key={`${item.id}-${index}`}
              item={item}
              showWishlistButton={false}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
} 