// =============================================================================
// Invoice PDF download API - renders & returns the invoice PDF
// =============================================================================

import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminDb } from '@/lib/firebase-admin';
import { InvoicePdfDocument } from '@/components/invoice/InvoicePdfDocument';
import type { Invoice } from '@/types/invoice';

export async function GET(
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
    const snap = await db.collection('invoices').doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    const invoice = { id: snap.id, ...snap.data() } as Invoice;

    const pdfBuffer = await renderToBuffer(<InvoicePdfDocument inv={invoice} />);
    const lastName = (invoice.fullName || 'Gast').split(/\s+/).slice(-1)[0];
    const safeLast = lastName.replace(/[^a-zA-Z0-9äöüÄÖÜß-]/g, '');
    const filename = `Rechnung_${invoice.invoiceNumber || 'Entwurf'}_${safeLast}.pdf`;

    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      },
    });
  } catch (error) {
    console.error('[GET /api/invoice/:id/pdf]', error);
    return NextResponse.json(
      { error: 'PDF konnte nicht erzeugt werden.' },
      { status: 500 }
    );
  }
}
