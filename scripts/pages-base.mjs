// Nach dem Pages-Build: interne Links ("/kontakt") um den Basis-Pfad ergänzen.
// Bilder und Skripte unter /_astro setzt Astro selbst richtig.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const base = '/waldorfkindergarten-baindt';
const dir = process.argv[2] ?? 'dist';

async function* htmlFiles(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

for await (const file of htmlFiles(dir)) {
  const html = await readFile(file, 'utf8');
  const out = html.replace(/(href|src)="\/(?!\/)/g, (m, attr, i) =>
    html.startsWith(base.slice(1) + '/', i + m.length) ? m : `${attr}="${base}/`,
  );
  await writeFile(file, out);
}
