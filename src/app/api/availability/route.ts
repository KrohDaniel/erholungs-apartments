// =============================================================================
// Erholungs Apartments - Availability API
// =============================================================================

import { NextResponse } from 'next/server';
import { format } from 'date-fns';
import { checkAvailability, getBlockedDates, ensureFreshCalendar } from '@/lib/availability';
import { APARTMENTS } from '@/lib/constants';

// -----------------------------------------------------------------------------
// GET /api/availability
// -----------------------------------------------------------------------------

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const apartmentId = searchParams.get('apartmentId');

    // Validate apartmentId (always required)
    if (!apartmentId) {
      return NextResponse.json(
        { error: 'Parameter "apartmentId" ist erforderlich.' },
        { status: 400 }
      );
    }

    // Validate that the apartment exists
    const apartmentExists = APARTMENTS.some((a) => a.id === apartmentId);
    if (!apartmentExists) {
      return NextResponse.json(
        { error: `Apartment "${apartmentId}" wurde nicht gefunden.` },
        { status: 404 }
      );
    }

    // --- Mode 1: Check availability for a specific date range ---
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');

    if (checkIn && checkOut) {
      // Validate date formats (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(checkIn) || !dateRegex.test(checkOut)) {
        return NextResponse.json(
          { error: 'Ungültiges Datumsformat. Erwartet: YYYY-MM-DD.' },
          { status: 400 }
        );
      }

      // Validate that checkOut is after checkIn
      if (checkOut <= checkIn) {
        return NextResponse.json(
          { error: 'Das Abreisedatum muss nach dem Anreisedatum liegen.' },
          { status: 400 }
        );
      }

      // Pull fresh Booking.com/Airbnb data before answering
      await ensureFreshCalendar(apartmentId);

      const available = await checkAvailability(apartmentId, checkIn, checkOut);

      return NextResponse.json({ available });
    }

    // --- Mode 2: Get blocked dates for a month ---
    const monthParam = searchParams.get('month');
    const yearParam = searchParams.get('year');

    if (monthParam && yearParam) {
      const month = parseInt(monthParam, 10);
      const year = parseInt(yearParam, 10);

      // Validate month and year
      if (isNaN(month) || month < 1 || month > 12) {
        return NextResponse.json(
          { error: 'Ungültiger Monat. Erlaubt: 1-12.' },
          { status: 400 }
        );
      }

      if (isNaN(year) || year < 2024 || year > 2100) {
        return NextResponse.json(
          { error: 'Ungültiges Jahr.' },
          { status: 400 }
        );
      }

      // Pull fresh Booking.com/Airbnb data before rendering the calendar
      await ensureFreshCalendar(apartmentId);

      const blockedDateObjects = await getBlockedDates(apartmentId, month, year);
      const blockedDates = blockedDateObjects.map((d) => format(d, 'yyyy-MM-dd'));

      return NextResponse.json({ blockedDates });
    }

    // --- Neither mode matched ---
    return NextResponse.json(
      {
        error:
          'Bitte geben Sie entweder "checkIn" und "checkOut" oder "month" und "year" als Parameter an.',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('[API /availability] Fehler:', error);
    return NextResponse.json(
      { error: 'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}
