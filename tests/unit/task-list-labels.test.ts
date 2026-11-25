import { describe, expect, it } from 'vitest';
import { taskListCheckboxLabel, type HastLike } from '../../src/lib/task-list-labels.ts';

const text = (value: string): HastLike => ({ type: 'text', value });
const el = (tagName: string, properties: Record<string, unknown>, children: HastLike[] = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const checkbox = (props: Record<string, unknown> = {}) =>
  el('input', { type: 'checkbox', disabled: true, ...props });

describe('taskListCheckboxLabel', () => {
  it('labels a tight task-list checkbox with the item text', () => {
    const input = checkbox();
    const item = el('li', {}, [input, text(' Verify the '), el('code', {}, [text('deploy')])]);
    expect(taskListCheckboxLabel(item)).toEqual({ checkbox: input, label: 'Verify the deploy' });
  });

  it('finds checkboxes inside loose-list paragraphs', () => {
    const input = checkbox();
    const item = el('li', {}, [el('p', {}, [input, text(' Roll back')])]);
    expect(taskListCheckboxLabel(item)).toEqual({ checkbox: input, label: 'Roll back' });
  });

  it('excludes nested list items from the label', () => {
    const item = el('li', {}, [
      checkbox(),
      text(' Parent'),
      el('ul', {}, [el('li', {}, [checkbox(), text(' Child')])]),
    ]);
    expect(taskListCheckboxLabel(item)?.label).toBe('Parent');
  });

  it('ignores ordinary list items, other inputs and already-labelled checkboxes', () => {
    expect(taskListCheckboxLabel(el('li', {}, [text('Plain item')]))).toBeUndefined();
    expect(
      taskListCheckboxLabel(el('li', {}, [el('input', { type: 'text' }), text(' x')])),
    ).toBeUndefined();
    expect(
      taskListCheckboxLabel(el('li', {}, [checkbox({ ariaLabel: 'Custom' }), text(' Item')])),
    ).toBeUndefined();
  });
});
