'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteInvoice, getInvoice, upsertInvoice } from '@/lib/invoices';
import { INVOICE_APARTMENTS, EMAIL_TEMPLATES } from '@/lib/invoice-constants';
import { renderTemplate } from '@/lib/invoice-template';
import { nights } from '@/lib/invoice-format';
import InvoicePreview from '@/components/invoice/InvoicePreview';
import ConfirmModal from '@/components/invoice/ConfirmModal';
import type { Invoice, InvoiceChannel, InvoiceLanguage } from '@/types/invoice';

const REQUIRED: (keyof Invoice)[] = [
  'fullName',
  'paidAmount',
  'arrivalDate',
  'departureDate',
  'address',
  'zipCity',
  'invoiceNumber',
];

type Tab = 'edit' | 'send';

export default function EditorClient({ id }: { id: string }) {
  const router = useRouter();
  const [inv, setInv] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('edit');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [editingTpl, setEditingTpl] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );
  const [confirmSend, setConfirmSend] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmFinalize, setConfirmFinalize] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  /** Override-Adresse für den Mail-Versand (initial aus inv.email) */
  const [sendToEmail, setSendToEmail] = useState('');
  /** Adresse die zuletzt tatsächlich vom Server angesteuert wurde */
  const [lastSentTo, setLastSentTo] = useState('');

  useEffect(() => {
    getInvoice(id)
      .then((found) => {
        if (!found) {
          setError('Rechnung nicht gefunden.');
        } else {
          setInv(found);
          setSendToEmail(found.email || '');
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Fehler beim Laden'))
      .finally(() => setLoading(false));
  }, [id]);

  // Re-render email template when invoice data changes
  useEffect(() => {
    if (!inv || editingTpl) return;
    const lang = (inv.language || 'de') as InvoiceLanguage;
    const tpl = EMAIL_TEMPLATES[lang] || EMAIL_TEMPLATES.de;
    setSubject(renderTemplate(tpl.subject, inv));
    setBody(renderTemplate(tpl.body, inv));
  }, [inv, editingTpl]);

  if (loading) {
    return <div className="p-12 text-center text-text-muted">Lade…</div>;
  }
  if (error || !inv) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || 'Rechnung nicht gefunden.'}
        </div>
        <Link
          href="/rechnungen/"
          className="mt-4 inline-block text-sm text-primary hover:underline"
        >
          ← Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  // GoBD: versendete Rechnungen sind read-only
  const readonly = inv.status === 'sent' || inv.status === 'cancelled';

  async function update(patch: Partial<Invoice>) {
    if (!inv) return;
    const next = { ...inv, ...patch, updatedAt: new Date().toISOString() };
    setInv(next);
    setSaving(true);
    try {
      await upsertInvoice(next);
    } finally {
      setSaving(false);
    }
  }

  const missing = REQUIRED.filter((k) => {
    const v = inv[k];
    if (v == null || v === '') return true;
    if (typeof v === 'string' && !v.trim()) return true;
    return false;
  });
  if (!inv.skipEmail && (!inv.email || !inv.email.trim())) missing.push('email');
  if (!inv.skipBookingNumber && (!inv.bookingNumber || !inv.bookingNumber.trim()))
    missing.push('bookingNumber');
  const ready = missing.length === 0;

  async function doPrint() {
    if (!inv) return;
    try {
      const res = await fetch(`/api/invoice/${inv.id}/pdf`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('PDF konnte nicht generiert werden.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const lastName = (inv.fullName || 'Gast').split(/\s+/).slice(-1)[0];
      const safeLast = lastName.replace(/[^a-zA-Z0-9äöüÄÖÜß-]/g, '');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rechnung_${inv.invoiceNumber || 'Entwurf'}_${safeLast}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'PDF-Download fehlgeschlagen.');
    }
  }

  async function doSend() {
    if (!inv) return;
    setConfirmSend(false);
    setSendStatus('sending');
    setError('');
    const overrideEmail =
      sendToEmail && sendToEmail !== inv.email ? sendToEmail : undefined;
    try {
      const res = await fetch('/api/invoice/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: inv.id,
          subject,
          body,
          overrideEmail,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.error || 'Versand fehlgeschlagen.');
      }
      const now = result.sentAt || new Date().toISOString();
      setInv(
        inv.sentAt
          ? { ...inv, lastResentAt: now }
          : { ...inv, sentAt: now }
      );
      setLastSentTo(result.sentTo || overrideEmail || inv.email);
      setSendStatus('sent');
    } catch (e) {
      setSendStatus('error');
      setError(e instanceof Error ? e.message : 'E-Mail-Versand fehlgeschlagen.');
    }
  }

  async function doFinalize() {
    if (!inv) return;
    setFinalizing(true);
    setError('');
    try {
      const finalizedAt = new Date().toISOString();
      const next: Invoice = { ...inv, status: 'sent', finalizedAt };
      await upsertInvoice(next);
      setInv(next);
      setConfirmFinalize(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Abschluss fehlgeschlagen.');
    } finally {
      setFinalizing(false);
    }
  }

  async function doDelete() {
    if (!inv) return;
    setDeleting(true);
    setError('');
    try {
      await deleteInvoice(inv.id);
      router.push('/rechnungen/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Löschen fehlgeschlagen.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
      <Link
        href="/rechnungen/"
        className="mb-3 inline-flex items-center gap-1 text-sm text-text-light hover:text-primary"
      >
        ← Zurück
      </Link>

      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          Rechnung {inv.invoiceNumber}
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          {inv.fullName || 'Gast'}
          {' · '}
          {inv.status === 'sent'
            ? 'abgeschlossen'
            : inv.status === 'cancelled'
            ? 'storniert'
            : 'Entwurf'}
          {inv.sentAt && (
            <span className="block text-xs sm:ml-2 sm:inline">
              · per E-Mail versendet
            </span>
          )}
          {inv.paid && (
            <span className="block text-xs text-primary sm:ml-2 sm:inline">
              · bezahlt
            </span>
          )}
          {saving && <span className="ml-2 italic">speichert…</span>}
        </p>

        {/* Tab switch */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setTab('edit')}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium sm:flex-none sm:px-4 ${
              tab === 'edit'
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-text-light hover:bg-secondary'
            }`}
          >
            Daten
          </button>
          <button
            onClick={() => setTab('send')}
            disabled={!ready && !readonly}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium sm:flex-none sm:px-4 ${
              tab === 'send'
                ? 'bg-primary text-white'
                : 'bg-white border border-border text-text-light hover:bg-secondary'
            } disabled:opacity-50`}
          >
            Versand
          </button>
        </div>

        {/* Primary actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {!readonly && ready && (
            <button
              onClick={() => setConfirmFinalize(true)}
              className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-light sm:flex-none sm:px-4"
            >
              🔒 Rechnung abschließen
            </button>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 sm:px-4"
          >
            🗑 Löschen
          </button>
        </div>
      </div>

      {readonly && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Diese Rechnung wurde {inv.status === 'sent' ? 'abgeschlossen' : 'storniert'}.
          Änderungen an Rechnungsdaten sind aus GoBD-Gründen nicht mehr möglich.
          {inv.status === 'sent' && ' (Versand per E-Mail ist weiterhin möglich.)'}
        </div>
      )}

      {error && sendStatus === 'error' && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <strong>Fehler beim Versand:</strong> {error}
        </div>
      )}

      {sendStatus === 'sent' && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          ✓ E-Mail mit PDF wurde erfolgreich an{' '}
          <strong>{lastSentTo || inv.email}</strong> gesendet.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr,1.1fr] lg:gap-6">
        {/* LEFT: form or send */}
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-6">
          {tab === 'edit' ? (
            <EditForm inv={inv} readonly={readonly} update={update} missing={missing} />
          ) : (
            <SendPanel
              inv={inv}
              subject={subject}
              setSubject={setSubject}
              body={body}
              setBody={setBody}
              sendToEmail={sendToEmail}
              setSendToEmail={setSendToEmail}
              onFocusTpl={() => setEditingTpl(true)}
              onChangeLang={(lang) => {
                setEditingTpl(false);
                update({ language: lang });
              }}
              doPrint={doPrint}
              onRequestSend={() => setConfirmSend(true)}
              sendStatus={sendStatus}
            />
          )}
        </div>

        {/* RIGHT: preview (always visible on desktop, collapsible on mobile) */}
        <PreviewSection inv={inv} />
      </div>

      {/* Confirm: Send / Re-Send */}
      <ConfirmModal
        open={confirmSend}
        title={inv.sentAt ? 'Rechnung erneut senden?' : 'Rechnung senden?'}
        message={
          <>
            {inv.sentAt && (
              <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 p-2 text-amber-800">
                Diese Rechnung wurde bereits am{' '}
                {new Date(inv.sentAt).toLocaleDateString('de-DE')} versendet.
                Sie wird erneut an den Gast geschickt.
              </div>
            )}
            <div>
              Die Rechnung Nr. <strong>{inv.invoiceNumber}</strong> wird inkl.
              PDF-Anhang an <strong>{sendToEmail || inv.email}</strong> gesendet.
            </div>
          </>
        }
        confirmLabel={inv.sentAt ? 'Erneut senden' : 'Jetzt senden'}
        loading={sendStatus === 'sending'}
        onConfirm={doSend}
        onCancel={() => setConfirmSend(false)}
      />

      {/* Confirm: Finalize (lock invoice) */}
      <ConfirmModal
        open={confirmFinalize}
        title="Rechnung jetzt abschließen?"
        message={
          <>
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 p-2 text-amber-800">
              <strong>GoBD-Hinweis:</strong> Nach dem Abschließen kann die
              Rechnung nicht mehr bearbeitet werden. Nur der E-Mail-Versand
              bleibt weiterhin möglich.
            </div>
            <div>
              Möchtest du die Rechnung Nr. <strong>{inv.invoiceNumber}</strong>{' '}
              endgültig abschließen?
            </div>
          </>
        }
        confirmLabel="Ja, abschließen"
        loading={finalizing}
        onConfirm={doFinalize}
        onCancel={() => setConfirmFinalize(false)}
      />

      {/* Confirm: Delete */}
      <ConfirmModal
        open={confirmDelete}
        title="Rechnung löschen?"
        variant="danger"
        message={
          <>
            {inv.status === 'sent' && (
              <div className="mb-3 rounded-md bg-red-50 border border-red-200 p-2 text-red-800">
                <strong>Achtung:</strong> Diese Rechnung wurde bereits versendet.
                Das Löschen verstößt gegen GoBD. Bitte nur löschen, wenn die
                Rechnung versehentlich angelegt wurde.
              </div>
            )}
            <div>
              Möchtest du die Rechnung <strong>{inv.invoiceNumber}</strong>{' '}
              wirklich endgültig löschen? Diese Aktion kann nicht rückgängig
              gemacht werden.
            </div>
          </>
        }
        confirmLabel="Endgültig löschen"
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function PreviewSection({ inv }: { inv: Invoice }) {
  const [openMobile, setOpenMobile] = useState(false);
  return (
    <div className="rounded-2xl bg-secondary">
      <button
        type="button"
        onClick={() => setOpenMobile((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-xs uppercase tracking-wider text-text-muted lg:cursor-default lg:pointer-events-none lg:py-3"
      >
        <span>Vorschau (PDF-Layout)</span>
        <span
          className={`text-base transition-transform lg:hidden ${
            openMobile ? 'rotate-180' : ''
          }`}
        >
          ⌄
        </span>
      </button>
      <div className={`${openMobile ? 'block' : 'hidden'} px-3 pb-4 lg:block lg:px-4`}>
        <PreviewWrapper inv={inv} />
      </div>
    </div>
  );
}

function PreviewWrapper({ inv }: { inv: Invoice }) {
  // The InvoicePreview is fixed at 794px wide. We scale it down to fit the column.
  return (
    <div className="overflow-x-auto">
      <div style={{ position: 'relative', height: 1123 * 0.55, minWidth: 794 * 0.55 }}>
        <InvoicePreview inv={inv} scale={0.55} />
      </div>
    </div>
  );
}

function EditForm({
  inv,
  readonly,
  update,
  missing,
}: {
  inv: Invoice;
  readonly: boolean;
  update: (patch: Partial<Invoice>) => void;
  missing: string[];
}) {
  function set<K extends keyof Invoice>(key: K, value: Invoice[K]) {
    update({ [key]: value } as Partial<Invoice>);
  }

  const inputBase =
    'w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-60 disabled:bg-secondary';

  return (
    <div className="space-y-5">
      {/* Gast */}
      <Section title="Gast">
        <Field label="Name" missing={missing.includes('fullName')}>
          <input
            disabled={readonly}
            value={inv.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            className={`${inputBase} ${
              missing.includes('fullName') ? 'border-red-300 bg-red-50' : 'border-border'
            }`}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="E-Mail" missing={missing.includes('email')}>
            <input
              type="email"
              disabled={readonly || !!inv.skipEmail}
              value={inv.email}
              onChange={(e) => set('email', e.target.value)}
              className={`${inputBase} ${
                missing.includes('email') ? 'border-red-300 bg-red-50' : 'border-border'
              }`}
            />
            <Checkbox
              checked={!!inv.skipEmail}
              onChange={(v) => set('skipEmail', v)}
              label="Keine E-Mail"
              disabled={readonly}
            />
          </Field>
          <Field label="Firma (optional)">
            <input
              disabled={readonly}
              value={inv.company || ''}
              onChange={(e) => set('company', e.target.value)}
              className={`${inputBase} border-border`}
            />
          </Field>
        </div>
        <Field label="Adresse" missing={missing.includes('address')}>
          <input
            disabled={readonly}
            value={inv.address}
            onChange={(e) => set('address', e.target.value)}
            className={`${inputBase} ${
              missing.includes('address') ? 'border-red-300 bg-red-50' : 'border-border'
            }`}
          />
        </Field>
        <Field label="PLZ + Stadt" missing={missing.includes('zipCity')}>
          <input
            disabled={readonly}
            value={inv.zipCity}
            onChange={(e) => set('zipCity', e.target.value)}
            className={`${inputBase} ${
              missing.includes('zipCity') ? 'border-red-300 bg-red-50' : 'border-border'
            }`}
          />
        </Field>
      </Section>

      {/* Aufenthalt */}
      <Section title="Aufenthalt">
        <Field label="Apartment">
          <select
            disabled={readonly}
            value={inv.apartmentId || ''}
            onChange={(e) =>
              set('apartmentId', e.target.value as Invoice['apartmentId'])
            }
            className={`${inputBase} border-border`}
          >
            <option value="">— bitte wählen —</option>
            {INVOICE_APARTMENTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Anreise" missing={missing.includes('arrivalDate')}>
            <input
              type="date"
              disabled={readonly}
              value={inv.arrivalDate}
              onChange={(e) => set('arrivalDate', e.target.value)}
              className={`${inputBase} ${
                missing.includes('arrivalDate')
                  ? 'border-red-300 bg-red-50'
                  : 'border-border'
              }`}
            />
          </Field>
          <Field label="Abreise" missing={missing.includes('departureDate')}>
            <input
              type="date"
              disabled={readonly}
              value={inv.departureDate}
              onChange={(e) => set('departureDate', e.target.value)}
              className={`${inputBase} ${
                missing.includes('departureDate')
                  ? 'border-red-300 bg-red-50'
                  : 'border-border'
              }`}
            />
          </Field>
        </div>
        <p className="text-xs text-text-muted">
          {nights(inv.arrivalDate, inv.departureDate)} Nächte
        </p>
      </Section>

      {/* Buchung & Betrag */}
      <Section title="Buchung & Betrag">
        <div className="grid grid-cols-4 gap-2">
          {(
            [
              ['Booking.com', 'Booking'],
              ['Airbnb', 'Airbnb'],
              ['FeWo-direkt', 'FeWo'],
              ['Direkt', 'Privat'],
            ] as [InvoiceChannel, string][]
          ).map(([id, label]) => {
            const active = (inv.channel || 'Booking.com') === id;
            return (
              <button
                key={id}
                disabled={readonly}
                onClick={() => set('channel', id)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                  active
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-white text-text-light hover:bg-secondary'
                } disabled:opacity-60`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Buchungsnummer" missing={missing.includes('bookingNumber')}>
            <input
              disabled={readonly || !!inv.skipBookingNumber}
              value={inv.bookingNumber || ''}
              onChange={(e) => set('bookingNumber', e.target.value)}
              className={`${inputBase} ${
                missing.includes('bookingNumber')
                  ? 'border-red-300 bg-red-50'
                  : 'border-border'
              }`}
            />
            <Checkbox
              checked={!!inv.skipBookingNumber}
              onChange={(v) => set('skipBookingNumber', v)}
              label="Keine Nummer"
              disabled={readonly}
            />
          </Field>
          <Field label="Bezahlter Betrag (€)" missing={missing.includes('paidAmount')}>
            <input
              type="number"
              step="0.01"
              disabled={readonly}
              value={inv.paidAmount ?? ''}
              onChange={(e) =>
                set('paidAmount', e.target.value === '' ? null : Number(e.target.value))
              }
              className={`${inputBase} ${
                missing.includes('paidAmount')
                  ? 'border-red-300 bg-red-50'
                  : 'border-border'
              }`}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rechnungs-Nr." missing={missing.includes('invoiceNumber')}>
            <input
              disabled={readonly}
              value={inv.invoiceNumber}
              onChange={(e) => set('invoiceNumber', e.target.value)}
              className={`${inputBase} ${
                missing.includes('invoiceNumber')
                  ? 'border-red-300 bg-red-50'
                  : 'border-border'
              }`}
            />
          </Field>
          <Field label="Kunden-Nr.">
            <input
              disabled={readonly}
              value={inv.customerNumber}
              onChange={(e) => set('customerNumber', e.target.value)}
              className={`${inputBase} border-border`}
            />
          </Field>
        </div>
      </Section>

      {/* Status */}
      <Section title="Zahlungsstatus">
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={readonly}
            onClick={() => set('paid', false)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              !inv.paid
                ? 'border-accent bg-accent/10'
                : 'border-border bg-white'
            } disabled:opacity-60`}
          >
            <div className="text-sm font-semibold">Steht noch aus</div>
            <div className="text-xs text-text-muted">Gast soll noch überweisen</div>
          </button>
          <button
            disabled={readonly}
            onClick={() => set('paid', true)}
            className={`rounded-lg border p-3 text-left transition-colors ${
              inv.paid
                ? 'border-primary bg-primary/5'
                : 'border-border bg-white'
            } disabled:opacity-60`}
          >
            <div className="text-sm font-semibold">Bereits bezahlt</div>
            <div className="text-xs text-text-muted">
              {inv.channel === 'Booking.com' ? 'über Booking.com' : 'bar / Überweisung'}
            </div>
          </button>
        </div>
      </Section>

      <div className="border-t border-border pt-4 text-sm">
        {missing.length > 0 ? (
          <span className="text-red-600">
            <strong>{missing.length}</strong> Feld{missing.length === 1 ? '' : 'er'}{' '}
            fehlt noch.
          </span>
        ) : (
          <span className="text-primary">✓ Alle Pflichtfelder ausgefüllt</span>
        )}
      </div>
    </div>
  );
}

function SendPanel({
  inv,
  subject,
  setSubject,
  body,
  setBody,
  sendToEmail,
  setSendToEmail,
  onFocusTpl,
  onChangeLang,
  doPrint,
  onRequestSend,
  sendStatus,
}: {
  inv: Invoice;
  subject: string;
  setSubject: (s: string) => void;
  body: string;
  setBody: (b: string) => void;
  sendToEmail: string;
  setSendToEmail: (e: string) => void;
  onFocusTpl: () => void;
  onChangeLang: (lang: InvoiceLanguage) => void;
  doPrint: () => void;
  onRequestSend: () => void;
  sendStatus: 'idle' | 'sending' | 'sent' | 'error';
}) {
  const lang = (inv.language || 'de') as InvoiceLanguage;
  const isResend = !!inv.sentAt;
  const emailChanged = sendToEmail !== inv.email;

  return (
    <div className="space-y-5">
      <Section title="Empfänger">
        <Field label="An">
          <input
            type="email"
            value={sendToEmail}
            onChange={(e) => setSendToEmail(e.target.value)}
            placeholder="empfaenger@beispiel.de"
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          {emailChanged && (
            <p className="mt-1 text-xs text-amber-700">
              Abweichend von gespeicherter Adresse ({inv.email || '—'}). Die
              Rechnung selbst wird dadurch nicht geändert.
            </p>
          )}
        </Field>
        <p className="text-xs text-text-muted">
          Sprache:{' '}
          <select
            value={lang}
            onChange={(e) => onChangeLang(e.target.value as InvoiceLanguage)}
            className="rounded border border-border px-2 py-1 text-xs"
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="nl">Nederlands</option>
          </select>
        </p>
      </Section>

      <Section title="E-Mail">
        <Field label="Betreff">
          <input
            value={subject}
            onFocus={onFocusTpl}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </Field>
        <Field label="Nachricht">
          <textarea
            rows={10}
            value={body}
            onFocus={onFocusTpl}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-lg border border-border p-3 text-sm focus:border-primary focus:outline-none"
          />
        </Field>
      </Section>

      {isResend && inv.lastResentAt && (
        <div className="rounded-lg bg-secondary border border-border px-3 py-2 text-xs text-text-muted">
          Zuletzt erneut versendet: {new Date(inv.lastResentAt).toLocaleString('de-DE')}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={doPrint}
          className="rounded-lg border border-border bg-white px-4 py-3 text-sm font-semibold hover:bg-secondary"
        >
          ↓ PDF herunterladen
        </button>
        <button
          onClick={onRequestSend}
          disabled={!sendToEmail || sendStatus === 'sending'}
          className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
        >
          {sendStatus === 'sending'
            ? 'Sende…'
            : isResend
            ? '✉ Erneut senden'
            : '✉ E-Mail senden'}
        </button>
      </div>

      <p className="text-xs text-text-muted">
        E-Mail-Versand via{' '}
        <code className="text-text-light">/api/invoice/send</code> (Resend + PDF-Anhang
        — Stufe 2). Aktuell wird PDF lokal gedruckt und Status gesetzt.
      </p>
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
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  missing,
  children,
}: {
  label: string;
  missing?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className={`mb-1 block text-xs font-medium ${
          missing ? 'text-red-600' : 'text-text-light'
        }`}
      >
        {missing && <span className="mr-1">●</span>}
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
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className="mt-1.5 flex items-center gap-2 text-xs text-text-muted cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="h-3.5 w-3.5"
      />
      {label}
    </label>
  );
}
