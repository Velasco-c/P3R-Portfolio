/**
 * Geometry for the wavy "ripple" circle transitions.
 * Each transition is a clip-path polygon whose vertices are sampled on a
 * distorted circle; the Web Animations API interpolates between keyframes.
 */

export interface Point {
  x: number;
  y: number;
}

export const REVEAL_EASING = 'cubic-bezier(0.2, 1, 0.35, 1)';
export const CLOSE_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const REVEAL_DURATION_MS = 520;
export const CLOSE_DURATION_MS = 480;
export const MODAL_OPEN_DURATION_MS = 650;
export const MODAL_CLOSE_DURATION_MS = 600;

/** Returns a CSS `polygon()` value approximating a wavy circle. */
export function generateWavyPolygon(
  cx: number,
  cy: number,
  r: number,
  numPoints = 72,
  waves1 = 7,
  amp1 = 0.085,
  waves2 = 14,
  amp2 = 0.035,
  phase = 0,
  scaleX = 1.25,
  scaleY = 1.05,
): string {
  if (r <= 0.5) {
    const pt = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    return `polygon(${new Array(numPoints).fill(pt).join(', ')})`;
  }
  const points: string[] = [];
  const step = (2 * Math.PI) / numPoints;
  for (let i = 0; i < numPoints; i++) {
    const theta = i * step;
    const wave =
      1.0 + amp1 * Math.sin(waves1 * theta + phase) + amp2 * Math.cos(waves2 * theta + phase * 1.6);
    const px = cx + r * wave * Math.cos(theta) * scaleX;
    const py = cy + r * wave * Math.sin(theta) * scaleY;
    points.push(`${px.toFixed(1)}px ${py.toFixed(1)}px`);
  }
  return `polygon(${points.join(', ')})`;
}

/** Radius large enough to cover the whole viewport from `origin`. */
export function calculateTargetRadius(origin: Point): number {
  const maxDist = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );
  return Math.ceil(maxDist * 1.85);
}

/** Keyframes that grow a page out from `o` to radius `R`. */
export function revealKeyframes(o: Point, R: number): Keyframe[] {
  return [
    { clipPath: generateWavyPolygon(o.x, o.y, 0, 72, 7, 0.085, 14, 0.035, 0.0, 1.25, 1.05) },
    {
      clipPath: generateWavyPolygon(o.x + 22, o.y - 12, R * 0.45, 72, 7, 0.09, 14, 0.035, 1.2, 1.25, 1.05),
      offset: 0.38,
    },
    {
      clipPath: generateWavyPolygon(o.x + 10, o.y - 5, R * 0.85, 72, 7, 0.075, 14, 0.025, 2.2, 1.2, 1.05),
      offset: 0.7,
    },
    { clipPath: generateWavyPolygon(o.x, o.y, R, 72, 7, 0.05, 14, 0.015, 3.4, 1.15, 1.02) },
  ];
}

/** Keyframes that shrink a page from radius `R` back into `o`. */
export function closeKeyframes(o: Point, R: number): Keyframe[] {
  return [
    { clipPath: generateWavyPolygon(o.x, o.y, R, 72, 9, 0.07, 18, 0.025, 0.0, 1.15, 1.25) },
    {
      clipPath: generateWavyPolygon(o.x - 20, o.y - 12, R * 0.8, 72, 9, 0.08, 18, 0.03, 1.0, 1.15, 1.25),
      offset: 0.32,
    },
    {
      clipPath: generateWavyPolygon(o.x - 28, o.y - 18, R * 0.42, 72, 9, 0.085, 18, 0.03, 2.0, 1.15, 1.25),
      offset: 0.65,
    },
    { clipPath: generateWavyPolygon(o.x, o.y, 0, 72, 9, 0.08, 18, 0.025, 3.0, 1.15, 1.25) },
  ];
}

/** Keyframes for the portfolio modal opening from `o`. */
export function modalOpenKeyframes(o: Point, R: number): Keyframe[] {
  return [
    { clipPath: generateWavyPolygon(o.x, o.y, 0, 100, 6, 0.08, 12, 0.03, 0.0, 1.25, 1.05) },
    { clipPath: generateWavyPolygon(o.x, o.y, R * 0.45, 100, 6, 0.085, 12, 0.03, 1.0, 1.25, 1.05), offset: 0.4 },
    { clipPath: generateWavyPolygon(o.x, o.y, R, 100, 6, 0.05, 12, 0.015, 2.5, 1.15, 1.02) },
  ];
}

/** Keyframes for the portfolio modal closing into `o`. */
export function modalCloseKeyframes(o: Point, R: number): Keyframe[] {
  return [
    { clipPath: generateWavyPolygon(o.x, o.y, R, 100, 8, 0.07, 16, 0.025, 0.0, 1.15, 1.25) },
    { clipPath: generateWavyPolygon(o.x, o.y, 0, 100, 8, 0.08, 16, 0.02, 2.5, 1.15, 1.25) },
  ];
}
