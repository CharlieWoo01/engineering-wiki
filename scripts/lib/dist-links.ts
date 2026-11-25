/**
 * Pure helpers for validating links and asset references in the built site.
 *
 * `starlight-links-validator` checks Markdown links at build time. This module
 * complements it by checking the *generated HTML* — including stylesheets,
 * scripts, images and the favicon — and by asserting that every root-relative
 * URL lives under the configured base path (the most common GitHub Pages
 * project-site failure).
 */
import path from 'node:path/posix';

export type ResolvedLink =
  | { kind: 'skip' }
  | { kind: 'external' }
  | { kind: 'outside-base'; pathname: string }
  | { kind: 'internal'; pathname: string; candidates: string[] };

const ATTRIBUTE_PATTERN = /\s(href|src|srcset)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;

/** Extracts every href, src and srcset URL from an HTML document. */
export function extractLinks(html: string): string[] {
  const links: string[] = [];
  for (const match of html.matchAll(ATTRIBUTE_PATTERN)) {
    const attribute = match[1]?.toLowerCase();
    const value = decodeEntities(match[2] ?? match[3] ?? '');
    if (attribute === 'srcset') {
      for (const candidate of value.split(',')) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) links.push(url);
      }
    } else {
      links.push(value);
    }
  }
  return links;
}

/**
 * Classifies a link found on `pageUrlPath` (e.g. `/engineering-wiki/adr/`)
 * and, for internal links, lists the files in the output directory that
 * would satisfy it, relative to that directory.
 */
export function resolveLink(raw: string, pageUrlPath: string, base: string): ResolvedLink {
  const link = raw.trim();
  if (link === '' || link.startsWith('#')) return { kind: 'skip' };
  if (link.startsWith('//') || SCHEME_PATTERN.test(link)) return { kind: 'external' };

  const url = new URL(link, `http://wiki.invalid${pageUrlPath}`);
  const pathname = safeDecode(url.pathname);

  const prefix = base === '/' ? '' : base;
  if (prefix !== '' && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) {
    return { kind: 'outside-base', pathname };
  }

  const relative = pathname.slice(prefix.length).replace(/^\/+/, '');
  return { kind: 'internal', pathname, candidates: candidateFiles(relative) };
}

/** Maps a URL path (relative to the base) to output files that could serve it. */
export function candidateFiles(relativePath: string): string[] {
  if (relativePath === '' || relativePath.endsWith('/')) {
    return [`${relativePath}index.html`];
  }
  if (path.extname(relativePath) !== '') {
    return [relativePath];
  }
  return [`${relativePath}/index.html`, `${relativePath}.html`];
}

/** Converts an output file path (relative to the output dir) into the URL path it is served at. */
export function pageUrlPathFor(file: string, base: string): string {
  const prefix = base === '/' ? '' : base;
  const normalised = file.split('\\').join('/');
  if (normalised === 'index.html') return `${prefix}/`;
  if (normalised.endsWith('/index.html')) {
    return `${prefix}/${normalised.slice(0, -'index.html'.length)}`;
  }
  return `${prefix}/${normalised}`;
}

function decodeEntities(value: string): string {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'");
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
