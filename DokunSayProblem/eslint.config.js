/**
 * DokunSay Problem — ESLint Yapılandırması
 * Platform standardına uyumlu (bkz. _platform/shared/eslint.config.js, _platform/STANDARDS.md)
 *
 * Kaynak TypeScript'tir (.ts/.tsx) ve `tsc -b` (strict) ile denetlenir. Bu yapılandırma
 * TS ayrıştırıcısı içermediği için yalnız .js/.jsx dosyalarına uygulanır; TS dosyaları
 * lint edilmek istenirse typescript-eslint eklenmelidir.
 */

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'android/**', 'ios/**', 'build/**', '*.min.js'],
  },
  {
    files: ['**/*.{js,jsx}'],
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
      // Seslendirme yalnız @shared/tts.js üzerinden (STANDARDS §1.4.1).
      'no-restricted-globals': ['error', { name: 'SpeechSynthesisUtterance', message: '@shared/tts.js kullan.' }],
    },
  },
];
