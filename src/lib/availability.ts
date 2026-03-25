// =============================================================================
// Erholungs Apartments - Availability Checking & iCal Sync
// =============================================================================

import {
  format,
  parseISO,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addDays,
} from 'date-fns';
import { getAdminDb } from '@/lib/firebase-admin';

// -----------------------------------------------------------------------------
// Check Availability
// -----------------------------------------------------------------------------

/**
 * Checks whether an apartment is available for the requested date range.
 * A date range is considered unavailable if any date within [checkIn, checkOut)
 * overlaps with an existing confirmed/paid booking or a blocked date.
 */
export async function checkAvailability(
  apartmentId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const db = getAdminDb();

  // 1. Check overlapping bookings (status CONFIRMED or PAID)
  const bookingsSnapshot = await db
    .collection('bookings')
    .where('apartmentId', '==', apartmentId)
    .where('status', 'in', ['CONFIRMED', 'PAID'])
    .where('checkIn', '<', checkOut)
    .get();

  // Filter server-side: booking.checkOut > checkIn
  const overlapping = bookingsSnapshot.docs.filter((doc) => {
    const data = doc.data();
    return data.checkOut > checkIn;
  });

  if (overlapping.length > 0) {
    return false;
  }

  // 2. Check blocked dates within the range [checkIn, checkOut)
  const blockedSnapshot = await db
    .collection('blockedDates')
    .where('apartmentId', '==', apartmentId)
    .where('date', '>=', checkIn)
    .where('date', '<', checkOut)
    .limit(1)
    .get();

  if (!blockedSnapshot.empty) {
    return false;
  }

  return true;
}

// -----------------------------------------------------------------------------
// Get Blocked Dates for a Month
// -----------------------------------------------------------------------------

/**
 * Returns all dates in a given month that are blocked or booked for an apartment.
 * Useful for rendering a calendar with unavailable dates.
 */
export async function getBlockedDates(
  apartmentId: string,
  month: number,
  year: number
): Promise<Date[]> {
  const db = getAdminDb();

  const monthStart = startOfMonth(new Date(year, month - 1));
  const monthEnd = endOfMonth(new Date(year, month - 1));
  const startStr = format(monthStart, 'yyyy-MM-dd');
  const endStr = format(addDays(monthEnd, 1), 'yyyy-MM-dd');

  // 1. Blocked dates
  const blockedSnapshot = await db
    .collection('blockedDates')
    .where('apartmentId', '==', apartmentId)
    .where('date', '>=', startStr)
    .where('date', '<', endStr)
    .get();

  const blockedSet = new Set<string>(
    blockedSnapshot.docs.map((doc) => doc.data().date as string)
  );

  // 2. Dates covered by confirmed/paid bookings
  const bookingsSnapshot = await db
    .collection('bookings')
    .where('apartmentId', '==', apartmentId)
    .where('status', 'in', ['CONFIRMED', 'PAID'])
    .where('checkIn', '<', endStr)
    .get();

  // Filter: booking.checkOut > startStr
  const relevantBookings = bookingsSnapshot.docs.filter((doc) => {
    const data = doc.data();
    return data.checkOut > startStr;
  });

  for (const doc of relevantBookings) {
    const data = doc.data();
    const bStart = parseISO(data.checkIn);
    const bEnd = parseISO(data.checkOut);
    const days = eachDayOfInterval({
      start: bStart < monthStart ? monthStart : bStart,
      end: bEnd > monthEnd ? monthEnd : addDays(bEnd, -1),
    });
    for (const day of days) {
      blockedSet.add(format(day, 'yyyy-MM-dd'));
    }
  }

  return Array.from(blockedSet)
    .sort()
    .map((d) => parseISO(d));
}

// -----------------------------------------------------------------------------
// Airbnb iCal Sync (Import)
// -----------------------------------------------------------------------------

/**
 * Fetches an iCal feed from an Airbnb URL, parses VEVENT entries,
 * and upserts blocked dates into the blockedDates collection.
 */
