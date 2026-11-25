import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with title, hero and section navigation', async ({ page }) => {
    const response = await page.goto('./');
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Engineering Wiki/);
    await expect(page.getByRole('heading', { level: 1, name: 'Engineering Wiki' })).toBeVisible();

    const sections = page.locator('.section-grid');
    for (const section of ['Engineering', 'Platform', 'Observability', 'Runbooks']) {
      await expect(
        sections.getByRole('link', { name: new RegExp(`^${section}\\b`) }),
      ).toBeVisible();
    }
  });

  test('section cards show live page counts and open the section', async ({ page }) => {
    await page.goto('./');
    const card = page.getByRole('link', { name: /^Architecture Decision Records/ });
    // Introduction, template and two ADRs.
    await expect(card).toContainText('4 pages');

    await card.click();
    await expect(page).toHaveURL(/\/adr\/introduction\/$/);
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
