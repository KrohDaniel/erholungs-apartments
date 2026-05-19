// =============================================================================
// Convert invoice-request → invoice (draft) and delete the request
// =============================================================================

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { getCurrentAdmin } from '@/lib/auth';
import type { Invoice, InvoiceRequest } from '@/types/invoice';

const REQUEST_COLLECTION = 'invoiceRequests';
const INVOICE_COLLECTION = 'invoices';

function newInvoiceId(): string {
  return 'inv_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

async function nextInvoiceNumber(
  db: FirebaseFirestore.Firestore
): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  const snap = await db.collection(INVOICE_COLLECTION).get();
  const nums = snap.docs
    .map((d) => (d.data().invoiceNumber as string) || '')
    .filter((s) => s.startsWith(prefix))
    .map((s) => parseInt(s.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return prefix + String(next).padStart(3, '0');
}

async function nextCustomerNumber(
  db: FirebaseFirestore.Firestore
): Promise<string> {
  const snap = await db.collection(INVOICE_COLLECTION).get();
  const nums = snap.docs
    .map((d) => parseInt(d.data().customerNumber as string, 10))
    .filter((n) => !isNaN(n));
  return String((nums.length ? Math.max(...nums) : 100) + 1);
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const db = getAdminDb();
    const reqRef = db.collection(REQUEST_COLLECTION).doc(id);
    const reqSnap = await reqRef.get();
    if (!reqSnap.exists) {
      return NextResponse.json({ error: 'Anfrage nicht gefunden.' }, { status: 404 });
    }
    const req = { id: reqSnap.id, ...reqSnap.data() } as InvoiceRequest;

    const [invoiceNumber, customerNumber] = await Promise.all([
      nextInvoiceNumber(db),
      nextCustomerNumber(db),
    ]);
    const invoiceId = newInvoiceId();

    const invoice: Omit<Invoice, 'id'> = {
      invoiceNumber,
      customerNumber,
      status: 'draft',
      createdAt: new Date().toISOString(),
      fullName: req.fullName || '',
      email: req.email || '',
      skipEmail: req.skipEmail,
      company: req.company || '',
      address: req.address || '',
      zipCity: req.zipCity || '',
      language: 'de',
      bookingNumber: req.bookingNumber || '',
      skipBookingNumber: req.skipBookingNumber,
      apartmentId: req.apartmentId || '',
      arrivalDate: req.arrivalDate || '',
      departureDate: req.departureDate || '',
      channel: req.channel || 'Direkt',
      paidAmount: req.paidAmount ?? null,
      paid: req.paid ?? false,
    };

    const batch = db.batch();
    batch.set(db.collection(INVOICE_COLLECTION).doc(invoiceId), invoice);
    batch.delete(reqRef);
    await batch.commit();

    return NextResponse.json({ ok: true, invoiceId });
  } catch (error) {
    console.error('[POST /api/invoice-request/:id/convert]', error);
    return NextResponse.json(
      { error: 'Konvertierung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
