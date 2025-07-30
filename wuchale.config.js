// @ts-check
import { adapter as svelte } from '@wuchale/svelte';
import { defineConfig } from 'wuchale';

export default defineConfig({
  locales: {
    // English included by default
    de: { name: 'German' },
  },
  adapters: {
    main: svelte(),
  },
});
