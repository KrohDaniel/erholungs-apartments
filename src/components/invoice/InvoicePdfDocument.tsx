import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { INVOICE_APARTMENTS, INVOICE_CONFIG } from '@/lib/invoice-constants';
import { dateLong, dateShort, eur, nights, todayIso } from '@/lib/invoice-format';
import type { Invoice } from '@/types/invoice';

// =============================================================================
// Server-side PDF document for invoice e-mail attachment
// Mirrors components/invoice/InvoicePreview.tsx but uses @react-pdf primitives.
// =============================================================================

const COLORS = {
  primary: '#2D5016',
  secondary: '#F5EFE6',
  accent: '#C9A84C',
  text: '#1A1A1A',
  textLight: '#4A4A4A',
  textMuted: '#7A7A7A',
  border: '#E5E2DC',
  danger: '#B84A4A',
};

const s = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 40,
    fontSize: 9,
    color: COLORS.text,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  brand: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  brandSub: { fontSize: 8, color: COLORS.textMuted, marginTop: 1 },
  contact: { fontSize: 8, color: COLORS.textLight, textAlign: 'right', lineHeight: 1.4 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 12,
  },
  title: { fontFamily: 'Helvetica-Bold', fontSize: 18 },
  labelSmall: {
    fontSize: 7,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  invoiceNumber: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: COLORS.primary,
    textAlign: 'right',
  },
  addrRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  addrLeft: { flex: 1.4, paddingRight: 14, fontSize: 9, lineHeight: 1.4 },
  addrRight: { flex: 1 },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1.5,
  },
  metaLabel: { color: COLORS.textMuted, fontSize: 8 },
  metaValue: { fontFamily: 'Helvetica-Bold', fontSize: 8 },
  itemsHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    padding: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  itemsHeaderText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemsRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  colLeistung: { flex: 4 },
  colRight: { flex: 1, textAlign: 'right' },
  colHl: { fontFamily: 'Helvetica-Bold' },
  totalsBlock: {
    marginTop: 12,
    alignSelf: 'flex-end',
    minWidth: 200,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  totalsRowHl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    marginTop: 3,
  },
  noteBox: {
    marginTop: 14,
    backgroundColor: COLORS.secondary,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    padding: 9,
    borderRadius: 2,
    fontSize: 8.5,
    color: COLORS.textLight,
    lineHeight: 1.4,
  },
  smallBizNote: {
    marginTop: 8,
    fontSize: 7.5,
    fontStyle: 'italic',
    textAlign: 'center',
    color: COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    fontSize: 7,
    color: COLORS.textMuted,
  },
  footerCol: { flex: 1, paddingRight: 6, lineHeight: 1.4 },
  footerStrong: { fontFamily: 'Helvetica-Bold', color: COLORS.text, marginBottom: 2, fontSize: 7.5 },
});

