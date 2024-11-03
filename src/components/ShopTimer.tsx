import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export function ShopTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    };

    setTimeLeft(calculateTimeLeft());
    timerRef.current = setInterval(() => setTimeLeft(calculateTimeLeft()), 60000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5">
      <Clock className="w-4 h-4 text-black/70 dark:text-white/70" />
      <span className="text-sm font-medium text-black/70 dark:text-white/70">
        {timeLeft}
      </span>
    </div>
  );
} 