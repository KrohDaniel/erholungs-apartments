import Link from 'next/link';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default function RechnungenPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3 sm:mb-8 sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            Rechnungen
          </h1>
          <p className="mt-1 text-sm text-text-muted sm:mt-2 sm:text-base">
            Übersicht aller Rechnungen.
          </p>
        </div>
        <Link
          href="/rechnungen/neu/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-text shadow-sm hover:bg-accent-light sm:px-5 sm:py-2.5"
        >
          + Neue Rechnung
        </Link>
      </div>

      <DashboardClient />
    </div>
  );
}
