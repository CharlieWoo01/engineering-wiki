import { expect, test } from '@playwright/test';

test.describe('Theme switching', () => {
  test('switches between light and dark and persists the choice', async ({ page, isMobile }) => {
    await page.goto('getting-started/introduction/');
    if (isMobile) {
      // On small screens the theme picker lives in the mobile menu.
      await page.getByRole('button', { name: 'Menu' }).click();
    }

    const themeSelect = page
      .getByRole('combobox', { name: 'Select theme' })
      .filter({ visible: true });
    const html = page.locator('html');

    await themeSelect.selectOption('light');
    await expect(html).toHaveAttribute('data-theme', 'light');

    await themeSelect.selectOption('dark');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});
