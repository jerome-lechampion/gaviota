import { test, expect } from '@playwright/test';

test.describe('Navigation Functionality', () => {
  test('should render all navigation links', async ({ page }) => {
    await page.goto('/');

    const navLinks = page.locator('.site-nav a');
    await expect(navLinks).toHaveCount(5);

    const linkTexts = await navLinks.allTextContents();
    expect(linkTexts).toEqual([
      'Expertises',
      'Solutions',
      'Projets',
      'Clients',
      'Contact'
    ]);
  });

  test('should navigate to sections on click', async ({ page }) => {
    await page.goto('/');

    // Open mobile menu if nav toggle is visible (mobile view)
    const navToggle = page.locator('.nav-toggle');
    if (await navToggle.isVisible()) {
      await navToggle.click();
      // Wait for menu to open
      await page.waitForTimeout(300);
    }

    const servicesLink = page.locator('.site-nav a[href="#services"]');
    await servicesLink.click();

    // Wait for URL to change to include hash
    await page.waitForFunction(() => window.location.hash === '#services', { timeout: 5000 });
    expect(page.url()).toContain('#services');

    // Check if section is in viewport with more time for scroll animation
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeInViewport({ timeout: 10000 });
  });

  test('should navigate to contact section and show form', async ({ page }) => {
    await page.goto('/');

    // Open mobile menu if nav toggle is visible (mobile view)
    const navToggle = page.locator('.nav-toggle');
    if (await navToggle.isVisible()) {
      await navToggle.click();
      // Wait for menu to open
      await page.waitForTimeout(300);
    }

    const contactLink = page.locator('.site-nav a[href="#contact"]');
    await contactLink.click();

    await page.waitForTimeout(500);
    expect(page.url()).toContain('#contact');

    const contactForm = page.locator('.contact-form');
    await expect(contactForm).toBeInViewport();
  });

  test('should show brand logo and link to top', async ({ page }) => {
    await page.goto('/');

    const brand = page.locator('.brand');
    await expect(brand).toBeVisible();

    const brandImg = brand.locator('img');
    await expect(brandImg).toHaveAttribute('alt', 'Gaviota');

    // Navigate away
    await page.locator('a[href="#contact"]').first().click();
    await page.waitForTimeout(500);

    // Click brand to return to top
    await brand.click();
    await page.waitForTimeout(500);
    expect(page.url()).toContain('#accueil');
  });

  test.describe('Mobile Navigation', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should show hamburger menu on mobile', async ({ page }) => {
      await page.goto('/');

      const navToggle = page.locator('.nav-toggle');
      await expect(navToggle).toBeVisible();

      const nav = page.locator('.site-nav');
      await expect(nav).not.toBeVisible();
    });

    test('should toggle mobile menu on click', async ({ page }) => {
      await page.goto('/');

      const navToggle = page.locator('.nav-toggle');
      const nav = page.locator('.site-nav');

      // Open menu
      await navToggle.click();
      await expect(nav).toHaveClass(/open/);
      await expect(navToggle).toHaveAttribute('aria-expanded', 'true');

      // Close menu
      await navToggle.click();
      await expect(nav).not.toHaveClass(/open/);
      await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
    });

    test('should close mobile menu when link is clicked', async ({ page }) => {
      await page.goto('/');

      const navToggle = page.locator('.nav-toggle');
      const nav = page.locator('.site-nav');

      // Open menu
      await navToggle.click();
      await expect(nav).toHaveClass(/open/);

      // Click a link
      await page.locator('.site-nav a[href="#services"]').click();

      // Menu should close
      await expect(nav).not.toHaveClass(/open/);
    });

    test('should have correct ARIA attributes', async ({ page }) => {
      await page.goto('/');

      const navToggle = page.locator('.nav-toggle');
      await expect(navToggle).toHaveAttribute('aria-label', 'Ouvrir le menu');
      await expect(navToggle).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('should have sticky header', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('.site-header');

    // Check initial position
    const initialPosition = await header.evaluate(el =>
      window.getComputedStyle(el).position
    );
    expect(initialPosition).toBe('sticky');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);

    // Header should still be visible
    await expect(header).toBeInViewport();
  });
});
