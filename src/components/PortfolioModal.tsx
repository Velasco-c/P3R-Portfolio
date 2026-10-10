import { useLayoutEffect, useRef } from 'react';
import { emptyLabel, hud } from '../content';
import type { MenuOption } from '../types/content';
import { getExitOrigin } from '../engine/origins';
import {
  REVEAL_EASING,
  MODAL_CLOSE_DURATION_MS,
  MODAL_OPEN_DURATION_MS,
  calculateTargetRadius,
  modalCloseKeyframes,
  modalOpenKeyframes,
  type Point,
} from '../engine/wavy';
import type { ScreenPhase, TransitionSettle } from '../hooks/useScreenTransition';

const CLOSE_BUTTON_ID = 'modal-close-btn';

interface PortfolioModalProps {
  option: MenuOption | null;
  phase: ScreenPhase;
  origin: Point | null;
  onSettled: (settled: TransitionSettle) => void;
  onClose: () => void;
}

/**
 * Overlay with a summary and a grid of cards for a menu item. Not opened by any
 * menu item in the current design (same as the original); open it by setting the
 * modal state in App to a menu option.
 */
export function PortfolioModal({ option, phase, origin, onSettled, onClose }: PortfolioModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || (phase !== 'opening' && phase !== 'closing')) return;

    let animation: Animation | null = null;
    if (phase === 'opening') {
      const o = origin ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      animation = el.animate(modalOpenKeyframes(o, calculateTargetRadius(o)), {
        duration: MODAL_OPEN_DURATION_MS,
        easing: REVEAL_EASING,
        fill: 'forwards',
      });
      animation.onfinish = () => onSettled('opening');
    } else {
      const exit = getExitOrigin(CLOSE_BUTTON_ID, () => ({ x: window.innerWidth * 0.78, y: window.innerHeight * 0.22 }));
      animation = el.animate(modalCloseKeyframes(exit, calculateTargetRadius(exit)), {
        duration: MODAL_CLOSE_DURATION_MS,
        easing: REVEAL_EASING,
        fill: 'forwards',
      });
      animation.onfinish = () => onSettled('closing');
    }
    return () => {
      animation?.cancel();
    };
    // Keyed on phase only: each phase change starts exactly one transition.
  }, [phase]);

  const visible = phase !== 'closed';

  return (
    <div
      id="portfolio-modal"
      ref={ref}
      className={`portfolio-modal${visible ? ' active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-hidden={!visible}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {option && (
        <div className="modal-card">
          <div className="modal-header">
            <div className="modal-title-wrap">
              <span id="modal-tag" className="modal-tag">
                {option.tag}
              </span>
              <h2 id="modal-title" className="modal-title">
                {option.name}
              </h2>
            </div>
            <button id={CLOSE_BUTTON_ID} type="button" className="modal-close-btn" aria-label="Close modal" onClick={onClose}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                <line x1="2" y1="2" x2="12" y2="12" />
                <line x1="12" y1="2" x2="2" y2="12" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            <p id="modal-summary" style={{ fontSize: '1.25rem', color: '#7de6fd', fontStyle: 'italic', marginBottom: '1rem' }}>
              {option.summary}
            </p>
            <div id="modal-cards-container" className="modal-content-grid">
              {option.cards.map((card) => (
                <div key={card.title} className="modal-info-card">
                  <div className="info-card-title">{card.title || emptyLabel}</div>
                  <div className="info-card-desc">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <div className="control-item">
              <div className="control-key">{hud.esc}</div>
              <span className="control-text" style={{ cursor: 'pointer' }} onClick={onClose}>
                {hud.close}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
