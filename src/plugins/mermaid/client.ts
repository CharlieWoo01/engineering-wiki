/**
 * Client half of the Mermaid plugin. Injected on every page, but it only
 * downloads Mermaid when the page actually contains a diagram.
 *
 * - Renders with Mermaid's `base` theme using the site's colour tokens.
 * - Re-renders when the reader switches between light and dark mode.
 * - Adds an accessible "Expand" view (native <dialog>) with zoom controls.
 */
import { mermaidThemeVariables } from './theme.ts';

type Mermaid = (typeof import('mermaid'))['default'];

const SOURCE_SELECTOR = 'pre[data-diagram-source]';
const sources = new WeakMap<HTMLElement, string>();
let mermaidPromise: Promise<Mermaid> | undefined;
let renderCount = 0;

const loadMermaid = () => (mermaidPromise ??= import('mermaid').then((module) => module.default));

const currentMode = (): 'light' | 'dark' =>
  document.documentElement.dataset['theme'] === 'light' ? 'light' : 'dark';

function sourceOf(element: HTMLElement): string {
  let source = sources.get(element);
  if (source === undefined) {
    source = element.textContent;
    sources.set(element, source);
  }
  return source;
}

async function configureMermaid(): Promise<Mermaid> {
  const mermaid = await loadMermaid();
  const styles = getComputedStyle(document.documentElement);
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: mermaidThemeVariables(currentMode(), (name) => styles.getPropertyValue(name)),
  });
  return mermaid;
}

async function renderSvg(mermaid: Mermaid, source: string): Promise<string> {
  const { svg } = await mermaid.render(`wiki-diagram-${String(++renderCount)}`, source);
  return svg;
}

async function renderAll(): Promise<void> {
  const diagrams = [...document.querySelectorAll<HTMLElement>(SOURCE_SELECTOR)];
  if (diagrams.length === 0) return;

  const mermaid = await configureMermaid();
  for (const element of diagrams) {
    const figure = element.closest<HTMLElement>('[data-wiki-diagram]');
    const source = sourceOf(element);
    try {
      element.innerHTML = await renderSvg(mermaid, source);
      element.dataset['rendered'] = 'true';
      figure?.querySelector('.wiki-diagram__toolbar')?.removeAttribute('hidden');
    } catch (error) {
      element.textContent = source;
      element.dataset['rendered'] = 'error';
      console.error('[wiki-mermaid] Failed to render diagram:', error);
    }
  }
}

/* ---------- Expanded view ---------- */

let dialog: HTMLDialogElement | undefined;
let zoom = 1;

function getDialog(): HTMLDialogElement {
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.className = 'wiki-diagram-dialog';
  dialog.setAttribute('aria-labelledby', 'wiki-diagram-dialog-title');
  dialog.innerHTML = `
    <div class="wiki-diagram-dialog__header">
      <h2 id="wiki-diagram-dialog-title" class="wiki-diagram-dialog__title"></h2>
      <div class="wiki-diagram-dialog__actions">
        <button type="button" class="wiki-diagram__button" data-zoom="out" aria-label="Zoom out">−</button>
        <button type="button" class="wiki-diagram__button" data-zoom="reset"><span class="sr-only">Reset zoom, currently </span><span data-zoom-level>100%</span></button>
        <button type="button" class="wiki-diagram__button" data-zoom="in" aria-label="Zoom in">+</button>
        <button type="button" class="wiki-diagram__button" data-close aria-label="Close">✕</button>
      </div>
    </div>
    <div class="wiki-diagram-dialog__body" role="region" tabindex="0" aria-label="Diagram, scrollable"></div>`;

  dialog.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target === dialog || target.closest('[data-close]')) {
      dialog?.close();
      return;
    }
    const action = target.closest<HTMLElement>('[data-zoom]')?.dataset['zoom'];
    if (action === 'in') setZoom(Math.min(zoom + 0.25, 4));
    if (action === 'out') setZoom(Math.max(zoom - 0.25, 0.5));
    if (action === 'reset') setZoom(1);
  });

  document.body.append(dialog);
  return dialog;
}

/** Applies a zoom level and shows it on the reset button. */
function setZoom(value: number): void {
  zoom = value;
  dialog
    ?.querySelector<HTMLElement>('.wiki-diagram-dialog__body')
    ?.style.setProperty('--wiki-diagram-zoom', String(zoom));
  const level = dialog?.querySelector('[data-zoom-level]');
  if (level) level.textContent = `${String(Math.round(zoom * 100))}%`;
}

async function expand(figure: HTMLElement): Promise<void> {
  const source = figure.querySelector<HTMLElement>(SOURCE_SELECTOR);
  if (!source) return;

  const view = getDialog();
  const title = figure.querySelector('figcaption')?.textContent ?? 'Diagram';
  const heading = view.querySelector('.wiki-diagram-dialog__title');
  const body = view.querySelector<HTMLElement>('.wiki-diagram-dialog__body');
  if (heading) heading.textContent = title;
  if (!body) return;

  // Render a fresh copy so element IDs inside the SVG stay unique.
  const mermaid = await configureMermaid();
  body.innerHTML = await renderSvg(mermaid, sourceOf(source));
  setZoom(1);
  view.showModal();
}

/* ---------- Wiring ---------- */

if (document.querySelector(SOURCE_SELECTOR)) {
  void renderAll();

  document.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest('[data-diagram-expand]');
    const figure = button?.closest<HTMLElement>('[data-wiki-diagram]');
    if (figure) void expand(figure);
  });

  // Starlight toggles `data-theme` on <html> when the reader changes theme.
  let lastMode = currentMode();
  new MutationObserver(() => {
    const mode = currentMode();
    if (mode === lastMode) return;
    lastMode = mode;
    void renderAll();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
