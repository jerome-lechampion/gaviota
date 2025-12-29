export default [
  {
    ignores: [
      "node_modules/",
      ".git/",
      ".claude/",
      "gitdir/",
      "assets/",
      "about_me.html",
      "playwright-report/",
      "test-results/"
    ]
  },
  {
    files: ["script.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        console: "readonly"
      }
    },
    rules: {
      // Possible Errors
      "no-console": "off", // Allow console for this project
      "no-debugger": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-empty": "warn",
      "no-extra-semi": "error",
      "no-irregular-whitespace": "error",
      "no-unreachable": "error",
      "valid-typeof": "error",

      // Best Practices
      "eqeqeq": ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-multi-spaces": "error",
      "no-new-func": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",

      // Style
      "semi": ["error", "always"],
      "quotes": ["error", "single", { "avoidEscape": true }],
      "indent": ["error", 2],
      "comma-dangle": ["error", "only-multiline"]
    }
  }
];
