import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Subscribes to document keydown events. The handler is always the latest
 * one passed in, so it can read current React state without re-subscribing.
 */
export function useDocumentKeydown(handler: (event: KeyboardEvent) => void): void {
  const latest = useRef(handler);
  useLayoutEffect(() => {
    latest.current = handler;
  });

  useEffect(() => {
    const listener = (event: KeyboardEvent) => latest.current(event);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
}
