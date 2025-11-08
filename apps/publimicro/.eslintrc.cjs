// .eslintrc.cjs
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    // 🔒 TypeScript rigoroso
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',

    // 🔍 React moderno
    'react/react-in-jsx-scope': 'off', // Next.js já importa React automaticamente
    'react/prop-types': 'off', // Usamos TypeScript em vez de PropTypes
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',

    // ♿ Acessibilidade
    'jsx-a11y/anchor-is-valid': 'error',
    '@next/next/no-img-element': 'warn', // recomendação, não bloqueia

    // 💅 Organização e boas práticas
    'no-unused-vars': 'off', // substituído pela versão TypeScript
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['.next/', 'node_modules/', 'dist/', 'out/'],
};
