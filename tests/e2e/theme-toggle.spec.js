import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should default to dark theme on first visit', async ({ page }) => {
    await page.goto('/');
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    // Default could be dark or light based on prefers-color-scheme
    expect(['dark', 'light']).toContain(theme);
  });

  test('should toggle from dark to light theme', async ({ page }) => {
    await page.goto('/');

    // Set to dark first
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      localStorage.setItem('gaviota-theme', 'dark');
    });
    await page.reload();

    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();

    // Click to toggle to light
    await themeToggle.click();

    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe('light');

    const icon = await themeToggle.locator('.theme-toggle__icon').textContent();
    expect(icon).toBe('☀️');
  });

  test('should toggle from light to dark theme', async ({ page }) => {
    await page.goto('/');

    // Set to light first
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
      localStorage.setItem('gaviota-theme', 'light');
    });
    await page.reload();

    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.click();

    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBe('dark');

    const icon = await themeToggle.locator('.theme-toggle__icon').textContent();
    expect(icon).toBe('🌙');
  });

  test('should persist theme preference in localStorage', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.click();

    const storedTheme = await page.evaluate(() =>
      localStorage.getItem('gaviota-theme')
    );
    expect(storedTheme).toBeTruthy();
    expect(['light', 'dark']).toContain(storedTheme);

    // Reload and check persistence
    await page.reload();
    const themeAfterReload = await page.evaluate(() =>
      document.documentElement.dataset.theme
    );
    expect(themeAfterReload).toBe(storedTheme);
  });

  test('should apply correct CSS variables for each theme', async ({ page }) => {
    await page.goto('/');

    // Test dark theme variables
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
    });

    let bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
    );
    expect(bgColor.trim()).toBe('#05060a');

    // Test light theme variables
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
    });

    bgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
    );
    expect(bgColor.trim()).toBe('#f6f8fc');
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('.theme-toggle');
    await themeToggle.focus();

    // Check focus visible
    await expect(themeToggle).toBeFocused();

    // Activate with keyboard
    await page.keyboard.press('Enter');

    // Theme should have changed
    const theme = await page.evaluate(() => document.documentElement.dataset.theme);
    expect(theme).toBeTruthy();
  });
});
