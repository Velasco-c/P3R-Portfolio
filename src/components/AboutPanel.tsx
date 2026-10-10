import { about, hud, site } from '../content';
import type { RichSegment } from '../types/content';
import { HudButton } from './Hud';
import { PageBanner, SubpageProfile } from './FullscreenPage';

function renderSegment(segment: RichSegment, index: number) {
  if (typeof segment === 'string') return <span key={index}>{segment}</span>;
  if ('strong' in segment) return <strong key={index}>{segment.strong}</strong>;
  return <em key={index}>{segment.em}</em>;
}

interface AboutPanelProps {
  title: string;
  onBack: () => void;
}

export function AboutPanel({ title, onBack }: AboutPanelProps) {
  return (
    <>
      <div className="slink-left-column p3r-about-left-column">
        <SubpageProfile name={site.profileName} />
        <PageBanner id="about-header-div" titleId="about-header-text" title={title} />

        <div className="p3r-about-card" role="region" aria-label="About Profile Card">
          <div className="p3r-about-card-inner">
            <div className="p3r-about-top-row">
              <div className="p3r-photo-box" aria-label="Profile Photo">
                <picture>
                  <source srcSet={about.photo.webp} type="image/webp" />
                  <img src={about.photo.jpg} alt={about.photo.alt} className="p3r-photo-img" width={120} height={120} decoding="async" />
                </picture>
              </div>

              <div className="p3r-about-identity">
                <h2 className="p3r-about-name">{about.name}</h2>
                <div className="p3r-about-title">{about.role}</div>
              </div>
            </div>

            <div className="p3r-about-bio">
              {about.paragraphs.map((segments, i) => (
                <p key={i} className="p3r-about-p">
                  {segments.map(renderSegment)}
                </p>
              ))}
            </div>

            <div className="p3r-about-quote">
              <div className="p3r-quote-mark" aria-hidden="true">
                “
              </div>
              <div className="p3r-quote-content">
                <blockquote className="p3r-quote-text">{about.quote.text}</blockquote>
                <cite className="p3r-quote-author">{about.quote.author}</cite>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="slink-bottom-hud">
        <div className="buttons-row">
          <HudButton id="about-back-btn" ariaLabel="Close About Screen" keyContent={hud.esc} label={hud.close} onClick={onBack} />
        </div>
      </div>
    </>
  );
}
