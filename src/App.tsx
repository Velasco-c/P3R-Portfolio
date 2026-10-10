import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent, type RefObject } from 'react';
import { hud, mailRows, media, menuOptions, projects, site, skillGroups, skillTabs } from './content';
import { sfx, type SfxName } from './engine/audio';
import { music } from './engine/music';
import { getOptionOrigin } from './engine/origins';
import { readBootPlan, readInitialSelection, readModalParam } from './engine/boot';
import type { Point } from './engine/wavy';
import type { ScreenId } from './types/content';
import { useAudioUnlock } from './hooks/useAudioUnlock';
import { useDocumentKeydown } from './hooks/useDocumentKeydown';
import { useMenuVideos } from './hooks/useMenuVideos';
import type { ScreenPhase, TransitionSettle } from './hooks/useScreenTransition';
import { LoadingScreen } from './components/LoadingScreen';
import { MainMenu } from './components/MainMenu';
import { MenuProfileHeader, MenuVideos } from './components/MenuBackdrop';
import { FullscreenPage } from './components/FullscreenPage';
import { ProjectPanel } from './components/ProjectPanel';
import { SkillsPanel } from './components/SkillsPanel';
import { AboutPanel } from './components/AboutPanel';
import { ContactPanel } from './components/ContactPanel';
import { PortfolioModal } from './components/PortfolioModal';
import { KeyHint } from './components/Hud';
import { MusicDisc } from './components/MusicDisc';

const DISMISS_MS = 450;
const CONFIRM_DELAY_MS = 200;

interface ActiveScreen {
  id: ScreenId;
  phase: ScreenPhase;
  origin: Point;
}

interface ActiveModal {
  id: ScreenId;
  phase: ScreenPhase;
  origin: Point;
}

const screenBodyClass: Record<ScreenId, string> = {
  project: 'project-screen-active',
  skills: 'skill-screen-active',
  about: 'about-screen-active',
  contact: 'contact-screen-active',
};

const exitButtonIds: Record<ScreenId, string> = {
  project: 'slink-back-btn',
  skills: 'skill-back-btn',
  about: 'about-back-btn',
  contact: 'contact-back-btn',
};

/** Where the back button's ripple starts when its element is not laid out. */
const exitFallbacks: Record<ScreenId, () => Point> = {
  project: () => ({ x: window.innerWidth - 120, y: window.innerHeight - 55 }),
  skills: () => ({ x: window.innerWidth - 120, y: window.innerHeight - 55 }),
  about: () => ({ x: window.innerWidth - 120, y: window.innerHeight - 55 }),
  contact: () => ({ x: 80, y: window.innerHeight - 60 }),
};

const pad2 = (n: number) => String(n).padStart(2, '0');

