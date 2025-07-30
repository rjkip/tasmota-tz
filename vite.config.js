import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { wuchale } from 'wuchale';

export default defineConfig({
  plugins: [sveltekit(), wuchale()],
  test: {
    include: ['src/lib/*.{test,spec}.js'],
  },
});
