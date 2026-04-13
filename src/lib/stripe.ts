// =============================================================================
// Erholungs Apartments - Stripe Configuration
// =============================================================================

import Stripe from 'stripe';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { getApartmentById } from '@/lib/constants';
import { SITE_CONFIG } from '@/lib/constants';
import { calculateTotalPrice } from '@/lib/pricing';
import type { Booking } from '@/types';

// -----------------------------------------------------------------------------
// Stripe Instance
// -----------------------------------------------------------------------------

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd.MM.yyyy', { locale: de });
}

// -----------------------------------------------------------------------------
// Create Checkout Session
// -----------------------------------------------------------------------------

/**
 * Creates a Stripe Checkout Session for a booking.
 * The session uses EUR as currency and redirects to the booking confirmation
 * page upon success.
 */
/**
 * Validates booking fields before processing. Throws on invalid input.
 */
function validateBookingInput(booking: Booking): void {
  // Validate apartmentId against known apartments
  const apartment = getApartmentById(booking.apartmentId);
  if (!apartment) {
    throw new Error(`Ungültige Apartment-ID: ${booking.apartmentId}`);
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(booking.guestEmail)) {
    throw new Error('Ungültige E-Mail-Adresse.');
  }

  // Validate date format (YYYY-MM-DD) and logical order
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(booking.checkIn) || !dateRegex.test(booking.checkOut)) {
    throw new Error('Ungültiges Datumsformat. Erwartet: YYYY-MM-DD.');
  }
  if (booking.checkIn >= booking.checkOut) {
    throw new Error('Das Abreisedatum muss nach dem Anreisedatum liegen.');
  }

  // Validate guest count
  if (!Number.isInteger(booking.guests) || booking.guests < 1 || booking.guests > apartment.maxGuests) {
    throw new Error(`Ungültige Gästeanzahl. Erlaubt: 1–${apartment.maxGuests}.`);
  }
}

export async function createCheckoutSession(
  booking: Booking
): Promise<Stripe.Checkout.Session> {
  // Validate all input fields
  validateBookingInput(booking);

  const apartment = getApartmentById(booking.apartmentId)!;
  const apartmentName = apartment.name;
  const siteUrl = `https://${SITE_CONFIG.domain}`;

  // Recalculate price server-side — never trust client-supplied totalPrice
  const priceResult = calculateTotalPrice(
    booking.apartmentId,
    booking.guests,
    booking.checkIn,
    booking.checkOut
  );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    locale: 'de',
    customer_email: booking.guestEmail,
    metadata: {
      bookingId: booking.id,
      apartmentId: booking.apartmentId,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: String(booking.guests),
    },
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: apartmentName,
            description: `${formatDate(booking.checkIn)} – ${formatDate(booking.checkOut)} | ${booking.guests} ${booking.guests === 1 ? 'Person' : 'Personen'}`,
          },
          unit_amount: Math.round(priceResult.total * 100), // Stripe expects cents
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/buchen/bestaetigung?session_id={CHECKOUT_SESSION_ID}&booking_id=${encodeURIComponent(booking.id)}`,
    cancel_url: `${siteUrl}/buchen/bestaetigung?cancelled=true&booking_id=${encodeURIComponent(booking.id)}`,
  });

  return session;
}

// -----------------------------------------------------------------------------
// Webhook Handler
// -----------------------------------------------------------------------------

export type WebhookResult = {
  type: string;
  bookingId: string | null;
  paymentIntentId: string | null;
};

/**
 * Validates a Stripe webhook signature and processes the event.
 *
 * @param body - raw request body (Buffer or string)
 * @param signature - Stripe-Signature header value
 * @returns parsed event details relevant to bookings
 */
export async function handleWebhook(
  body: string | Buffer,
  signature: string
): Promise<WebhookResult> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured.');
  }

  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  let bookingId: string | null = null;
  let paymentIntentId: string | null = null;

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      bookingId = session.metadata?.bookingId ?? null;
      paymentIntentId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id ?? null;
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      bookingId = session.metadata?.bookingId ?? null;
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      bookingId = intent.metadata?.bookingId ?? null;
      paymentIntentId = intent.id;
      break;
    }

    default:
      // Unhandled event type -- no-op
      break;
  }

  return {
    type: event.type,
    bookingId,
    paymentIntentId,
  };
}
