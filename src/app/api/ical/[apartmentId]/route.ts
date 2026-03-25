import { NextResponse } from 'next/server';
import { generateICalFeed } from '@/lib/availability';
import { APARTMENTS } from '@/lib/constants';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ apartmentId: string }> }
) {
  try {
    const { apartmentId } = await params;

    const apartmentExists = APARTMENTS.some((a) => a.id === apartmentId);
    if (!apartmentExists) {
      return NextResponse.json(
        { error: `Apartment "${apartmentId}" wurde nicht gefunden.` },
        { status: 404 }
      );
    }

    const icalContent = await generateICalFeed(apartmentId);

    return new Response(icalContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${apartmentId}.ics"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[API /ical] Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Generieren des iCal-Feeds.' },
      { status: 500 }
    );
  }
}
