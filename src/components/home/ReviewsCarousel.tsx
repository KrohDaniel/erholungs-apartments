'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

type ReviewSource = 'Google' | 'Airbnb' | 'Booking.com';

interface Review {
  id: number;
  text: string;
  name: string;
  date: string;
  rating: number;
  source: ReviewSource;
}

const reviews: Review[] = [
  {
    id: 1,
    text: 'Gepflegt und sauber, tolle Matratze, gemütliche Einrichtung und gut ausgestattete Küche. Sehr nette Gastgeber!',
    name: 'Petra S.',
    date: 'Januar 2025',
    rating: 5,
    source: 'Booking.com',
  },
  {
    id: 2,
    text: 'Wunderbare kleine Wohnung, sehr sauber und gemütlich. Die Lage zur Therme ist perfekt!',
    name: 'Maria K.',
    date: 'Januar 2025',
    rating: 5,
    source: 'Google',
  },
  {
    id: 3,
    text: 'Die Ferienwohnung war sauber und gemütlich eingerichtet. Bequemes Bett, geräumiges Bad und ein toller Balkon.',
    name: 'Jürgen W.',
    date: 'Dezember 2024',
    rating: 5,
    source: 'Booking.com',
  },
  {
    id: 4,
    text: 'Super Preis-Leistung, ruhige Lage, alles da was man braucht. Kommen auf jeden Fall wieder!',
    name: 'Sabine M.',
    date: 'November 2024',
    rating: 5,
    source: 'Airbnb',
  },
  {
    id: 5,
    text: 'Einfach perfekt! Liebevoll gestaltete Wohnung mit allem was man braucht. Tolle Gegend zum Radfahren.',
    name: 'Martin H.',
    date: 'Oktober 2024',
    rating: 5,
    source: 'Booking.com',
  },
  {
    id: 6,
    text: 'Die Massage im Haus war das absolute Highlight unseres Aufenthalts! Unbedingt buchen!',
    name: 'Frank D.',
    date: 'Oktober 2024',
    rating: 5,
    source: 'Google',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? 'fill-accent text-accent'
              : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

function SourceBadge({ source }: { source: ReviewSource }) {
  const styles: Record<ReviewSource, string> = {
    'Google': 'bg-blue-50 text-blue-600',
    'Airbnb': 'bg-rose-50 text-rose-600',
    'Booking.com': 'bg-indigo-50 text-indigo-600',
  };

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[source]}`}
    >
      {source}
    </span>
  );
}

export default function ReviewsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);

  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function updateCardsPerView() {
      if (window.innerWidth >= 1024) setCardsPerView(3);
      else if (window.innerWidth >= 640) setCardsPerView(2);
      else setCardsPerView(1);
    }
    function debouncedUpdate() {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(updateCardsPerView, 150);
    }
    updateCardsPerView();
    window.addEventListener('resize', debouncedUpdate);
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, []);

  const maxIndex = Math.max(0, reviews.length - cardsPerView);

  const scrollPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const scrollNext = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  // Clamp activeIndex when cardsPerView changes
  useEffect(() => {
    setActiveIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const slideWidth = 100 / cardsPerView;

  return (
    <section className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-accent text-accent"
                />
              ))}
            </div>
            <span className="text-lg font-bold text-text">4.9</span>
          </div>
          <h2 className="mb-3 text-3xl font-bold text-text sm:text-4xl">
            Was unsere G&auml;ste sagen
          </h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-accent" />
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:-left-5 cursor-pointer"
            aria-label="Vorherige Bewertung"
          >
            <ChevronLeft className="h-5 w-5 text-text" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-1 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:shadow-lg sm:-right-5 cursor-pointer"
            aria-label="Nächste Bewertung"
          >
            <ChevronRight className="h-5 w-5 text-text" />
          </button>

          {/* Cards container */}
          <div className="overflow-hidden px-4">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeIndex * slideWidth}%)`,
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${slideWidth}%` }}
                >
                  <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-md sm:p-8">
                    <Quote className="mb-2 h-6 w-6 text-accent/40" />
                    <StarRating rating={review.rating} />
                    <p className="mt-4 flex-1 text-text-light leading-relaxed">
                      &bdquo;{review.text}&ldquo;
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-border-light pt-4">
                      <div>
                        <p className="text-sm font-semibold text-text">
                          {review.name}
                        </p>
                        <p className="text-xs text-text-muted">{review.date}</p>
                      </div>
                      <SourceBadge source={review.source} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'w-8 bg-accent'
                  : 'w-2.5 bg-accent/30 hover:bg-accent/50'
              }`}
              aria-label={`Seite ${index + 1} anzeigen`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
