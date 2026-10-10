import { useCallback, useEffect, useRef, type RefObject } from 'react';

/**
 * Main menu background: the intro video plays once, then the loop takes over
 * seamlessly. The loop is preloaded near the end of the intro so the switch
 * has no gap.
 */
const PRELOAD_AT = 0.4; // fraction of the intro after which the loop is preloaded
const SWITCH_BEFORE_END_S = 0.08;
const FADE_MS = 300;

export function useMenuVideos(
  introRef: RefObject<HTMLVideoElement | null>,
  loopRef: RefObject<HTMLVideoElement | null>,
) {
  const switchedRef = useRef(false);

  const switchToLoop = useCallback(() => {
    if (switchedRef.current) return;
    switchedRef.current = true;

    const intro = introRef.current;
    const loop = loopRef.current;
    if (!loop) return;

    if (loop.preload !== 'auto') loop.preload = 'auto';
    loop.currentTime = 0;
    loop.play().then(
      () => {
        if (!intro) return;
        intro.classList.add('fade-out');
        window.setTimeout(() => {
          intro.pause();
          intro.style.display = 'none';
        }, FADE_MS);
      },
      (err: unknown) => {
        console.warn('Loop video playback notice:', err);
        intro?.classList.add('fade-out');
      },
    );
  }, [introRef, loopRef]);

  // Intro lifecycle listeners.
  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    const onEnded = () => switchToLoop();
    const onError = () => switchToLoop();
    const onTimeUpdate = () => {
      if (switchedRef.current || !(intro.duration > 0)) return;
      if (intro.currentTime >= intro.duration * PRELOAD_AT) {
        const loop = loopRef.current;
        if (loop && loop.preload !== 'auto') loop.preload = 'auto';
      }
      if (intro.currentTime >= intro.duration - SWITCH_BEFORE_END_S) switchToLoop();
    };

    intro.addEventListener('ended', onEnded);
    intro.addEventListener('error', onError);
    intro.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      intro.removeEventListener('ended', onEnded);
      intro.removeEventListener('error', onError);
      intro.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [introRef, loopRef, switchToLoop]);

  /** Starts the intro. Falls back to the loop if autoplay is refused. */
  const start = useCallback(() => {
    const intro = introRef.current;
    if (!intro) return;
    if (intro.preload !== 'auto') intro.preload = 'auto';
    intro.currentTime = 0;
    intro.muted = true;
    intro.play().catch((err: unknown) => {
      console.warn('Intro playback notice:', err);
      switchToLoop();
    });
  }, [introRef, switchToLoop]);

  return { start, switchToLoop };
}
