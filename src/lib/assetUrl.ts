/** Resolve a path under public/media/ for any Vite base (local, GitHub Pages sub-path…). */
export function mediaUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = path.replace(/^\/+/, '');
  return `${base.endsWith('/') ? base : base + '/'}media/${clean}`;
}
