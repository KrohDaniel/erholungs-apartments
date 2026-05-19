// =============================================================================
// Invoice list & create API
// =============================================================================

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { getAdminDb } from '@/lib/firebase-admin';
import type { Invoice } from '@/types/invoice';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db
      .collection('invoices')
      .orderBy('createdAt', 'desc')
      .get();
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ items });
  } catch (error) {
    console.error('[GET /api/invoice]', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const inv = (await request.json()) as Invoice;
    if (!inv.id) {
      return NextResponse.json({ error: 'id fehlt' }, { status: 400 });
    }
    const db = getAdminDb();
    const ref = db.collection('invoices').doc(inv.id);

    // GoBD: einmal versendet → Rechnungsdaten unveränderbar.
    // Erlaubt sind nur Versand-Meta-Daten (Sprache, sentAt, Status-Wechsel zu cancelled).
    const existing = await ref.get();
    if (existing.exists && existing.data()?.status === 'sent') {
      const prev = existing.data() as Invoice;
      const immutableKeys: (keyof Invoice)[] = [
        'invoiceNumber', 'customerNumber', 'fullName', 'email', 'company',
        'address', 'zipCity', 'bookingNumber', 'apartmentId',
        'arrivalDate', 'departureDate', 'channel', 'paidAmount',
        'createdAt', 'skipEmail', 'skipBookingNumber',
      ];
      const changed = immutableKeys.filter((k) => {
        const a = (prev as unknown as Record<string, unknown>)[k];
        const b = (inv as unknown as Record<string, unknown>)[k];
        return a !== undefined && a !== b && b !== undefined;
      });
      if (changed.length > 0) {
        return NextResponse.json(
          {
            error: `Versendete Rechnung kann nicht bearbeitet werden (geänderte Felder: ${changed.join(', ')}). Nur Sprache/Storno änderbar.`,
          },
          { status: 409 }
        );
      }
    }

    const { id, ...data } = inv;
    void id;
    await ref.set(data, { merge: true });
    return NextResponse.json({ ok: true, id: inv.id });
  } catch (error) {
    console.error('[POST /api/invoice]', error);
    return NextResponse.json(
      { error: 'Fehler beim Speichern.' },
      { status: 500 }
    );
  }
}
