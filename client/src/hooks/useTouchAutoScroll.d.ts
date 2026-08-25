import type { RefObject } from "react";

type TouchAutoScrollOptions = {
  edge?: number;
  step?: number;
};

type TouchMoveLikeEvent = {
  touches?: ArrayLike<{ clientX: number }>;
};

type TouchAutoScrollApi = {
  onTouchMove: (event: TouchMoveLikeEvent) => void;
  stop: () => void;
};

export function useTouchAutoScroll(
  containerRef: RefObject<HTMLElement | null>,
  options?: TouchAutoScrollOptions,
): TouchAutoScrollApi;

export default useTouchAutoScroll;
