// Flat ESLint configuration (ESLint v9+)
// Migrated from legacy `.eslintrc.cjs` to the new flat config format.
module.exports = [
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/dist/**',
      '**/.turbo/**',
      '.turbo/',
    ],
  },

  // Allow console statements in small build scripts (mark-next-built, helpers)
  {
    files: [
      'scripts/**/*.{js,cjs,mjs}',
      'apps/*/scripts/**/*.{js,cjs,mjs}',
      'packages/*/scripts/**/*.{js,cjs,mjs}',
      '**/scripts/**/*.{js,cjs,mjs}',
    ],
    rules: {
      'no-console': 'off',
    },
  },

  // Apply to JS/TS files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // For pure JS files we don't set project, TypeScript files will
        // be handled by a separate override below that provides `project`.
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General
      'no-console': 'warn',
      'prefer-const': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // TypeScript-specific override: enable parser project for all packages
  {
    // Apply TypeScript parser project only to source files to avoid
    // linting tooling/config files (e.g. tailwind.config.ts) that are
    // not included in package tsconfigs.
    files: [
      'packages/*/src/**/*.{ts,tsx}',
      'apps/*/src/**/*.{ts,tsx}',
      'apps/*/**/src/**/*.{ts,tsx}',
      'packages/*/**/src/**/*.{ts,tsx}',
    ],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: [
          './tsconfig.json',
          './packages/*/tsconfig.json',
          './apps/*/tsconfig.json',
          './apps/*/**/tsconfig.json'
        ],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {},
  },

  // Specific overrides for the Publimicro Next.js app (migrated from .eslintrc.cjs)
  {
    files: ['apps/publimicro/src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: ['./apps/publimicro/tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
    },
    // Merge in recommended rules for Next.js core web vitals by importing the config
    rules: Object.assign(
      {},
      // Next.js core-web-vitals rules (if available)
      (function getNextCoreRules() {
        try {
          const cfg = require('eslint-config-next');
          const rules = (cfg && cfg.configs && cfg.configs['core-web-vitals'] && cfg.configs['core-web-vitals'].rules) || {};
            '**/node_modules/**',
            '**/.pnp/**',
            '**/.pnp.js',
            '**/.next/**',
            '**/out/**',
            '**/dist/**',
            '**/build/**',
            '**/.turbo/**',
            '.turbo/',
            '**/.cache/**',
            '*.tsbuildinfo',
            'next-env.d.ts',
            '.env',
            '.env.*',
            '*.config.js',
            '*.config.ts',
            '*.config.mjs',
            '*.config.cjs',
            'tailwind.config.*',
            'postcss.config.*',
            'next.config.*',
            'prisma/generated/**',
            'coverage/**',
            '.nyc_output/**',
            '*.log',
            'logs/**',
            '.DS_Store',
            'Thumbs.db',
            '.vscode/**',
            '.idea/**',
            '.vercel/**',
            'public/**',
            '**/public/models/**',
            '**/public/sounds/**',
            '**/public/images/**',
            'pnpm-lock.yaml',
            'package-lock.json',
            'yarn.lock',
            '.storybook/**',
            'storybook-static/**',
      })(),
      {
        // App-specific rule overrides (from previous .eslintrc.cjs)
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',

        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/jsx-uses-vars': 'error',

        'jsx-a11y/anchor-is-valid': 'error',

        'no-unused-vars': 'off',
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'error',
      }
    ),
    settings: {
      react: { version: 'detect' },
    },
  },
  // Final override: ensure scripts folders can use console (placed last to take precedence)
  {
    files: [
      'scripts/**/*.{js,cjs,mjs}',
      'apps/*/scripts/**/*.{js,cjs,mjs}',
      'packages/*/scripts/**/*.{js,cjs,mjs}',
      '**/scripts/**/*.{js,cjs,mjs}',
    ],
    rules: {
      'no-console': 'off',
    },
  },
];
