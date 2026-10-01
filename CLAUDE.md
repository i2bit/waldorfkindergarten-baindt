# Projektkontext: Website Waldorfkindergarten Baindt

Ehrenamtlicher Neubau von waldorfkindergarten-baindt.de (bisher WordPress).
Repo: https://github.com/i2bit/waldorfkindergarten-baindt
Sprache der Website: Deutsch, Ansprache durchgehend „Sie“.

## Stack (steht fest, nicht ändern)
- Astro 7 (statische Seiten) + Keystatic als Admin unter `/keystatic`
- Hosting: Cloudflare Workers, kostenloser Plan (`npm run deploy`)
- Keine laufenden Kosten verursachen: keine kostenpflichtigen Dienste,
  keine Cloudflare Images, keine externen Fonts/Tracker/Cookies
- Kein WordPress, keine Datenbank

## Inhalte
- Alle pflegbaren Inhalte liegen in `src/content/` und sind in
  `keystatic.config.ts` definiert. Inhalte immer per
  `createReader` aus `@keystatic/core/reader` lesen, nie hart codieren.
- Fotos: `src/assets/fotos/` (über `astro:assets` einbinden).

## Design-Vorlage
`design/*.dc.html` ist der freigegebene Entwurf (eine Datei pro Seite).
Diese Dateien sind nur Referenz für Layout, Farben, Typo und Texte, nicht
direkt verwendbar (eigenes Vorlagenformat mit `<x-dc>`-Wrapper).
- Aktuelles Design (nach Feedback des Kindergartens, ersetzt die Entwurfsfarben): Farben der
  bisherigen Website (Pfirsich #FBE7D9, Weiß, Dunkelgrau #373737, Rosé aus dem
  gemalten Logo, Akzent Krapprosa #A8424D), gestaltet als Mischung mit
  waldorfkindergarten-wurzelwerk.de (ruhig, Pastell, Wellenkanten). Farben als CSS-Variablen in `src/styles/global.css`,
  Jahreszeiten-Farben in `src/lib/content.ts`.
- Schriften: Überschriften in „Waldorf2“ (Schrift der bisherigen Website,
  `src/assets/fonts/`, Lizenz noch klären), Text in Instrument Sans (@fontsource).
  Keine Google Fonts.
- Logo: gemaltes Logo der bisherigen Website (`src/assets/logo.png`)
- Besonderheiten: schlichte Textnavigation (mobil wischbar), Wachsmalblöcke,
  Märchen-Gruppenkarten, interaktiver Jahreskreis (4 Viertelkreis-Buttons),
  Pinnwand mit schrägen Zetteln, „Gesucht!“-Schild

## Aufgaben (in dieser Reihenfolge)
1. Gemeinsames Layout (`src/layouts/Base.astro`) mit Kopf, Navigation, Fußbereich
2. Seiten nach Vorlage: `/`, `/ueber-uns`, `/gruppen`, `/fuer-eltern`,
   `/aktuelles`, `/aktuelles/[slug]`, `/stellen`, `/kontakt`, `/impressum`,
   `/datenschutz`
3. Jahreskreis als kleine Insel (React oder Vanilla-Script), Rest ohne JS
4. Mobil zuerst prüfen (375 px), Barrierefreiheit: Kontraste, Fokus, Alt-Texte
5. Weiterleitungen alter WordPress-URLs in `public/_redirects`
   (z. B. /ueber-uns/paedagogik/ → /ueber-uns#paedagogik,
   /organisation/oeffnungszeiten/ → /fuer-eltern, /category/presseberichte/ → /aktuelles)
6. PDFs von der alten Seite nach `public/downloads/` holen und die Links in
   `src/content/einstellungen/downloads.yaml` darauf umstellen

## Offene Punkte (nicht raten, nachfragen)
- Keystatic-Cloud-Projektname (`keystatic.config.ts` → `cloud.project`)
- Datenschutzerklärung: Hoster ist Cloudflare, Text vor Livegang prüfen lassen
- Gruppengrößen stammen aus dem Eltern-ABC 2016, vor Ort bestätigen
