'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { INVOICE_APARTMENTS } from '@/lib/invoice-constants';
import { dateShort, eur, nights } from '@/lib/invoice-format';
import ConfirmModal from '@/components/invoice/ConfirmModal';
import type { InvoiceRequest } from '@/types/invoice';

export default function RequestReviewClient({ id }: { id: string }) {
  const router = useRouter();
  const [req, setReq] = useState<InvoiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [converting, setConverting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/invoice-request/${id}`, { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Fehler beim Laden.');
        setReq(data.request as InvoiceRequest);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Fehler beim Laden.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function doConvert() {
    if (!req) return;
    setConverting(true);
    setError('');
    try {
      const res = await fetch(`/api/invoice-request/${req.id}/convert`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Konvertierung fehlgeschlagen.');
      router.push(`/rechnungen/${data.invoiceId}/`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Konvertierung fehlgeschlagen.');
      setConverting(false);
    }
  }

  async function doDelete() {
    if (!req) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/invoice-request/${req.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Löschen fehlgeschlagen.');
      router.push('/rechnungen/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Löschen fehlgeschlagen.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return <div className="p-12 text-center text-text-muted">Lade…</div>;
  }
  if (error && !req) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
        <Link
          href="/rechnungen/"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Zurück
        </Link>
      </div>
    );
  }
  if (!req) return null;

  const apt = INVOICE_APARTMENTS.find((a) => a.id === req.apartmentId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <Link
        href="/rechnungen/"
        className="mb-3 inline-flex items-center gap-1 text-sm text-text-light hover:text-primary"
      >
        ← Zurück
      </Link>

      <div className="mb-5">
        <div className="mb-2 inline-block rounded-full bg-accent/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-accent-dark">
          Kundenanfrage
        </div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {req.fullName || 'Anfrage'}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Eingegangen am{' '}
          {new Date(req.createdAt).toLocaleString('de-DE')}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-5 rounded-2xl border border-border bg-white p-4 sm:p-6">
        <Section title="Gast">
          <Row label="Name" value={req.fullName} />
          <Row
            label="E-Mail"
            value={req.skipEmail ? '— (keine angegeben)' : req.email}
          />
          {req.company && <Row label="Firma" value={req.company} />}
          <Row label="Adresse" value={req.address} />
          <Row label="PLZ + Stadt" value={req.zipCity} />
        </Section>

        <Section title="Aufenthalt">
          <Row label="Apartment" value={apt ? apt.name : '—'} />
          <Row
            label="Zeitraum"
            value={`${dateShort(req.arrivalDate)} – ${dateShort(req.departureDate)} (${nights(req.arrivalDate, req.departureDate)} Nächte)`}
          />
        </Section>

        <Section title="Buchung & Betrag">
          <Row label="Kanal" value={req.channel || '—'} />
          <Row
            label="Buchungsnummer"
            value={req.skipBookingNumber ? '—' : req.bookingNumber || '—'}
          />
          <Row label="Betrag" value={eur(req.paidAmount)} />
          <Row
            label="Status"
            value={req.paid ? '✓ bereits bezahlt' : 'steht noch aus'}
          />
        </Section>

        {req.message && (
          <Section title="Nachricht vom Gast">
            <div className="whitespace-pre-wrap text-sm text-text-light">
              {req.message}
            </div>
          </Section>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={() => setConfirmDelete(true)}
          className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
        >
          🗑 Anfrage verwerfen
        </button>
        <button
          onClick={doConvert}
          disabled={converting}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
        >
          {converting ? 'Erstelle…' : '→ Rechnung erstellen'}
        </button>
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Beim Erstellen wird die Anfrage in eine Rechnung umgewandelt. Du
        kannst sie anschließend bearbeiten, abschließen und versenden.
        Die Anfrage wird automatisch gelöscht.
      </p>

      <ConfirmModal
        open={confirmDelete}
        title="Anfrage verwerfen?"
        variant="danger"
        message={
          <div>
            Die Anfrage von <strong>{req.fullName}</strong> wird endgültig
            gelöscht. Es wird keine Rechnung erstellt.
          </div>
        }
        confirmLabel="Verwerfen"
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-3">
      <div className="w-32 shrink-0 text-text-muted">{label}</div>
      <div className="font-medium text-text">{value || '—'}</div>
    </div>
  );
}
