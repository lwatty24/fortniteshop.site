import { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { ShopItem } from '../types';
import { toast } from 'sonner';

interface Collection {
  id: string;
  name: string;
  description?: string;
  items: ShopItem[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface CollectionsContextType {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;
  addCollection: (name: string, description?: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addItemToCollection: (collectionId: string, item: ShopItem) => Promise<void>;
  removeItemFromCollection: (collectionId: string, itemId: string) => Promise<void>;
  updateCollection: (id: string, updates: { name?: string; description?: string }) => Promise<void>;
}

const CollectionsContext = createContext<CollectionsContextType | null>(null);

export function CollectionsProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchCollections = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const q = query(collection(db, 'collections'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const collectionsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate()
          })) as Collection[];
          setCollections(collectionsData);
        } catch (err) {
          console.error('Error fetching collections:', err);
          setError('Failed to load collections');
          toast.error('Failed to load collections');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCollections();
    }
  }, [user]);

  const addCollection = async (name: string, description?: string) => {
    if (!user) return;
    try {
      const newCollection = {
        name,
        description,
        items: [],
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await addDoc(collection(db, 'collections'), newCollection);
      setCollections(prev => [...prev, { ...newCollection, id: docRef.id }]);
      toast.success('Collection created successfully');
    } catch (err) {
      console.error('Error adding collection:', err);
      toast.error('Failed to create collection');
      throw err;
    }
  };

  const deleteCollection = async (id: string) => {
    await deleteDoc(doc(db, 'collections', id));
    setCollections(prev => prev.filter(c => c.id !== id));
  };

  const addItemToCollection = async (collectionId: string, item: ShopItem) => {
    const collectionRef = doc(db, 'collections', collectionId);
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    const updatedItems = [...collection.items, item];
    await updateDoc(collectionRef, {
      items: updatedItems,
      updatedAt: new Date()
    });

    setCollections(prev => prev.map(c => 
      c.id === collectionId 
        ? { ...c, items: updatedItems, updatedAt: new Date() }
        : c
    ));
  };

  const removeItemFromCollection = async (collectionId: string, itemId: string) => {
    const collectionRef = doc(db, 'collections', collectionId);
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return;

    const updatedItems = collection.items.filter(item => item.id !== itemId);
    await updateDoc(collectionRef, {
      items: updatedItems,
      updatedAt: new Date()
    });

    setCollections(prev => prev.map(c => 
      c.id === collectionId 
        ? { ...c, items: updatedItems, updatedAt: new Date() }
        : c
    ));
  };

  const updateCollection = async (id: string, updates: { name?: string; description?: string }) => {
    const collectionRef = doc(db, 'collections', id);
    await updateDoc(collectionRef, {
      ...updates,
      updatedAt: new Date()
    });

    setCollections(prev => prev.map(c => 
      c.id === id 
        ? { ...c, ...updates, updatedAt: new Date() }
        : c
    ));
  };

  return (
    <CollectionsContext.Provider value={{
      collections,
      isLoading,
      error,
      addCollection,
      deleteCollection,
      addItemToCollection,
      removeItemFromCollection,
      updateCollection
    }}>
      {children}
    </CollectionsContext.Provider>
  );
}

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
}; 