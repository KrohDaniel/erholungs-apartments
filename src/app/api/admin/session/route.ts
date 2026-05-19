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

// -----------------------------------------------------------------------------
// Brute-force protection: rate-limit by IP
// -----------------------------------------------------------------------------

const attemptMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attemptMap.get(ip);
  if (!entry || now > entry.resetAt) {
    attemptMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_ATTEMPTS;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of attemptMap) {
      if (now > entry.resetAt) attemptMap.delete(ip);
    }
  }, 30 * 60 * 1000);
}

// -----------------------------------------------------------------------------

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          'Zu viele Anmeldeversuche. Bitte 15 Minuten warten und erneut versuchen.',
      },
      { status: 429 }
    );
  }

  try {
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken) {
      return NextResponse.json({ error: 'idToken fehlt.' }, { status: 400 });
    }

    // Verify the ID token (incl. revocation check) and admin claim
    const decoded = await getAdminAuth().verifyIdToken(idToken, true);
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
