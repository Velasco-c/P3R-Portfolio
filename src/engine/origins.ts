import type { ScreenId } from '../types/content';
import type { Point } from './wavy';

/**
 * Where a transition starts, in viewport pixels.
 * Mouse clicks use the cursor; keyboard activation uses the centre of the menu
 * label; the fallback ratios are used only if the layout cannot be measured.
 */

/** Fallback origin (fraction of viewport width/height) for each menu item. */
export const OPTION_FALLBACK_RATIO: Record<ScreenId, [number, number]> = {
  project: [0.62, 0.38],
  skills: [0.6, 0.48],
  about: [0.58, 0.57],
  contact: [0.57, 0.66],
};

/** Centre of an element's box, or null if it has no size (e.g. display: none). */
export function getElementCenter(el: Element | null): Point | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width > 0 && r.height > 0) {
    return { x: r.left + r.width * 0.5, y: r.top + r.height * 0.5 };
  }
  return null;
}

export function getOptionOrigin(
  index: number,
  id: ScreenId,
  event?: Pick<MouseEvent, 'clientX' | 'clientY'>,
): Point {
  if (event && (event.clientX > 0 || event.clientY > 0)) {
    return { x: event.clientX, y: event.clientY };
  }
  const item = document.getElementById(`option-item-${index}`);
  if (item) {
    for (const text of item.querySelectorAll<Element>('.option-text')) {
      const c = getElementCenter(text);
      if (c) return c;
    }
    const ir = item.getBoundingClientRect();
    if (ir.width > 0 && ir.height > 0) {
      return { x: ir.left + ir.width * 0.45, y: ir.top + ir.height * 0.5 };
    }
  }
  const [rx, ry] = OPTION_FALLBACK_RATIO[id];
  return { x: window.innerWidth * rx, y: window.innerHeight * ry };
}

/** Centre of a back/close button; `fallback` is used if the button is not laid out. */
export function getExitOrigin(buttonId: string, fallback: () => Point): Point {
  return getElementCenter(document.getElementById(buttonId)) ?? fallback();
}
