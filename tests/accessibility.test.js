import { chromium } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

async function runAccessibilityTests() {
  console.log('Starting accessibility tests...\n');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const violations = [];

  try {
    // Start local server or use deployed URL
    await page.goto('http://localhost:8080');

    // Inject Axe
    await injectAxe(page);

    console.log('Testing: Homepage (dark theme)');
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    }, (results) => {
      if (results.violations.length > 0) {
        violations.push({ page: 'Homepage (dark)', violations: results.violations });
      }
    });

    // Test light theme
    console.log('Testing: Homepage (light theme)');
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
    });
    await checkA11y(page, null, {}, (results) => {
      if (results.violations.length > 0) {
        violations.push({ page: 'Homepage (light)', violations: results.violations });
      }
    });

    // Test contact form
    console.log('Testing: Contact form section');
    await page.goto('http://localhost:8080/#contact');
    await page.waitForTimeout(500);
    await injectAxe(page);
    await checkA11y(page, '.contact-form', {}, (results) => {
      if (results.violations.length > 0) {
        violations.push({ page: 'Contact Form', violations: results.violations });
      }
    });

    // Test navigation
    console.log('Testing: Navigation menu');
    await page.goto('http://localhost:8080');
    await injectAxe(page);
    await checkA11y(page, '.site-nav', {}, (results) => {
      if (results.violations.length > 0) {
        violations.push({ page: 'Navigation', violations: results.violations });
      }
    });

    // Test mobile menu
    console.log('Testing: Mobile navigation');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await injectAxe(page);
    await page.click('.nav-toggle');
    await checkA11y(page, null, {}, (results) => {
      if (results.violations.length > 0) {
        violations.push({ page: 'Mobile Navigation', violations: results.violations });
      }
    });

  } catch (error) {
    console.error('Accessibility test error:', error);
    await browser.close();
    process.exit(1);
  }

  await browser.close();

  // Report results
  console.log('\n' + '='.repeat(60));
  if (violations.length === 0) {
    console.log('✅ All accessibility tests passed!');
    console.log('='.repeat(60) + '\n');
    process.exit(0);
  } else {
    console.log('❌ Accessibility violations found:\n');
    violations.forEach(({ page, violations: pageViolations }) => {
      console.log(`\n${page}:`);
      pageViolations.forEach(violation => {
        console.log(`  - ${violation.id}: ${violation.help}`);
        console.log(`    Impact: ${violation.impact}`);
        console.log(`    Affected elements: ${violation.nodes.length}`);
      });
    });
    console.log('\n' + '='.repeat(60) + '\n');
    process.exit(1);
  }
}

runAccessibilityTests();
