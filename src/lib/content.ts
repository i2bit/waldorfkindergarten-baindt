// Gemeinsamer Zugriff auf die Keystatic-Inhalte und kleine Hilfsfunktionen.
import { createReader } from '@keystatic/core/reader';
import Markdoc, { type Node } from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export async function getKontakt() {
  const kontakt = await reader.singletons.kontakt.readOrThrow();
  return { ...kontakt, telHref: telHref(kontakt.telefon), mailHref: `mailto:${kontakt.email}` };
}

/** "07502 / 5558664" → "tel:+4975025558664" */
export function telHref(telefon: string) {
  const digits = telefon.replace(/[^\d+]/g, '');
  return `tel:${digits.startsWith('0') ? `+49${digits.slice(1)}` : digits}`;
}

export function osmHref(adresse: string) {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(adresse)}`;
}

export function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export type Jahreszeit = 'fruehling' | 'sommer' | 'herbst' | 'winter';

/** Farben pro Jahreszeit: Jahreskreis-Viertel, Textfarbe auf Weiß, Zettel an der Pinnwand. */
export const jahreszeiten: Record<Jahreszeit, { name: string; bg: string; fg: string; text: string; zettel: string }> = {
  fruehling: { name: 'Frühling', bg: '#2F7A55', fg: '#FFFFFF', text: '#2F7A55', zettel: '#E6F2EB' },
  sommer: { name: 'Sommer', bg: '#F3C33C', fg: '#1E1F3B', text: '#7A5A00', zettel: '#FFF4D6' },
  herbst: { name: 'Herbst', bg: '#E8793A', fg: '#1E1F3B', text: '#A84A12', zettel: '#FCE7DA' },
  winter: { name: 'Winter', bg: '#26337A', fg: '#FFFFFF', text: '#26337A', zettel: '#FFFFFF' },
};

const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** "2026-06-24" → "Juni 2026" */
export function monatJahr(datum: string | null) {
  if (!datum) return '';
  const [jahr, monat] = datum.split('-').map(Number);
  return `${monate[monat - 1]} ${jahr}`;
}

/** "2026-06-24" → "24. Juni 2026" */
export function datumLang(datum: string | null) {
  if (!datum) return '';
  const [, , tag] = datum.split('-').map(Number);
  return `${tag}. ${monatJahr(datum)}`;
}

export async function getAktuelles() {
  const posts = await reader.collections.aktuelles.all();
  return posts.sort((a, b) => (b.entry.datum ?? '').localeCompare(a.entry.datum ?? ''));
}

export function renderMarkdoc(node: Node) {
  return Markdoc.renderers.html(Markdoc.transform(node));
}

/** Teilt "Hier wird noch *richtig* gespielt." in Teile; markierte Teile werden hervorgehoben. */
export function hervorheben(text: string) {
  return text.split(/\*([^*]+)\*/).map((teil, i) => ({ teil, hervor: i % 2 === 1 }));
}

// Alle Bilder unter src/assets, damit Keystatic-Pfade über astro:assets optimiert werden.
const bilder = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });

/**
 * Löst einen von Keystatic gespeicherten Bildpfad (z. B. "../../assets/gruppen/x.jpg")
 * oder einen Dateinamen aus src/assets/fotos auf. Fällt auf `ersatz` zurück.
 */
export function bild(pfad: string | null | undefined, ersatz?: string): ImageMetadata {
  const kandidaten = [pfad, ersatz]
    .filter((p): p is string => !!p)
    .map((p) => (p.includes('/') ? `/src/${p.replace(/^(\.\.\/)+/, '').replace(/^\/?src\//, '')}` : `/src/assets/fotos/${p}`));
  for (const k of kandidaten) {
    if (bilder[k]) return bilder[k].default;
  }
  throw new Error(`Bild nicht gefunden: ${kandidaten.join(', ')}`);
}
