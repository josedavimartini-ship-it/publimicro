module.exports = {
  root: true,
  extends: [
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    
    // React rules
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // General rules
    "no-console": "warn",
    "prefer-const": "warn"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  ignorePatterns: [
    "node_modules/",
    ".next/",
    "dist/",
    "out/",
    "build/"
  ]
};