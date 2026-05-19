import type { Metadata } from 'next';
import RechnungsanfrageClient from './RechnungsanfrageClient';

export const metadata: Metadata = {
  title: 'Rechnungsanfrage | Erholungs Apartments Bad Lippspringe',
  description:
    'Senden Sie uns Ihre Daten für eine Rechnung Ihres Aufenthalts in den Erholungs Apartments Bad Lippspringe.',
  robots: { index: false, follow: false },
};

export default function RechnungsanfragePage() {
  return (
    <main className="min-h-screen bg-background py-6 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <RechnungsanfrageClient />
      </div>
    </main>
  );
}
