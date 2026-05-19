// =============================================================================
// Single invoice-request - admin only
// =============================================================================

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { getCurrentAdmin } from '@/lib/auth';

const COLLECTION = 'invoiceRequests';

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
    const snap = await db.collection(COLLECTION).doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ request: { id: snap.id, ...snap.data() } });
  } catch (error) {
    console.error('[GET /api/invoice-request/:id]', error);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}

export async function DELETE(
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
    await db.collection(COLLECTION).doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/invoice-request/:id]', error);
    return NextResponse.json({ error: 'Fehler beim Löschen.' }, { status: 500 });
  }
}
