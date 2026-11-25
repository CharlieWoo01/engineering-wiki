import { describe, expect, it } from 'vitest';
import {
  assessHealth,
  groupByTag,
  readingMinutes,
  type DocSummary,
} from '../../src/lib/docs-index.ts';

const doc = (id: string, overrides: Partial<DocSummary> = {}): DocSummary => ({
  id,
  title: id,
  description: `About ${id}.`,
  status: 'published',
  tags: [],
  ...overrides,
});

const NOW = new Date('2026-11-25T12:00:00Z');

describe('groupByTag', () => {
  it('groups pages by tag, most-used tags first, pages sorted by title', () => {
    const groups = groupByTag([
      doc('b', { title: 'Beta', tags: ['security', 'ci-cd'] }),
      doc('a', { title: 'Alpha', tags: ['security'] }),
      doc('c', { title: 'Gamma', tags: ['ci-cd', 'testing'] }),
    ]);

    expect(groups.map(({ tag, pages }) => [tag, pages.map((p) => p.title)])).toEqual([
      ['ci-cd', ['Beta', 'Gamma']],
      ['security', ['Alpha', 'Beta']],
      ['testing', ['Gamma']],
    ]);
  });

  it('ignores the homepage and 404 page', () => {
    expect(groupByTag([doc('index', { tags: ['x'] }), doc('404', { tags: ['x'] })])).toEqual([]);
  });
});

describe('readingMinutes', () => {
  it('returns 0 for pages without prose', () => {
    expect(readingMinutes(undefined)).toBe(0);
    expect(readingMinutes('')).toBe(0);
    expect(readingMinutes('```sh\nls -la\n```')).toBe(0);
  });

  it('rounds to whole minutes with a minimum of one', () => {
    expect(readingMinutes('A short page.')).toBe(1);
    expect(readingMinutes(Array.from({ length: 660 }, () => 'word').join(' '))).toBe(3);
  });

  it('ignores code blocks, MDX imports and components', () => {
    const code = Array.from({ length: 1000 }, () => 'token').join(' ');
    const page = `import { Card } from 'x';\n\n<Card title="t" />\n\n\`\`\`ts\n${code}\n\`\`\`\n\nHello world.`;
    expect(readingMinutes(page)).toBe(1);
  });
});

describe('assessHealth', () => {
  const report = assessHealth(
    [
      doc('index'),
      doc('fresh', { owner: 'Team', lastReviewed: new Date('2026-06-01'), tags: ['x'] }),
      doc('stale', { owner: 'Team', lastReviewed: new Date('2024-01-01'), tags: ['x'] }),
      doc('draft', { status: 'draft' }),
      doc('old', { status: 'deprecated', owner: 'Team', tags: ['x'] }),
    ],
    NOW,
  );
  const ids = (pages: DocSummary[]) => pages.map((page) => page.id);

  it('counts handbook pages only', () => {
    expect(report.total).toBe(4);
  });

  it('classifies pages that need attention', () => {
    expect(ids(report.drafts)).toEqual(['draft']);
    expect(ids(report.deprecated)).toEqual(['old']);
    expect(ids(report.reviewDue)).toEqual(['stale']);
    expect(ids(report.neverReviewed)).toEqual(['draft', 'old']);
    expect(ids(report.withoutOwner)).toEqual(['draft']);
    expect(ids(report.untagged)).toEqual(['draft']);
  });
});
