export function autoScrollDelta(clientX: number, left: number, right: number, edge = 76, speed = 22) {
  if (clientX < left + edge) return -speed;
  if (clientX > right - edge) return speed;
  return 0;
}

export function autoScrollViewportDelta(clientY: number, top: number, bottom: number, edge = 84, speed = 24) {
  if (clientY < top + edge) return -speed;
  if (clientY > bottom - edge) return speed;
  return 0;
}

export function clampScrollLeft(next: number, scrollWidth: number, clientWidth: number) {
  return Math.min(Math.max(0, next), Math.max(0, scrollWidth - clientWidth));
}
