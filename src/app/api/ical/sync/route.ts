import { NextResponse } from 'next/server';
import { syncExternalCalendar } from '@/lib/availability';
import { ICAL_FEEDS, APARTMENTS } from '@/lib/constants';

/**
 * POST /api/ical/sync
 * Syncs all configured external iCal feeds (Booking.com, Airbnb) into blockedDates.
 *
 * Optional body: { apartmentId?: string } to sync only one apartment.
 *
 * Protect this route with a secret header in production:
 *   Authorization: Bearer <ICAL_SYNC_SECRET>
 */
export async function POST(request: Request) {
  // Verify sync secret
  const authHeader = request.headers.get('authorization');
  const secret = process.env.ICAL_SYNC_SECRET;
  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const targetApartment = (body as { apartmentId?: string }).apartmentId;

    const apartmentIds = targetApartment
      ? [targetApartment]
      : APARTMENTS.map((a) => a.id);

    const results: Record<string, Record<string, { added: number; removed: number }>> = {};

    for (const apartmentId of apartmentIds) {
      const feeds = ICAL_FEEDS[apartmentId];
      if (!feeds) continue;

      results[apartmentId] = {};

      for (const [source, url] of Object.entries(feeds)) {
        if (!url) continue;
        try {
          const result = await syncExternalCalendar(
            apartmentId,
            url,
            source as 'airbnb' | 'booking'
          );
          results[apartmentId][source] = result;
        } catch (error) {
          console.error(`[iCal Sync] Fehler bei ${apartmentId}/${source}:`, error);
          results[apartmentId][source] = { added: -1, removed: -1 };
        }
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('[API /ical/sync] Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Synchronisieren der Kalender.' },
      { status: 500 }
    );
  }
}
