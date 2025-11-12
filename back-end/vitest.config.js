// back-end/vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [
      'tests-mocha/**',
      'node_modules/**',
      'dist/**',
      '.git/**'
    ],
    environment: 'node'
  }
});
