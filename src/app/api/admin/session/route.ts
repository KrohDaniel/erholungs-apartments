// =============================================================================
// Admin session API - exchanges Firebase ID token for HTTP-only session cookie
// =============================================================================

import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase-admin';
import {
  createSessionCookie,
  setSessionCookie,
  clearSessionCookie,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: 'idToken fehlt.' }, { status: 400 });
    }

    // Verify the ID token and admin claim before issuing a session
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    if (!decoded.admin) {
      return NextResponse.json(
        { error: 'Kein Admin-Zugriff.' },
        { status: 403 }
      );
    }

    const sessionCookie = await createSessionCookie(idToken);
    await setSessionCookie(sessionCookie);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[API /admin/session POST]', error);
    return NextResponse.json(
      { error: 'Anmeldung fehlgeschlagen.' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
