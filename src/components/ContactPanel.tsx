import type { MutableRefObject } from 'react';
import { hud, mailRows } from '../content';
import { HudButton } from './Hud';

const GMAIL_ICON = 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z';
const ENVELOPE_ICON = 'M22 0H2C0.9 0 0 0.9 0 2v14c0 1.1 0.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4.2l-10 6.3L2 4.2V2.5l10 6.3 10-6.3v1.7z';

interface ContactPanelProps {
  selected: number;
  rowRefs: MutableRefObject<Array<HTMLElement | null>>;
  onHover: (index: number) => void;
  onBack: () => void;
}

export function ContactPanel({ selected, rowRefs, onHover, onBack }: ContactPanelProps) {
  return (
    <>
      <div className="p3r-mail-phone-wrap">
        <svg className="p3r-mail-chassis-svg" viewBox="0 0 880 860" preserveAspectRatio="none" aria-hidden="true">
          <polygon className="p3r-mail-black-body" points="10,28 875,56 875,836 10,858" fill="#070a12" />
          <polygon
            className="p3r-mail-white-frame"
            points="22,50 832,96 828,806 18,838"
            fill="none"
            stroke="#ffffff"
            strokeWidth={4.5}
            strokeLinejoin="round"
          />
        </svg>

        <div className="p3r-mail-phone-card">
          <div className="p3r-mail-header-row">
            <div className="p3r-mail-watermark" aria-hidden="true">
              MAIL
            </div>
          </div>

          <div className="p3r-mail-list-container" role="list" aria-label="Contact Channels">
            {mailRows.map((row, index) => {
              const isActive = index === selected;
              const setRef = (el: HTMLElement | null) => {
                rowRefs.current[index] = el;
              };

              if (row.kind === 'channel') {
                return (
                  <a
                    key={index}
                    ref={setRef}
                    href={row.href}
                    className={`p3r-mail-row${isActive ? ' active' : ''}`}
                    data-idx={index}
                    role="listitem"
                    aria-label={row.ariaLabel}
                    onMouseEnter={() => onHover(index)}
                  >
                    <div className="p3r-mail-icon-block p3r-mail-gmail" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width={34} height={34} fill="currentColor">
                        <path d={GMAIL_ICON} />
                      </svg>
                    </div>
                    <div className="p3r-mail-content-block">
                      <div className="p3r-mail-sender-row">
                        <svg className="p3r-mail-env-icon" width={18} height={14} viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
                          <path d={ENVELOPE_ICON} />
                        </svg>
                        <span className="p3r-mail-sender-name">{row.sender}</span>
                      </div>
                      <div className="p3r-mail-row-line" aria-hidden="true" />
                      <div className="p3r-mail-msg-text">{row.address}</div>
                    </div>
                  </a>
                );
              }

              return (
                <div
                  key={index}
                  ref={setRef}
                  className={`p3r-mail-row p3r-mail-row-empty${isActive ? ' active' : ''}`}
                  aria-hidden="true"
                  onMouseEnter={() => onHover(index)}
                >
                  <div className="p3r-mail-icon-block p3r-mail-empty-icon" aria-hidden="true" />
                  <div className="p3r-mail-content-block">
                    <div className="p3r-mail-sender-row">
                      <span className="p3r-mail-sender-name" />
                    </div>
                    <div className="p3r-mail-row-line" aria-hidden="true" />
                    <div className="p3r-mail-msg-text p3r-mail-empty-text">{row.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p3r-contact-bottom-hud">
        <div className="buttons-row">
          <HudButton id="contact-back-btn" ariaLabel="Close Contact Screen" keyContent={hud.esc} label={hud.close} onClick={onBack} />
        </div>
      </div>
    </>
  );
}
