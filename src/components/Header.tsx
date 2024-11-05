import { format } from 'date-fns';
import { RotateCcw, Calendar, Search, Sun, Moon, X, User } from 'lucide-react';
import { ShopTimer } from './ShopTimer';
import { useAuth } from '../contexts/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthModal } from './AuthModal';

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
  const { user, signIn, signOut } = useAuth();
  const location = useLocation();
  const [fullPhotoURL, setFullPhotoURL] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const ProfileButton = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [fullPhotoURL, setFullPhotoURL] = useState<string | null>(null);

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

    return (
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                  hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-colors"
      >
        <div className="w-7 h-7 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
          <img 
            src={fullPhotoURL || user?.photoURL || '/default-avatar.png'} 
            alt={user?.displayName || 'User'} 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm font-medium text-black/70 dark:text-white/70">
          {user?.displayName}
        </span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.06] bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center -ml-16">
          <div className="relative">
            <div className="relative flex flex-col">
              <h1 className="relative flex items-center">
                <span className="text-3xl font-black tracking-tight text-black dark:text-white">
                  Fortnite
                </span>
                <div className="mx-1 h-6 w-px bg-gradient-to-b from-black/0 via-black/10 to-black/0 
                            dark:from-white/0 dark:via-white/10 dark:to-white/0" />
                <span className="text-3xl font-black tracking-tight bg-gradient-to-br 
                            from-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Shop
                </span>
                <div className="relative ml-2">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 
                              rounded-full opacity-25 blur-sm" />
                  <span className="relative px-1.5 py-0.5 text-[0.6rem] font-bold rounded-full 
                              bg-gradient-to-br from-blue-500 to-violet-500
                              text-white tracking-wider">
                    BETA
                  </span>
                </div>
              </h1>
              <div className="relative mt-0.5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-indigo-500/10 to-violet-500/0 
                            rounded blur-sm" />
                <span className="relative text-[0.6rem] font-medium text-black/50 dark:text-white/50 
                            tracking-[0.2em] uppercase">
                  Item Shop Tracker
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Center Section - Search & Timer */}
        {location.pathname === '/' && (
          <div className="flex-1 flex items-center justify-center max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full h-9 px-4 pl-9 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] 
                         border border-transparent hover:border-black/10 dark:hover:border-white/10
                         focus:border-blue-500/30 dark:focus:border-blue-400/30
                         text-sm text-black/70 dark:text-white/70 
                         placeholder-black/40 dark:placeholder-white/40
                         outline-none transition-all"
              />
              {isSearching ? (
                <RotateCcw className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
              )}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg
                           hover:bg-black/5 dark:hover:bg-white/5
                           text-black/40 dark:text-white/40
                           hover:text-black/70 dark:hover:text-white/70
                           transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center mr-2">
            <ShopTimer />
          </div>

          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
            <Calendar className="w-4 h-4 text-black/50 dark:text-white/50" />
            <time className="text-sm font-medium text-black/70 dark:text-white/70">
              {format(new Date(), 'MMM d, yyyy')}
            </time>
          </div>

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

          <div className="flex items-center gap-4">
            {user ? (
              <ProfileButton />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 
                         text-white font-medium hover:from-blue-600 hover:to-violet-600 
                         transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
} 