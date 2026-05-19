'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { listInvoices } from '@/lib/invoices';
import { INVOICE_APARTMENTS } from '@/lib/invoice-constants';
import { dateShort, eur, nights } from '@/lib/invoice-format';
import type { Invoice, InvoiceStatus } from '@/types/invoice';

type Filter = 'all' | InvoiceStatus;

export default function DashboardClient() {
  const [items, setItems] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    listInvoices()
      .then((all) => setItems(all))
      .catch((e) => setError(e instanceof Error ? e.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((inv) => {
        if (filter !== 'all' && inv.status !== filter) return false;
        if (!q) return true;
        const t = q.toLowerCase();
        return (
          (inv.fullName || '').toLowerCase().includes(t) ||
          (inv.invoiceNumber || '').toLowerCase().includes(t) ||
          (inv.bookingNumber || '').toLowerCase().includes(t)
        );
      }),
    [items, filter, q]
  );

  const total = items.length;
  const totalSent = items.filter((i) => i.status === 'sent').length;
  const totalDraft = items.filter((i) => i.status === 'draft').length;
  const privateItems = items.filter((i) => i.channel === 'Direkt');
  const totalEuroPrivate = privateItems.reduce(
    (s, i) => s + (Number(i.paidAmount) || 0),
    0
  );

  if (loading) {
    return <div className="p-12 text-center text-text-muted">Lade…</div>;
  }
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Gesamt" value={total} />
        <Stat label="Versendet" value={totalSent} tone="success" />
        <Stat label="Entwürfe" value={totalDraft} tone="warning" />
        <Stat
          label="Umsatz Privat"
          value={eur(totalEuroPrivate)}
          hint={`${privateItems.length} Direktbuchung${
            privateItems.length === 1 ? '' : 'en'
          }`}
        />
      </div>

      {/* Filter + Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <input
            placeholder="Name, Rechnungs- oder Buchungsnummer…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 min-w-[200px] max-w-md rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <div className="flex gap-1">
            {(
              [
                ['all', 'Alle'],
                ['draft', 'Entwürfe'],
                ['sent', 'Versendet'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  filter === k
                    ? 'bg-primary text-white'
                    : 'text-text-light hover:bg-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-text-muted mb-4">
              {total > 0 ? 'Keine Treffer.' : 'Noch keine Rechnungen vorhanden.'}
            </p>
            <Link
              href="/rechnungen/neu/"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-text shadow-sm hover:bg-accent-light"
            >
              + Erste Rechnung anlegen
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-background text-left text-xs uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3 font-medium">Nr.</th>
                <th className="px-4 py-3 font-medium">Gast</th>
                <th className="px-4 py-3 font-medium">Apartment</th>
                <th className="px-4 py-3 font-medium">Zeitraum</th>
                <th className="px-4 py-3 font-medium text-right">Betrag</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => {
                const apt = INVOICE_APARTMENTS.find((a) => a.id === inv.apartmentId);
                return (
                  <tr
                    key={inv.id}
                    className="cursor-pointer border-t border-border hover:bg-secondary/50"
                  >
                    <td className="px-4 py-3.5 font-semibold">
                      <Link
                        href={`/rechnungen/${inv.id}/`}
                        className="block"
                      >
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium">{inv.fullName || '—'}</div>
                      <div className="text-xs text-text-muted">{inv.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      {apt ? apt.shortName : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-sm">
                      {dateShort(inv.arrivalDate)} – {dateShort(inv.departureDate)}
                      <div className="text-xs text-text-muted">
                        {nights(inv.arrivalDate, inv.departureDate)} Nächte
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-medium tabular-nums">
                      {eur(inv.paidAmount)}
                    </td>
                    <td className="px-4 py-3.5">
                      {inv.status === 'sent' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          versendet
                        </span>
                      ) : inv.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                          storniert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                          Entwurf
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={`/rechnungen/${inv.id}/`}
                        className="text-sm text-primary hover:underline"
                      >
                        Öffnen →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string | number;
  tone?: 'success' | 'warning';
  hint?: string;
}) {
  const valueClass =
    tone === 'success'
      ? 'text-primary'
      : tone === 'warning'
      ? 'text-accent-dark'
      : 'text-text';
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="text-xs uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</div>
      {hint && <div className="mt-1 text-xs text-text-muted">{hint}</div>}
    </div>
  );
}
