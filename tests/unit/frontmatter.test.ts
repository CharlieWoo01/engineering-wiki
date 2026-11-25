import { describe, expect, it } from 'vitest';
import { wikiFrontmatter } from '../../src/lib/frontmatter.ts';

describe('wikiFrontmatter', () => {
  it('defaults status to "published" and leaves optional fields unset', () => {
    const result = wikiFrontmatter.parse({ description: 'A meaningful description.' });
    expect(result).toEqual({ description: 'A meaningful description.', status: 'published' });
  });

  it('requires a description', () => {
    expect(wikiFrontmatter.safeParse({}).success).toBe(false);
  });

  it('rejects placeholder-length descriptions', () => {
    expect(wikiFrontmatter.safeParse({ description: 'TODO' }).success).toBe(false);
  });

  it('rejects unknown statuses', () => {
    const result = wikiFrontmatter.safeParse({
      description: 'A valid description.',
      status: 'wip',
    });
    expect(result.success).toBe(false);
  });

  it('coerces lastReviewed from a YAML date string', () => {
    const result = wikiFrontmatter.parse({
      description: 'A valid description.',
      lastReviewed: '2026-11-25',
    });
    expect(result.lastReviewed).toEqual(new Date('2026-11-25'));
  });
});
