import { motion } from 'framer-motion';
import { User, Heart, Calendar, Settings, LogOut, Package, Clock, Sparkles, Trophy, Camera, Plus, FolderPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ItemCard } from './ItemCard';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProfileSettings } from './ProfileSettings';
import { ProfilePictureUpload } from './ProfilePictureUpload';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useCollections } from '../contexts/CollectionsContext';
import { NewCollectionModal } from './NewCollectionModal';
import { Collection } from '../types';
import { CollectionItemsModal } from './CollectionItemsModal';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { wishlist, handleWishlist } = useWishlist();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showPictureUpload, setShowPictureUpload] = useState(false);
  const [fullPhotoURL, setFullPhotoURL] = useState<string | null>(null);
  const { collections, isLoading, error } = useCollections();
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (user) {
      const fetchFullPhoto = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setFullPhotoURL(userDoc.data().fullPhotoURL);
        }
      };
      fetchFullPhoto();
    }
  }, [user]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { 
      icon: <Heart className="w-5 h-5 text-pink-500" />,
      value: wishlist.length,
      label: 'Wishlisted Items',
      color: 'from-pink-500/20 to-rose-500/20'
    },
    { 
      icon: <Clock className="w-5 h-5 text-blue-500" />,
      value: format(new Date(user.metadata.creationTime), 'MMM d'),
      label: 'Member Since',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    { 
      icon: <Package className="w-5 h-5 text-purple-500" />,
      value: collections.length.toString(),
      label: 'Collections',
      color: 'from-purple-500/20 to-indigo-500/20'
    },
    { 
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
      value: 'Novice',
      label: 'Collector Rank',
      color: 'from-amber-500/20 to-yellow-500/20'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-64 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="absolute right-8 top-8 w-32 h-32 text-white/10" />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 transform translate-y-1/3 px-8"
        >
          <div className="flex items-end justify-between">
            <div className="flex items-end gap-6">
              <div className="relative group cursor-pointer" onClick={() => setShowPictureUpload(true)}>
                <div className="absolute -inset-3 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000" />
                <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-white dark:bg-gray-800 shadow-2xl">
                  <img 
                    src={fullPhotoURL || user.photoURL} 
                    alt={user.displayName} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="mb-4 relative z-10">
                <h1 className="text-3xl font-bold text-white mb-1">{user.displayName}</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {format(new Date(user.metadata.creationTime), 'MMMM yyyy')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mb-4">
              <button 
                onClick={() => setShowSettings(true)} 
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl
                      border border-white/10 dark:border-white/5`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white dark:bg-black/50">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-black/90 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-black/60 dark:text-white/60">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Collections Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl p-8 border border-white/10 dark:border-white/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black/90 dark:text-white">Collections</h2>
          <button
            onClick={() => setShowNewCollection(true)}
            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
          >
            <FolderPlus className="w-5 h-5 text-blue-500" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map(collection => (
            <div
              key={collection.id}
              onClick={() => setSelectedCollection(collection)}
              className="group relative p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-violet-500/5 
                       border border-white/10 hover:border-blue-500/20 transition-all cursor-pointer"
            >
              <h3 className="text-lg font-bold text-black/90 dark:text-white mb-2">
                {collection.name}
              </h3>
              <p className="text-sm text-black/60 dark:text-white/60 mb-4">
                {collection.description || 'No description'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black/50 dark:text-white/50">
                  {collection.items.length} items
                </span>
                <span className="text-sm text-black/50 dark:text-white/50">
                  {format(collection.createdAt, 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => setShowNewCollection(true)}
            className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed 
                      border-black/10 dark:border-white/10 hover:border-blue-500/30 transition-colors"
          >
            <Plus className="w-8 h-8 text-black/30 dark:text-white/30 mb-2" />
            <span className="text-sm font-medium text-black/50 dark:text-white/50">
              Create New Collection
            </span>
          </button>
        </div>
      </motion.div>

      {/* Wishlist Section */}
      {wishlist.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl p-8 border border-white/10 dark:border-white/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black/90 dark:text-white">Favorite Items</h2>
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {wishlist.map(item => (
              <div key={item.id} className="relative group">
                <ItemCard
                  key={item.id}
                  item={item}
                  isWishlisted={true}
                  showWishlistButton={false}
                  onClick={() => handleWishlist(item)}
                />
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 
                       transition-colors rounded-xl pointer-events-none" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {showSettings && (
        <ProfileSettings 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      {showPictureUpload && (
        <ProfilePictureUpload
          isOpen={showPictureUpload}
          onClose={() => setShowPictureUpload(false)}
          currentPhotoURL={fullPhotoURL || user.photoURL}
        />
      )}

      {showNewCollection && (
        <NewCollectionModal
          isOpen={showNewCollection}
          onClose={() => setShowNewCollection(false)}
        />
      )}

      {selectedCollection && (
        <CollectionItemsModal
          isOpen={!!selectedCollection}
          onClose={() => setSelectedCollection(null)}
          collection={selectedCollection}
        />
      )}
    </div>
  );
};

export default ProfilePage;