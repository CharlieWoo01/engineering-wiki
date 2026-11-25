import { describe, expect, it } from 'vitest';
import {
  candidateFiles,
  extractLinks,
  pageUrlPathFor,
  resolveLink,
} from '../../scripts/lib/dist-links.ts';

const BASE = '/engineering-wiki';

describe('extractLinks', () => {
  it('collects href, src and every srcset candidate', () => {
    const html = `
      <link rel="stylesheet" href="/engineering-wiki/_astro/index.css">
      <a href='/engineering-wiki/adr/'>ADRs</a>
      <script src="/engineering-wiki/_astro/page.js"></script>
      <img src="a.png" srcset="a-1x.png 1x, a-2x.png 2x">`;

    expect(extractLinks(html)).toEqual([
      '/engineering-wiki/_astro/index.css',
      '/engineering-wiki/adr/',
      '/engineering-wiki/_astro/page.js',
      'a.png',
      'a-1x.png',
      'a-2x.png',
    ]);
  });

  it('decodes HTML entities in attribute values', () => {
    expect(extractLinks('<a href="/search?a=1&amp;b=2">x</a>')).toEqual(['/search?a=1&b=2']);
  });

  it('ignores attribute names that merely end in href or src', () => {
    expect(extractLinks('<div data-href="/nope" data-src="/nope"></div>')).toEqual([]);
  });
});

describe('resolveLink', () => {
  const page = `${BASE}/adr/introduction/`;

  it.each(['', '#heading', 'https://example.com', '//cdn.example.com/x.js', 'mailto:a@b.c'])(
    'does not treat %j as an internal link',
    (link) => {
      expect(['skip', 'external']).toContain(resolveLink(link, page, BASE).kind);
    },
  );

  it('resolves root-relative links under the base', () => {
    expect(resolveLink(`${BASE}/runbooks/template/#steps`, page, BASE)).toEqual({
      kind: 'internal',
      pathname: `${BASE}/runbooks/template/`,
      candidates: ['runbooks/template/index.html'],
    });
  });

  it('resolves relative links against the current page', () => {
    expect(resolveLink('../template/', page, BASE)).toMatchObject({
      kind: 'internal',
      candidates: ['adr/template/index.html'],
    });
  });

  it('flags root-relative links that escape the base path', () => {
    expect(resolveLink('/adr/', page, BASE)).toEqual({ kind: 'outside-base', pathname: '/adr/' });
    expect(resolveLink('/engineering-wiki-old/x/', page, BASE).kind).toBe('outside-base');
  });

  it('accepts any root-relative link when the base is "/"', () => {
    expect(resolveLink('/adr/', '/', '/')).toMatchObject({
      kind: 'internal',
      candidates: ['adr/index.html'],
    });
  });

  it('decodes percent-encoded paths to match files on disk', () => {
    expect(resolveLink(`${BASE}/my%20page/`, page, BASE)).toMatchObject({
      candidates: ['my page/index.html'],
    });
  });
});

describe('candidateFiles', () => {
  it.each([
    ['', ['index.html']],
    ['adr/', ['adr/index.html']],
    ['favicon.svg', ['favicon.svg']],
    ['adr', ['adr/index.html', 'adr.html']],
  ])('maps %j to %j', (input, expected) => {
    expect(candidateFiles(input)).toEqual(expected);
  });
});

describe('pageUrlPathFor', () => {
  it.each([
    ['index.html', `${BASE}/`],
    ['adr/introduction/index.html', `${BASE}/adr/introduction/`],
    ['404.html', `${BASE}/404.html`],
  ])('serves %j at %j', (file, expected) => {
    expect(pageUrlPathFor(file, BASE)).toBe(expected);
  });

  it('handles a root base path', () => {
    expect(pageUrlPathFor('adr/index.html', '/')).toBe('/adr/');
  });
});
