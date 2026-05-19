import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIX = '/rechnungen';
const ADMIN_API_PREFIXES = ['/api/admin/', '/api/invoice/'];
const LOGIN_PATH = '/admin-login';

function addAdminSecurityHeaders(res: NextResponse): NextResponse {
  // Prevent caching of any admin response
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.headers.set('Pragma', 'no-cache');
  // Prevent admin pages from being indexed
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  // Stricter referrer policy for admin
  res.headers.set('Referrer-Policy', 'no-referrer');
  return res;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Protect /rechnungen/* pages: check session cookie presence
  if (pathname.startsWith(PROTECTED_PREFIX)) {
    const session = req.cookies.get('admin_session')?.value;
    if (!session || session.length < 50) {
      const url = req.nextUrl.clone();
      url.pathname = LOGIN_PATH;
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    // Full verification happens in the layout via getCurrentAdmin()
    return addAdminSecurityHeaders(NextResponse.next());
  }

  // 2) Add security headers to admin API responses (auth still checked in route)
  if (ADMIN_API_PREFIXES.some((p) => pathname.startsWith(p))) {
    return addAdminSecurityHeaders(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/rechnungen/:path*', '/api/admin/:path*', '/api/invoice/:path*'],
};
