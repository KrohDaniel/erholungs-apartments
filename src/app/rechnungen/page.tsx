import Link from 'next/link';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default function RechnungenPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-baseline justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Rechnungen</h1>
          <p className="mt-2 text-text-muted">
            Übersicht aller Rechnungen für die Ferienwohnungen.
          </p>
        </div>
        <Link
          href="/rechnungen/neu/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-text shadow-sm hover:bg-accent-light"
        >
          + Neue Rechnung
        </Link>
      </div>

      <DashboardClient />
    </div>
  );
}
