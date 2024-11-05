import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { db } from '../config/firebase';
import { toast } from 'sonner';

interface AccountSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSettings({ isOpen, onClose }: AccountSettingsProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const updates = [];

      if (username !== user.displayName) {
        updates.push(
          updateProfile(user, { displayName: username }),
          updateDoc(doc(db, 'users', user.uid), { displayName: username })
        );
      }

      if (email !== user.email) {
        updates.push(updateEmail(user, email));
      }

      if (newPassword) {
        updates.push(updatePassword(user, newPassword));
      }

      await Promise.all(updates);
      toast.success('Account settings updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
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
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5 dark:border-white/5">
              <h2 className="text-xl font-bold text-black/90 dark:text-white">Account Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-black/70 dark:text-white/70" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-black/70 dark:text-white/70 mb-2">
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
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-black/70 dark:text-white/70 mb-2">
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
              </div>

              <div>
                <label className="block text-sm text-black/70 dark:text-white/70 mb-2">
                  New Password (optional)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] 
                             border border-black/10 dark:border-white/10 
                             focus:border-blue-500/50 dark:focus:border-blue-400/50
                             text-black dark:text-white outline-none"
                    placeholder="Leave blank to keep current password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 dark:text-white/40" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 rounded-xl bg-blue-500 text-white 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-blue-600 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 