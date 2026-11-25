/**
 * Resolves Astro's `site` and `base` options from the environment.
 *
 * Defaults target GitHub Pages project hosting
 * (https://charliewoo01.github.io/engineering-wiki/). The deploy workflow
 * passes the values reported by `actions/configure-pages`, so switching to a
 * custom domain (served from `/`) requires no code change.
 */

export const DEFAULT_SITE_URL = 'https://charliewoo01.github.io';
export const DEFAULT_BASE_PATH = '/engineering-wiki';

export interface Deployment {
  /** Origin only, e.g. `https://example.github.io` (no trailing slash, no path). */
  site: string;
  /** Path prefix, e.g. `/engineering-wiki`, or `/` when served from the root. */
  base: string;
}

export interface DeploymentEnv {
  SITE_URL?: string | undefined;
  BASE_PATH?: string | undefined;
}

/** Normalises a base path to `/` or `/segment[/segment…]` with no trailing slash. */
export function normaliseBasePath(input: string): string {
  const segments = input
    .trim()
    .split('/')
    .filter((segment) => segment.length > 0);

  for (const segment of segments) {
    if (segment === '.' || segment === '..' || /[\s?#\\]/.test(segment)) {
      throw new Error(`Invalid BASE_PATH segment "${segment}" in "${input}".`);
    }
  }

  return segments.length === 0 ? '/' : `/${segments.join('/')}`;
}

/** Validates that the site URL is an http(s) origin without a path. */
export function normaliseSiteUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error(`Invalid SITE_URL "${input}": expected an absolute URL.`);
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`Invalid SITE_URL "${input}": only http and https are supported.`);
  }

  if (url.pathname !== '/' || url.search !== '' || url.hash !== '') {
    throw new Error(
      `Invalid SITE_URL "${input}": provide the origin only and set the path via BASE_PATH.`,
    );
  }

  return url.origin;
}

export function resolveDeployment(env: DeploymentEnv): Deployment {
  const site = normaliseSiteUrl(nonEmpty(env.SITE_URL) ?? DEFAULT_SITE_URL);
  const base = normaliseBasePath(nonEmpty(env.BASE_PATH) ?? DEFAULT_BASE_PATH);
  return { site, base };
}

function nonEmpty(value: string | undefined): string | undefined {
  return value !== undefined && value.trim() !== '' ? value : undefined;
}
