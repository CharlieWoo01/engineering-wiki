/**
 * Joins the site's base path with a path relative to the site root, e.g.
 * `withBase('/engineering-wiki', 'adr/introduction/')` → `/engineering-wiki/adr/introduction/`.
 * Used by components, which (unlike Markdown) cannot rely on relative links.
 */
export function withBase(base: string, path: string): string {
  const prefix = base.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${prefix}/${suffix}`;
}
