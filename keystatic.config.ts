import { config, fields, collection, singleton } from '@keystatic/core';

// Lokal (npm run dev) speichert Keystatic direkt in die Dateien.
// Live wird über Keystatic Cloud gespeichert: Login per E-Mail, kein GitHub-Konto nötig.
// Baustein „Abschnitte“: Jede Inhaltsseite besteht aus Abschnitten mit Überschrift,
// Text, optionalem Foto und Hintergrundfarbe. So ist jeder Text im Admin änderbar.
const abschnitte = fields.array(
  fields.object({
    titel: fields.text({ label: 'Überschrift' }),
    anker: fields.text({ label: 'Sprungmarke', description: 'Kurzer Name für Links und das Menü „Auf dieser Seite“, z. B. paedagogik. Leer lassen, wenn nicht nötig.' }),
    text: fields.markdoc.inline({ label: 'Text' }),
    bild: fields.image({ label: 'Foto (optional)', description: 'Bitte keine Fotos, auf denen Kinder oder Eltern zu erkennen sind', directory: 'src/assets/seiten', publicPath: '../../assets/seiten/' }),
    bildAlt: fields.text({ label: 'Was ist auf dem Foto zu sehen?', description: 'Kurze Beschreibung für Menschen, die das Foto nicht sehen können' }),
    hintergrund: fields.select({
      label: 'Hintergrundfarbe',
      options: [
        { label: 'Hell (Standard)', value: 'hell' },
        { label: 'Pfirsich', value: 'pfirsich' },
        { label: 'Honig', value: 'honig' },
        { label: 'Rosé', value: 'rosa' },
        { label: 'Grün', value: 'blatt' },
      ],
      defaultValue: 'hell',
    }),
    baustein: fields.select({
      label: 'Darunter zusätzlich anzeigen',
      options: [
        { label: 'Nichts', value: 'nichts' },
        { label: 'Tabelle der Module & Beiträge', value: 'module' },
        { label: 'Bring- & Abholzeiten', value: 'zeiten' },
        { label: 'Downloads', value: 'downloads' },
        { label: 'Offene Stellen', value: 'stellen' },
        { label: 'Kontaktdaten & Sprechzeiten', value: 'kontakt' },
        { label: 'Knopf zum Aufnahmeantrag', value: 'anmeldung' },
        { label: 'Jahreskreis (zum Antippen)', value: 'jahreskreis' },
      ],
      defaultValue: 'nichts',
    }),
    aufStartseite: fields.checkbox({ label: 'Auch auf der Startseite zeigen', description: 'Nur auf der Seite „Gruppen“ wirksam' }),
    kurz: fields.text({ label: 'Kurztext für die Startseite', multiline: true }),
  }),
  { label: 'Abschnitte', itemLabel: (p) => p.fields.titel.value || '(ohne Überschrift)' }
);

const seite = (label: string, name: string) =>
  singleton({
    label,
    path: `src/content/seiten/${name}`,
    schema: {
      titel: fields.text({ label: 'Seitentitel' }),
      einleitung: fields.text({ label: 'Einleitung oben', multiline: true }),
      abschnitte,
    },
  });

