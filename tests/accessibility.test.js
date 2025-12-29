import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function runAccessibilityTests() {
  console.log('Starting accessibility tests...\n');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const violations = [];

  try {
    // Test Homepage (dark theme)
    console.log('Testing: Homepage (dark theme)');
    await page.goto('http://localhost:8080');
    const darkResults = await new AxeBuilder({ page }).analyze();
    if (darkResults.violations.length > 0) {
      violations.push({ page: 'Homepage (dark)', violations: darkResults.violations });
    }

    // Test light theme
    console.log('Testing: Homepage (light theme)');
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'light';
    });
    const lightResults = await new AxeBuilder({ page }).analyze();
    if (lightResults.violations.length > 0) {
      violations.push({ page: 'Homepage (light)', violations: lightResults.violations });
    }

    // Test contact form
    console.log('Testing: Contact form section');
    await page.goto('http://localhost:8080/#contact');
    await page.waitForTimeout(500);
    const formResults = await new AxeBuilder({ page })
      .include('.contact-form')
      .analyze();
    if (formResults.violations.length > 0) {
      violations.push({ page: 'Contact Form', violations: formResults.violations });
    }

    // Test navigation
    console.log('Testing: Navigation menu');
    await page.goto('http://localhost:8080');
    const navResults = await new AxeBuilder({ page })
      .include('.site-nav')
      .analyze();
    if (navResults.violations.length > 0) {
      violations.push({ page: 'Navigation', violations: navResults.violations });
    }

    // Test mobile menu
    console.log('Testing: Mobile navigation');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.click('.nav-toggle');
    const mobileResults = await new AxeBuilder({ page }).analyze();
    if (mobileResults.violations.length > 0) {
      violations.push({ page: 'Mobile Navigation', violations: mobileResults.violations });
    }

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
