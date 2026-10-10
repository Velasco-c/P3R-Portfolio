import { useEffect } from 'react';
import { sfx } from '../engine/audio';

const UNLOCK_EVENTS = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown', 'focus'] as const;

/**
 * Browsers only allow audio after a user gesture. The first gesture of any
 * kind unlocks the AudioContext.
 */
export function useAudioUnlock(): void {
  useEffect(() => {
    const unlock = () => sfx.unlock();
    for (const type of UNLOCK_EVENTS) {
      window.addEventListener(type, unlock, { capture: true, passive: true });
    }
    return () => {
      for (const type of UNLOCK_EVENTS) {
        window.removeEventListener(type, unlock, { capture: true });
      }
    };
  }, []);
}
