import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Mail, Palette, Shield, User } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileSettings({ isOpen, onClose }: ProfileSettingsProps) {
  const { theme, toggleTheme } = useTheme();

  const settings = [
    {
      icon: <Bell className="w-5 h-5 text-blue-500" />,
      title: 'Notifications',
      description: 'Manage your email notifications',
      onClick: () => {},
    },
    {
      icon: <Palette className="w-5 h-5 text-purple-500" />,
      title: 'Appearance',
      description: 'Toggle dark mode',
      onClick: toggleTheme,
      value: theme === 'dark' ? 'Dark' : 'Light'
    },
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: 'Privacy',
      description: 'Manage your privacy settings',
      onClick: () => {},
    },
  ];

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
              <h2 className="text-xl font-bold text-black/90 dark:text-white">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-black/70 dark:text-white/70" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {settings.map((setting) => (
                <button
                  key={setting.title}
                  onClick={setting.onClick}
                  className="w-full p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 
                           transition-colors flex items-start gap-4 text-left"
                >
                  <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5">
                    {setting.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-black/90 dark:text-white mb-1">
                      {setting.title}
                    </h3>
                    <p className="text-sm text-black/50 dark:text-white/50">
                      {setting.description}
                    </p>
                  </div>
                  {setting.value && (
                    <span className="text-sm text-black/50 dark:text-white/50">
                      {setting.value}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
} 