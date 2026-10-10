/**
 * Media locations. Files live in /public. Replace a file (keeping its name) to
 * change the artwork or sound; change a path here to point at a new file.
 */
import { assetUrl } from '../lib/assets';

export const media = {
  menuVideos: {
    intro: assetUrl('videos/bg-intro.mp4'),
    loop: assetUrl('videos/bg-loop.mp4'),
  },
  screenVideos: {
    project: assetUrl('videos/skills-bg.mp4'),
    skills: assetUrl('videos/makoto-wallpaper.mp4'),
    about: assetUrl('videos/about-bg.mp4'),
    contact: assetUrl('videos/contact-bg.mp4'),
  },
  sfx: {
    navigation: assetUrl('audio/navigation.wav'),
    closeMenu: assetUrl('audio/close-menu.mp3'),
    menuUtama: assetUrl('audio/menu-utama.mp3'),
  },
  favicon: assetUrl('favicon.png'),
  /** Background music for the MusicDisc widget. Repeats each track until paused or skipped. */
  music: [
    { title: 'Full Moon Full Life', src: assetUrl('audio/full-moon-full-life.mp3') },
    { title: "It's Going Down Now", src: assetUrl('audio/its-going-down-now.mp3') },
  ],
  /** Picture shown on the spinning record (square PNG). */
  discImage: assetUrl('images/disc.png'),
} as const;
