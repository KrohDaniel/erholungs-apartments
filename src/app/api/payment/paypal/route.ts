// =============================================================================
// Erholungs Apartments - PayPal Payment API Routes
// =============================================================================

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { createPayPalOrder, capturePayPalOrder } from '@/lib/paypal';
import { getApartmentById } from '@/lib/constants';
import { sendBookingConfirmation, sendBookingNotification } from '@/lib/email';
import type { Booking } from '@/types';

// -----------------------------------------------------------------------------
// POST - Create PayPal Order
// -----------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Buchungs-ID ist erforderlich.' },
        { status: 400 }
      );
    }

    // Fetch booking from Firestore
    const db = getAdminDb();
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json(
        { error: 'Buchung nicht gefunden.' },
        { status: 404 }
      );
    }

    const booking = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;

    // Validate booking status
    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Diese Buchung kann nicht mehr bezahlt werden.' },
        { status: 400 }
      );
    }

    // Build description
    const apartment = getApartmentById(booking.apartmentId);
    const apartmentName = apartment?.name ?? booking.apartmentId;
    const description = `Erholungs Apartments - Buchung ${apartmentName} ${booking.checkIn} bis ${booking.checkOut}`;

    // Create PayPal order
    const order = await createPayPalOrder(
      bookingId,
      booking.totalPrice,
      description
    );

    if (!order.id) {
      return NextResponse.json(
        { error: 'PayPal-Bestellung konnte nicht erstellt werden.' },
        { status: 500 }
      );
    }

    // Store PayPal order ID in the booking document
    await bookingRef.update({
      paypalOrderId: order.id,
    });

    // Find the approval URL from HATEOAS links
    const approvalUrl =
      order.links?.find((link) => link.rel === 'payer-action')?.href ??
      order.links?.find((link) => link.rel === 'approve')?.href ??
      null;

    return NextResponse.json({
      orderId: order.id,
      approvalUrl,
    });
  } catch (error) {
    console.error('PayPal POST error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Ein unerwarteter Fehler ist aufgetreten.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// -----------------------------------------------------------------------------
// PUT - Capture / Complete PayPal Order
// -----------------------------------------------------------------------------

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, orderId } = body;

    if (!bookingId || !orderId) {
      return NextResponse.json(
        { error: 'Buchungs-ID und PayPal-Bestell-ID sind erforderlich.' },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const capturedOrder = await capturePayPalOrder(orderId);

    // Verify the order was completed
    if (capturedOrder.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          error: `Zahlung nicht abgeschlossen. Status: ${capturedOrder.status}`,
        },
        { status: 400 }
      );
    }

    // Extract payment ID from capture
    const captureId =
      capturedOrder.purchaseUnits?.[0]?.payments?.captures?.[0]?.id ?? orderId;

    // Update booking in Firestore
    const db = getAdminDb();
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json(
        { error: 'Buchung nicht gefunden.' },
        { status: 404 }
      );
    }

    await bookingRef.update({
      status: 'PAID',
      paymentId: captureId,
      paymentMethod: 'paypal',
    });

    // Fetch updated booking for email
    const updatedSnap = await bookingRef.get();
    const updatedBooking = {
      id: updatedSnap.id,
      ...updatedSnap.data(),
    } as Booking;

    // Send confirmation emails (fire-and-forget with error logging)
    try {
      await Promise.all([
        sendBookingConfirmation(updatedBooking),
        sendBookingNotification(updatedBooking),
      ]);
    } catch (emailError) {
      // Log email errors but don't fail the payment response
      console.error('Fehler beim E-Mail-Versand:', emailError);
    }

    return NextResponse.json({
      success: true,
      bookingId,
    });
  } catch (error) {
    console.error('PayPal PUT error:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Ein unerwarteter Fehler ist aufgetreten.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
