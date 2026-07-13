/// <reference types="vitest" />
import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  test: {
    setupFiles: ['tests/setup.ts'],

    globals: true,
    include: ['src/**/__tests__/**/*.{spec,test}.{ts,tsx}', 'tests/**/*.{spec,test}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