export default config({
  storage: import.meta.env.PROD ? { kind: 'cloud' } : { kind: 'local' },
  cloud: { project: 'i2bit/waldorfkindergar' },
  ui: {
    brand: { name: 'Waldorfkindergarten Baindt' },
    navigation: {
      'Seiten': ['startseite', 'ueberUns', 'gruppen', 'fuerEltern', 'stellenSeite', 'kontaktSeite', 'anmeldung', 'impressum', 'datenschutz'],
      'Neuigkeiten': ['aktuelles', 'stellen'],
      'Daten': ['module', 'zeiten', 'downloads', 'jahreskreis', 'kontakt', 'verein'],
    },
  },

  collections: {
    aktuelles: collection({
      label: 'Aktuelles & Presse',
      slugField: 'titel',
      path: 'src/content/aktuelles/*',
      format: { contentField: 'inhalt' },
      entryLayout: 'content',
      columns: ['titel', 'datum'],
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        datum: fields.date({ label: 'Datum', validation: { isRequired: true } }),
        jahreszeit: fields.select({
          label: 'Jahreszeit',
          description: 'Bestimmt die Farbe des Zettels an der Pinnwand',
          options: [
            { label: 'Frühling', value: 'fruehling' },
            { label: 'Sommer', value: 'sommer' },
            { label: 'Herbst', value: 'herbst' },
            { label: 'Winter', value: 'winter' },
          ],
          defaultValue: 'herbst',
        }),
        kategorie: fields.select({
          label: 'Art',
          options: [
            { label: 'Pressebericht', value: 'presse' },
            { label: 'Termin', value: 'termin' },
            { label: 'Aus dem Alltag', value: 'alltag' },
          ],
          defaultValue: 'presse',
        }),
        teaser: fields.text({ label: 'Kurztext für die Pinnwand', multiline: true, validation: { length: { max: 220 } } }),
        bild: fields.image({ label: 'Foto (optional)', description: 'Bitte keine Fotos, auf denen Kinder oder Eltern zu erkennen sind', directory: 'src/assets/aktuelles', publicPath: '../../assets/aktuelles/' }),
        pdf: fields.file({ label: 'Zeitungsartikel als PDF (optional)', description: 'Nur ohne Fotos von Kindern. Besser den Text oben einfügen.', directory: 'public/downloads/presse', publicPath: '/downloads/presse/' }),
        inhalt: fields.markdoc({ label: 'Text' }),
      },
    }),

    stellen: collection({
      label: 'Stellen',
      slugField: 'titel',
      path: 'src/content/stellen/*',
      format: { contentField: 'beschreibung' },
      columns: ['titel', 'aktiv'],
      schema: {
        titel: fields.slug({ name: { label: 'Stellentitel', description: 'z. B. Pädagogische Fachkraft (m/w/d)' } }),
        aktiv: fields.checkbox({ label: 'Auf der Website anzeigen', defaultValue: true }),
        art: fields.select({
          label: 'Art',
          options: [
            { label: 'Fachkraft', value: 'fachkraft' },
            { label: 'FSJ', value: 'fsj' },
            { label: 'Praktikum', value: 'praktikum' },
            { label: 'Ausbildung / Studium', value: 'ausbildung' },
          ],
          defaultValue: 'fachkraft',
        }),
        umfang: fields.text({ label: 'Umfang', description: 'z. B. 80–100 %, Teilzeit' }),
        start: fields.text({ label: 'Beginn', description: 'z. B. ab sofort, ab 01.09.2027' }),
        beschreibung: fields.markdoc({ label: 'Beschreibung' }),
      },
    }),
  },

  singletons: {
    startseite: singleton({
      label: 'Startseite',
      path: 'src/content/einstellungen/startseite',
      schema: {
        zitat: fields.text({ label: 'Spruch oben', description: 'Eine Zeile pro Zeile des Spruchs', multiline: true }),
        zitatQuelle: fields.text({ label: 'Quelle des Spruchs', description: 'Optional, z. B. der Name der Autorin' }),
        willkommenTitel: fields.text({ label: 'Überschrift Willkommen' }),
        willkommen: fields.markdoc.inline({ label: 'Willkommenstext' }),
        heroBild: fields.image({ label: 'Breites Foto unten', description: 'Am besten ein Querformat ohne erkennbare Personen', directory: 'src/assets/startseite', publicPath: '../../assets/startseite/' }),
        heroBildAlt: fields.text({ label: 'Was ist auf dem Foto zu sehen?' }),
        platzTitel: fields.text({ label: 'Hinweis im farbigen Kasten: Überschrift', description: 'z. B. Wir haben noch freie Plätze' }),
        platzText: fields.text({ label: 'Hinweis im farbigen Kasten: Text', multiline: true }),
      },
    }),

    ueberUns: seite('Seite: Über uns', 'ueber-uns'),
    gruppen: seite('Seite: Gruppen & Angebote', 'gruppen'),
    fuerEltern: seite('Seite: Für Eltern', 'fuer-eltern'),
    stellenSeite: seite('Seite: Stellen', 'stellen'),
    kontaktSeite: seite('Seite: Kontakt', 'kontakt'),
    anmeldung: seite('Seite: Anmeldung', 'anmeldung'),
    impressum: seite('Seite: Impressum', 'impressum'),
    datenschutz: seite('Seite: Datenschutz', 'datenschutz'),

    module: singleton({
      label: 'Module & Beiträge',
      path: 'src/content/einstellungen/module',
      schema: {
        gueltigAb: fields.text({ label: 'Gültig ab', description: 'z. B. 01.09.2026' }),
        grundlage: fields.text({ label: 'Berechnungsgrundlage', description: 'z. B. Empfehlung des Gemeindetages 05/26' }),
        module: fields.array(
          fields.object({
            modul: fields.text({ label: 'Modul', description: 'z. B. 1A, 3B*' }),
            alter: fields.text({ label: 'Alter' }),
            zeiten: fields.text({ label: 'Zeiten', multiline: true }),
            stunden: fields.integer({ label: 'Stunden pro Woche' }),
            mittagessen: fields.checkbox({ label: 'Mit Mittagessen' }),
            preis1: fields.text({ label: 'Beitrag bei 1 Kind' }),
            preis2: fields.text({ label: 'bei 2 Kindern' }),
            preis3: fields.text({ label: 'bei 3 Kindern' }),
            preis4: fields.text({ label: 'bei 4 Kindern' }),
          }),
          { label: 'Module', itemLabel: (p) => `${p.fields.modul.value} · ${p.fields.alter.value}` }
        ),
        fussnoten: fields.array(fields.text({ label: 'Fußnote', multiline: true }), { label: 'Fußnoten', itemLabel: (p) => p.value.slice(0, 60) }),
      },
    }),

    zeiten: singleton({
      label: 'Bring- & Abholzeiten',
      path: 'src/content/einstellungen/zeiten',
      schema: {
        bringzeit: fields.text({ label: 'Bringzeit' }),
        abholzeiten: fields.array(
          fields.object({ label: fields.text({ label: 'Für' }), zeit: fields.text({ label: 'Zeit' }) }),
          { label: 'Abholzeiten', itemLabel: (p) => `${p.fields.label.value}: ${p.fields.zeit.value}` }
        ),
      },
    }),

    downloads: singleton({
      label: 'Downloads',
      path: 'src/content/einstellungen/downloads',
      schema: {
        dateien: fields.array(
          fields.object({
            titel: fields.text({ label: 'Titel' }),
            beschreibung: fields.text({ label: 'Kurzbeschreibung' }),
            datei: fields.file({ label: 'PDF hochladen', directory: 'public/downloads', publicPath: '/downloads/' }),
            link: fields.url({ label: '… oder Link', description: 'Nur ausfüllen, wenn keine Datei hochgeladen wird' }),
          }),
          { label: 'Dateien', itemLabel: (p) => p.fields.titel.value }
        ),
      },
    }),

    jahreskreis: singleton({
      label: 'Jahreskreis',
      path: 'src/content/einstellungen/jahreskreis',
      schema: {
        fruehling: fields.array(fields.text({ label: 'Fest' }), { label: 'Frühling', itemLabel: (p) => p.value }),
        sommer: fields.array(fields.text({ label: 'Fest' }), { label: 'Sommer', itemLabel: (p) => p.value }),
        herbst: fields.array(fields.text({ label: 'Fest' }), { label: 'Herbst', itemLabel: (p) => p.value }),
        winter: fields.array(fields.text({ label: 'Fest' }), { label: 'Winter', itemLabel: (p) => p.value }),
      },
    }),

    kontakt: singleton({
      label: 'Kontakt',
      path: 'src/content/einstellungen/kontakt',
      schema: {
        telefon: fields.text({ label: 'Telefon' }),
        email: fields.text({ label: 'E-Mail' }),
        strasse: fields.text({ label: 'Straße' }),
        ort: fields.text({ label: 'PLZ und Ort' }),
        leitung: fields.text({ label: 'Kindergartenleitung' }),
        sprechzeiten: fields.array(
          fields.object({ tag: fields.text({ label: 'Tag' }), zeit: fields.text({ label: 'Zeit' }) }),
          { label: 'Sprechzeiten', itemLabel: (p) => `${p.fields.tag.value}: ${p.fields.zeit.value}` }
        ),
      },
    }),

    verein: singleton({
      label: 'Verein & Impressum',
      path: 'src/content/einstellungen/verein',
      schema: {
        name: fields.text({ label: 'Vereinsname' }),
        vorstand: fields.array(
          fields.object({ bereich: fields.text({ label: 'Bereich' }), namen: fields.text({ label: 'Namen' }) }),
          { label: 'Vorstand', itemLabel: (p) => `${p.fields.bereich.value}: ${p.fields.namen.value}` }
        ),
        registergericht: fields.text({ label: 'Registergericht' }),
        registernummer: fields.text({ label: 'Registernummer' }),
        verantwortlich: fields.text({ label: 'Verantwortlich für den Inhalt' }),
      },
    }),
  },
});
