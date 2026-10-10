/**
 * Resolves a path inside /public against Vite's `base` setting, so the site
 * still works when deployed under a sub-path (for example /porto-persona3/).
 * Pass paths without a leading slash, e.g. assetUrl('videos/bg-intro.mp4').
 */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
