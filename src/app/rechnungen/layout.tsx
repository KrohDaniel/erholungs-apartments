import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/auth';
import LogoutButton from './LogoutButton';

export default async function RechnungenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin-login?next=/rechnungen/');

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/rechnungen/" className="flex items-center gap-2 min-w-0 sm:gap-3">
            <img
              src="/images/general/logo_weiss_FeWo.png"
              alt="Erholungs Apartments"
              className="h-8 w-auto shrink-0 sm:h-10"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-text sm:text-base">
                Erholungs Apartments
              </div>
              <div className="text-[10px] uppercase tracking-wider text-text-muted sm:text-xs">
                Rechnungs-Tool
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-sm sm:gap-4">
            <a
              href="https://erholungs-apartments.de"
              target="_blank"
              rel="noreferrer"
              className="hidden text-text-light hover:text-primary md:inline"
            >
              ↗ Hauptseite
            </a>
            <span className="hidden text-xs text-text-muted lg:inline">
              {admin.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
