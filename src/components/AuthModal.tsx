import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
  }>({});

  const checkUsernameExists = async (username: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('displayName', '==', username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (isSignUp) {
        const usernameExists = await checkUsernameExists(username);
        if (usernameExists) {
          setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
          return;
        }

        try {
          const userCredential = await signUpWithEmail(email, password);
          await updateProfile(userCredential.user, {
            displayName: username
          });
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            displayName: username,
            email: email,
            createdAt: new Date(),
          });
          onClose();
          toast.success('Account created successfully');
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            setErrors(prev => ({ ...prev, email: 'Email is already registered' }));
          } else {
            toast.error('Failed to create account');
          }
        }
      } else {
        try {
          await signInWithEmail(email, password);
          onClose();
          toast.success('Signed in successfully');
        } catch (error: any) {
          if (error.code === 'auth/invalid-credential') {
            setErrors(prev => ({ ...prev, password: 'Invalid email or password' }));
          } else {
            toast.error('Failed to sign in');
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
      toast.success('Signed in with Google successfully');
    } catch (error: any) {
      toast.error(error.message);
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
              <h2 className="text-xl font-bold text-black/90 dark:text-white">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-black/70 dark:text-white/70" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                               border border-black/10 dark:border-white/10 
                               focus:border-blue-500/50 dark:focus:border-blue-400/50
                               text-black dark:text-white outline-none"
                      required={isSignUp}
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.username}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                             border border-black/10 dark:border-white/10 
                             focus:border-blue-500/50 dark:focus:border-blue-400/50
                             text-black dark:text-white outline-none"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                             border border-black/10 dark:border-white/10 
                             focus:border-blue-500/50 dark:focus:border-blue-400/50
                             text-black dark:text-white outline-none"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 
                         text-white font-medium hover:from-blue-600 hover:to-violet-600 
                         transition-all"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-black/50 dark:text-white/50">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full p-3 rounded-xl border border-black/10 dark:border-white/10 
                         hover:bg-black/5 dark:hover:bg-white/5 transition-colors
                         flex items-center justify-center gap-2"
              >
                <FcGoogle className="w-5 h-5" />
                <span className="text-black/70 dark:text-white/70">Google</span>
              </button>

              <p className="text-sm text-center text-black/50 dark:text-white/50">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 