export function InvoicePdfDocument({ inv }: { inv: Invoice }) {
  const apt =
    INVOICE_APARTMENTS.find((a) => a.id === inv.apartmentId) ||
    { name: 'Apartment', shortName: 'Apartment', id: 'erholungs-apartment' as const };
  const n = nights(inv.arrivalDate, inv.departureDate);
  const pricePerNight = n ? (Number(inv.paidAmount) || 0) / n : null;
  const site = INVOICE_CONFIG;
  const today = dateLong(todayIso());
  const paid = inv.paid ?? inv.status === 'sent';

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brand}>Erholungs Apartments</Text>
            <Text style={s.brandSub}>Ferienwohnung Bad Lippspringe</Text>
          </View>
          <View style={s.contact}>
            <Text>{site.owner}</Text>
            <Text>{site.address}</Text>
            <Text>{site.zip} {site.city}</Text>
            <Text>{site.phone} · {site.email}</Text>
          </View>
        </View>

        {/* Title row */}
        <View style={s.titleRow}>
          <Text style={s.title}>Rechnung</Text>
          <View>
            <Text style={s.labelSmall}>Rechnungsnummer</Text>
            <Text style={s.invoiceNumber}>{inv.invoiceNumber || '—'}</Text>
          </View>
        </View>

        {/* Addressee + meta */}
        <View style={s.addrRow}>
          <View style={s.addrLeft}>
            <Text style={s.labelSmall}>Rechnung an</Text>
            {inv.company ? <Text>{inv.company}</Text> : null}
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>{inv.fullName || '—'}</Text>
            <Text>{inv.address || ''}</Text>
            <Text>{inv.zipCity || ''}</Text>
            {inv.email ? (
              <Text style={{ color: COLORS.textLight, marginTop: 4 }}>{inv.email}</Text>
            ) : null}
          </View>
          <View style={s.addrRight}>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Rechnungsdatum</Text>
              <Text style={s.metaValue}>{today}</Text>
            </View>
            {inv.customerNumber ? (
              <View style={s.metaRow}>
                <Text style={s.metaLabel}>Kunden-Nr.</Text>
                <Text style={s.metaValue}>{inv.customerNumber}</Text>
              </View>
            ) : null}
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Buchungsnummer</Text>
              <Text style={s.metaValue}>{inv.bookingNumber || '—'}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Kanal</Text>
              <Text style={s.metaValue}>{inv.channel || 'Direkt'}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>Leistungsdatum</Text>
              <Text style={s.metaValue}>
                {dateShort(inv.arrivalDate)} – {dateShort(inv.departureDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Items table */}
        <View style={s.itemsHeader}>
          <Text style={[s.itemsHeaderText, s.colLeistung]}>Leistung</Text>
          <Text style={[s.itemsHeaderText, s.colRight]}>Nächte</Text>
          <Text style={[s.itemsHeaderText, s.colRight]}>pro Nacht</Text>
          <Text style={[s.itemsHeaderText, s.colRight]}>Gesamt</Text>
        </View>
        <View style={s.itemsRow}>
          <View style={s.colLeistung}>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>{apt.name}</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 9, marginTop: 2 }}>
              Übernachtung inkl. Endreinigung, Bettwäsche, WLAN
            </Text>
          </View>
          <Text style={s.colRight}>{n || '—'}</Text>
          <Text style={s.colRight}>{pricePerNight ? eur(pricePerNight) : '—'}</Text>
          <Text style={[s.colRight, s.colHl]}>{eur(inv.paidAmount)}</Text>
        </View>

        {/* Totals */}
        <View style={s.totalsBlock}>
          <View style={s.totalsRow}>
            <Text style={{ color: COLORS.textLight }}>Zwischensumme</Text>
            <Text>{eur(inv.paidAmount)}</Text>
          </View>
          <View style={s.totalsRowHl}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12 }}>Gesamtbetrag</Text>
            <Text
              style={{
                fontFamily: 'Helvetica-Bold',
                fontSize: 13,
                color: COLORS.primary,
              }}
            >
              {eur(inv.paidAmount)}
            </Text>
          </View>
          {paid ? (
            <>
              <View style={s.totalsRow}>
                <Text style={{ color: COLORS.primary, fontFamily: 'Helvetica-Bold' }}>
                  Bereits bezahlt {inv.channel ? `(${inv.channel})` : ''}
                </Text>
                <Text style={{ color: COLORS.primary, fontFamily: 'Helvetica-Bold' }}>
                  – {eur(inv.paidAmount)}
                </Text>
              </View>
              <View style={s.totalsRow}>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>Offener Betrag</Text>
                <Text style={{ fontFamily: 'Helvetica-Bold' }}>{eur(0)}</Text>
              </View>
            </>
          ) : (
            <View style={s.totalsRow}>
              <Text style={{ color: COLORS.danger, fontFamily: 'Helvetica-Bold' }}>
                Offener Betrag
              </Text>
              <Text style={{ color: COLORS.danger, fontFamily: 'Helvetica-Bold' }}>
                {eur(inv.paidAmount)}
              </Text>
            </View>
          )}
        </View>

        {/* Note */}
        <View style={s.noteBox}>
          <Text>
            {paid
              ? 'Diese Rechnung dient als Beleg über einen bereits vollständig bezahlten Aufenthalt. Eine zusätzliche Zahlung ist nicht erforderlich. '
              : 'Bitte überweisen Sie den offenen Betrag innerhalb von 14 Tagen auf das unten genannte Konto. '}
            Vielen Dank für Ihren Besuch im Erholungs Apartment in Bad Lippspringe –
            wir wünschen Ihnen einen erholsamen Aufenthalt!
          </Text>
        </View>

        <Text style={s.smallBizNote}>{site.smallBusinessNote}</Text>

        {/* Compact footer — single row */}
        <View style={s.footer}>
          <View style={s.footerCol}>
            <Text style={s.footerStrong}>{site.name}</Text>
            <Text>
              {site.owner} · {site.address} · {site.zip} {site.city}
            </Text>
            <Text>{site.phone} · {site.email}</Text>
          </View>
          <View style={s.footerCol}>
            <Text style={s.footerStrong}>Bankverbindung</Text>
            <Text>{site.bank.accountHolder} · {site.bank.name}</Text>
            <Text>IBAN: {site.bank.iban}</Text>
            <Text>BIC: {site.bank.bic} · St.-Nr.: {site.taxNumber}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
