import { useRef, useCallback } from 'react';

export function useLongPress(onLongPress, onClick, delay = 500) {
  const timerRef = useRef(null);
  const isLongPressRef = useRef(false);

  const start = useCallback((e) => {
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (navigator.vibrate) navigator.vibrate(50);
      onLongPress(e);
    }, delay);
  }, [onLongPress, delay]);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  const handleClick = useCallback((e) => {
    if (!isLongPressRef.current && onClick) {
      onClick(e);
    }
  }, [onClick]);

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onClick: handleClick,
    onContextMenu: (e) => e.preventDefault(),
  };
}

export function useSwipe(onDelete) {
  const getClientX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
  const getClientY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

  const handleTouchStart = (e) => {
    const el = e.currentTarget;
    el.dataset.startX = getClientX(e);
    el.dataset.startY = getClientY(e);
    el.style.transition = 'none';
    el.dataset.isSwiping = 'false';
    el.dataset.isMouseDrag = e.type === 'mousedown' ? 'true' : 'false';
  };

  const handleTouchMove = (e) => {
    const el = e.currentTarget;
    if (e.type === 'mousemove' && el.dataset.isMouseDrag !== 'true') return;

    const startX = parseFloat(el.dataset.startX);
    const startY = parseFloat(el.dataset.startY);
    const currentX = getClientX(e);
    const currentY = getClientY(e);
    const diffX = startX - currentX;
    const diffY = Math.abs(startY - currentY);

    if (diffY > Math.abs(diffX) && e.type !== 'mousemove') return;

    if (diffX > 0 && diffX <= 100) {
      el.style.transform = `translateX(-${diffX}px)`;
      el.dataset.isSwiping = 'true';
    } else if (diffX < 0) {
      el.style.transform = 'translateX(0px)';
    }
  };

  const handleTouchEnd = (e) => {
    const el = e.currentTarget;
    if (el.dataset.isMouseDrag === 'true') el.dataset.isMouseDrag = 'false';
    if (el.dataset.isSwiping !== 'true') return;

    el.style.transition = 'transform 0.2s ease-out';
    const startX = parseFloat(el.dataset.startX);
    const currentX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diffX = startX - currentX;

    if (diffX > 45) {
      el.style.transform = 'translateX(-80px)';
    } else {
      el.style.transform = 'translateX(0)';
    }
    el.dataset.isSwiping = 'false';
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleTouchStart,
    onMouseMove: handleTouchMove,
    onMouseUp: handleTouchEnd,
    onMouseLeave: handleTouchEnd,
  };
}

