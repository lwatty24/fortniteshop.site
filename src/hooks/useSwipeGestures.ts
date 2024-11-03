import { useEffect, useState } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipeGestures(config: SwipeConfig) {
  const [touchStart, setTouchStart] = useState<[number, number] | null>(null);
  const [touchEnd, setTouchEnd] = useState<[number, number] | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart([e.targetTouches[0].clientX, e.targetTouches[0].clientY]);
    };

    const onTouchMove = (e: TouchEvent) => {
      setTouchEnd([e.targetTouches[0].clientX, e.targetTouches[0].clientY]);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;

      const distanceX = touchStart[0] - touchEnd[0];
      const distanceY = touchStart[1] - touchEnd[1];
      const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

      if (isHorizontal && Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          config.onSwipeLeft?.();
        } else {
          config.onSwipeRight?.();
        }
      } else if (!isHorizontal && Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          config.onSwipeUp?.();
        } else {
          config.onSwipeDown?.();
        }
      }
    };

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [touchStart, touchEnd, config]);
} 