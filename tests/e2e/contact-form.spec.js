import { test, expect } from '@playwright/test';

test.describe('Contact Form Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#contact');
    await page.waitForTimeout(500);
  });

  test('should render contact form with all fields', async ({ page }) => {
    const form = page.locator('.contact-form');
    await expect(form).toBeVisible();

    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have required attributes on required fields', async ({ page }) => {
    await expect(page.locator('input[name="name"]')).toHaveAttribute('required', '');
    await expect(page.locator('input[name="email"]')).toHaveAttribute('required', '');
  });

  test('should validate email field', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Browser will prevent submission with HTML5 validation
    const nameInput = page.locator('input[name="name"]');
    const isInvalid = await nameInput.evaluate(el => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should mock successful form submission', async ({ page }) => {
    // Mock the API endpoint
    await page.route('https://api.gaviota.fr/mail', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.locator('input[name="name"]').fill('Test User, Test Company');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message');

    await page.locator('button[type="submit"]').click();

    // Wait for success message
    await page.waitForTimeout(1000);

    const statusMessage = page.locator('.form-status');
    await expect(statusMessage).toHaveClass(/form-status--success/);
    await expect(statusMessage).toContainText('Merci');

    // Form should be reset
    await expect(page.locator('input[name="name"]')).toHaveValue('');
  });

  test('should handle API error gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('https://api.gaviota.fr/mail', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(1000);

    const statusMessage = page.locator('.form-status');
    await expect(statusMessage).toHaveClass(/form-status--error/);
    await expect(statusMessage).toContainText('erreur');
  });

  test('should disable submit button during submission', async ({ page }) => {
    // Mock slow API response
    await page.route('https://api.gaviota.fr/mail', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({ status: 200, body: '{}' });
    });

    await page.locator('input[name="name"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Button should be disabled immediately
    await expect(submitBtn).toBeDisabled();
    await expect(submitBtn).toContainText('Envoi en cours');

    // Wait for completion
    await page.waitForTimeout(2500);
    await expect(submitBtn).toBeEnabled();
  });

  test('should have proper labels and placeholders', async ({ page }) => {
    await expect(page.locator('input[name="name"]'))
      .toHaveAttribute('placeholder', 'Camille, Airbus');

    await expect(page.locator('input[name="email"]'))
      .toHaveAttribute('placeholder', 'prenom@entreprise.com');

    await expect(page.locator('textarea[name="message"]'))
      .toHaveAttribute('placeholder', 'Décrivez vos enjeux');
  });

  test('should have GDPR notice', async ({ page }) => {
    const footnote = page.locator('.form-footnote');
    await expect(footnote).toBeVisible();
    await expect(footnote).toContainText('soumettant ce formulaire');
  });

  test('should have status region with proper ARIA attributes', async ({ page }) => {
    const statusRegion = page.locator('.form-status');
    await expect(statusRegion).toHaveAttribute('role', 'status');
    await expect(statusRegion).toHaveAttribute('aria-live', 'polite');
  });
});
