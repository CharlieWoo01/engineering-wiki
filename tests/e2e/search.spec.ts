import { expect, test } from '@playwright/test';

test.describe('Search', () => {
  test('finds a page and navigates to it', async ({ page }) => {
    await page.goto('./');

    await page.getByRole('button', { name: 'Search' }).click();
    const dialog = page.getByRole('dialog', { name: 'Search' });
    await expect(dialog).toBeVisible();

    await dialog.getByPlaceholder('Search').fill('runbook template');
    const firstResult = dialog.locator('.pagefind-ui__result-link').first();
    await expect(firstResult).toBeVisible({ timeout: 10_000 });

    await dialog
      .locator('.pagefind-ui__result-link', { hasText: 'Runbook template' })
      .first()
      .click();
    await expect(page).toHaveURL(/\/runbooks\/template\/$/);
  });
});
