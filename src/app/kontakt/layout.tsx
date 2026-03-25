import type { Metadata } from 'next';
import SchemaMarkup from '@/components/seo/SchemaMarkup';

// =============================================================================
// Kontakt Page - SEO Metadata & Schema
// =============================================================================

export const metadata: Metadata = {
  title: 'Kontakt & Anfahrt | Erholungs Apartments Bad Lippspringe',
  description:
    'Kontaktieren Sie die Erholungs Apartments in Bad Lippspringe. ' +
    'Fragen zur Buchung, Verfügbarkeit oder Anreise? Wir helfen Ihnen gerne weiter!',
  keywords: [
    'Kontakt Erholungs Apartments',
    'Ferienwohnung Bad Lippspringe buchen',
    'Anfrage Unterkunft Bad Lippspringe',
    'Buchung Ferienwohnung',
  ],
  openGraph: {
    title: 'Kontakt | Erholungs Apartments Bad Lippspringe',
    description:
      'Kontaktieren Sie uns für Ihre Buchung oder Fragen zu unseren Ferienwohnungen in Bad Lippspringe.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/kontakt',
  },
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SchemaMarkup type="LocalBusiness" />
      {children}
    </>
  );
}
