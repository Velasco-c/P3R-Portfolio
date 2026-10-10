/**
 * Loading sequence: a smoothed progress counter that waits for fonts and audio.
 * Resolves once the counter reaches 100%.
 */
export interface LoadingHooks {
  onProgress: (percent: number) => void;
  /** Kicks off background downloads (audio decode etc.). Not awaited. */
  startPreload: () => void;
}

const START_PROGRESS = 15;
const AFTER_AUDIO_PROGRESS = 55;
const FONT_WAIT_MS = 120;
const SETTLE_MS = 60;

export async function runLoadingSequence({ onProgress, startPreload }: LoadingHooks): Promise<void> {
  let current = 0;
  let target = START_PROGRESS;
  const raiseTarget = (value: number) => {
    target = Math.min(100, Math.max(target, Math.round(value)));
  };

  // Eases the displayed value toward the target one frame at a time.
  const ticker = new Promise<void>((resolve) => {
    const tick = () => {
      if (current < target) {
        const step = Math.max(1, Math.ceil((target - current) * 0.35));
        current = Math.min(target, current + step);
        onProgress(current);
      }
      if (current >= 100) {
        onProgress(100);
        resolve();
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  });

  startPreload();
  raiseTarget(AFTER_AUDIO_PROGRESS);

  try {
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise<void>((r) => setTimeout(r, FONT_WAIT_MS)),
      ]);
    }
  } catch {
    /* fonts are optional for this step */
  }

  raiseTarget(100);
  await ticker;
  onProgress(100);
  await new Promise<void>((r) => setTimeout(r, SETTLE_MS));
}
