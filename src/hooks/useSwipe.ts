import { useState, useCallback } from 'react';

interface SwipeState {
  startX: number;
  startY: number;
  isDragging: boolean;
  translateX: number;
}

interface UseSwipeProps {
  onSwipeComplete: (direction: 'left' | 'right') => void;
  isActive: boolean;
}

// Reduced threshold for easier swipes
const SWIPE_THRESHOLD = 10;
const SAFE_VERTICAL_THRESHOLD = 50;
// Added multiplier for smoother movement
const MOVEMENT_MULTIPLIER = 1.5;

export function useSwipe({ onSwipeComplete, isActive }: UseSwipeProps) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    isDragging: false,
    translateX: 0,
  });

  const handleTouchStart = useCallback((clientX: number, clientY: number) => {
    if (!isActive) return;
    
    setSwipeState({
      startX: clientX,
      startY: clientY,
      isDragging: true,
      translateX: 0,
    });
  }, [isActive]);

  const handleTouchMove = useCallback((clientX: number, clientY: number) => {
    if (!swipeState.isDragging || !isActive) return;

    const deltaX = (clientX - swipeState.startX) * MOVEMENT_MULTIPLIER;
    const deltaY = Math.abs(clientY - swipeState.startY);

    if (deltaY > SAFE_VERTICAL_THRESHOLD) {
      setSwipeState(prev => ({ ...prev, isDragging: false, translateX: 0 }));
      return;
    }

    setSwipeState(prev => ({ ...prev, translateX: deltaX }));
  }, [swipeState.isDragging, swipeState.startX, swipeState.startY, isActive]);

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isDragging || !isActive) return;

    const direction = swipeState.translateX > SWIPE_THRESHOLD ? 'right' 
      : swipeState.translateX < -SWIPE_THRESHOLD ? 'left' 
      : null;

    if (direction) {
      onSwipeComplete(direction);
    }

    setSwipeState(prev => ({ ...prev, isDragging: false, translateX: 0 }));
  }, [swipeState.isDragging, swipeState.translateX, onSwipeComplete, isActive]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    translateX: swipeState.translateX,
    isDragging: swipeState.isDragging,
  };
}