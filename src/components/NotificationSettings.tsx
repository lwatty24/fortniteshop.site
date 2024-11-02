import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, X, BellRing, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { createPortal } from 'react-dom';

export function NotificationSettings() {
  const { subscribeToNotifications, unsubscribeFromNotifications, isSubscribed, email, isLoading } = useNotifications();
  const [emailInput, setEmailInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailInput) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      setError('Please enter a valid email address');
      return;
    }

    const result = await subscribeToNotifications(emailInput);
    if (result.success) {
      setEmailInput('');
      setIsOpen(false);
    } else {
      setError(result.error || 'Failed to subscribe');
    }
  };

  const handleUnsubscribe = async () => {
    setError(null);
    const result = await unsubscribeFromNotifications();
    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || 'Failed to unsubscribe');
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-black/70 dark:text-white/70" />
        {isSubscribed && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", bounce: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
                        <BellRing className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-black dark:text-white">
                          Notifications
                        </h2>
                        <p className="text-sm text-black/50 dark:text-white/50">
                          Get alerts when wishlisted items return
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <X className="w-5 h-5 text-black/70 dark:text-white/70" />
                    </button>
                  </div>

                  {isSubscribed ? (
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-500" />
                        <div>
                          <h3 className="font-medium text-black dark:text-white mb-1">
                            Notifications Active
                          </h3>
                          <p className="text-sm text-black/50 dark:text-white/50 mb-3">
                            You'll receive emails at:
                          </p>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 w-fit">
                            <Mail className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-500">{email}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleUnsubscribe}
                        className="w-full p-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/5 transition-colors"
                      >
                        Turn off notifications
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm text-black/70 dark:text-white/70 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className={`w-full p-4 rounded-xl bg-black/5 dark:bg-white/5 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 outline-none focus:ring-2 ${
                              error ? 'ring-2 ring-red-500' : 'ring-blue-500'
                            }`}
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                          />
                          {error && (
                            <p className="mt-2 text-sm text-red-500">{error}</p>
                          )}
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full p-4 rounded-xl bg-blue-500 text-white transition-colors ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                          }`}
                        >
                          {isLoading ? 'Processing...' : 'Enable notifications'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
} 