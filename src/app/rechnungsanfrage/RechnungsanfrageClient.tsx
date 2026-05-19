'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { INVOICE_APARTMENTS } from '@/lib/invoice-constants';
import { nights } from '@/lib/invoice-format';
import type { InvoiceChannel, InvoiceApartmentId } from '@/types/invoice';

interface FormState {
  fullName: string;
  email: string;
  skipEmail: boolean;
  company: string;
  address: string;
  zipCity: string;
  apartmentId: InvoiceApartmentId | '';
  arrivalDate: string;
  departureDate: string;
  channel: InvoiceChannel;
  bookingNumber: string;
  skipBookingNumber: boolean;
  paidAmount: string;
  paid: boolean;
  message: string;
}

const INITIAL: FormState = {
  fullName: '',
  email: '',
  skipEmail: false,
  company: '',
  address: '',
  zipCity: '',
  apartmentId: '',
  arrivalDate: '',
  departureDate: '',
  channel: 'Direkt',
  bookingNumber: '',
  skipBookingNumber: false,
  paidAmount: '',
  paid: false,
  message: '',
};

export default function RechnungsanfrageClient() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/invoice-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          paidAmount: form.paidAmount === '' ? null : Number(form.paidAmount),
          website,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = Array.isArray(result.details)
          ? ' (' + result.details.join(' ') + ')'
          : '';
        throw new Error((result.error || 'Anfrage fehlgeschlagen.') + details);
      }
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Anfrage fehlgeschlagen.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-3 text-4xl">✓</div>
        <h1 className="text-2xl font-bold text-green-800">
          Vielen Dank für Ihre Anfrage!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-green-700">
          Ihre Daten wurden erfolgreich übermittelt. Sie erhalten in Kürze
          Ihre Rechnung per E-Mail. Wir freuen uns auf Ihren nächsten Besuch!
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
        >
          Zur Startseite
        </Link>
      </div>
    );
  }

  const n = nights(form.arrivalDate, form.departureDate);
  const inputBase =
    'w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none';

  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          Rechnungsanfrage
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Bitte füllen Sie das Formular aus. Wir erstellen Ihnen anschließend
          Ihre Rechnung und senden sie per E-Mail zu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>

        <Section title="Ihre Daten">
          <Field label="Name *">
            <input
              required
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Vor- und Nachname"
              className={inputBase}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={form.skipEmail ? 'E-Mail (optional)' : 'E-Mail *'}>
              <input
                type="email"
                required={!form.skipEmail}
                disabled={form.skipEmail}
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="name@beispiel.de"
                className={`${inputBase} disabled:bg-secondary disabled:opacity-60`}
              />
              <Checkbox
                checked={form.skipEmail}
                onChange={(v) => set('skipEmail', v)}
                label="Keine E-Mail"
              />
            </Field>
            <Field label="Firma (optional)">
              <input
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                className={inputBase}
              />
            </Field>
          </div>
          <Field label="Adresse *">
            <input
              required
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Musterstraße 12"
              className={inputBase}
            />
          </Field>
          <Field label="PLZ + Stadt *">
            <input
              required
              value={form.zipCity}
              onChange={(e) => set('zipCity', e.target.value)}
              placeholder="33175 Bad Lippspringe"
              className={inputBase}
            />
          </Field>
        </Section>

        <Section title="Ihr Aufenthalt">
          <Field label="Apartment">
            <select
              value={form.apartmentId}
              onChange={(e) =>
                set('apartmentId', e.target.value as InvoiceApartmentId | '')
              }
              className={inputBase}
            >
              <option value="">— bitte wählen —</option>
              {INVOICE_APARTMENTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Anreise *">
              <input
                type="date"
                required
                value={form.arrivalDate}
                onChange={(e) => set('arrivalDate', e.target.value)}
                className={inputBase}
              />
            </Field>
            <Field label="Abreise *">
              <input
                type="date"
                required
                value={form.departureDate}
                onChange={(e) => set('departureDate', e.target.value)}
                className={inputBase}
              />
            </Field>
          </div>
          {n > 0 && (
            <p className="text-xs text-text-muted">{n} Nächte</p>
          )}
        </Section>

        <Section title="Buchung & Betrag">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                ['Booking.com', 'Booking'],
                ['Airbnb', 'Airbnb'],
                ['FeWo-direkt', 'FeWo'],
                ['Direkt', 'Privat'],
              ] as [InvoiceChannel, string][]
            ).map(([id, label]) => {
              const active = form.channel === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => set('channel', id)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    active
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border bg-white text-text-light hover:bg-secondary'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={form.skipBookingNumber ? 'Buchungsnr. (optional)' : 'Buchungsnummer *'}
            >
              <input
                required={!form.skipBookingNumber}
                disabled={form.skipBookingNumber}
                value={form.bookingNumber}
                onChange={(e) => set('bookingNumber', e.target.value)}
                className={`${inputBase} disabled:bg-secondary disabled:opacity-60`}
              />
              <Checkbox
                checked={form.skipBookingNumber}
                onChange={(v) => set('skipBookingNumber', v)}
                label="Keine Nummer"
              />
            </Field>
            <Field label="Bezahlter Betrag (€) *">
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.paidAmount}
                onChange={(e) => set('paidAmount', e.target.value)}
                placeholder="170.00"
                className={inputBase}
              />
            </Field>
          </div>
          <Checkbox
            checked={form.paid}
            onChange={(v) => set('paid', v)}
            label="Betrag wurde bereits bezahlt (z.B. via Booking.com)"
          />
        </Section>

        <Section title="Nachricht (optional)">
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Anmerkungen oder besondere Wünsche..."
            className={`${inputBase} resize-y`}
          />
        </Section>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-sm text-text-light hover:text-primary text-center sm:text-left"
          >
            ← Zurück zur Startseite
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {submitting ? 'Sende…' : 'Anfrage absenden'}
          </button>
        </div>

        <p className="text-xs text-text-muted">
          Ihre Daten werden ausschließlich zur Rechnungserstellung verwendet
          und nach Versand der Rechnung gelöscht. Mehr Infos in unserer{' '}
          <Link href="/datenschutzerklaerung" className="underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </form>
    </>
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
    <div className="rounded-2xl border border-border bg-white p-4 sm:p-6">
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-light">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="mt-1.5 flex items-center gap-2 text-xs text-text-muted cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5"
      />
      {label}
    </label>
  );
}
