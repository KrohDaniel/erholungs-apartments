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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/rechnungen/" className="flex items-center gap-3">
            <img
              src="/images/general/logo_weiss_FeWo.png"
              alt="Erholungs Apartments"
              className="h-10 w-auto"
            />
            <div>
              <div className="font-semibold text-text">Erholungs Apartments</div>
              <div className="text-xs uppercase tracking-wider text-text-muted">
                Rechnungs-Tool
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <a
              href="https://erholungs-apartments.de"
              target="_blank"
              rel="noreferrer"
              className="text-text-light hover:text-primary"
            >
              ↗ Hauptseite
            </a>
            <span className="text-text-muted">{admin.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
