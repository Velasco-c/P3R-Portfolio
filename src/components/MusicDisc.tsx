import { useSyncExternalStore, type KeyboardEvent } from 'react';
import { media } from '../content';
import { music } from '../engine/music';

const iconProps = {
  width: 12,
  height: 12,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
} as const;

function PlayIcon() {
  return (
    <svg {...iconProps}>
      <polygon points="7 4 20 12 7 20" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="4" width="5" height="16" />
      <rect x="14" y="4" width="5" height="16" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg {...iconProps}>
      <polygon points="4 4 15 12 4 20" />
      <rect x="16" y="4" width="4" height="16" />
    </svg>
  );
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="3 9 7 9 12 5 12 19 7 15 3 15" fill="currentColor" />
      {muted ? (
        <>
          <line x1="16" y1="9" x2="22" y2="15" />
          <line x1="22" y1="9" x2="16" y2="15" />
        </>
      ) : (
        <path d="M16 8.5a5 5 0 0 1 0 7" />
      )}
    </svg>
  );
}

/** Small spinning record with play/pause, next and mute controls. Shown on the main menu. */
export function MusicDisc() {
  const state = useSyncExternalStore(music.subscribe, music.getState);
  const track = media.music[state.trackIndex];

  // Enter and Space on a focused button would also reach the menu's document key handler
  // and activate a menu item, so they stop here.
  const stopMenuKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') e.stopPropagation();
  };

  return (
    <div
      id="music-disc"
      className={`music-disc${state.playing ? ' is-playing' : ''}`}
      role="group"
      aria-label="Music player"
      onKeyDown={stopMenuKeys}
    >
      <div className="music-disc-vinyl" aria-hidden="true">
        <img
          className="music-disc-art"
          src={media.discImage}
          alt=""
          draggable={false}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="music-disc-body">
        <div className="music-disc-title" title={track.title}>
          {state.error ? `${track.title} · file missing` : track.title}
        </div>
        <div className="music-disc-buttons">
          <button
            type="button"
            className="music-btn"
            aria-label={state.playing ? 'Pause music' : 'Play music'}
            onClick={() => music.toggle()}
          >
            {state.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className="music-btn" aria-label="Next track" onClick={() => music.next()}>
            <NextIcon />
          </button>
          <button
            type="button"
            className={`music-btn${state.muted ? ' is-active' : ''}`}
            aria-label={state.muted ? 'Unmute music' : 'Mute music'}
            aria-pressed={state.muted}
            onClick={() => music.toggleMute()}
          >
            <SpeakerIcon muted={state.muted} />
          </button>
        </div>
      </div>
    </div>
  );
}
