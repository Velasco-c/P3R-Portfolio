import type { CSSProperties } from 'react';
import { hud, site } from '../content';
import type { ProjectItem } from '../types/content';
import { HudButton } from './Hud';
import { PageBanner, SubpageProfile } from './FullscreenPage';

interface ProjectPanelProps {
  title: string;
  items: ProjectItem[];
  selected: number;
  /** False while the page is animating in or out; disables pointer selection. */
  interactive: boolean;
  /** Changes on every open so the cards replay their entrance animation. */
  sessionKey: number;
  onSelect: (index: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export function ProjectPanel({ title, items, selected, interactive, sessionKey, onSelect, onConfirm, onBack }: ProjectPanelProps) {
  return (
    <>
      <div className="slink-left-column">
        <SubpageProfile name={site.profileName} />
        <PageBanner id="slink-project-div" titleId="slink-project-text" title={title} />

        <div id="slink-cards-container" className="slink-cards-container" role="tablist" aria-label="Project List">
          {items.map((item, idx) => {
            const isActive = idx === selected;
            return (
              <button
                key={`${sessionKey}-${idx}`}
                id={`slink-card-${idx}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`slink-card${isActive ? ' active' : ''}`}
                style={{ '--card-idx': idx } as CSSProperties}
                onMouseEnter={() => {
                  if (interactive && !isActive) onSelect(idx);
                }}
                onClick={() => {
                  if (!interactive) return;
                  if (!isActive) onSelect(idx);
                  else onConfirm();
                }}
              >
                <div className="card-unified-row">
                  <div className="card-numeral-box">
                    <span className="card-numeral-text">{item.numeral}</span>
                  </div>
                  <div className="card-main-body">
                    <div className="card-title-text">{item.title}</div>
                    <div className="card-subtitle-text">{item.subtitle}</div>
                    <div className="card-red-accent" aria-hidden="true" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="slink-bottom-hud">
        <div className="buttons-row">
          <HudButton
            id="slink-confirm-btn"
            ariaLabel="Confirm Selection"
            keyContent={hud.enter}
            label={hud.confirm}
            onClick={onConfirm}
          />
          <HudButton
            id="slink-back-btn"
            ariaLabel="Back to Main Menu"
            keyContent={hud.esc}
            label={hud.back}
            onClick={onBack}
          />
        </div>
      </div>
    </>
  );
}
