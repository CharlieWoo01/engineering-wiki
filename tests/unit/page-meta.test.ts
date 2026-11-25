import { describe, expect, it } from 'vitest';
import { describePageMeta, hasPageMeta, isReviewOverdue } from '../../src/lib/page-meta.ts';
import { withBase } from '../../src/lib/paths.ts';

const NOW = new Date('2026-11-25T12:00:00Z');

describe('describePageMeta', () => {
  it('shows nothing for a published page without owner or review date', () => {
    const meta = describePageMeta({ status: 'published' }, NOW);
    expect(meta).toEqual({});
    expect(hasPageMeta(meta)).toBe(false);
  });

  it.each([
    ['draft', 'Draft', 'caution'],
    ['deprecated', 'Deprecated', 'danger'],
  ] as const)('labels %s pages', (status, label, variant) => {
    expect(describePageMeta({ status }, NOW).status).toEqual({ label, variant });
  });

  it('formats the owner and review date', () => {
    const meta = describePageMeta(
      { owner: 'Platform team', lastReviewed: new Date('2026-11-25') },
      NOW,
    );
    expect(meta).toEqual({
      owner: 'Platform team',
      lastReviewed: { iso: '2026-11-25', display: '25 Nov 2026', overdue: false },
    });
    expect(hasPageMeta(meta)).toBe(true);
  });
});

describe('isReviewOverdue', () => {
  it('is not overdue within twelve months', () => {
    expect(isReviewOverdue(new Date('2025-11-26'), NOW)).toBe(false);
  });

  it('is overdue after twelve months', () => {
    expect(isReviewOverdue(new Date('2025-11-24'), NOW)).toBe(true);
  });
});

describe('withBase', () => {
  it.each([
    ['/engineering-wiki', 'adr/', '/engineering-wiki/adr/'],
    ['/engineering-wiki/', '/adr/', '/engineering-wiki/adr/'],
    ['/', 'adr/', '/adr/'],
    ['', 'adr/', '/adr/'],
  ])('joins %j and %j', (base, path, expected) => {
    expect(withBase(base, path)).toBe(expected);
  });
});
