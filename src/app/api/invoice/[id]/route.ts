// =============================================================================
// Single invoice get & delete API
// =============================================================================

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminDb } from '@/lib/firebase-admin';

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
    return NextResponse.json({ invoice: { id: snap.id, ...snap.data() } });
  } catch (error) {
    console.error('[GET /api/invoice/:id]', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden.' },
      { status: 500 }
    );
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
    await db.collection('invoices').doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[DELETE /api/invoice/:id]', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen.' },
      { status: 500 }
    );
  }
}
