// =============================================================================
// Invoice Request API - public guest submissions + admin list
// =============================================================================

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { getCurrentAdmin } from '@/lib/auth';
import type { InvoiceRequest } from '@/types/invoice';

const COLLECTION = 'invoiceRequests';

// -----------------------------------------------------------------------------
// Rate-limiting (per IP)
// -----------------------------------------------------------------------------

const attemptMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_HOUR = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attemptMap.get(ip);
  if (!entry || now > entry.resetAt) {
    attemptMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > MAX_PER_HOUR;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of attemptMap) {
      if (now > entry.resetAt) attemptMap.delete(ip);
    }
  }, 30 * 60 * 1000);
}

// -----------------------------------------------------------------------------
// POST - public, creates new invoice request
// -----------------------------------------------------------------------------

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function str(s: unknown, maxLen = 500): string {
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, maxLen);
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown> & {
      website?: string;
    };

    // Honeypot
    if (body.website) {
      // Silent success — bot detected
      return NextResponse.json({ ok: true });
    }

    const fullName = str(body.fullName, 200);
    const email = str(body.email, 200);
    const skipEmail = body.skipEmail === true;
    const company = str(body.company, 200);
    const address = str(body.address, 200);
    const zipCity = str(body.zipCity, 100);
    const bookingNumber = str(body.bookingNumber, 100);
    const skipBookingNumber = body.skipBookingNumber === true;
    const apartmentId = str(body.apartmentId, 100);
    const arrivalDate = str(body.arrivalDate, 20);
    const departureDate = str(body.departureDate, 20);
    const channel = str(body.channel, 50) || 'Direkt';
    const paidAmount =
      typeof body.paidAmount === 'number' && !isNaN(body.paidAmount)
        ? body.paidAmount
        : typeof body.paidAmount === 'string' && body.paidAmount !== ''
        ? Number(body.paidAmount)
        : null;
    const paid = body.paid === true;
    const message = str(body.message, 2000);

    // Required fields
    const errors: string[] = [];
    if (!fullName) errors.push('Name ist erforderlich.');
    if (!skipEmail) {
      if (!email) errors.push('E-Mail ist erforderlich.');
      else if (!isValidEmail(email)) errors.push('Ungültige E-Mail-Adresse.');
    }
    if (!address) errors.push('Adresse ist erforderlich.');
    if (!zipCity) errors.push('PLZ + Stadt sind erforderlich.');
    if (!arrivalDate) errors.push('Anreisedatum ist erforderlich.');
    if (!departureDate) errors.push('Abreisedatum ist erforderlich.');
    if (paidAmount == null || isNaN(Number(paidAmount)) || Number(paidAmount) <= 0) {
      errors.push('Bezahlter Betrag ist erforderlich.');
    }
    if (!skipBookingNumber && !bookingNumber) {
      errors.push('Buchungsnummer ist erforderlich.');
    }
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validierung fehlgeschlagen.', details: errors },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const ref = await db.collection(COLLECTION).add({
      createdAt: new Date().toISOString(),
      fullName,
      email,
      skipEmail,
      company,
      address,
      zipCity,
      bookingNumber,
      skipBookingNumber,
      apartmentId,
      arrivalDate,
      departureDate,
      channel,
      paidAmount: Number(paidAmount),
      paid,
      message,
    });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (error) {
    console.error('[POST /api/invoice-request]', error);
    return NextResponse.json(
      { error: 'Anfrage konnte nicht gespeichert werden.' },
      { status: 500 }
    );
  }
}

// -----------------------------------------------------------------------------
// GET - admin-only, list all open requests
// -----------------------------------------------------------------------------

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db
      .collection(COLLECTION)
      .orderBy('createdAt', 'desc')
      .get();
    const items = snap.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as InvoiceRequest
    );
    return NextResponse.json({ items });
  } catch (error) {
    console.error('[GET /api/invoice-request]', error);
    return NextResponse.json({ error: 'Fehler beim Laden.' }, { status: 500 });
  }
}
