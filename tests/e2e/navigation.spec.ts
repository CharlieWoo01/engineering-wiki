import { expect, test } from '@playwright/test';

test.describe('Sidebar navigation', () => {
  test('navigates between pages and marks the current page', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Covered by the mobile navigation test.');
    await page.goto('getting-started/introduction/');

    const sidebar = page.getByRole('navigation', { name: 'Main' });
    await sidebar.getByRole('link', { name: 'OpenTelemetry' }).click();

    await expect(page).toHaveURL(/\/observability\/opentelemetry\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('OpenTelemetry');
    await expect(sidebar.getByRole('link', { name: 'OpenTelemetry' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('every sidebar link resolves', async ({ page, request, isMobile }) => {
    test.skip(isMobile, 'Link resolution is viewport-independent.');
    await page.goto('getting-started/introduction/');

    const hrefs = await page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));

    expect(hrefs.length).toBeGreaterThan(30);
    for (const href of new Set(hrefs)) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });
});

test.describe('Mobile navigation', () => {
  test('menu button opens the sidebar and navigates', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only behaviour.');
    await page.goto('getting-started/introduction/');

    // Starlight's mobile sidebar is a native popover toggled by the menu button.
    const loggingLink = page
      .getByRole('navigation', { name: 'Main' })
      .getByRole('link', { name: 'Logging' });
    await expect(loggingLink).toBeHidden();
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(loggingLink).toBeVisible();

    await loggingLink.click();
    await expect(page).toHaveURL(/\/observability\/logging\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Logging');
  });
});

test.describe('Not found page', () => {
  test('unknown URLs return the custom 404 page', async ({ page }) => {
    const response = await page.goto('this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
    await page.getByRole('link', { name: 'Go to the homepage' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Engineering Wiki' })).toBeVisible();
  });
});
