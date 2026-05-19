import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_PREFIX = '/rechnungen';
const LOGIN_PATH = '/admin-login';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(PROTECTED_PREFIX)) return NextResponse.next();

  const session = req.cookies.get('admin_session')?.value;
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Cookie presence check only - full verification happens in pages via getCurrentAdmin()
  return NextResponse.next();
}

export const config = {
  matcher: ['/rechnungen/:path*'],
};