export async function syncExternalCalendar(
  apartmentId: string,
  icalUrl: string,
  source: 'airbnb' | 'booking' = 'booking'
): Promise<{ added: number; removed: number }> {
  const db = getAdminDb();

  // Fetch the iCal feed
  const response = await fetch(icalUrl);
  if (!response.ok) {
    throw new Error(`iCal-Feed konnte nicht geladen werden: HTTP ${response.status}`);
  }
  const icalText = await response.text();

  // Parse VEVENT blocks
  const newDates = parseICalEvents(icalText);
  const newSet = new Set(newDates);

  // Get existing blocked dates for this source
  const existingSnapshot = await db
    .collection('blockedDates')
    .where('apartmentId', '==', apartmentId)
    .where('source', '==', source)
    .get();

  const existingDates = new Map<string, string>(); // date -> docId
  existingSnapshot.docs.forEach((doc) => {
    existingDates.set(doc.data().date as string, doc.id);
  });

  // Dates to add (in new feed but not in DB)
  const toAdd = newDates.filter((d) => !existingDates.has(d));

  // Dates to remove (in DB but no longer in feed)
  const toRemoveIds: string[] = [];
  existingDates.forEach((docId, date) => {
    if (!newSet.has(date)) {
      toRemoveIds.push(docId);
    }
  });

  // Batch write
  const batch = db.batch();

  for (const date of toAdd) {
    const ref = db.collection('blockedDates').doc();
    batch.set(ref, {
      apartmentId,
      date,
      source,
    });
  }

  for (const docId of toRemoveIds) {
    batch.delete(db.collection('blockedDates').doc(docId));
  }

  await batch.commit();

  return { added: toAdd.length, removed: toRemoveIds.length };
}

/** @deprecated Use syncExternalCalendar instead */
export const syncAirbnbCalendar = syncExternalCalendar;

// -----------------------------------------------------------------------------
// iCal Parser (simple VEVENT extraction)
// -----------------------------------------------------------------------------

function parseICalEvents(icalText: string): string[] {
  const dates: string[] = [];
  const events = icalText.split('BEGIN:VEVENT');

  for (let i = 1; i < events.length; i++) {
    const block = events[i].split('END:VEVENT')[0];

    const dtStartMatch = block.match(/DTSTART[^:]*:(\d{8})/);
    const dtEndMatch = block.match(/DTEND[^:]*:(\d{8})/);

    if (!dtStartMatch) continue;

    const startStr = dtStartMatch[1];
    const startDate = new Date(
      parseInt(startStr.slice(0, 4)),
      parseInt(startStr.slice(4, 6)) - 1,
      parseInt(startStr.slice(6, 8))
    );

    let endDate: Date;
    if (dtEndMatch) {
      const endStr = dtEndMatch[1];
      endDate = new Date(
        parseInt(endStr.slice(0, 4)),
        parseInt(endStr.slice(4, 6)) - 1,
        parseInt(endStr.slice(6, 8))
      );
    } else {
      endDate = addDays(startDate, 1);
    }

    const days = eachDayOfInterval({
      start: startDate,
      end: addDays(endDate, -1),
    });

    for (const day of days) {
      dates.push(format(day, 'yyyy-MM-dd'));
    }
  }

  return [...new Set(dates)].sort();
}

// -----------------------------------------------------------------------------
// Generate iCal Feed (Export)
// -----------------------------------------------------------------------------

/**
 * Generates an iCal feed string for all confirmed/paid bookings of an
 * apartment. This feed can be imported into Airbnb.
 */
export async function generateICalFeed(apartmentId: string): Promise<string> {
  const db = getAdminDb();

  const bookingsSnapshot = await db
    .collection('bookings')
    .where('apartmentId', '==', apartmentId)
    .where('status', 'in', ['CONFIRMED', 'PAID'])
    .orderBy('checkIn', 'asc')
    .get();

  const now = new Date();
  const timestamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

  const events = bookingsSnapshot.docs
    .map((doc) => {
      const data = doc.data();
      const dtStart = (data.checkIn as string).replace(/-/g, '');
      const dtEnd = (data.checkOut as string).replace(/-/g, '');
      return [
        'BEGIN:VEVENT',
        `DTSTART;VALUE=DATE:${dtStart}`,
        `DTEND;VALUE=DATE:${dtEnd}`,
        `DTSTAMP:${timestamp}`,
        `UID:${doc.id}@erholungs-apartments.de`,
        `SUMMARY:Gebucht - ${data.guestName}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
      ].join('\r\n');
    })
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Erholungs Apartments//Booking Calendar//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Erholungs Apartments - ${apartmentId}`,
    events,
    'END:VCALENDAR',
  ].join('\r\n');
}
