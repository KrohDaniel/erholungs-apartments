# Admin & Seed Scripts

Pflicht: `.env.local` mit `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` und
`FIREBASE_PRIVATE_KEY` muss gesetzt sein.

## Admin-User anlegen

```bash
npx tsx scripts/create-admin.ts info@erholungs-apartments.de
```

Output:
```
✓ Neuer User angelegt: info@erholungs-apartments.de (uid: …)
✓ Custom Claim gesetzt: { admin: true }

========================================
E-Mail:    info@erholungs-apartments.de
Passwort:  <generiertes-passwort>
========================================
```

**Das Passwort wird nur EINMAL angezeigt — bitte sofort in einem Passwort-Manager
speichern.** Es lässt sich später nur durch erneute Ausführung des Skripts
zurücksetzen.

## Bestandsrechnungen importieren

```bash
npx tsx scripts/seed-invoices.ts
```

Importiert die 8 Bestandsrechnungen aus `seed-invoices.json` in die Firestore
Collection `invoices`. Bestehende IDs werden übersprungen, der Lauf ist
idempotent.

## Firestore Rules deployen

```bash
firebase deploy --only firestore:rules
```

(Benötigt die Firebase CLI: `npm i -g firebase-tools`.)
