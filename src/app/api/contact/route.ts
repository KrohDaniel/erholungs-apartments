// =============================================================================
// Erholungs Apartments - Contact Form API
// =============================================================================

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SITE_CONFIG } from '@/lib/constants';

// -----------------------------------------------------------------------------
// Resend Client
// -----------------------------------------------------------------------------

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = `Erholungs Apartments <noreply@${SITE_CONFIG.domain}>`;

// -----------------------------------------------------------------------------
// Simple In-Memory Rate Limiting
// -----------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 requests per window per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

// Periodically clean up stale entries to prevent memory leaks
function cleanUpRateLimitMap() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}

// Clean up every 30 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanUpRateLimitMap, 30 * 60 * 1000);
}

// -----------------------------------------------------------------------------
// Validation Helpers
// -----------------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// -----------------------------------------------------------------------------
// POST /api/contact
// -----------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            'Zu viele Anfragen. Bitte versuchen Sie es in einigen Minuten erneut.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    const { name, email, phone, subject, message, turnstileToken } = body as {
      name?: string;
      email?: string;
      phone?: string;
      subject?: string;
      message?: string;
      turnstileToken?: string;
    };

    // -------------------------------------------------------------------------
    // Honeypot check (field "website" should not be filled by real users)
    // -------------------------------------------------------------------------

    if (body.website) {
      // Bot detected — return fake success
      return NextResponse.json({ success: true, message: 'Nachricht gesendet.' });
    }

    // -------------------------------------------------------------------------
    // Cloudflare Turnstile verification
    // -------------------------------------------------------------------------

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret && turnstileToken) {
      const turnstileResponse = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: turnstileSecret,
            response: turnstileToken,
            remoteip: ip,
          }),
        }
      );

      const turnstileResult = await turnstileResponse.json() as { success: boolean };

      if (!turnstileResult.success) {
        return NextResponse.json(
          { error: 'Sicherheitsprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.' },
          { status: 403 }
        );
      }
    } else if (turnstileSecret && !turnstileToken) {
      // Secret is configured but no token sent — likely a bot skipping the widget
      return NextResponse.json(
        { error: 'Bitte bestätigen Sie, dass Sie kein Roboter sind.' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // Validate required fields
    // -------------------------------------------------------------------------

    const errors: string[] = [];

    if (!name || name.trim().length === 0) {
      errors.push('Name ist erforderlich.');
    }

    if (!email || email.trim().length === 0) {
      errors.push('E-Mail-Adresse ist erforderlich.');
    } else if (!isValidEmail(email)) {
      errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    }

    if (!message || message.trim().length === 0) {
      errors.push('Nachricht ist erforderlich.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: errors },
        { status: 400 }
      );
    }

    // Sanitize values
    const safeName = escapeHtml(name!.trim());
    const safeEmail = escapeHtml(email!.trim());
    const safePhone = phone ? escapeHtml(phone.trim()) : '–';
    const safeSubject = subject ? escapeHtml(subject.trim()) : 'Allgemeine Anfrage';
    const safeMessage = escapeHtml(message!.trim());

    // -------------------------------------------------------------------------
    // Send email to owner
    // -------------------------------------------------------------------------

    const emailSubject = `Kontaktanfrage: ${safeSubject}`;

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FAFAF7; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #2D5016; color: #ffffff; padding: 24px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Neue Kontaktanfrage</h1>
        </div>
        <div style="padding: 32px; color: #1A1A1A; line-height: 1.6;">
          <p>Es ist eine neue Kontaktanfrage über die Website eingegangen:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; color: #555; font-size: 14px; width: 30%; vertical-align: top;">Name</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; font-size: 14px;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; color: #555; font-size: 14px; width: 30%; vertical-align: top;">E-Mail</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; font-size: 14px;">
                <a href="mailto:${safeEmail}">${safeEmail}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; color: #555; font-size: 14px; width: 30%; vertical-align: top;">Telefon</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; font-size: 14px;">${safePhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; color: #555; font-size: 14px; width: 30%; vertical-align: top;">Betreff</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #e0e0e0; font-weight: 600; font-size: 14px;">${safeSubject}</td>
            </tr>
          </table>

          <div style="background-color: #F5EFE6; border-left: 4px solid #C9A84C; padding: 16px 20px; margin: 24px 0; border-radius: 0 4px 4px 0;">
            <strong>Nachricht:</strong><br /><br />
            ${safeMessage.replace(/\n/g, '<br />')}
          </div>
        </div>
        <div style="background-color: #f5f5f0; padding: 20px 32px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0;">
          Diese Nachricht wurde über das Kontaktformular auf ${SITE_CONFIG.domain} gesendet.
        </div>
      </div>
    `;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: SITE_CONFIG.email,
      replyTo: email!.trim(),
      subject: emailSubject,
      html,
    });

    return NextResponse.json({
      success: true,
      message:
        'Vielen Dank für Ihre Nachricht! Wir werden uns so schnell wie möglich bei Ihnen melden.',
    });
  } catch (error) {
    console.error('[API /contact] Fehler:', error);
    return NextResponse.json(
      {
        error:
          'Ihre Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt per Telefon.',
      },
      { status: 500 }
    );
  }
}
