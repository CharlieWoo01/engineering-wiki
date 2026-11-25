import { describe, expect, it } from 'vitest';
import { mermaidThemeVariables } from '../../src/plugins/mermaid/theme.ts';
import {
  escapeHtml,
  mermaidMdastPlugin,
  parseDiagramTitle,
  renderDiagramFigure,
} from '../../src/plugins/mermaid/transform.ts';

describe('parseDiagramTitle', () => {
  it.each([
    ['title="Request flow"', 'Request flow'],
    ["title='Single quotes'", 'Single quotes'],
    ['showLineNumbers title="After other meta"', 'After other meta'],
    ['title=""', undefined],
    ['subtitle="Not a title"', undefined],
    [null, undefined],
  ])('parses %j as %j', (meta, expected) => {
    expect(parseDiagramTitle(meta)).toBe(expected);
  });
});

describe('renderDiagramFigure', () => {
  it('escapes the diagram source so Mermaid syntax survives as text', () => {
    const html = renderDiagramFigure('A-->B{"<Decision>"} & C');
    expect(html).toContain('A--&gt;B{&quot;&lt;Decision&gt;&quot;} &amp; C');
    expect(html).not.toContain('<Decision>');
  });

  it('labels the figure with its caption when a title is given', () => {
    const html = renderDiagramFigure('graph LR', 'Pipeline <v2>');
    const captionId = /<figcaption id="([^"]+)">Pipeline &lt;v2&gt;<\/figcaption>/.exec(html)?.[1];
    expect(captionId).toBeDefined();
    expect(html).toContain(`aria-labelledby="${captionId ?? ''}"`);
  });

  it('falls back to a generic accessible name without a title', () => {
    const html = renderDiagramFigure('graph LR');
    expect(html).toContain('aria-label="Diagram"');
    expect(html).not.toContain('<figcaption');
  });

  it('hides the toolbar until the client script has rendered the diagram', () => {
    expect(renderDiagramFigure('graph LR')).toContain('<div class="wiki-diagram__toolbar" hidden>');
  });

  it('gives every figure a unique caption id', () => {
    const ids = [renderDiagramFigure('a', 'One'), renderDiagramFigure('b', 'Two')].map(
      (html) => /figcaption id="([^"]+)"/.exec(html)?.[1],
    );
    expect(new Set(ids).size).toBe(2);
  });
});

describe('mermaidMdastPlugin', () => {
  it('replaces mermaid code blocks with an HTML figure', () => {
    const result = mermaidMdastPlugin.code({
      lang: 'mermaid',
      meta: 'title="X"',
      value: 'graph LR',
    });
    expect(result?.type).toBe('html');
    expect(result?.value).toContain('data-wiki-diagram');
  });

  it('leaves other code blocks for Expressive Code', () => {
    expect(mermaidMdastPlugin.code({ lang: 'ts', value: 'const a = 1;' })).toBeUndefined();
    expect(mermaidMdastPlugin.code({ value: 'plain' })).toBeUndefined();
  });
});

describe('escapeHtml', () => {
  it('escapes all HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    );
  });
});

describe('mermaidThemeVariables', () => {
  const tokens: Record<string, string> = {
    '--sl-color-bg': '#000001',
    '--sl-color-accent': '#000002',
    '--sl-color-accent-low': '#000003',
    '--sl-color-white': '#000004',
  };
  const read = (name: string) => tokens[name] ?? '';

  it('derives Mermaid colours from the site colour tokens', () => {
    const vars = mermaidThemeVariables('dark', read);
    expect(vars).toMatchObject({
      darkMode: true,
      background: '#000001',
      primaryBorderColor: '#000002',
      primaryColor: '#000003',
      primaryTextColor: '#000004',
      edgeLabelBackground: '#000001',
    });
  });

  it('falls back to the default palette when a token is missing', () => {
    const vars = mermaidThemeVariables('light', () => '  ');
    expect(vars['darkMode']).toBe(false);
    expect(vars['primaryBorderColor']).toBe('#1a5fc4');
  });
});
