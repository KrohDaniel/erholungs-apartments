import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Erholungs Apartments - Ferienwohnungen in Bad Lippspringe';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2D5016 0%, #3A6B1E 50%, #2D5016 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '64px', fontWeight: 'bold', color: 'white', letterSpacing: '-1px' }}>
            Erholungs Apartments
          </div>
          <div style={{ fontSize: '28px', color: '#C9A84C', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase' as const }}>
            Ferienwohnungen in Bad Lippspringe
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 24px', color: 'white', fontSize: '20px' }}>
              ★ 9.0/10 Booking.com
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 24px', color: 'white', fontSize: '20px' }}>
              ab 45€/Nacht
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px 24px', color: 'white', fontSize: '20px' }}>
              500m zur Therme
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
