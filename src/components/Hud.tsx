import type { ReactNode } from 'react';

/** Non-interactive key hint, e.g. [ENTER] Confirm. */
export function KeyHint({ keyLabel, label }: { keyLabel: string; label: string }) {
  return (
    <div className="control-item">
      <div className="control-key">{keyLabel}</div>
      <span className="control-text">{label}</span>
    </div>
  );
}

interface HudButtonProps {
  id?: string;
  ariaLabel: string;
  keyContent: ReactNode;
  label: string;
  onClick: () => void;
}

/** Clickable key hint used on the sub-pages. */
export function HudButton({ id, ariaLabel, keyContent, label, onClick }: HudButtonProps) {
  return (
    <button id={id} type="button" className="control-item slink-hud-btn" aria-label={ariaLabel} onClick={onClick}>
      <div className="control-key">{keyContent}</div>
      <span className="control-text">{label}</span>
    </button>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
