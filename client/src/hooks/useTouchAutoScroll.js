import { useCallback, useEffect, useRef } from "react";

/**
 * Custom mobile horizontal auto-scroll for a touch-dragging Kanban board.
 * The hook deliberately does not depend on a DnD library.
 */
export function useTouchAutoScroll(containerRef, { edge = 60, step = 12 } = {}) {
  const frameRef = useRef(null);
  const directionRef = useRef(0);

  const stop = useCallback(() => {
    directionRef.current = 0;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const container = containerRef.current;
    const direction = directionRef.current;
    if (!container || !direction) {
      frameRef.current = null;
      return;
    }

    const next = container.scrollLeft + direction * step;
    const max = Math.max(0, container.scrollWidth - container.clientWidth);
    container.scrollLeft = Math.max(0, Math.min(next, max));

    if (container.scrollLeft <= 0 && direction < 0) {
      stop();
      return;
    }
    if (container.scrollLeft >= max && direction > 0) {
      stop();
      return;
    }

    frameRef.current = requestAnimationFrame(tick);
  }, [containerRef, step, stop]);

  const onTouchMove = useCallback((event) => {
    const touch = event.touches?.[0];
    const container = containerRef.current;
    if (!touch || !container) return;

    const width = window.innerWidth;
    const nextDirection = touch.clientX > width - edge ? 1 : touch.clientX < edge ? -1 : 0;
    directionRef.current = nextDirection;

    if (!nextDirection) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(tick);
    }
  }, [containerRef, edge, tick]);

  useEffect(() => stop, [stop]);

  return { onTouchMove, stop };
}

export default useTouchAutoScroll;
