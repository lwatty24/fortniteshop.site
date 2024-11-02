import { createContext, useContext, useState } from 'react';

interface NotificationContextType {
  subscribeToNotifications: (email: string) => Promise<{ success: boolean; error?: string }>;
  unsubscribeFromNotifications: () => Promise<{ success: boolean; error?: string }>;
  isSubscribed: boolean;
  email: string | null;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(localStorage.getItem('notificationEmail'));
  const [isSubscribed, setIsSubscribed] = useState(!!email);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const subscribeToNotifications = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      localStorage.setItem('notificationEmail', email);
      setEmail(email);
      setIsSubscribed(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to subscribe' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/notifications/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to unsubscribe');
      }

      localStorage.removeItem('notificationEmail');
      setEmail(null);
      setIsSubscribed(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to unsubscribe' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NotificationContext.Provider value={{
      subscribeToNotifications,
      unsubscribeFromNotifications,
      isSubscribed,
      email,
      isLoading
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}; 