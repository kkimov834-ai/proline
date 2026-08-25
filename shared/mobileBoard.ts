export function autoScrollDelta(clientX: number, left: number, right: number, edge = 60, speed = 20) {
  if (clientX < left + edge) return -speed;
  if (clientX > right - edge) return speed;
  return 0;
}

export function edgeScrollSpeed(clientX: number, left: number, right: number, edge = 44, maxSpeed = 18) {
  const leftDistance = clientX - left;
  const rightDistance = right - clientX;
  if (leftDistance >= 0 && leftDistance <= edge) return -Math.max(3, Math.round(maxSpeed * (1 - leftDistance / edge)));
  if (rightDistance >= 0 && rightDistance <= edge) return Math.max(3, Math.round(maxSpeed * (1 - rightDistance / edge)));
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
