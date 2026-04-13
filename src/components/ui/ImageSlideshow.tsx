'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideshowImage {
  src: string;
  alt: string;
}

interface ImageSlideshowProps {
  images: SlideshowImage[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageSlideshow({
  images,
  autoPlay = true,
  interval = 5000,
}: ImageSlideshowProps) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => goTo(current + 1), interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, current, goTo]);

  if (images.length === 0) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#E5E2DC] bg-black shadow-sm">
      {/* Images */}
      <div className="relative aspect-video">
        {images.map((img, i) => (
          <div
            key={img.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 600px"
              quality={85}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/60 group-hover:opacity-100"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-black/60 group-hover:opacity-100"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Bild ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-8 pt-12">
        <p className="text-sm text-white/90">{images[current].alt}</p>
      </div>
    </div>
  );
}
