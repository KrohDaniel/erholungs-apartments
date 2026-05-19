// =============================================================================
// Auth helpers - Session cookie creation & verification
// =============================================================================

import { cookies } from 'next/headers';
import { getAdminAuth } from './firebase-admin';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION_MS = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionCookie(idToken: string): Promise<string> {
  const auth = getAdminAuth();
  return auth.createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
}

export async function setSessionCookie(sessionCookie: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    maxAge: SESSION_DURATION_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<{ uid: string; email?: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;

  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifySessionCookie(session, true);
    if (!decoded.admin) return null;
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = SESSION_COOKIE_NAME;
