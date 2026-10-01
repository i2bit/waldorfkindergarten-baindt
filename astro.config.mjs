// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Demo-Build für GitHub Pages (GITHUB_PAGES=true): rein statisch unter
// /waldorfkindergarten-baindt/, ohne Admin und ohne Cloudflare-Adapter.
const pages = process.env.GITHUB_PAGES === 'true';

// Seiten werden statisch gebaut, nur der Admin (/keystatic) läuft serverseitig.
// Hosting: Cloudflare (kostenloser Plan).
export default defineConfig(
  pages
    ? {
        site: 'https://i2bit.github.io',
        base: '/waldorfkindergarten-baindt',
        integrations: [react(), markdoc()],
      }
    : {
        site: 'https://waldorfkindergarten-baindt.de',
        integrations: [react(), markdoc(), keystatic()],
        adapter: cloudflare({ prerenderEnvironment: 'node', imageService: 'compile' }),
      },
);
