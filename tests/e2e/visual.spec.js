import { test, expect } from '@playwright/test';

test.describe('Visual and Content Tests', () => {
  test('should load homepage without errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    expect(errors).toHaveLength(0);
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Gaviota.*Agence de développement web/);
  });

  test('should have meta description', async ({ page }) => {
    await page.goto('/');
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });

  test('should load all critical sections', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.hero')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();
    await expect(page.locator('#solutions')).toBeVisible();
    await expect(page.locator('#projets')).toBeVisible();
    await expect(page.locator('#clients')).toBeVisible();
    await expect(page.locator('#contact')).toBeVisible();
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('should load all images without errors', async ({ page }) => {
    const failedImages = [];

    page.on('response', response => {
      if (response.request().resourceType() === 'image' && !response.ok()) {
        failedImages.push(response.url());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(failedImages).toHaveLength(0);
  });

  test('should display client logos', async ({ page }) => {
    await page.goto('/');

    // Scroll to clients section and wait for it to be in viewport
    const clientsSection = page.locator('#clients');
    await clientsSection.scrollIntoViewIfNeeded();
    await expect(clientsSection).toBeInViewport({ timeout: 5000 });

    // Wait for logos to be loaded
    const logos = page.locator('.logo-row img');
    await expect(logos.first()).toBeVisible({ timeout: 5000 });

    const count = await logos.count();
    expect(count).toBeGreaterThan(5);

    // Check some specific logos are present and visible
    await expect(page.locator('img[alt="Airbus"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('img[alt="Thales"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('img[alt="TotalEnergies"]')).toBeVisible({ timeout: 5000 });
  });

  test('should display case studies', async ({ page }) => {
    await page.goto('/');

    const caseCards = page.locator('.case-card');
    const count = await caseCards.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should render current year in footer', async ({ page }) => {
    await page.goto('/');

    const yearElement = page.locator('#year');
    const yearText = await yearElement.textContent();
    const currentYear = new Date().getFullYear().toString();
    expect(yearText).toBe(currentYear);
  });

  test('should have working social media links', async ({ page }) => {
    await page.goto('/');

    const linkedInLink = page.locator('a[href*="linkedin"]');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');
    await expect(linkedInLink).toBeVisible();

    const githubLink = page.locator('a[href*="github"]');
    await expect(githubLink).toBeVisible();

    const maltLink = page.locator('a[href*="malt"]');
    await expect(maltLink).toBeVisible();
  });

  test('should load external font from Google Fonts', async ({ page }) => {
    await page.goto('/');

    const bodyFont = await page.evaluate(() =>
      window.getComputedStyle(document.body).fontFamily
    );
    expect(bodyFont).toContain('Space Grotesk');
  });

  test('should have responsive viewport meta tag', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  });
});
