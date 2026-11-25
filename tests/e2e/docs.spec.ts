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

  test('templates are rendered from the repository template files', async ({ page }) => {
    await page.goto('adr/template/');
    await expect(page.locator('.expressive-code').first()).toContainText('## Context');
  });

  test('page metadata shows status, owner and review date', async ({ page }) => {
    await page.goto('runbooks/rollback-github-pages-deployment/');
    const meta = page.getByRole('list', { name: 'Page information' });
    await expect(meta).toContainText('Owner: Wiki maintainers');
    await expect(meta.locator('time')).toHaveAttribute('datetime', '2026-11-25');

    await page.goto('engineering/coding-standards/');
    await expect(page.getByRole('list', { name: 'Page information' })).toContainText('Draft');

    // Published pages without an owner show no metadata row.
    await page.goto('devops/deployment-strategies/');
    await expect(page.getByRole('list', { name: 'Page information' })).toHaveCount(0);
  });

  test('line numbers can be enabled per code block', async ({ page }) => {
    await page.goto('observability/opentelemetry/');
    await expect(page.locator('.expressive-code .gutter').first()).toBeVisible();
  });
});

test.describe('Mermaid diagrams', () => {
  const figure = (page: import('@playwright/test').Page) =>
    page.getByRole('figure', { name: 'Telemetry pipeline through an OpenTelemetry Collector' });

  test('render to SVG with a caption', async ({ page }) => {
    await page.goto('observability/opentelemetry/');
    await expect(figure(page).locator('svg').first()).toBeVisible({ timeout: 15_000 });
    await expect(figure(page).locator('figcaption')).toBeVisible();
  });

  test('re-render when the theme changes', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Theme picker is in the mobile menu; covered on desktop.');
    await page.goto('observability/opentelemetry/');
    const svg = figure(page).locator('pre svg');
    await expect(svg).toBeVisible({ timeout: 15_000 });

    const before = await svg.getAttribute('id');
    const nextTheme =
      (await page.locator('html').getAttribute('data-theme')) === 'dark' ? 'light' : 'dark';
    await page
      .getByRole('combobox', { name: 'Select theme' })
      .filter({ visible: true })
      .selectOption(nextTheme);

    await expect(svg).not.toHaveAttribute('id', before ?? '');
    await expect(svg).toBeVisible();
  });

  test('open in an accessible expanded view with zoom', async ({ page }) => {
    await page.goto('observability/opentelemetry/');
    await expect(figure(page).locator('svg').first()).toBeVisible({ timeout: 15_000 });

    await figure(page).getByRole('button', { name: 'Expand' }).click();
    const dialog = page.getByRole('dialog', {
      name: 'Telemetry pipeline through an OpenTelemetry Collector',
    });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('svg').first()).toBeVisible();

    await dialog.getByRole('button', { name: 'Zoom in' }).click();
    await expect(dialog.getByRole('button', { name: /Reset zoom/ })).toContainText('125%');

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

test.describe('Machine-readable outputs', () => {
  test('llms.txt is published', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL ?? ''}llms.txt`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('Engineering Wiki');
  });
});
