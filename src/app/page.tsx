import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import TrustBar from '@/components/home/TrustBar';
import ApartmentCards from '@/components/home/ApartmentCards';
import USPSection from '@/components/home/USPSection';
import MassageTeaser from '@/components/home/MassageTeaser';
import UmgebungTeaser from '@/components/home/UmgebungTeaser';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import FAQ from '@/components/home/FAQ';
import SchemaMarkup from '@/components/seo/SchemaMarkup';

export const metadata: Metadata = {
  title:
    'Erholungs Apartments Bad Lippspringe | Ferienwohnungen nahe Westfalen Therme',
  description:
    'Gemütliche Ferienwohnungen in Bad Lippspringe, nur 500m zur Westfalen Therme. Kostenlos Parken, WLAN & Wohlbefinden Massage im Haus. Ab 40€/Nacht. Jetzt buchen!',
  keywords: [
    'Ferienwohnung Bad Lippspringe',
    'Erholungs Apartments',
    'Westfalen Therme',
    'Urlaub Bad Lippspringe',
    'Kurort Unterkunft',
    'Ferienwohnung Teutoburger Wald',
    'Massage Bad Lippspringe',
    'Günstige Ferienwohnung',
  ],
  openGraph: {
    title: 'Erholungs Apartments Bad Lippspringe | Ferienwohnungen nahe Westfalen Therme',
    description:
      'Gemütliche Ferienwohnungen in Bad Lippspringe, nur 500m zur Westfalen Therme. Ab 40€/Nacht.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Erholungs Apartments',
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <SchemaMarkup type="LodgingBusiness" />
      <SchemaMarkup type="FAQPage" />
      <SchemaMarkup type="WebSite" />
      <Hero />
      <TrustBar />
      <ApartmentCards />
      <USPSection />
      <MassageTeaser />
      <UmgebungTeaser />
      <ReviewsCarousel />
      <FAQ />
    </>
  );
}
