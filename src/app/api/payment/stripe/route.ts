// =============================================================================
// Erholungs Apartments - Stripe Webhook API
// =============================================================================

import { NextResponse } from 'next/server';
import { handleWebhook } from '@/lib/stripe';
import { getAdminDb } from '@/lib/firebase-admin';
import { sendBookingConfirmation, sendBookingNotification } from '@/lib/email';
import { BookingStatus } from '@/types';
import type { Booking } from '@/types';

// -----------------------------------------------------------------------------
// POST /api/payment/stripe (Stripe Webhook)
// -----------------------------------------------------------------------------

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Stripe-Signature Header fehlt.' },
      { status: 400 }
    );
  }

  // Read the raw body as text (important for webhook signature verification)
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      { error: 'Request-Body konnte nicht gelesen werden.' },
      { status: 400 }
    );
  }

  // Verify signature and parse event
  let webhookResult;
  try {
    webhookResult = await handleWebhook(rawBody, signature);
  } catch (error) {
    console.error('[Stripe Webhook] Signaturverifizierung fehlgeschlagen:', error);
    return NextResponse.json(
      { error: 'Webhook-Signatur ungültig.' },
      { status: 400 }
    );
  }

  const db = getAdminDb();

  try {
    switch (webhookResult.type) {
      // -----------------------------------------------------------------------
      // checkout.session.completed - Payment successful
      // -----------------------------------------------------------------------
      case 'checkout.session.completed': {
        const { bookingId, paymentIntentId } = webhookResult;

        if (!bookingId) {
          console.warn('[Stripe Webhook] checkout.session.completed ohne bookingId.');
          break;
        }

        const bookingRef = db.collection('bookings').doc(bookingId);
        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
          console.error(
            `[Stripe Webhook] Buchung "${bookingId}" nicht gefunden.`
          );
          break;
        }

        // Update booking status to PAID
        await bookingRef.update({
          status: BookingStatus.PAID,
          paymentId: paymentIntentId ?? null,
        });

        // Get the updated booking data for email
        const booking = {
          ...bookingDoc.data(),
          id: bookingDoc.id,
          status: BookingStatus.PAID,
          paymentId: paymentIntentId ?? null,
        } as Booking;

        // Send confirmation email to guest
        try {
          await sendBookingConfirmation(booking);
        } catch (emailError) {
          console.error(
            '[Stripe Webhook] Bestätigungs-E-Mail konnte nicht gesendet werden:',
            emailError
          );
        }

        // Send notification email to owner
        try {
          await sendBookingNotification(booking);
        } catch (emailError) {
          console.error(
            '[Stripe Webhook] Benachrichtigungs-E-Mail konnte nicht gesendet werden:',
            emailError
          );
        }

        console.log(
          `[Stripe Webhook] Buchung "${bookingId}" erfolgreich als PAID markiert.`
        );
        break;
      }

      // -----------------------------------------------------------------------
      // checkout.session.expired - Session expired without payment
      // -----------------------------------------------------------------------
      case 'checkout.session.expired': {
        const { bookingId } = webhookResult;

        if (!bookingId) {
          console.warn('[Stripe Webhook] checkout.session.expired ohne bookingId.');
          break;
        }

        const bookingRef = db.collection('bookings').doc(bookingId);
        const bookingDoc = await bookingRef.get();

        if (!bookingDoc.exists) {
          console.error(
            `[Stripe Webhook] Buchung "${bookingId}" nicht gefunden.`
          );
          break;
        }

        // Only cancel if still PENDING (avoid overwriting a completed payment)
        const currentStatus = bookingDoc.data()?.status;
        if (currentStatus === BookingStatus.PENDING) {
          await bookingRef.update({
            status: BookingStatus.CANCELLED,
          });

          console.log(
            `[Stripe Webhook] Buchung "${bookingId}" als CANCELLED markiert (Session abgelaufen).`
          );
        }
        break;
      }

      // -----------------------------------------------------------------------
      // payment_intent.payment_failed - Payment failed
      // -----------------------------------------------------------------------
      case 'payment_intent.payment_failed': {
        const { bookingId } = webhookResult;

        if (bookingId) {
          console.warn(
            `[Stripe Webhook] Zahlung fehlgeschlagen für Buchung "${bookingId}".`
          );
        }
        break;
      }

      default:
        // Unhandled event type - acknowledge receipt
        console.log(`[Stripe Webhook] Unbehandeltes Event: ${webhookResult.type}`);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Stripe Webhook] Verarbeitungsfehler:', error);
    return NextResponse.json(
      { error: 'Webhook-Verarbeitung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
