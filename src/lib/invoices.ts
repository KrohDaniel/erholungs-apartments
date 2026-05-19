// =============================================================================
// Invoice Repository (Client-Side) — uses /api/invoice/* routes
// All actual data access happens server-side with the Firebase Admin SDK
// after verifying the admin session cookie.
// =============================================================================

import type { Invoice } from '@/types/invoice';

export async function listInvoices(): Promise<Invoice[]> {
  const res = await fetch('/api/invoice', { credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Fehler beim Laden.');
  }
  const data = (await res.json()) as { items: Invoice[] };
  return data.items;
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const res = await fetch(`/api/invoice/${encodeURIComponent(id)}`, {
    credentials: 'include',
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Fehler beim Laden.');
  }
  const data = (await res.json()) as { invoice: Invoice };
  return data.invoice;
}

export async function upsertInvoice(inv: Invoice): Promise<Invoice> {
  const res = await fetch('/api/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inv),
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Fehler beim Speichern.');
  }
  return inv;
}

export async function deleteInvoice(id: string): Promise<void> {
  const res = await fetch(`/api/invoice/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Fehler beim Löschen.');
  }
}

/** Generate next invoice number in current year, format YYYY-NNN */
export async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  const items = await listInvoices();
  const nums = items
    .map((x) => x.invoiceNumber || '')
    .filter((s) => s.startsWith(prefix))
    .map((s) => parseInt(s.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return prefix + String(next).padStart(3, '0');
}

/** Generate next customer number (max + 1, starting from 100) */
export async function nextCustomerNumber(): Promise<string> {
  const items = await listInvoices();
  const nums = items
    .map((x) => parseInt(x.customerNumber, 10))
    .filter((n) => !isNaN(n));
  return String((nums.length ? Math.max(...nums) : 100) + 1);
}

export function newInvoiceId(): string {
  return 'inv_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
