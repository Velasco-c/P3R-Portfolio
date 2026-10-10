/**
 * Shapes for everything that lives in src/content/.
 * Edit the data files; these types keep them consistent with the components.
 */

/** The four destinations reachable from the main menu. */
export type ScreenId = 'project' | 'skills' | 'about' | 'contact';

export interface MenuCard {
  title: string;
  desc: string;
}

export interface MenuOption {
  id: ScreenId;
  /** Label shown in the big menu banner (also used as the page banner title). */
  name: string;
  /** Short line describing the option (screen-reader / future hint use). */
  description: string;
  /** Tilt of the menu item in degrees. */
  rotation: number;
  /** Stacking order of the item when it is not selected. */
  zIndex: number;
  offsetX: number;
  offsetY: number;
  /** CSS font-size for the menu label, e.g. "5.15rem". */
  fontSize: string;
  bannerScaleX: number;
  bannerScaleY: number;
  /** Small uppercase tag shown in the portfolio modal. */
  tag: string;
  /** One-line summary shown in the portfolio modal. */
  summary: string;
  cards: MenuCard[];
}

export interface ProjectItem {
  numeral: string;
  title: string;
  subtitle: string;
  url: string;
}

export interface SkillTab {
  id: string;
  code: string;
  label: string;
}

export interface SkillEntry {
  name: string;
  level: number;
}

export interface SkillGroup {
  id: string;
  code: string;
  title: string;
  skills: SkillEntry[];
}

export type RichSegment = string | { strong: string } | { em: string };

export interface AboutContent {
  name: string;
  role: string;
  photo: {
    webp: string;
    jpg: string;
    alt: string;
  };
  paragraphs: RichSegment[][];
  quote: {
    text: string;
    author: string;
  };
}

export type MailRow =
  | {
      kind: 'channel';
      icon: 'gmail' | 'linkedin' | 'github' | 'web';
      sender: string;
      address: string;
      href: string;
      ariaLabel: string;
    }
  | {
      kind: 'empty';
      text: string;
    };
