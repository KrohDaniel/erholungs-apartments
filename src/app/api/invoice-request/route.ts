// =============================================================================
// Invoice Request API - public guest submissions + admin list
// =============================================================================

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getAdminDb } from '@/lib/firebase-admin';
import { getCurrentAdmin } from '@/lib/auth';
import { INVOICE_APARTMENTS, INVOICE_CONFIG } from '@/lib/invoice-constants';
import { dateShort, eur, nights } from '@/lib/invoice-format';
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
      turnstileToken?: string;
    };

    // Honeypot
    if (body.website) {
      // Silent success — bot detected
      return NextResponse.json({ ok: true });
    }

    // Cloudflare Turnstile verification (if configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : '';
      if (!token) {
        return NextResponse.json(
          { error: 'Bitte bestätigen Sie, dass Sie kein Roboter sind.' },
          { status: 400 }
        );
      }
      try {
        const verify = await fetch(
          'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret: turnstileSecret,
              response: token,
              remoteip: ip,
            }),
          }
        );
        const result = (await verify.json()) as { success: boolean };
        if (!result.success) {
          return NextResponse.json(
            { error: 'Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen.' },
            { status: 403 }
          );
        }
      } catch (err) {
        console.error('[Turnstile verify]', err);
        return NextResponse.json(
          { error: 'Sicherheitsprüfung nicht möglich.' },
          { status: 502 }
        );
      }
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
    const requestData = {
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
    };
    const ref = await db.collection(COLLECTION).add(requestData);

    // Notify owner by e-mail (best-effort, never fail the request)
    try {
      await notifyOwner(ref.id, requestData);
    } catch (notifyErr) {
      console.error('[Invoice Request notify]', notifyErr);
    }

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

// -----------------------------------------------------------------------------
// Notify owner by email
// -----------------------------------------------------------------------------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function notifyOwner(
  id: string,
  data: {
    fullName: string;
    email: string;
    skipEmail: boolean;
    company: string;
    address: string;
    zipCity: string;
    apartmentId: string;
    arrivalDate: string;
    departureDate: string;
    channel: string;
    bookingNumber: string;
    paidAmount: number;
    paid: boolean;
    message: string;
  }
) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const apt = INVOICE_APARTMENTS.find((a) => a.id === data.apartmentId);
  const aptName = apt ? apt.name : data.apartmentId || '—';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    `https://${INVOICE_CONFIG.domain}`;
  const reviewLink = `${siteUrl}/rechnungen/anfrage/${id}/`;

  const resend = new Resend(resendKey);

  const subject = `Neue Rechnungsanfrage: ${data.fullName}`;
  const rows: [string, string][] = [
    ['Gast', data.fullName],
    ['E-Mail', data.skipEmail ? '— (keine angegeben)' : data.email],
    ['Adresse', `${data.address}, ${data.zipCity}`],
    ['Apartment', aptName],
    [
      'Aufenthalt',
      `${dateShort(data.arrivalDate)} – ${dateShort(data.departureDate)} (${nights(
        data.arrivalDate,
        data.departureDate
      )} Nächte)`,
    ],
    ['Kanal', data.channel],
    ['Buchungsnr.', data.bookingNumber || '—'],
    ['Betrag', eur(data.paidAmount)],
    ['Bezahlt', data.paid ? 'Ja' : 'Nein'],
  ];
  if (data.company) rows.unshift(['Firma', data.company]);

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;color:#555;font-size:13px;width:30%;border-bottom:1px solid #eee;">${escapeHtml(label)}</td><td style="padding:8px 12px;font-weight:600;font-size:13px;border-bottom:1px solid #eee;">${escapeHtml(String(value))}</td></tr>`
    )
    .join('');

  const messageBlock = data.message
    ? `<div style="background:#F5EFE6;border-left:4px solid #C9A84C;padding:14px 18px;margin:18px 0;border-radius:0 4px 4px 0;"><strong>Nachricht vom Gast:</strong><br/><br/>${escapeHtml(data.message).replace(/\n/g, '<br/>')}</div>`
    : '';

  const html = `
    <div style="font-family:'Segoe UI',Tahoma,sans-serif;max-width:600px;margin:0 auto;background:#FAFAF7;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
      <div style="background:#2D5016;color:#fff;padding:24px 32px;text-align:center;">
        <h1 style="margin:0;font-size:20px;">📩 Neue Rechnungsanfrage</h1>
      </div>
      <div style="padding:24px 32px;color:#1A1A1A;line-height:1.55;">
        <p>Eine neue Rechnungsanfrage wurde über das Formular auf der Website eingereicht:</p>
        <table style="width:100%;border-collapse:collapse;margin:18px 0;">
          <tbody>${tableRows}</tbody>
        </table>
        ${messageBlock}
        <p style="margin-top:24px;text-align:center;">
          <a href="${reviewLink}" style="display:inline-block;padding:12px 22px;background:#2D5016;color:#fff;font-weight:600;border-radius:8px;text-decoration:none;">
            → Anfrage prüfen &amp; Rechnung erstellen
          </a>
        </p>
      </div>
      <div style="background:#f5f5f0;padding:14px 32px;text-align:center;color:#666;font-size:12px;border-top:1px solid #e0e0e0;">
        Automatische Benachrichtigung · ${INVOICE_CONFIG.domain}
      </div>
    </div>
  `;

  const fromAddress = `${INVOICE_CONFIG.name} <noreply@${INVOICE_CONFIG.domain}>`;
  await resend.emails.send({
    from: fromAddress,
    to: INVOICE_CONFIG.email,
    replyTo: data.skipEmail || !data.email ? INVOICE_CONFIG.email : data.email,
    subject,
    html,
  });
}

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
