// =============================================================================
// Invoice Repository (Client-Side Firestore)
// =============================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';
import type { Invoice } from '@/types/invoice';

const COLLECTION = 'invoices';

function normalizeInvoice(data: Record<string, unknown>): Invoice {
  const out: Record<string, unknown> = { ...data };
  // Convert any Firestore Timestamps back to ISO strings
  for (const k of ['createdAt', 'sentAt', 'updatedAt', 'cancelledAt']) {
    const v = out[k];
    if (v instanceof Timestamp) {
      out[k] = v.toDate().toISOString();
    }
  }
  return out as unknown as Invoice;
}

export async function listInvoices(): Promise<Invoice[]> {
  const db = getDb();
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => normalizeInvoice({ id: d.id, ...d.data() }));
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const db = getDb();
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return normalizeInvoice({ id: snap.id, ...snap.data() });
}

export async function upsertInvoice(inv: Invoice): Promise<Invoice> {
  const db = getDb();
  const { id, ...data } = inv;
  await setDoc(doc(db, COLLECTION, id), data, { merge: true });
  return inv;
}

export async function deleteInvoice(id: string): Promise<void> {
  const db = getDb();
  await deleteDoc(doc(db, COLLECTION, id));
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
