import { useEffect, useRef, useState } from 'react';
import { site } from '../content';
import { sfx } from '../engine/audio';
import { runLoadingSequence } from '../engine/loading';

interface LoadingScreenProps {
  /** Set once the experience has been entered; triggers the fade-out. */
  dismissed: boolean;
  /** Called when loading finishes. */
  onReady: () => void;
}

export function LoadingScreen({ dismissed, onReady }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;
  const startedRef = useRef(false);

  useEffect(() => {
    // Guards against the double effect run in React StrictMode (development).
    if (startedRef.current) return;
    startedRef.current = true;
    void runLoadingSequence({
      onProgress: setProgress,
      startPreload: () => void sfx.preload(),
    }).then(() => readyRef.current());
  }, []);

  return (
    <div
      id="loading-screen"
      className={`p3r-loading-screen${dismissed ? ' dismissed' : ''}`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="loading-hud-bottom">
        <div className="loading-text-row">
          <h2 className="loading-title">
            {site.loadingTitle}
            <span className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </h2>
        </div>
        <div className="loading-bar-wrap">
          <div className="loading-track">
            <div id="loading-bar" className="loading-fill" style={{ width: `${progress}%` }} />
          </div>
          <div id="loading-percent" className="loading-percent">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
