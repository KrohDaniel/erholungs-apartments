'use client';

import type { Invoice } from '@/types/invoice';
import { INVOICE_APARTMENTS, INVOICE_CONFIG } from '@/lib/invoice-constants';
import { dateLong, dateShort, eur, nights, todayIso } from '@/lib/invoice-format';

interface InvoicePreviewProps {
  inv: Invoice;
  scale?: number;
}

const phStyle: React.CSSProperties = {
  color: 'var(--color-text-muted)',
  fontStyle: 'italic',
};

function Ph({ children }: { children: React.ReactNode }) {
  return <span style={phStyle}>— {children} —</span>;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: '4px 0', color: 'var(--color-text-muted)' }}>{label}</td>
      <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 500 }}>{value}</td>
    </tr>
  );
}

export default function InvoicePreview({ inv, scale }: InvoicePreviewProps) {
  const apt =
    INVOICE_APARTMENTS.find((a) => a.id === inv.apartmentId) ||
    { name: 'Apartment', shortName: 'Apartment', id: 'erholungs-apartment' as const };
  const n = nights(inv.arrivalDate, inv.departureDate);
  const pricePerNight = n ? (Number(inv.paidAmount) || 0) / n : null;
  const site = INVOICE_CONFIG;
  const today = dateLong(todayIso());
  const missing = (v: unknown) =>
    !v || (typeof v === 'string' && !v.trim());
  const paid = inv.status === 'sent';

  return (
    <div
      className="invoice-print"
      style={{
        width: 794,
        minHeight: 1123,
        background: 'white',
        color: '#1A1A1A',
        boxShadow: '0 8px 28px rgba(20,30,10,0.10)',
        border: '1px solid var(--color-border)',
        padding: '48px 64px 36px',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 13,
        lineHeight: 1.55,
        transformOrigin: 'top left',
        transform: scale ? `scale(${scale})` : 'none',
      }}
    >
      {/* Header band */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 22,
          borderBottom: '2px solid var(--color-primary)',
        }}
      >
        <img
          src="/images/general/logo_weiss_FeWo.png"
          alt="Erholungs Apartments"
          style={{ height: 70, width: 'auto' }}
        />
        <div style={{ textAlign: 'right', fontSize: 11.5, color: 'var(--color-text-light)' }}>
          {site.owner}<br />
          {site.address}<br />
          {site.zip} {site.city}<br />
          {site.phone} · {site.email}
        </div>
      </div>

      {/* Title row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginTop: 36,
          marginBottom: 28,
        }}
      >
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
          Rechnung
        </h1>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: 11,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Rechnungsnummer
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-primary)' }}>
            {inv.invoiceNumber || '—'}
          </div>
        </div>
      </div>

      {/* Addressee + meta */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 36,
          marginBottom: 36,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            Rechnung an
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.55 }}>
            {inv.company && <div>{inv.company}</div>}
            <div style={{ fontWeight: 600 }}>
              {inv.fullName || <Ph>Name</Ph>}
            </div>
            <div style={missing(inv.address) ? phStyle : undefined}>
              {inv.address || 'Straße + Hausnummer'}
            </div>
            <div style={missing(inv.zipCity) ? phStyle : undefined}>
              {inv.zipCity || 'PLZ Stadt'}
            </div>
            {inv.email && (
              <div style={{ marginTop: 6, color: 'var(--color-text-light)' }}>{inv.email}</div>
            )}
          </div>
        </div>

        <div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <tbody>
              <MetaRow label="Rechnungsdatum" value={today} />
              {inv.customerNumber && <MetaRow label="Kunden-Nr." value={inv.customerNumber} />}
              <MetaRow label="Buchungsnummer" value={inv.bookingNumber || '—'} />
              <MetaRow label="Kanal" value={inv.channel || 'Direkt'} />
              <MetaRow
                label="Leistungsdatum"
                value={`${dateShort(inv.arrivalDate)} – ${dateShort(inv.departureDate)}`}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Line items */}
      <div style={{ marginBottom: 26 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 80px 110px 110px',
            padding: '10px 14px',
            background: 'var(--color-secondary)',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--color-text-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          <div>Leistung</div>
          <div style={{ textAlign: 'right' }}>Nächte</div>
          <div style={{ textAlign: 'right' }}>pro Nacht</div>
          <div style={{ textAlign: 'right' }}>Gesamt</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 80px 110px 110px',
            padding: '16px 14px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>{apt.name}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
              Übernachtung inkl. Endreinigung, Bettwäsche, WLAN
            </div>
          </div>
          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {n || '—'}
          </div>
          <div style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
            {pricePerNight ? eur(pricePerNight) : '—'}
          </div>
          <div
            style={{
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
            }}
          >
            {eur(inv.paidAmount)}
          </div>
        </div>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
        <table style={{ minWidth: 300, fontSize: 13, borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '4px 12px', color: 'var(--color-text-light)' }}>
                Zwischensumme
              </td>
              <td
                style={{
                  padding: '4px 12px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {eur(inv.paidAmount)}
              </td>
            </tr>
            <tr style={{ borderTop: '2px solid var(--color-primary)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 700, fontSize: 14 }}>Gesamtbetrag</td>
              <td
                style={{
                  padding: '10px 12px',
                  textAlign: 'right',
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'var(--color-primary)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {eur(inv.paidAmount)}
              </td>
            </tr>
            {paid ? (
              <>
                <tr>
                  <td
                    style={{
                      padding: '4px 12px',
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                    }}
                  >
                    Bereits bezahlt {inv.channel ? `(${inv.channel})` : ''}
                  </td>
                  <td
                    style={{
                      padding: '4px 12px',
                      textAlign: 'right',
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    – {eur(inv.paidAmount)}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>Offener Betrag</td>
                  <td
                    style={{
                      padding: '8px 12px',
                      textAlign: 'right',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {eur(0)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  style={{
                    padding: '8px 12px',
                    color: 'var(--color-danger)',
                    fontWeight: 600,
                  }}
                >
                  Offener Betrag
                </td>
                <td
                  style={{
                    padding: '8px 12px',
                    textAlign: 'right',
                    color: 'var(--color-danger)',
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {eur(inv.paidAmount)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <div
        style={{
          background: 'var(--color-secondary)',
          borderLeft: '3px solid var(--color-accent)',
          padding: '14px 18px',
          borderRadius: 4,
          fontSize: 12.5,
          color: 'var(--color-text-light)',
        }}
      >
        {paid
          ? 'Diese Rechnung dient als Beleg über einen bereits vollständig bezahlten Aufenthalt. Eine zusätzliche Zahlung ist nicht erforderlich. '
          : 'Bitte überweisen Sie den offenen Betrag innerhalb von 14 Tagen auf das unten genannte Konto. '}
        Vielen Dank für Ihren Besuch im Erholungs Apartment in Bad Lippspringe –
        wir wünschen Ihnen einen erholsamen Aufenthalt!
      </div>

      <div
        style={{
          marginTop: 14,
          fontSize: 11,
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        {site.smallBusinessNote}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 44,
          borderTop: '1px solid var(--color-border)',
          paddingTop: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 24,
          fontSize: 10.5,
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
        }}
      >
        <div>
          <strong style={{ color: 'var(--color-text)', display: 'block' }}>{site.name}</strong>
          {site.owner}<br />
          {site.address}<br />
          {site.zip} {site.city}
        </div>
        <div>
          <strong style={{ color: 'var(--color-text)', display: 'block' }}>Kontakt</strong>
          {site.phone}<br />
          {site.email}<br />
          {site.domain}
        </div>
        <div>
          <strong style={{ color: 'var(--color-text)', display: 'block' }}>Bankverbindung</strong>
          {site.bank.name}<br />
          IBAN: {site.bank.iban}<br />
          BIC: {site.bank.bic}<br />
          KTO-Inh.: {site.bank.accountHolder}<br />
          St.-Nr.: {site.taxNumber}
        </div>
      </div>
    </div>
  );
}
