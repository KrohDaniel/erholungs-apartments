'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  newInvoiceId,
  nextCustomerNumber,
  nextInvoiceNumber,
  upsertInvoice,
} from '@/lib/invoices';
import { EXAMPLE_BOOKING_TEXT } from '@/lib/invoice-constants';
import type { Invoice, InvoiceExtractedData } from '@/types/invoice';

type Mode = null | 'text' | 'manual';

export default function NewInvoiceClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function createDraft(data: InvoiceExtractedData) {
    const id = newInvoiceId();
    const [invoiceNumber, customerNumber] = await Promise.all([
      nextInvoiceNumber(),
      nextCustomerNumber(),
    ]);
    const inv: Invoice = {
      id,
      invoiceNumber,
      customerNumber,
      status: 'draft',
      createdAt: new Date().toISOString(),
      fullName: data.fullName || '',
      email: data.email || '',
      company: data.company || '',
      bookingNumber: data.bookingNumber || '',
      paidAmount:
        data.paidAmount != null && !isNaN(Number(data.paidAmount))
          ? Number(data.paidAmount)
          : null,
      arrivalDate: data.arrivalDate || '',
      departureDate: data.departureDate || '',
      address: data.address || '',
      zipCity: data.zipCity || '',
      channel: data.channel || 'Direkt',
      apartmentId: data.apartmentId || '',
      language: data.language || 'de',
    };
    await upsertInvoice(inv);
    router.push(`/rechnungen/${id}/`);
  }

  async function handleManual() {
    setLoading(true);
    try {
      await createDraft({});
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Anlegen.');
      setLoading(false);
    }
  }

  async function handleText() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/invoice/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const data = (await res.json()) as InvoiceExtractedData;
        await createDraft(data);
        return;
      }
      // API not configured / fails - fall back to manual draft with raw text
      await createDraft({});
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'KI-Extraktion nicht verfügbar — manuell anlegen.'
      );
      setLoading(false);
    }
  }

  return (
    <>
      <Link
        href="/rechnungen/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-text-light hover:text-primary"
      >
        ← Zurück
      </Link>

      <h1 className="text-3xl font-bold text-text">Neue Rechnung</h1>
      <p className="mt-2 mb-8 text-text-muted">
        Füge die Buchungsdaten als Text aus Booking ein – oder starte mit einem
        leeren Formular.
      </p>

      {!mode && (
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => setMode('text')}
            className="rounded-2xl border border-border bg-white p-6 text-left hover:border-primary hover:shadow-md transition-all"
          >
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-2xl">
              📋
            </div>
            <h3 className="text-lg font-semibold">Text einfügen</h3>
            <p className="mt-1 text-sm text-text-muted">
              KI extrahiert Daten aus Booking.com-Text automatisch.
            </p>
          </button>

          <button
            onClick={handleManual}
            disabled={loading}
            className="rounded-2xl border border-border bg-white p-6 text-left hover:border-primary hover:shadow-md transition-all disabled:opacity-50"
          >
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-2xl">
              ✏️
            </div>
            <h3 className="text-lg font-semibold">Manuell anlegen</h3>
            <p className="mt-1 text-sm text-text-muted">Leeres Formular öffnen.</p>
          </button>
        </div>
      )}

      {mode === 'text' && (
        <div className="rounded-2xl border border-border bg-white p-6">
          <h3 className="mb-3 text-lg font-semibold">Buchungstext</h3>
          <textarea
            rows={12}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Buchungsdetails aus Booking.com einfügen…"
            className="w-full rounded-lg border border-border p-3 text-sm font-mono focus:border-primary focus:outline-none"
          />
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => {
                setMode(null);
                setText('');
                setError('');
              }}
              className="text-sm text-text-light hover:text-primary"
            >
              ← Zurück
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setText(EXAMPLE_BOOKING_TEXT)}
                className="rounded-lg border border-border bg-white px-4 py-2 text-sm hover:bg-secondary"
              >
                Beispiel einfügen
              </button>
              <button
                onClick={handleText}
                disabled={!text.trim() || loading}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-text hover:bg-accent-light disabled:opacity-50"
              >
                {loading ? 'Lese aus…' : 'Daten auslesen'}
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
              {error}
            </div>
          )}
        </div>
      )}
    </>
  );
}
