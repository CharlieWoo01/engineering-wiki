/**
 * Build-time half of the Mermaid plugin: turns ```mermaid code blocks into a
 * `<figure>` that the client script renders. Kept free of Astro/Sätteri
 * imports so it can be unit tested directly.
 */

export interface CodeNode {
  lang?: string | null | undefined;
  meta?: string | null | undefined;
  value: string;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);

/** Reads `title="…"` (or `title='…'`) from a code fence's meta string. */
export function parseDiagramTitle(meta: string | null | undefined): string | undefined {
  const match = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)')/.exec(meta ?? '');
  const title = (match?.[1] ?? match?.[2])?.trim();
  return title === '' ? undefined : title;
}

let figureCount = 0;

/**
 * HTML for one diagram. The source stays in the `<pre>` as escaped text, so
 * the page is still readable without JavaScript; the toolbar is revealed by
 * the client script once the diagram has rendered.
 */
export function renderDiagramFigure(source: string, title?: string): string {
  const captionId = `wiki-diagram-caption-${String(++figureCount)}`;
  const label = title ? ` aria-labelledby="${captionId}"` : ' aria-label="Diagram"';
  const caption = title ? `<figcaption id="${captionId}">${escapeHtml(title)}</figcaption>` : '';

  return (
    `<figure class="wiki-diagram" data-wiki-diagram${label}>` +
    `<div class="wiki-diagram__toolbar" hidden>` +
    `<button type="button" class="wiki-diagram__button" data-diagram-expand>` +
    `<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>` +
    `<span>Expand</span></button></div>` +
    `<pre class="wiki-diagram__source" data-diagram-source>${escapeHtml(source.trim())}</pre>` +
    caption +
    `</figure>`
  );
}

/** Sätteri mdast plugin: replaces ```mermaid code nodes with the diagram figure. */
export const mermaidMdastPlugin = {
  name: 'wiki-mermaid',
  code(node: CodeNode): { type: 'html'; value: string } | undefined {
    if (node.lang !== 'mermaid') return undefined;
    return { type: 'html', value: renderDiagramFigure(node.value, parseDiagramTitle(node.meta)) };
  },
};
