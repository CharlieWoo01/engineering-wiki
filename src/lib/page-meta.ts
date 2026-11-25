/**
 * Presentation logic for the page metadata shown under each page title
 * (status, owner, last reviewed). Kept separate from the component so it can
 * be unit tested.
 */
import type { WikiFrontmatter } from './frontmatter.ts';

/** Pages not reviewed for this long are flagged as due for review. */
export const REVIEW_INTERVAL_MONTHS = 12;

export interface PageMeta {
  status?: { label: string; variant: 'caution' | 'danger' };
  owner?: string;
  lastReviewed?: { iso: string; display: string; overdue: boolean };
}

const STATUS_LABELS = {
  draft: { label: 'Draft', variant: 'caution' },
  deprecated: { label: 'Deprecated', variant: 'danger' },
} as const;

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function isReviewOverdue(lastReviewed: Date, now: Date): boolean {
  const due = new Date(lastReviewed);
  due.setUTCMonth(due.getUTCMonth() + REVIEW_INTERVAL_MONTHS);
  return now.getTime() > due.getTime();
}

export function describePageMeta(
  data: Partial<Pick<WikiFrontmatter, 'status' | 'owner' | 'lastReviewed'>>,
  now: Date,
): PageMeta {
  const meta: PageMeta = {};

  // "published" is the default and needs no badge.
  if (data.status === 'draft' || data.status === 'deprecated') {
    meta.status = { ...STATUS_LABELS[data.status] };
  }
  if (data.owner) meta.owner = data.owner;
  if (data.lastReviewed) {
    meta.lastReviewed = {
      iso: data.lastReviewed.toISOString().slice(0, 10),
      display: dateFormat.format(data.lastReviewed),
      overdue: isReviewOverdue(data.lastReviewed, now),
    };
  }
  return meta;
}

export const hasPageMeta = (meta: PageMeta): boolean =>
  meta.status !== undefined || meta.owner !== undefined || meta.lastReviewed !== undefined;
