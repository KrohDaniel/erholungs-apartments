import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/seo/GoogleAnalytics';
import { CookieConsent } from '@/components/shared/CookieConsent';
import './globals.css';

// =============================================================================
// Font Configuration
// =============================================================================

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: 'Erholungs Apartments | Ferienwohnung Bad Lippspringe',
    template: '%s | Erholungs Apartments',
  },
  description:
    'Liebevoll eingerichtete Ferienwohnungen in Bad Lippspringe nahe der Westfalen-Therme. ' +
    'Perfekt für Erholung, Kur und Wellness am Teutoburger Wald. Jetzt buchen!',
  keywords: [
    'Ferienwohnung Bad Lippspringe',
    'Erholungs Apartments',
    'Unterkunft Bad Lippspringe',
    'Westfalen-Therme',
    'Teutoburger Wald',
    'Kururlaub',
    'Wellness Urlaub',
    'Ferienwohnung NRW',
  ],
  authors: [{ name: 'Erholungs Apartments' }],
  creator: 'Erholungs Apartments',
  metadataBase: new URL('https://erholungs-apartments.de'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: 'https://erholungs-apartments.de',
    siteName: 'Erholungs Apartments',
    title: 'Erholungs Apartments | Ferienwohnung Bad Lippspringe',
    description:
      'Liebevoll eingerichtete Ferienwohnungen in Bad Lippspringe nahe der Westfalen-Therme. ' +
      'Perfekt für Erholung, Kur und Wellness am Teutoburger Wald.',
    images: [
      {
        url: '/images/hero/20180406_182210.jpg',
        width: 1200,
        height: 630,
        alt: 'Erholungs Apartments - Ferienwohnung Bad Lippspringe',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Erholungs Apartments | Ferienwohnung Bad Lippspringe',
    description:
      'Liebevoll eingerichtete Ferienwohnungen in Bad Lippspringe nahe der Westfalen-Therme.',
    images: ['/images/hero/20180406_182210.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#2D5016] focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
          Zum Inhalt springen
        </a>
        <GoogleAnalytics />
        <Header />
        <main id="main-content" className="flex-1 pt-20 lg:pt-[7.5rem]">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
