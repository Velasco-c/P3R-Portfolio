import type { ScreenId } from '../types/content';

/**
 * Query-string entry points, for linking straight to a screen or skipping the intro.
 *
 *   ?select=2                  highlight menu item 2 (0-based) on the main menu
 *   ?page=project              open PROJECT immediately (no loading screen)
 *   ?page=skills&tab=backend   open SKILLS on a specific tab (also ?cat=)
 *   ?page=about | ?page=contact
 *   ?skip_loading=1           go straight to the main menu
 *   ?modal=project            open the portfolio modal for an item (see PortfolioModal)
 */
export type BootPlan =
  | { mode: 'loading' }
  | { mode: 'skip-loading' }
  | { mode: 'page'; page: ScreenId; tab?: string };

const PAGE_ALIASES: Record<string, ScreenId> = {
  project: 'project',
  skill: 'skills',
  skills: 'skills',
  about: 'about',
  contact: 'contact',
};

export function readBootPlan(search: string): BootPlan {
  const params = new URLSearchParams(search);
  const page = PAGE_ALIASES[params.get('page') ?? ''];
  if (page) {
    const tab = params.get('tab') ?? params.get('cat') ?? undefined;
    return tab ? { mode: 'page', page, tab } : { mode: 'page', page };
  }
  if (params.get('skip_loading') === '1') return { mode: 'skip-loading' };
  return { mode: 'loading' };
}

export function readInitialSelection(search: string, optionCount: number): number {
  const value = parseInt(new URLSearchParams(search).get('select') ?? '', 10);
  return Number.isInteger(value) && value >= 0 && value < optionCount ? value : 0;
}

/** Menu item to open in the portfolio modal on load, if `?modal=` names one. */
export function readModalParam(search: string): ScreenId | null {
  const value = new URLSearchParams(search).get('modal') ?? '';
  return PAGE_ALIASES[value] ?? null;
}
