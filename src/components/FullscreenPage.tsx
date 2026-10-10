import { useRef, type ReactNode, type RefObject } from 'react';
import { cx } from '../lib/classnames';
import { useScreenTransition, type ScreenPhase, type TransitionSettle } from '../hooks/useScreenTransition';
import type { Point } from '../engine/wavy';

interface FullscreenPageProps {
  id: string;
  /** Extra class for page-specific styling (e.g. "p3r-skill-screen"). */
  className?: string;
  ariaLabel: string;
  phase: ScreenPhase;
  origin: Point | null;
  onSettled: (settled: TransitionSettle) => void;
  /** Background video shown behind the page. */
  video: { src: string; overlayClassName?: string };
  videoRef: RefObject<HTMLVideoElement | null>;
  menuVideoRef: RefObject<HTMLVideoElement | null>;
  /** Class on <body> while this page is open. */
  bodyClass: string;
  exitButtonId: string;
  exitFallback: () => Point;
  viewportClassName?: string;
  children: ReactNode;
}

/**
 * Shell shared by every sub-page: looping background video, dark overlay,
 * and the viewport that holds the page content. Owns the reveal/close animation.
 */
export function FullscreenPage({
  id,
  className,
  ariaLabel,
  phase,
  origin,
  onSettled,
  video,
  videoRef,
  menuVideoRef,
  bodyClass,
  exitButtonId,
  exitFallback,
  viewportClassName,
  children,
}: FullscreenPageProps) {
  const pageRef = useRef<HTMLElement>(null);

  useScreenTransition({
    phase,
    origin,
    bodyClass,
    pageRef,
    videoRef,
    menuVideoRef,
    exitButtonId,
    exitFallback,
    onSettled,
  });

  const transitioning = phase === 'opening' || phase === 'closing';

  return (
    <section
      id={id}
      ref={pageRef}
      className={cx(
        'p3r-slink-screen',
        className,
        transitioning && 'circle-transitioning',
        phase === 'open' && 'active',
      )}
      role="region"
      aria-label={ariaLabel}
      aria-hidden={phase === 'closed'}
    >
      <div className="slink-video-container" aria-hidden="true">
        <video ref={videoRef} className="slink-bg-video" loop muted playsInline preload="none">
          <source src={video.src} type="video/mp4" />
        </video>
        <div className={cx('slink-video-overlay', video.overlayClassName)} aria-hidden="true" />
      </div>

      <div className={cx('slink-viewport', viewportClassName)}>{children}</div>
    </section>
  );
}

/** "ILHAM ZIQRI" line above the page banner. */
export function SubpageProfile({ name }: { name: string }) {
  return (
    <div className="slink-profile-header" aria-hidden="true">
      <div className="slink-profile-name">{name}</div>
    </div>
  );
}

/** Slanted banner with the page title (the shattered header shape). */
export function PageBanner({ id, titleId, title }: { id: string; titleId: string; title: string }) {
  return (
    <div className="p3r-geometric-header" id={id}>
      <div className="p3r-shard-back-band" aria-hidden="true" />
      <div className="p3r-header-slash-main" aria-hidden="true" />
      <h1 className="p3r-banner-title" id={titleId}>
        {title}
      </h1>
    </div>
  );
}
