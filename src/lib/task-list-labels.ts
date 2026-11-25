/**
 * Gives GitHub-flavoured Markdown task-list checkboxes an accessible name.
 *
 * `- [ ] Step` renders as `<li><input type="checkbox" disabled> Step</li>`,
 * which fails WCAG 4.1.2 (axe rule `label`) because the checkbox has no label.
 * This plugin copies the item's own text (excluding nested lists) into
 * `aria-label`, so checklists in runbooks and templates stay accessible.
 *
 * Implemented as a Sätteri hast plugin — Astro 7's default Markdown processor,
 * which MDX inherits — so no remark/rehype pipeline is needed.
 */

export interface HastLike {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: readonly HastLike[];
}

const isElement = (node: HastLike, tagName?: string): boolean =>
  node.type === 'element' && (tagName === undefined || node.tagName === tagName);

const isCheckbox = (node: HastLike): boolean =>
  isElement(node, 'input') && node.properties?.['type'] === 'checkbox';

/** Text of a node, ignoring nested lists so sub-items are not included. */
function itemText(node: HastLike): string {
  if (node.type === 'text') return node.value ?? '';
  if (isElement(node, 'ul') || isElement(node, 'ol')) return '';
  return node.children?.map(itemText).join('') ?? '';
}

/**
 * For a task-list `<li>`, returns the checkbox and the label it should have;
 * `undefined` for ordinary list items or checkboxes that are already labelled.
 */
export function taskListCheckboxLabel(
  item: HastLike,
): { checkbox: HastLike; label: string } | undefined {
  const children = item.children ?? [];
  // Tight lists hold the checkbox directly; loose lists wrap it in a <p>.
  const container = children.find(
    (child) => isElement(child, 'p') && child.children?.some(isCheckbox),
  );
  const checkbox = (container?.children ?? children).find(isCheckbox);
  if (!checkbox || checkbox.properties?.['ariaLabel'] !== undefined) return undefined;

  const label = itemText(item).replace(/\s+/g, ' ').trim();
  return label === '' ? undefined : { checkbox, label };
}

interface VisitorContext {
  setProperty(node: HastLike, key: string, value: unknown): void;
}

/** Sätteri hast plugin: pass to `satteri({ hastPlugins: [taskListLabels] })`. */
export const taskListLabels = {
  name: 'task-list-labels',
  element: {
    filter: ['li'],
    visit(node: HastLike, ctx: VisitorContext): void {
      const result = taskListCheckboxLabel(node);
      if (result) ctx.setProperty(result.checkbox, 'ariaLabel', result.label);
    },
  },
};
