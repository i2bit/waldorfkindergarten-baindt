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
- **Keine Fotos mit erkennbaren Personen** (Wunsch des Kindergartens): zeitlose Motive wie
  Filzfiguren, Räume, Garten.
- Inhaltsseiten (Über uns, Gruppen, Für Eltern, Stellen, Kontakt, Anmeldung, Impressum,
  Datenschutz) bestehen aus „Abschnitten“ (`src/content/seiten/*.yaml`, Typ in
  `keystatic.config.ts` → `abschnitte`): Überschrift, Text (Markdoc), Foto, Hintergrund
  und optional ein eingebauter Baustein (Modultabelle, Zeiten, Downloads, Stellen,
  Kontakt, Aufnahmeantrag). Darstellung: `src/components/Abschnitte.astro`.
- Texte stammen von der bisherigen Website (wörtlich übernommen), Fotos der Abschnitte
  in `src/assets/seiten/`. Presseberichte (135): voller Text aus den alten
  Zeitungs-PDFs übernommen, PDFs selbst entfernt (enthielten Kinderfotos). Alte Slugs
  beibehalten (für Weiterleitungen in Aufgabe 5).

## Design-Vorlage
`design/*.dc.html` ist der freigegebene Entwurf (eine Datei pro Seite).
Diese Dateien sind nur Referenz für Layout, Farben, Typo und Texte, nicht
direkt verwendbar (eigenes Vorlagenformat mit `<x-dc>`-Wrapper).
- Aktuelles Design (nach Feedback des Kindergartens, ersetzt die Entwurfsfarben): Farben der
  bisherigen Website (Pfirsich #FBE7D9, Weiß, Dunkelgrau #373737, Rosé aus dem
  gemalten Logo, Akzent Krapprosa #A8424D), gestaltet als Mischung mit
  waldorfkindergarten-wurzelwerk.de (ruhig, Pastell, Wellenkanten). Farben als CSS-Variablen in `src/styles/global.css`,
  Jahreszeiten-Farben in `src/lib/content.ts`.
- Schriften: Überschriften in Overlock fett (@fontsource/overlock, OFL), Text in
  Instrument Sans (@fontsource). Keine Google Fonts. „Antropos“ (wie bei Wurzelwerk)
  ist nur privat frei und darum nicht verwendet.
- Hinweisbalken unten auf allen Seiten (Keystatic „Hinweisbalken unten“: an/aus, Text, Link),
  schließbar per ✕ (merkt sich das nur für die Sitzung, sessionStorage, kein Cookie).
- Logo: gemaltes Logo der bisherigen Website (`src/assets/logo.png`)
- Überschriften in Großbuchstaben (wie bei anderen Waldorfseiten).
- Aufbau wie waldorfkindergarten-wurzelwerk.de: weißer Kopf (Name links, Textnavigation
  rechts, Handy: „Menü“), darunter ein farbiges Band mit Wellenkante (Startseite: Logo,
  Spruch, Knopf; Unterseiten: zentrierter Titel). Startseite als schmale Textspalte:
  Willkommen, farbiger Hinweis „Platz“, offene Stellen, 3 Berichte, ein breites Foto.
  Schlichte Fußzeile. Jahreskreis steht auf „Über uns“ (Baustein „Jahreskreis“).
- Besonderheiten: schlichte Textnavigation (Handy unter 760 px: Menü-Knopf „Menü“ mit
  <details>, ohne JS), interaktiver Jahreskreis (4 Viertelkreis-Buttons), Pinnwand,
  „Gesucht!“-Schild auf /stellen

## Aufgaben (in dieser Reihenfolge)
1. Gemeinsames Layout (`src/layouts/Base.astro`) mit Kopf, Navigation, Fußbereich
2. Seiten nach Vorlage: `/`, `/ueber-uns`, `/gruppen`, `/fuer-eltern`,
   `/aktuelles`, `/aktuelles/[slug]`, `/stellen`, `/kontakt`, `/impressum`,
   `/datenschutz`, `/anmeldung` (Aufnahmeantrag: öffnet das Mailprogramm der Eltern, nichts wird gespeichert)
3. Jahreskreis als kleine Insel (React oder Vanilla-Script), Rest ohne JS
4. Mobil zuerst prüfen (375 px), Barrierefreiheit: Kontraste, Fokus, Alt-Texte
5. Weiterleitungen alter WordPress-URLs in `public/_redirects`
   (z. B. /ueber-uns/paedagogik/ → /ueber-uns#paedagogik,
   /organisation/oeffnungszeiten/ → /fuer-eltern, /category/presseberichte/ → /aktuelles)
6. ~~PDFs von der alten Seite nach `public/downloads/` holen~~ (erledigt)

## Offene Punkte (nicht raten, nachfragen)
- Datenschutzerklärung: Hoster ist Cloudflare, Text vor Livegang prüfen lassen
- Gruppengrößen stammen aus dem Eltern-ABC 2016, vor Ort bestätigen
