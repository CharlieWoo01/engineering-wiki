/**
 * Build-time views over the docs collection: tags, reading time and the
 * documentation health report. Pure functions over plain objects so they can
 * be unit tested without Astro.
 */
import { isReviewOverdue } from './page-meta.ts';

export interface DocSummary {
  /** Collection id, e.g. `adr/introduction` (also the page's URL path). */
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'deprecated';
  owner?: string | undefined;
  lastReviewed?: Date | undefined;
  tags: readonly string[];
}

/** Pages that are not part of the handbook itself (homepage, 404). */
const isHandbookPage = (doc: Pick<DocSummary, 'id'>) => doc.id !== 'index' && doc.id !== '404';

const byTitle = (a: DocSummary, b: DocSummary) => a.title.localeCompare(b.title, 'en');

/* ---------- Tags ---------- */

export interface TagGroup {
  tag: string;
  pages: DocSummary[];
}

/** Every tag in use, most-used first (then alphabetical), with its pages sorted by title. */
export function groupByTag(docs: readonly DocSummary[]): TagGroup[] {
  const groups = new Map<string, DocSummary[]>();
  for (const doc of docs.filter(isHandbookPage)) {
    for (const tag of doc.tags) {
      const pages = groups.get(tag) ?? [];
      pages.push(doc);
      groups.set(tag, pages);
    }
  }
  return [...groups]
    .map(([tag, pages]) => ({ tag, pages: pages.sort(byTitle) }))
    .sort((a, b) => b.pages.length - a.pages.length || a.tag.localeCompare(b.tag, 'en'));
}

/* ---------- Reading time ---------- */

const WORDS_PER_MINUTE = 220;

/**
 * Estimated reading time in whole minutes, ignoring code blocks and markup.
 * Returns 0 for pages without prose (e.g. generated pages), otherwise at least 1.
 */
export function readingMinutes(markdown: string | undefined): number {
  const prose = (markdown ?? '')
    .replace(/^(`{3,}|~{3,})[\s\S]*?^\1/gm, ' ') // fenced code
    .replace(/^import .*$/gm, ' ') // MDX imports
    .replace(/<[^>]+>/g, ' ') // HTML / components
    .replace(/[#>*_`|[\]()-]/g, ' ');
  const words = prose.split(/\s+/).filter((word) => /\w/.test(word)).length;
  return words === 0 ? 0 : Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/* ---------- Documentation health ---------- */

export interface HealthReport {
  total: number;
  drafts: DocSummary[];
  deprecated: DocSummary[];
  reviewDue: DocSummary[];
  neverReviewed: DocSummary[];
  withoutOwner: DocSummary[];
  untagged: DocSummary[];
}

export function assessHealth(docs: readonly DocSummary[], now: Date): HealthReport {
  const pages = docs.filter(isHandbookPage).sort(byTitle);
  return {
    total: pages.length,
    drafts: pages.filter((doc) => doc.status === 'draft'),
    deprecated: pages.filter((doc) => doc.status === 'deprecated'),
    reviewDue: pages.filter((doc) => doc.lastReviewed && isReviewOverdue(doc.lastReviewed, now)),
    neverReviewed: pages.filter((doc) => !doc.lastReviewed),
    withoutOwner: pages.filter((doc) => !doc.owner),
    untagged: pages.filter((doc) => doc.tags.length === 0),
  };
}
