import { media } from '../content/media';

/**
 * Background music player for the MusicDisc widget.
 *
 * Separate from the sound-effect engine (engine/audio.ts). One HTMLAudioElement
 * streams the current track with `loop = true`, so a track repeats until the
 * visitor pauses it or skips to the next one.
 */

export interface MusicState {
  trackIndex: number;
  /** True while audio is actually playing (not paused). */
  playing: boolean;
  muted: boolean;
  /** True when the current file could not be loaded. */
  error: boolean;
}

type Listener = () => void;

const MUSIC_VOLUME = 0.5;

class MusicEngine {
  private el: HTMLAudioElement | null = null;
  private state: MusicState = { trackIndex: 0, playing: false, muted: false, error: false };
  private listeners = new Set<Listener>();

  /** Subscribe for useSyncExternalStore. */
  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** Returns the current snapshot. The object changes only when state changes. */
  getState = (): MusicState => this.state;

  private patch(next: Partial<MusicState>): void {
    this.state = { ...this.state, ...next };
    this.listeners.forEach((listener) => listener());
  }

  /** Creates the element on first use, so nothing is fetched until the visitor presses play. */
  private element(): HTMLAudioElement {
    if (!this.el) {
      const el = new Audio();
      el.loop = true;
      el.preload = 'none';
      el.volume = MUSIC_VOLUME;
      el.muted = this.state.muted;
      el.addEventListener('playing', () => this.patch({ playing: true, error: false }));
      el.addEventListener('pause', () => this.patch({ playing: false }));
      el.addEventListener('error', () => this.patch({ playing: false, error: true }));
      this.el = el;
    }
    return this.el;
  }

  /** Points the element at the current track, changing the source only when needed. */
  private ensureSource(): HTMLAudioElement {
    const el = this.element();
    const src = media.music[this.state.trackIndex].src;
    if (el.getAttribute('src') !== src) {
      el.src = src;
      this.patch({ error: false });
    }
    return el;
  }

  private start(): void {
    const el = this.ensureSource();
    el.play().catch((err: unknown) => {
      // AbortError happens when a newer load replaces this one; the newer play() sets the state.
      if ((err as { name?: string })?.name !== 'AbortError') this.patch({ playing: false });
    });
  }

  toggle(): void {
    if (this.state.playing) {
      this.el?.pause();
    } else {
      this.start();
    }
  }

  next(): void {
    const wasPlaying = this.state.playing;
    this.patch({ trackIndex: (this.state.trackIndex + 1) % media.music.length, error: false });
    if (wasPlaying) {
      this.start();
    } else {
      this.el?.pause();
    }
  }

  /**
   * Starts the first track when the page opens. Browsers block sound until the
   * visitor interacts with the page, so if that happens, the track starts on the
   * first click or key press instead.
   */
  autoplay(): void {
    const el = this.ensureSource();
    el.play().catch((err: unknown) => {
      if ((err as { name?: string })?.name !== 'NotAllowedError') return;
      const retry = () => {
        window.removeEventListener('pointerdown', retry, true);
        window.removeEventListener('keydown', retry, true);
        if (!this.state.playing) this.start();
      };
      window.addEventListener('pointerdown', retry, true);
      window.addEventListener('keydown', retry, true);
    });
  }

  toggleMute(): void {
    const muted = !this.state.muted;
    if (this.el) this.el.muted = muted;
    this.patch({ muted });
  }
}

/** Shared music player for the whole app. */
export const music = new MusicEngine();