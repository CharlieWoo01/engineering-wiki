import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BASE_PATH,
  DEFAULT_SITE_URL,
  normaliseBasePath,
  normaliseSiteUrl,
  resolveDeployment,
} from '../../src/lib/deployment.ts';

describe('resolveDeployment', () => {
  it('defaults to the GitHub Pages project site', () => {
    expect(resolveDeployment({})).toEqual({ site: DEFAULT_SITE_URL, base: DEFAULT_BASE_PATH });
  });

  it('treats blank variables as unset (GitHub Actions passes empty strings)', () => {
    expect(resolveDeployment({ SITE_URL: '', BASE_PATH: '  ' })).toEqual({
      site: DEFAULT_SITE_URL,
      base: DEFAULT_BASE_PATH,
    });
  });

  it('supports a custom domain served from the root', () => {
    expect(resolveDeployment({ SITE_URL: 'https://docs.example.com/', BASE_PATH: '/' })).toEqual({
      site: 'https://docs.example.com',
      base: '/',
    });
  });

  it('accepts the values reported by actions/configure-pages', () => {
    expect(
      resolveDeployment({
        SITE_URL: 'https://charliewoo01.github.io',
        BASE_PATH: '/engineering-wiki',
      }),
    ).toEqual({ site: 'https://charliewoo01.github.io', base: '/engineering-wiki' });
  });
});

describe('normaliseBasePath', () => {
  it.each([
    ['engineering-wiki', '/engineering-wiki'],
    ['/engineering-wiki/', '/engineering-wiki'],
    ['//nested//path/', '/nested/path'],
    ['', '/'],
    ['/', '/'],
  ])('normalises %j to %j', (input, expected) => {
    expect(normaliseBasePath(input)).toBe(expected);
  });

  it.each(['/../etc', '/has space', '/query?x=1', '/hash#x'])('rejects %j', (input) => {
    expect(() => normaliseBasePath(input)).toThrow(/Invalid BASE_PATH/);
  });
});

describe('normaliseSiteUrl', () => {
  it('strips a trailing slash', () => {
    expect(normaliseSiteUrl('https://example.github.io/')).toBe('https://example.github.io');
  });

  it('rejects a URL with a path, which belongs in BASE_PATH', () => {
    expect(() => normaliseSiteUrl('https://example.github.io/engineering-wiki')).toThrow(
      /BASE_PATH/,
    );
  });

  it.each(['not a url', 'ftp://example.com'])('rejects %j', (input) => {
    expect(() => normaliseSiteUrl(input)).toThrow(/Invalid SITE_URL/);
  });
});
