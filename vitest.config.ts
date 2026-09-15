/// <reference types="vitest" />
import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],

    globals: true,
    include: ['src/**/__tests__/**/*.{spec,test}.{ts,tsx}', 'tests/**/*.{spec,test}.{ts,tsx}'],

    // mongodb-memory-server needs to download the Mongo binary on a cold
    // run (e.g. a fresh CI runner), which can exceed the 10s default.
    hookTimeout: 60000,
    testTimeout: 60000,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
