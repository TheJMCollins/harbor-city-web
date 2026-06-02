// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://harborcitychurch.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      external: ['node:buffer', 'node:path', 'node:url', 'node:fs'],
    },
  },
});
