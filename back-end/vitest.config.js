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
    environment: 'node',
    setupFiles: ['./tests/setup.js'],
    testTimeout: 10000,
    // Run tests sequentially to avoid database conflicts
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  }
});
