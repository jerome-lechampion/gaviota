import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runLighthouse() {
  console.log('Starting Lighthouse audit...\n');

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  const options = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('http://localhost:8080', options);

  await chrome.kill();

  const { categories } = runnerResult.lhr;

  console.log('Lighthouse Results:');
  console.log('='.repeat(60));
  console.log(`Performance:     ${Math.round(categories.performance.score * 100)}/100`);
  console.log(`Accessibility:   ${Math.round(categories.accessibility.score * 100)}/100`);
  console.log(`Best Practices:  ${Math.round(categories['best-practices'].score * 100)}/100`);
  console.log(`SEO:             ${Math.round(categories.seo.score * 100)}/100`);
  console.log('='.repeat(60) + '\n');

  // Set thresholds
  const thresholds = {
    performance: 80,
    accessibility: 90,
    'best-practices': 90,
    seo: 90
  };

  const failures = [];

  Object.entries(thresholds).forEach(([category, threshold]) => {
    const score = Math.round(categories[category].score * 100);
    if (score < threshold) {
      failures.push(`${category}: ${score}/100 (minimum: ${threshold})`);
    }
  });

  if (failures.length > 0) {
    console.error('❌ Lighthouse thresholds not met:\n');
    failures.forEach(failure => console.error(`  - ${failure}`));
    console.log('');
    process.exit(1);
  } else {
    console.log('✅ All Lighthouse thresholds met!\n');
    process.exit(0);
  }
}

runLighthouse().catch(err => {
  console.error('Lighthouse error:', err);
  process.exit(1);
});
