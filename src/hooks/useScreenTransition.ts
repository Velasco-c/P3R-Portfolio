import { useLayoutEffect, type RefObject } from 'react';
import {
  CLOSE_DURATION_MS,
  CLOSE_EASING,
  REVEAL_DURATION_MS,
  REVEAL_EASING,
  calculateTargetRadius,
  closeKeyframes,
  revealKeyframes,
  type Point,
} from '../engine/wavy';
import { getExitOrigin } from '../engine/origins';

/**
 * Lifecycle of a full-screen sub-page:
 *   closed -> opening -> open -> closing -> closed
 * "opening" and "closing" are the wavy circle transitions; the page is shown
 * with the `circle-transitioning` class during both.
 */
export type ScreenPhase = 'closed' | 'opening' | 'open' | 'closing';
export type TransitionSettle = 'opening' | 'closing';

export interface ScreenTransitionOptions {
  phase: ScreenPhase;
  /** Reveal origin in viewport pixels (where the click or keypress happened). */
  origin: Point | null;
  /** Class added to <body> while the page is open (hides the main menu for hit testing). */
  bodyClass: string;
  pageRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  /** The main menu's looping background, paused while a page is shown. */
  menuVideoRef: RefObject<HTMLVideoElement | null>;
  /** id of the back/close button; its centre is the exit origin. */
  exitButtonId: string;
  exitFallback: () => Point;
  onSettled: (settled: TransitionSettle) => void;
}

/**
 * Runs the wavy reveal and close animations for a sub-page.
 *
 * Classes are applied by React from `phase`; this hook only drives the
 * clip-path animation and the associated media. The animation is cancelled
 * in the effect cleanup, which runs in the same commit that removes the
 * transition class, so the page never flashes unclipped.
 */
export function useScreenTransition(opts: ScreenTransitionOptions): void {
  const { phase } = opts;

  useLayoutEffect(() => {
    if (phase !== 'opening' && phase !== 'closing') return;

    const page = opts.pageRef.current;
    if (!page) {
      opts.onSettled(phase);
      return;
    }

    let animation: Animation | null = null;

    if (phase === 'opening') {
      const menuLoop = opts.menuVideoRef.current;
      if (menuLoop && !menuLoop.paused) menuLoop.pause();

      const video = opts.videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.muted = true;
        video.play().catch(() => {});
      }

      const origin = opts.origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const radius = calculateTargetRadius(origin);
      animation = page.animate(revealKeyframes(origin, radius), {
        duration: REVEAL_DURATION_MS,
        easing: REVEAL_EASING,
        fill: 'forwards',
      });
      animation.onfinish = () => {
        document.body.classList.add(opts.bodyClass);
        page.style.clipPath = '';
        opts.onSettled('opening');
      };
    } else {
      document.body.classList.remove(opts.bodyClass);

      const exit = getExitOrigin(opts.exitButtonId, opts.exitFallback);
      const radius = calculateTargetRadius(exit);
      animation = page.animate(closeKeyframes(exit, radius), {
        duration: CLOSE_DURATION_MS,
        easing: CLOSE_EASING,
        fill: 'forwards',
      });
      animation.onfinish = () => {
        page.style.clipPath = '';
        opts.videoRef.current?.pause();
        const menuLoop = opts.menuVideoRef.current;
        if (menuLoop && menuLoop.paused) menuLoop.play().catch(() => {});
        opts.onSettled('closing');
      };
    }

    return () => {
      animation?.cancel();
    };
    // Only phase changes start a transition; the other values are read once per phase.
    // Deliberately keyed on phase only: each phase change starts exactly one transition.
  }, [phase]);
}
