// =============================================================================
// Invoice Repository (Server-Side / Admin SDK)
// =============================================================================

import { getAdminDb } from './firebase-admin';
import type { Invoice } from '@/types/invoice';

const COLLECTION = 'invoices';

export async function getInvoiceAdmin(id: string): Promise<Invoice | null> {
  const db = getAdminDb();
  const snap = await db.collection(COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as Invoice;
}

export async function updateInvoiceAdmin(
  id: string,
  patch: Partial<Invoice>
): Promise<void> {
  const db = getAdminDb();
  await db.collection(COLLECTION).doc(id).update(patch);
}

export async function listInvoicesAdmin(): Promise<Invoice[]> {
  const db = getAdminDb();
  const snap = await db.collection(COLLECTION).orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Invoice);
}
