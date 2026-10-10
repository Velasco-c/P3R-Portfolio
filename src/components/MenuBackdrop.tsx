import type { RefObject } from 'react';
import { media } from '../content';

interface MenuVideosProps {
  introRef: RefObject<HTMLVideoElement | null>;
  loopRef: RefObject<HTMLVideoElement | null>;
}

/** The two stacked background videos behind the main menu. */
export function MenuVideos({ introRef, loopRef }: MenuVideosProps) {
  return (
    <>
      <video
        id="background-video-intro"
        ref={introRef}
        className="background-video bg-video-intro"
        src={media.menuVideos.intro}
        muted
        playsInline
        preload="metadata"
      />
      <video
        id="background-video-loop"
        ref={loopRef}
        className="background-video bg-video-loop"
        src={media.menuVideos.loop}
        loop
        muted
        playsInline
        preload="none"
      />
    </>
  );
}

/** Profile name banner at the top-right of the main menu. */
export function MenuProfileHeader({ name, entered }: { name: string; entered: boolean }) {
  return (
    <div id="menu-profile-header" className={`menu-profile-header${entered ? ' menu-entered' : ''}`} aria-hidden="true">
      <div className="profile-name-text">{name}</div>
      <div className="profile-accent-line" />
    </div>
  );
}
