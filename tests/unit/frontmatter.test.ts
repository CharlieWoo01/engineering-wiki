import { describe, expect, it } from 'vitest';
import { wikiFrontmatter } from '../../src/lib/frontmatter.ts';

describe('wikiFrontmatter', () => {
  it('defaults status to "published" and leaves optional fields unset', () => {
    const result = wikiFrontmatter.parse({ description: 'A meaningful description.' });
    expect(result).toEqual({
      description: 'A meaningful description.',
      status: 'published',
      tags: [],
    });
  });

  it('accepts lowercase kebab-case tags', () => {
    const result = wikiFrontmatter.parse({
      description: 'A valid description.',
      tags: ['ci-cd', 'security'],
    });
    expect(result.tags).toEqual(['ci-cd', 'security']);
  });

  it.each([
    [['CI/CD'], 'not kebab-case'],
    [['security', 'security'], 'duplicated'],
    [['a', 'b', 'c', 'd', 'e', 'f', 'g'], 'more than six'],
  ])('rejects tags that are %s (%s)', (tags) => {
    expect(wikiFrontmatter.safeParse({ description: 'A valid description.', tags }).success).toBe(
      false,
    );
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
