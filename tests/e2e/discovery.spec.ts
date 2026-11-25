import { expect, test } from '@playwright/test';

test.describe('Tags', () => {
  test('page tags link to a tag page listing related pages', async ({ page }) => {
    await page.goto('observability/opentelemetry/');

    await page
      .getByRole('list', { name: 'Tags' })
      .getByRole('link', { name: /observability/ })
      .click();
    await expect(page).toHaveURL(/\/tags\/observability\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('#observability');
    await expect(
      page.getByRole('main').getByRole('link', { name: 'Distributed tracing' }),
    ).toBeVisible();
  });

  test('the tag index lists every tag with a page count', async ({ page }) => {
    await page.goto('tags/');
    const tags = page.getByRole('list', { name: 'All tags' });
    await expect(tags.getByRole('link', { name: /security/ })).toBeVisible();
    await tags.getByRole('link', { name: /decision-making/ }).click();
    await expect(page.getByRole('link', { name: /ADR-0001/ })).toBeVisible();
  });
});

test.describe('Documentation health', () => {
  test('summarises pages that need attention', async ({ page }) => {
    await page.goto('health/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Documentation health');

    const pages = page.locator('.health-stats div', { hasText: 'Pages' }).locator('dd');
    expect(Number(await pages.textContent())).toBeGreaterThan(30);

    await expect(page.getByRole('heading', { name: /Drafts/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Coding standards' }).first()).toBeVisible();
  });

  test('is reachable from the sidebar', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Sidebar navigation is covered on desktop.');
    await page.goto('getting-started/introduction/');
    const sidebar = page.getByRole('navigation', { name: 'Main' });
    await sidebar.getByText('About this wiki').click();
    await sidebar.getByRole('link', { name: 'Documentation health' }).click();
    await expect(page).toHaveURL(/\/health\/$/);
  });
});
