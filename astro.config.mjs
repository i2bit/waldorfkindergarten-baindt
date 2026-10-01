// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';

// Seiten werden statisch gebaut, nur der Admin (/keystatic) läuft serverseitig.
// Hosting: Cloudflare (kostenloser Plan).
export default defineConfig({
  site: 'https://waldorfkindergarten-baindt.de',
  integrations: [react(), markdoc(), keystatic()],
  adapter: cloudflare({ prerenderEnvironment: 'node', imageService: 'compile' }),
});
