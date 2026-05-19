// =============================================================================
// Invoice Tool - Business Data & Templates
// =============================================================================

import { SITE_CONFIG } from './constants';

export const INVOICE_CONFIG = {
  ...SITE_CONFIG,
  owner: 'Andreas Kroh',
  isKleinunternehmer: true,
  smallBusinessNote:
    'Gemäß § 19 UStG enthält der Rechnungsbetrag keine Umsatzsteuer.',
  taxNumber: '339/5156/2531',
  bank: {
    name: 'Volksbank Paderborn-Höxter-Detmold',
    iban: 'DE85 4726 0121 9204 0957 00',
    bic: 'DGPBDE3MXXX',
    accountHolder: 'Natalja Kroh',
  },
} as const;

export const INVOICE_APARTMENTS = [
  { id: 'erholungs-kellerchen' as const, name: 'Erholungs Kellerchen', shortName: 'Kellerchen' },
  { id: 'erholungs-apartment' as const, name: 'Erholungs Apartment', shortName: 'Apartment' },
];

export const EMAIL_TEMPLATES = {
  de: {
    subject: 'Ihre Rechnung – Aufenthalt {arrival_short} – {departure_short}',
    body: `Hallo {first_name},

vielen Dank noch einmal für Ihren Besuch in unserem {apartment}!
Im Anhang erhalten Sie wie gewünscht Ihre Rechnung Nr. {invoice_number}
für Ihren Aufenthalt vom {arrival} bis {departure} ({nights} Nächte).

Wir freuen uns, Sie bald wieder bei uns begrüßen zu dürfen.

Herzliche Grüße
{owner}
{site_name}`,
  },
  en: {
    subject: 'Your invoice – Stay {arrival_short} – {departure_short}',
    body: `Hello {first_name},

thank you again for your stay at our {apartment}.
Please find attached, as requested, your invoice no. {invoice_number}
for your stay from {arrival} to {departure} ({nights} nights).

We hope to welcome you again soon.

Best regards
{owner}
{site_name}`,
  },
  nl: {
    subject: 'Uw factuur – Verblijf {arrival_short} – {departure_short}',
    body: `Beste {first_name},

hartelijk dank nogmaals voor uw verblijf in onze {apartment}.
In de bijlage vindt u, zoals gewenst, uw factuur nr. {invoice_number}
voor uw verblijf van {arrival} tot {departure} ({nights} nachten).

Wij verheugen ons u graag weer te mogen begroeten.

Hartelijke groet
{owner}
{site_name}`,
  },
} as const;

export const EXAMPLE_BOOKING_TEXT = `Buchungsdetails
Check-in: Do., 16. Apr. 2026
Check-out: So., 19. Apr. 2026
3 Nächte · 2 Erwachsene · 1 Zimmer

Name des Gasts: Evert Verweij
Bevorzugte Sprache: Niederländisch
E-Mail: everwe.895272@guest.booking.com

Buchungsnummer: 6101325459
Kanal: Booking.com
Gesamtpreis: € 170
Gastzahlung: Zahlung über Booking.com`;

export const INVOICE_EXTRACTION_PROMPT = `Du bist ein Daten-Extraktor für deutsche Ferienwohnungs-Buchungen.
Lies aus dem folgenden Text (Booking.com-Buchungsdetails, Airbnb-Mail oder ähnliches)
die Buchungsdaten aus und gib AUSSCHLIESSLICH ein JSON-Objekt zurück. Kein Fließtext.
Verwende exakt diese Schlüssel; unbekannte Felder als null (NICHT raten):

{
  "fullName":       string | null,
  "email":          string | null,
  "company":        string | null,
  "bookingNumber":  string | null,
  "paidAmount":     number | null,
  "arrivalDate":    string | null,
  "departureDate":  string | null,
  "address":        string | null,
  "zipCity":        string | null,
  "channel":        string | null,
  "apartmentId":    string | null,
  "language":       string | null
}

Wichtig:
- Daten IMMER ins ISO-Format YYYY-MM-DD umwandeln. Aus "Do., 16. Apr. 2026" wird "2026-04-16".
- Beträge nur als Zahl (ohne €, Punkt als Dezimaltrenner): 170 oder 245.50.
- Wenn Felder fehlen → null.

Text:
---
`;