export default function App() {
  const boot = useMemo(() => readBootPlan(window.location.search), []);
  const modalParam = useMemo(() => readModalParam(window.location.search), []);

  // ---------------------------------------------------------------- state
  const [loadingVisible, setLoadingVisible] = useState(boot.mode === 'loading');
  const [loadingDismissed, setLoadingDismissed] = useState(false);
  const [menuEntered, setMenuEntered] = useState(false);
  const [menuIndex, setMenuIndex] = useState(() => readInitialSelection(window.location.search, menuOptions.length));

  const [screen, setScreen] = useState<ActiveScreen | null>(null);
  const [modal, setModal] = useState<ActiveModal | null>(null);
  /** Increments on every sub-page open; used to replay entrance animations. */
  const [session, setSession] = useState(0);

  const [projectIndex, setProjectIndex] = useState(0);
  const [skillTab, setSkillTab] = useState(() => {
    const requested = boot.mode === 'page' ? boot.tab : undefined;
    return skillTabs.some((t) => t.id === requested) ? (requested as string) : skillTabs[0].id;
  });
  const [contactIndex, setContactIndex] = useState(0);

  // Mirrors used by event handlers and timers that must see the latest value.
  const startedRef = useRef(false);
  const loadedRef = useRef(false);
  const bootRef = useRef(false);

  // ------------------------------------------------------------- refs
  const introRef = useRef<HTMLVideoElement>(null);
  const loopRef = useRef<HTMLVideoElement>(null);
  const screenVideoRefs: Record<ScreenId, RefObject<HTMLVideoElement | null>> = {
    project: useRef<HTMLVideoElement>(null),
    skills: useRef<HTMLVideoElement>(null),
    about: useRef<HTMLVideoElement>(null),
    contact: useRef<HTMLVideoElement>(null),
  };
  const contactRowRefs = useRef<Array<HTMLElement | null>>([]);

  const menuVideos = useMenuVideos(introRef, loopRef);
  useAudioUnlock();

  // ------------------------------------------------------------ helpers
  const playNavigation = useCallback((name: SfxName = 'navigation') => {
    if (startedRef.current) sfx.play(name);
  }, []);

  const preloadScreenVideo = (id: ScreenId) => {
    const video = screenVideoRefs[id].current;
    if (video && video.preload !== 'auto') video.preload = 'auto';
  };

  const selectMenuItem = (index: number) => {
    if (index === menuIndex) return;
    setMenuIndex(index);
    playNavigation();
    preloadScreenVideo(menuOptions[index].id);
  };

  const enterExperience = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    sfx.markEntered();
    void sfx.playMenuTheme();
    music.autoplay();
    setLoadingDismissed(true);
    window.setTimeout(() => setLoadingVisible(false), DISMISS_MS);
    setMenuEntered(true);
    menuVideos.start();
  };

  const onLoadingReady = () => {
    loadedRef.current = true;
    sfx.resume();
    enterExperience();
  };

  // ----------------------------------------------------- screen control
  const openScreen = (id: ScreenId, event?: Pick<MouseEvent, 'clientX' | 'clientY'>) => {
    if (screen || modal) return;
    playNavigation();
    const index = menuOptions.findIndex((o) => o.id === id);
    const origin = getOptionOrigin(index, id, event);
    setSession((s) => s + 1);
    if (id === 'project') {
      setProjectIndex(0);
      playNavigation();
    }
    if (id === 'contact') {
      setContactIndex(0);
      playNavigation();
    }
    setScreen({ id, phase: 'opening', origin });
  };

  const closeScreen = () => {
    if (!screen || screen.phase !== 'open') return;
    sfx.play('closeMenu');
    setScreen({ ...screen, phase: 'closing' });
  };

  const onScreenSettled = useCallback((settled: TransitionSettle) => {
    setScreen((prev) => {
      if (!prev) return prev;
      if (settled === 'opening') return prev.phase === 'opening' ? { ...prev, phase: 'open' } : prev;
      return null;
    });
  }, []);

  const openModal = (id: ScreenId) => {
    if (screen || modal) return;
    const index = menuOptions.findIndex((o) => o.id === id);
    setModal({ id, phase: 'opening', origin: getOptionOrigin(index, id) });
    sfx.play('navigation');
  };

  const closeModal = () => {
    if (!modal || modal.phase !== 'open') return;
    sfx.play('closeMenu');
    setModal({ ...modal, phase: 'closing' });
  };

  const onModalSettled = useCallback((settled: TransitionSettle) => {
    setModal((prev) => {
      if (!prev) return prev;
      if (settled === 'opening') return prev.phase === 'opening' ? { ...prev, phase: 'open' } : prev;
      return null;
    });
  }, []);

  const activateOption = (index: number, event?: MouseEvent<HTMLButtonElement>) => {
    openScreen(menuOptions[index].id, event);
  };

  const confirmProject = () => {
    const item = projects[projectIndex];
    playNavigation();
    if (item && item.url && item.url !== '#') {
      setTimeout(() => {
        window.location.href = item.url;
      }, CONFIRM_DELAY_MS);
    }
  };

  const selectProject = (index: number) => {
    setProjectIndex(index);
    playNavigation();
  };

  const selectSkillTab = (id: string) => {
    setSkillTab(id);
    playNavigation();
  };

  const stepSkillTab = (delta: number) => {
    const current = skillTabs.findIndex((t) => t.id === skillTab);
    const next = (current + delta + skillTabs.length) % skillTabs.length;
    selectSkillTab(skillTabs[next].id);
  };

  const selectContact = (index: number) => {
    setContactIndex(Math.max(0, Math.min(index, mailRows.length - 1)));
    playNavigation();
  };

  // --------------------------------------------------- keyboard routing
  const handleKey = (e: KeyboardEvent) => {
    const key = e.key;
    const lower = key.toLowerCase();

    if (!startedRef.current) {
      if (loadedRef.current || key === 'Enter' || key === ' ') enterExperience();
      return;
    }

    // A page is "active" for input from the moment it starts opening until it starts closing.
    const activeId = screen && screen.phase !== 'closing' ? screen.id : null;
    const back = key === 'Escape' || lower === 'b' || lower === 'backspace';
    const down = key === 'ArrowDown' || lower === 's';
    const up = key === 'ArrowUp' || lower === 'w';

    if (activeId === 'project') {
      if (back) {
        e.preventDefault();
        closeScreen();
      } else if (down) {
        e.preventDefault();
        selectProject((projectIndex + 1) % projects.length);
      } else if (up) {
        e.preventDefault();
        selectProject((projectIndex - 1 + projects.length) % projects.length);
      } else if (key === 'Enter' || key === ' ' || lower === 'a') {
        e.preventDefault();
        confirmProject();
      }
      return;
    }

    if (activeId === 'skills') {
      if (back) {
        e.preventDefault();
        closeScreen();
      } else if (lower === 'q' || key === 'ArrowLeft') {
        e.preventDefault();
        stepSkillTab(-1);
      } else if (lower === 'e' || key === 'ArrowRight') {
        e.preventDefault();
        stepSkillTab(1);
      }
      return;
    }

    if (activeId === 'about') {
      if (back) {
        e.preventDefault();
        closeScreen();
      }
      return;
    }

    if (activeId === 'contact') {
      if (back) {
        e.preventDefault();
        closeScreen();
      } else if (down) {
        e.preventDefault();
        selectContact((contactIndex + 1) % mailRows.length);
      } else if (up) {
        e.preventDefault();
        selectContact((contactIndex - 1 + mailRows.length) % mailRows.length);
      } else if (key === 'Enter' || key === ' ') {
        contactRowRefs.current[contactIndex]?.click();
      }
      return;
    }

    if (modal && modal.phase !== 'closing') {
      if (key === 'Escape' || lower === 'a') closeModal();
      return;
    }

    // Main menu
    if (down) {
      e.preventDefault();
      selectMenuItem((menuIndex + 1) % menuOptions.length);
    } else if (up) {
      e.preventDefault();
      selectMenuItem((menuIndex - 1 + menuOptions.length) % menuOptions.length);
    } else if (key === 'Enter' || key === ' ' || lower === 'b') {
      e.preventDefault();
      activateOption(menuIndex);
    } else if (key === 'Escape' || lower === 'a') {
      playNavigation();
    }
  };

  useDocumentKeydown(handleKey);

  // ------------------------------------------------------- boot sequence
  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;

    if (boot.mode === 'page') {
      startedRef.current = true;
      loadedRef.current = true;
      setMenuEntered(true);
      menuVideos.switchToLoop();
      openScreen(boot.page);
    } else if (boot.mode === 'skip-loading') {
      enterExperience();
      menuVideos.switchToLoop();
    }
    // 'loading' mode: LoadingScreen calls onLoadingReady when done.
    if (boot.mode !== 'loading') void sfx.preload(); // the loading screen preloads otherwise
    if (modalParam) openModal(modalParam);
    preloadScreenVideo(menuOptions[menuIndex].id);
    // Runs once on mount. The helpers it calls only use refs and stable setters.
  }, []);

  // ------------------------------------------------------------- render
  const phaseOf = (id: ScreenId): ScreenPhase => (screen?.id === id ? screen.phase : 'closed');
  const originOf = (id: ScreenId): Point | null => (screen?.id === id ? screen.origin : null);
  const transition = (id: ScreenId) => ({
    phase: phaseOf(id),
    origin: originOf(id),
    onSettled: onScreenSettled,
    menuVideoRef: loopRef,
    videoRef: screenVideoRefs[id],
    bodyClass: screenBodyClass[id],
    exitButtonId: exitButtonIds[id],
    exitFallback: exitFallbacks[id],
  });
  const option = (id: ScreenId) => menuOptions.find((o) => o.id === id)!;
  const modalOption = modal ? menuOptions.find((o) => o.id === modal.id) ?? null : null;

  return (
    <>
      {loadingVisible && <LoadingScreen dismissed={loadingDismissed} onReady={onLoadingReady} />}

      <main className="p3r-main">
        <div className="p3r-global-vignette" aria-hidden="true" />

        <MenuVideos introRef={introRef} loopRef={loopRef} />

        <div id="side-number" className="side-number" aria-hidden="true">
          <span>{pad2(menuIndex + 1)}</span>
        </div>

        <MenuProfileHeader name={site.profileName} entered={menuEntered} />

        <MusicDisc />

        <MainMenu
          options={menuOptions}
          selectedIndex={menuIndex}
          entered={menuEntered}
          onHover={selectMenuItem}
          onActivate={activateOption}
        />

        <div className="hud-controls">
          <div className="buttons-row">
            <KeyHint keyLabel={hud.enter} label={hud.confirm} />
            <KeyHint keyLabel={hud.esc} label={hud.close} />
          </div>
        </div>
      </main>

      <FullscreenPage
        id="project-page"
        ariaLabel="Projects Social Link Screen"
        video={{ src: media.screenVideos.project }}
        {...transition('project')}
      >
        <ProjectPanel
          title={option('project').name}
          items={projects}
          selected={projectIndex}
          interactive={phaseOf('project') === 'open'}
          sessionKey={session}
          onSelect={selectProject}
          onConfirm={confirmProject}
          onBack={closeScreen}
        />
      </FullscreenPage>

      <FullscreenPage
        id="skill-page"
        className="p3r-skill-screen"
        ariaLabel="Skills Stats Screen"
        video={{ src: media.screenVideos.skills }}
        viewportClassName="p3r-skill-viewport"
        {...transition('skills')}
      >
        <SkillsPanel
          title={option('skills').name}
          tabs={skillTabs}
          groups={skillGroups}
          activeTab={skillTab}
          sessionKey={session}
          onSelectTab={selectSkillTab}
          onPrevTab={() => stepSkillTab(-1)}
          onNextTab={() => stepSkillTab(1)}
          onBack={closeScreen}
        />
      </FullscreenPage>

      <FullscreenPage
        id="about-page"
        className="p3r-about-screen"
        ariaLabel="About Screen"
        video={{ src: media.screenVideos.about }}
        viewportClassName="p3r-about-viewport"
        {...transition('about')}
      >
        <AboutPanel title={option('about').name} onBack={closeScreen} />
      </FullscreenPage>

      <FullscreenPage
        id="contact-page"
        className="p3r-contact-screen"
        ariaLabel="Contact Mail Screen"
        video={{ src: media.screenVideos.contact, overlayClassName: 'p3r-contact-overlay' }}
        viewportClassName="p3r-contact-viewport"
        {...transition('contact')}
      >
        <ContactPanel
          selected={contactIndex}
          rowRefs={contactRowRefs}
          onHover={selectContact}
          onBack={closeScreen}
        />
      </FullscreenPage>

      <PortfolioModal
        option={modalOption}
        phase={modal?.phase ?? 'closed'}
        origin={modal?.origin ?? null}
        onSettled={onModalSettled}
        onClose={closeModal}
      />
    </>
  );
};