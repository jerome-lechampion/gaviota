# Gaviota Website

Modern agency website built with vanilla HTML, CSS, and JavaScript.

## Tech Stack

- Pure HTML5, CSS3, JavaScript (ES6+)
- No framework, no build system
- Deployed on GitHub Pages

## Development

### Prerequisites

- Node.js 20+ (for dev tools only)
- npm

### Setup

```bash
npm install
```

### Local Development

```bash
npm run serve
# Open http://localhost:8080
```

### Testing

```bash
# Run all tests
npm test

# Run specific tests
npm run test:e2e          # Playwright E2E tests
npm run test:e2e:ui       # Playwright with UI
npm run test:html         # HTML validation
npm run test:a11y         # Accessibility tests
npm run test:lighthouse   # Performance tests

# Linting
npm run lint              # Lint JS + CSS
npm run lint:fix          # Auto-fix linting issues
```

## CI/CD

Automated pipeline runs on every push to `main`:

1. **Linting**: ESLint (JavaScript) + Stylelint (CSS)
2. **HTML Validation**: HTML5 standards compliance
3. **E2E Tests**: Playwright across Chrome, Firefox, Safari
4. **Accessibility**: Axe-core WCAG 2.1 compliance
5. **Performance**: Lighthouse audits
6. **Deploy**: Automatic deployment to GitHub Pages

## Project Structure

```
.
├── index.html           # Main HTML file
├── styles.css           # All CSS styles
├── script.js            # All JavaScript
├── assets/              # Images and logos
├── tests/
│   ├── e2e/            # Playwright E2E tests
│   ├── accessibility.test.js
│   └── lighthouse.test.js
└── .github/workflows/   # CI/CD configuration
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

UNLICENSED - Private project
