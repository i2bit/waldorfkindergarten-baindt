# Waldorfkindergarten Baindt – Website

Astro + Keystatic. Die Inhalte liegen als Dateien in `src/content/` und werden
über den Admin unter `/keystatic` gepflegt.

## Lokal starten

    npm install
    npm run dev

Website: http://localhost:4321 · Admin: http://localhost:4321/keystatic
Lokal speichert der Admin direkt in die Dateien.

## Live gehen (Cloudflare, kostenlos)

Einmalig per Kommandozeile:

    npx wrangler login
    npm run deploy

Danach läuft die Seite unter `waldorfkindergarten-baindt.<konto>.workers.dev`.

Automatisch bei jeder Änderung:

1. Repo auf GitHub anlegen und pushen (Repo sollte dem Verein gehören).
2. Im Cloudflare-Dashboard unter Workers & Pages das Projekt mit dem Repo
   verbinden (Workers Builds). Build-Befehl: `npm run build`,
   Deploy-Befehl: `npx wrangler deploy`.
3. Auf https://keystatic.cloud ein Team und ein Projekt anlegen, mit dem Repo
   verbinden und in `keystatic.config.ts` bei `cloud.project` eintragen.
4. Die Leute vor Ort in Keystatic Cloud einladen. Jedes Speichern im Admin ist
   ein Commit, Cloudflare baut die Seite danach automatisch neu.
5. Domain waldorfkindergarten-baindt.de im Worker unter „Domains & Routes“
   hinzufügen (Nameserver auf Cloudflare umziehen oder CNAME setzen).

Hinweise zum Kostenrahmen: Bilder werden beim Build optimiert
(`imageService: 'compile'`), dafür fallen keine Cloudflare-Images-Kosten an.
Die KV-Bindung `SESSION` legt Astro automatisch an; der kostenlose Plan reicht.

## Was im Admin pflegbar ist

- Aktuelles & Presse (mit Foto und PDF)
- Stellen (ein-/ausblendbar)
- Module & Beiträge, Bring-/Abholzeiten, Downloads, Jahreskreis
- Startseite, Gruppen, Kontakt, Verein & Impressum

## Vor dem Livegang

- PDFs von der alten Seite nach `public/downloads/` übernehmen und die Links
  in „Downloads“ durch Datei-Uploads ersetzen.
- Daten der Presseberichte prüfen (teils geschätzt).
- Seiten aus dem Design-Entwurf übertragen (`src/pages/`), aktuell gibt es
  nur eine Testseite.
