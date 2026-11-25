import { expect, test } from '@playwright/test';

test.describe('Documentation pages', () => {
  test('render content, metadata and page tools', async ({ page }) => {
    await page.goto('getting-started/contributing/');

    await expect(page).toHaveTitle('Contributing | Engineering Wiki');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{10,}/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Contributing');
    await expect(page.getByRole('table').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit page' })).toHaveAttribute(
      'href',
      /github\.com\/CharlieWoo01\/engineering-wiki\/edit\/main\/src\/content\/docs\/getting-started\/contributing\.mdx$/,
    );
  });

  test('code blocks are highlighted and copyable', async ({ page }) => {
    await page.goto('knowledge-base/useful-commands/');

    const codeBlock = page.locator('.expressive-code').first();
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock.getByRole('button', { name: /copy/i })).toBeAttached();
  });

  test('Mermaid diagrams render to SVG', async ({ page }) => {
    await page.goto('observability/opentelemetry/');
    await expect(page.locator('pre.mermaid svg').first()).toBeVisible({ timeout: 15_000 });
  });

  test('templates are rendered from the repository template files', async ({ page }) => {
    await page.goto('adr/template/');
    await expect(page.locator('.expressive-code').first()).toContainText('## Context');
  });
});
