// =============================================================================
// Erholungs Apartments - Booking API
// =============================================================================

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkAvailability } from '@/lib/availability';
import { calculateTotalPrice, PricingError } from '@/lib/pricing';
import { createCheckoutSession } from '@/lib/stripe';
import { getApartmentById } from '@/lib/constants';
import { BookingStatus } from '@/types';
import type { Booking, PaymentMethod } from '@/types';

// -----------------------------------------------------------------------------
// Validation Helpers
// -----------------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDateString(dateStr: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

// -----------------------------------------------------------------------------
// POST /api/booking
// -----------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      apartmentId,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestEmail,
      guestPhone,
      notes,
      paymentMethod,
    } = body as {
      apartmentId?: string;
      checkIn?: string;
      checkOut?: string;
      guests?: number;
      guestName?: string;
      guestEmail?: string;
      guestPhone?: string;
      notes?: string;
      paymentMethod?: PaymentMethod;
    };

    // -------------------------------------------------------------------------
    // Validate required fields
    // -------------------------------------------------------------------------

    const errors: string[] = [];

    if (!apartmentId) errors.push('Apartment-ID ist erforderlich.');
    if (!checkIn) errors.push('Anreisedatum ist erforderlich.');
    if (!checkOut) errors.push('Abreisedatum ist erforderlich.');
    if (!guests) errors.push('Gästeanzahl ist erforderlich.');
    if (!guestName) errors.push('Name ist erforderlich.');
    if (!guestEmail) errors.push('E-Mail-Adresse ist erforderlich.');
    if (!guestPhone) errors.push('Telefonnummer ist erforderlich.');
    if (!paymentMethod) errors.push('Zahlungsmethode ist erforderlich.');

    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: errors },
        { status: 400 }
      );
    }

    // At this point, all required fields are guaranteed non-null
    const validApartmentId = apartmentId!;
    const validCheckIn = checkIn!;
    const validCheckOut = checkOut!;
    const validGuests = guests!;
    const validGuestName = guestName!;
    const validGuestEmail = guestEmail!;
    const validGuestPhone = guestPhone!;
    const validPaymentMethod = paymentMethod!;

    // -------------------------------------------------------------------------
    // Validate field formats
    // -------------------------------------------------------------------------

    // Apartment exists
    const apartment = getApartmentById(validApartmentId);
    if (!apartment) {
      return NextResponse.json(
        { error: `Apartment "${validApartmentId}" wurde nicht gefunden.` },
        { status: 404 }
      );
    }

    // Date format
    if (!isValidDateString(validCheckIn) || !isValidDateString(validCheckOut)) {
      return NextResponse.json(
        { error: 'Ungültiges Datumsformat. Erwartet: YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    // Check-out after check-in
    if (validCheckOut <= validCheckIn) {
      return NextResponse.json(
        { error: 'Das Abreisedatum muss nach dem Anreisedatum liegen.' },
        { status: 400 }
      );
    }

    // Guest count
    if (
      typeof validGuests !== 'number' ||
      validGuests < 1 ||
      validGuests > apartment.maxGuests
    ) {
      return NextResponse.json(
        {
          error: `Ungültige Gästeanzahl. Erlaubt: 1–${apartment.maxGuests} für ${apartment.name}.`,
        },
        { status: 400 }
      );
    }

    // Email format
    if (!isValidEmail(validGuestEmail)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse.' },
        { status: 400 }
      );
    }

    // Payment method
    if (!['stripe', 'paypal', 'bank_transfer'].includes(validPaymentMethod)) {
      return NextResponse.json(
        { error: 'Ungültige Zahlungsmethode. Erlaubt: stripe, paypal, bank_transfer.' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------------------
    // Check availability
    // -------------------------------------------------------------------------

    const available = await checkAvailability(
      validApartmentId,
      validCheckIn,
      validCheckOut
    );

    if (!available) {
      return NextResponse.json(
        {
          error:
            'Das Apartment ist im gewünschten Zeitraum leider nicht verfügbar. Bitte wählen Sie andere Daten.',
        },
        { status: 409 }
      );
    }

    // -------------------------------------------------------------------------
    // Calculate price server-side
    // -------------------------------------------------------------------------

    let priceCalculation;
    try {
      priceCalculation = calculateTotalPrice(
        apartment.slug,
        validGuests,
        validCheckIn,
        validCheckOut
      );
    } catch (err) {
      if (err instanceof PricingError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    // -------------------------------------------------------------------------
    // Create booking document in Firestore
    // -------------------------------------------------------------------------

    const db = getAdminDb();
    const bookingRef = db.collection('bookings').doc();
    const now = new Date().toISOString();

    const booking: Booking = {
      id: bookingRef.id,
      apartmentId: validApartmentId,
      checkIn: validCheckIn,
      checkOut: validCheckOut,
      guests: validGuests,
      guestName: validGuestName,
      guestEmail: validGuestEmail,
      guestPhone: validGuestPhone,
      totalPrice: priceCalculation.total,
      status: BookingStatus.PENDING,
      paymentId: null,
      paymentMethod: validPaymentMethod,
      createdAt: now,
      notes: notes || undefined,
    };

    await bookingRef.set(booking);

    // -------------------------------------------------------------------------
    // Handle payment method
    // -------------------------------------------------------------------------

    if (validPaymentMethod === 'stripe') {
      const session = await createCheckoutSession(booking);

      // Store the Stripe session ID on the booking
      await bookingRef.update({ paymentId: session.id });

      return NextResponse.json(
        {
          bookingId: booking.id,
          paymentUrl: session.url,
          totalPrice: priceCalculation.total,
          priceDetails: priceCalculation,
        },
        { status: 201 }
      );
    }

    if (validPaymentMethod === 'paypal') {
      return NextResponse.json(
        {
          bookingId: booking.id,
          paymentMethod: 'paypal',
          totalPrice: priceCalculation.total,
          priceDetails: priceCalculation,
        },
        { status: 201 }
      );
    }

    // bank_transfer or other methods
    return NextResponse.json(
      {
        bookingId: booking.id,
        paymentMethod: validPaymentMethod,
        totalPrice: priceCalculation.total,
        priceDetails: priceCalculation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /booking] Fehler:', error);
    return NextResponse.json(
      {
        error:
          'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.',
      },
      { status: 500 }
    );
  }
}
