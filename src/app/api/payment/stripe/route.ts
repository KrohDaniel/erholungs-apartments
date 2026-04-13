// =============================================================================
// Stripe Webhook API (disabled - bookings via Booking.com)
// =============================================================================

import { NextResponse } from 'next/server';

// -----------------------------------------------------------------------------
// Simple In-Memory Rate Limiting
// -----------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { error: 'Stripe-Zahlungen sind deaktiviert. Buchungen erfolgen ueber Booking.com.' },
    { status: 410 }
  );
}
