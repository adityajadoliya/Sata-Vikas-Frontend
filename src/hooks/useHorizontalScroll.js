import { useEffect, useRef } from 'react';

/**
 * Hook to enable smooth horizontal scrolling on containers:
 * - Translates vertical mouse wheel (deltaY) into horizontal scroll (scrollLeft).
 * - Preserves trackpad horizontal gestures (deltaX).
 * - Enables click-and-drag horizontal mouse movement scrolling without interfering with inputs/buttons.
 */
export function useHorizontalScroll() {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    // Mouse wheel horizontal scroll handler
    const onWheel = (e) => {
      // If pure horizontal scroll or already handled, don't intervene
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        return;
      }

      if (e.deltaY === 0) return;

      const hasHorizontalScroll = el.scrollWidth > el.clientWidth;
      if (!hasHorizontalScroll) return;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      const canScrollLeft = el.scrollLeft > 0 && e.deltaY < 0;
      const canScrollRight = el.scrollLeft < maxScrollLeft && e.deltaY > 0;

      if (canScrollLeft || canScrollRight) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    // Click & Drag mouse movement horizontal scroll
    let isDown = false;
    let startX = 0;
    let initialScrollLeft = 0;

    const onMouseDown = (e) => {
      // Only main mouse button (left click)
      if (e.button !== 0) return;
      // Do not trigger drag on interactive elements
      if (e.target.closest('input, select, textarea, button, a, [contenteditable="true"]')) {
        return;
      }

      isDown = true;
      startX = e.pageX - el.offsetLeft;
      initialScrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };

    const onMouseLeave = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = '';
      el.style.removeProperty('user-select');
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = '';
      el.style.removeProperty('user-select');
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.2; // movement speed multiplier
      el.scrollLeft = initialScrollLeft - walk;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return elRef;
}

export default useHorizontalScroll;
