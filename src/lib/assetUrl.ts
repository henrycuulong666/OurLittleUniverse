/** Bump when you replace a video/poster file with the same name, so browsers don't keep the old cached copy. */
const VIDEO_VERSION = 2;

/** Resolve a path under public/media/ for any Vite base (local, GitHub Pages sub-path…). */
export function mediaUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\/+/, '');
  const url = `${base.endsWith('/') ? base : base + '/'}media/${clean}`;
  return /^(videos|posters)\//.test(clean) ? `${url}?v=${VIDEO_VERSION}` : url;
}
