import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with title, hero and section navigation', async ({ page }) => {
    const response = await page.goto('./');
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Engineering Wiki/);
    await expect(page.getByRole('heading', { level: 1, name: 'Engineering Wiki' })).toBeVisible();

    for (const section of ['Engineering', 'Platform', 'Observability', 'Runbooks']) {
      await expect(page.getByRole('link', { name: section, exact: true }).first()).toBeVisible();
    }
  });

  test('primary call to action opens the introduction', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/\/getting-started\/introduction\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Introduction');
  });

  test('links to the GitHub repository', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Social links move into the mobile menu.');
    await page.goto('./');
    await expect(page.getByRole('link', { name: 'GitHub repository' })).toHaveAttribute(
      'href',
      'https://github.com/CharlieWoo01/engineering-wiki',
    );
  });
});
