'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { ApartmentImage } from '@/types';

// =============================================================================
// ImageGallery Component
// =============================================================================

interface ImageGalleryProps {
  images: ApartmentImage[];
  apartmentName: string;
}

// -----------------------------------------------------------------------------
// Placeholder image component (used when real images are not yet available)
// -----------------------------------------------------------------------------

const placeholderColors = [
  'bg-stone-200',
  'bg-stone-300',
  'bg-stone-200',
  'bg-stone-300',
  'bg-stone-200',
];

function PlaceholderImage({
  alt,
  index,
  className = '',
}: {
  alt: string;
  index: number;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center ${placeholderColors[index % placeholderColors.length]} ${className}`}
    >
      <div className="text-center px-4">
        <Images className="mx-auto mb-2 text-stone-400" size={32} />
        <p className="text-sm text-stone-500 font-medium">{alt}</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Lightbox Component
// -----------------------------------------------------------------------------

interface LightboxProps {
  images: ApartmentImage[];
  apartmentName: string;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSetIndex: (index: number) => void;
}

function Lightbox({
  images,
  apartmentName,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onSetIndex,
}: LightboxProps) {
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation + focus trap
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();

      // Focus trap
      if (e.key === 'Tab' && lightboxRef.current) {
        const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Body scroll lock + auto-focus
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    if (closeButtonRef.current) closeButtonRef.current.focus();
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  // Touch / swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.targetTouches[0].clientX;
    touchEndRef.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStartRef.current === null || touchEndRef.current === null) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      onNext();
    } else if (distance < -minSwipeDistance) {
      onPrev();
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [onNext, onPrev]);

  const currentImage = images[currentIndex];

  return createPortal(
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-50 flex flex-col bg-text/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Bildergalerie ${apartmentName}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <span className="text-white/80 text-sm font-medium" aria-live="polite">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="
            flex items-center justify-center w-10 h-10 rounded-full
            text-white/70 hover:text-white hover:bg-white/10
            transition-colors duration-[var(--transition-fast)]
            cursor-pointer
          "
          aria-label="Galerie schliessen"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main image area */}
      <div
        className="flex-1 flex items-center justify-center relative px-4 sm:px-16"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous button */}
        <button
          type="button"
          onClick={onPrev}
          className="
            hidden sm:flex absolute left-4 z-10
            items-center justify-center w-12 h-12 rounded-full
            bg-white/10 text-white hover:bg-white/20
            transition-all duration-[var(--transition-fast)]
            cursor-pointer
          "
          aria-label="Vorheriges Bild"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Image */}
        <div className="relative w-full max-w-4xl aspect-[4/3] mx-auto">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className="object-contain rounded-lg"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={onNext}
          className="
            hidden sm:flex absolute right-4 z-10
            items-center justify-center w-12 h-12 rounded-full
            bg-white/10 text-white hover:bg-white/20
            transition-all duration-[var(--transition-fast)]
            cursor-pointer
          "
          aria-label="Naechstes Bild"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="px-4 py-4 sm:px-6">
        <div className="flex gap-1.5 justify-center overflow-x-auto no-scrollbar sm:gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onSetIndex(index)}
              className={`
                relative flex-shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-md overflow-hidden
                transition-all duration-[var(--transition-fast)] cursor-pointer
                ${index === currentIndex
                  ? 'ring-2 ring-accent opacity-100'
                  : 'opacity-50 hover:opacity-80'
                }
              `}
              aria-label={`Bild ${index + 1}: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// -----------------------------------------------------------------------------
// Main ImageGallery Component
// -----------------------------------------------------------------------------

export default function ImageGallery({ images, apartmentName }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Ensure we have at least 5 images for the grid (pad with duplicates if needed)
  const displayImages = images.length >= 5
    ? images.slice(0, 5)
    : [...images, ...images, ...images, ...images, ...images].slice(0, 5);

  return (
    <section aria-label={`Fotos von ${apartmentName}`}>
      {/* Desktop grid: 1 large + 4 small */}
      <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[420px] lg:h-[480px]">
        {/* Large hero image (spans 2 cols x 2 rows) */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
          aria-label={`${displayImages[0].alt} - Bild vergroessern`}
        >
          <Image
            src={displayImages[0].src}
            alt={displayImages[0].alt}
            fill
            className="object-cover transition-transform duration-[var(--transition-slow)] group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 640px"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-[var(--transition-base)]" />
        </button>

        {/* 4 smaller images */}
        {displayImages.slice(1, 5).map((image, index) => (
          <button
            key={index + 1}
            type="button"
            onClick={() => openLightbox(index + 1)}
            className="relative cursor-pointer group overflow-hidden"
            aria-label={`${image.alt} - Bild vergroessern`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-[var(--transition-slow)] group-hover:scale-105"
              sizes="(max-width: 1024px) 25vw, 320px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-[var(--transition-base)]" />
          </button>
        ))}

      </div>

      {/* Mobile: single image with swipe hint */}
      <div className="md:hidden relative">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="w-full aspect-[4/3] relative cursor-pointer group overflow-hidden rounded-xl"
          aria-label={`${displayImages[0].alt} - Galerie oeffnen`}
        >
          <Image
            src={displayImages[0].src}
            alt={displayImages[0].alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </button>

        {/* Image counter badge */}
        <div className="absolute top-3 right-3 bg-text/70 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm" aria-hidden="true">
          1 / {images.length}
        </div>
      </div>

      {/* "Alle Fotos ansehen" button */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="
            inline-flex items-center gap-2 px-4 py-2
            text-sm font-medium text-text
            bg-white border border-border rounded-lg
            hover:bg-secondary hover:border-border
            transition-all duration-[var(--transition-fast)]
            cursor-pointer shadow-sm
          "
        >
          <Images size={16} />
          Alle {images.length} Fotos ansehen
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          apartmentName={apartmentName}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={goNext}
          onPrev={goPrev}
          onSetIndex={setCurrentIndex}
        />
      )}
    </section>
  );
}

export { ImageGallery };
export type { ImageGalleryProps };
