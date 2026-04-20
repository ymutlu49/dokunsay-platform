/**
 * DokunSay Platform — Ortak ESLint Yapılandırması
 *
 * Her uygulama kendi eslint.config.js'inde bu yapılandırmayı extend eder
 * veya kopyalar. React + Hooks + temel kalite kuralları.
 */

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'android/**', 'ios/**', 'build/**', '*.min.js'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'smart'],
      'no-implicit-globals': 'error',
    },
  },
];
