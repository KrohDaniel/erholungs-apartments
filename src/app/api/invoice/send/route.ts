// =============================================================================
// Invoice Send API - emails PDF via Resend, updates Firestore status.
// STAGE 2: Implement with @react-pdf/renderer (server-side PDF) + Resend.
// For now this returns 501 — the UI falls back to local print + status update.
// =============================================================================

import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';

export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(
    {
      error:
        'E-Mail-Versand noch nicht eingerichtet. Bitte PDF manuell drucken (Stufe 2 fügt automatischen Versand hinzu).',
    },
    { status: 501 }
  );
}
