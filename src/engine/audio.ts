import { media } from '../content/media';

/**
 * Low-latency sound effects.
 *
 * Primary path: Web Audio API (decoded buffers, zero-latency start).
 * Fallback path: a small pool of HTMLAudioElements, used until the AudioContext
 * is running (for example, before the first user gesture on some browsers).
 */

export type SfxName = 'navigation' | 'closeMenu' | 'menuUtama';

const SFX_SRC: Record<SfxName, string> = {
  navigation: media.sfx.navigation,
  closeMenu: media.sfx.closeMenu,
  menuUtama: media.sfx.menuUtama,
};

const SFX_VOLUME: Record<SfxName, number> = {
  navigation: 0.6,
  closeMenu: 0.75,
  menuUtama: 0.95,
};

const FALLBACK_POOL_SIZE = 2;
/** How long after entering the menu a first gesture may still trigger the menu theme. */
const MENU_THEME_UNLOCK_WINDOW_MS = 2500;

class SfxEngine {
  private ctx: AudioContext | null = null;
  private buffers = new Map<SfxName, AudioBuffer>();
  private pools = new Map<SfxName, { items: HTMLAudioElement[]; next: number }>();
  private menuThemePlayed = false;
  private enteredAt: number | null = null;

  /** Creates the AudioContext on first use (must happen after a user gesture to run). */
  private getContext(): AudioContext | null {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctor) this.ctx = new Ctor({ latencyHint: 'interactive' });
    }
    return this.ctx;
  }

  /** Decodes every effect into memory. Failures are ignored; the fallback path still works. */
  async preload(): Promise<void> {
    const ctx = this.getContext();
    if (!ctx) return;
    await Promise.all(
      (Object.keys(SFX_SRC) as SfxName[]).map(async (name) => {
        try {
          const res = await fetch(SFX_SRC[name]);
          if (!res.ok) return;
          this.buffers.set(name, await ctx.decodeAudioData(await res.arrayBuffer()));
        } catch {
          /* ignore: fallback path remains available */
        }
      }),
    );
  }

  /** Resumes a suspended context. Safe to call repeatedly. */
  resume(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  private fallbackFor(name: SfxName) {
    let pool = this.pools.get(name);
    if (!pool) {
      pool = {
        items: Array.from({ length: FALLBACK_POOL_SIZE }, () => {
          const el = new Audio(SFX_SRC[name]);
          el.preload = 'auto';
          return el;
        }),
        next: 0,
      };
      this.pools.set(name, pool);
    }
    return pool;
  }

  /** Plays an effect right away. `onStart` fires once playback has actually begun. */
  play(name: SfxName, onStart?: () => void): void {
    const volume = SFX_VOLUME[name];
    const ctx = this.getContext();
    const buffer = this.buffers.get(name);

    if (ctx && ctx.state === 'running' && buffer) {
      try {
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        gain.gain.value = volume;
        source.buffer = buffer;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(0);
        onStart?.();
        return;
      } catch {
        /* fall through to the element pool */
      }
    }

    const pool = this.fallbackFor(name);
    const el = pool.items[pool.next];
    pool.next = (pool.next + 1) % pool.items.length;
    try {
      el.currentTime = 0;
      el.volume = volume;
      el.play().then(() => onStart?.()).catch(() => {});
    } catch {
      /* audio is non-essential; ignore */
    }
  }

  /** Plays the menu theme once per visit. */
  async playMenuTheme(): Promise<void> {
    if (this.menuThemePlayed) return;
    const ctx = this.getContext();
    if (ctx && ctx.state !== 'running') {
      try {
        await ctx.resume();
      } catch {
        /* ignore */
      }
    }
    this.play('menuUtama', () => {
      this.menuThemePlayed = true;
    });
  }

  /** Records when the menu was entered, for the first-gesture theme fallback. */
  markEntered(): void {
    this.enteredAt = Date.now();
  }

  /**
   * Called on the first user gesture. Unlocks the AudioContext and, if the
   * menu was entered moments ago and the theme has not played, plays it now.
   */
  unlock(): void {
    const ctx = this.getContext();
    if (ctx) {
      if (ctx.state !== 'running') ctx.resume().catch(() => {});
      try {
        const silent = ctx.createBuffer(1, 1, 22050);
        const src = ctx.createBufferSource();
        src.buffer = silent;
        src.connect(ctx.destination);
        src.start(0);
      } catch {
        /* ignore */
      }
    }
    if (this.enteredAt !== null && !this.menuThemePlayed) {
      if (Date.now() - this.enteredAt < MENU_THEME_UNLOCK_WINDOW_MS) {
        void this.playMenuTheme();
      } else {
        this.menuThemePlayed = true;
      }
    }
  }
}

/** Shared engine instance for the whole app. */
export const sfx = new SfxEngine();
