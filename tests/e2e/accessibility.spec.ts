import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** Representative page types: splash, prose with tables, code, diagrams, templates, 404. */
const PAGES = [
  { name: 'homepage', path: './' },
  { name: 'contributing guide', path: 'getting-started/contributing/' },
  { name: 'code-heavy page', path: 'knowledge-base/useful-commands/' },
  { name: 'diagram page', path: 'observability/opentelemetry/' },
  { name: 'ADR', path: 'adr/0002-use-astro-starlight-for-the-engineering-wiki/' },
  { name: 'runbook with checklists', path: 'runbooks/rollback-github-pages-deployment/' },
  { name: '404 page', path: 'this-page-does-not-exist/' },
];

/**
 * Known upstream issues, ignored for one rule on one element only so that
 * everything else on the element is still checked.
 *
 * - Starlight's search button shows a "Ctrl K" shortcut hint that is not part
 *   of its accessible name ("Search"), which axe reports as
 *   label-content-name-mismatch. Remove once fixed upstream.
 */
const KNOWN_ISSUES = [
  { rule: 'label-content-name-mismatch', target: 'button[data-open-modal=""]' },
];

type Violations = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];

function withoutKnownIssues(violations: Violations): Violations {
  return violations
    .map((violation) => ({
      ...violation,
      nodes: violation.nodes.filter(
        (node) =>
          !KNOWN_ISSUES.some(
            (issue) => issue.rule === violation.id && node.target.join(' ') === issue.target,
          ),
      ),
    }))
    .filter((violation) => violation.nodes.length > 0);
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(`Accessibility (${theme} theme)`, () => {
    test.use({ colorScheme: theme });

    for (const { name, path } of PAGES) {
      test(`${name} has no detectable WCAG 2.2 A/AA violations`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        // Mermaid diagrams render client-side; wait so they are included in the scan.
        await page.waitForLoadState('networkidle');

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();

        const violations = withoutKnownIssues(results.violations);
        expect(violations, formatViolations(violations)).toEqual([]);
      });
    }

    test('expanded diagram view has no detectable WCAG 2.2 A/AA violations', async ({ page }) => {
      await page.goto('observability/opentelemetry/');
      await page.getByRole('button', { name: 'Expand' }).first().click();
      const dialog = page.getByRole('dialog');
      await expect(dialog.locator('svg').first()).toBeVisible();

      const results = await new AxeBuilder({ page })
        .include('.wiki-diagram-dialog')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations, formatViolations(results.violations)).toEqual([]);
    });
  });
}

function formatViolations(violations: Violations) {
  return violations
    .map(
      (v) =>
        `${v.id} (${v.impact ?? 'unknown'}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
    )
    .join('\n');
}
