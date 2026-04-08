'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Phone } from 'lucide-react';
import { DesktopNav, PHONE_NUMBER, PHONE_HREF, BOOKING_HREF } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';

// =============================================================================
// Header Component
// =============================================================================

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  // ---------------------------------------------------------------------------
  // Scroll detection
  // ---------------------------------------------------------------------------
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    // Set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-[var(--transition-base)]
          ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white/80 backdrop-blur-sm'
          }
        `}
      >
        {/* Top bar - phone number (desktop only) */}
        <div
          className={`
            hidden lg:block border-b
            transition-all duration-[var(--transition-base)] overflow-hidden
            ${scrolled ? 'max-h-0 opacity-0 border-transparent' : 'max-h-10 opacity-100 border-border-light'}
          `}
        >
          <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-end">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 text-sm font-medium text-text-light hover:text-primary transition-colors duration-[var(--transition-fast)]"
            >
              <Phone size={14} className="text-primary" />
              <span className="tracking-wide">{PHONE_NUMBER}</span>
            </a>
          </div>
        </div>

        {/* Main header row */}
        <div className="max-w-7xl mx-auto px-6">
          <div
            className={`
              flex items-center justify-between
              transition-all duration-[var(--transition-base)]
              ${scrolled ? 'h-16' : 'h-20'}
            `}
          >
            {/* Logo - oversized, extends beyond header */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0 relative"
            >
              <div
                className={`
                  relative transition-all duration-[var(--transition-base)]
                  ${scrolled ? 'w-[60px] h-[60px] -my-2' : 'w-[110px] h-[110px] -my-8'}
                `}
              >
                <Image
                  src="/images/general/logo-ohne-schrift.png"
                  alt="Erholungs Apartments Logo"
                  fill
                  className="object-contain mix-blend-multiply"
                  sizes="110px"
                  priority
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className={`
                    font-semibold tracking-tight text-primary
                    transition-all duration-[var(--transition-base)]
                    ${scrolled ? 'text-lg' : 'text-2xl'}
                  `}
                >
                  Erholungs
                </span>
                <span
                  className={`
                    uppercase tracking-[0.2em] font-medium
                    transition-all duration-[var(--transition-base)]
                    ${scrolled ? 'text-[0.6rem] text-accent' : 'text-[0.7rem] text-accent-light'}
                  `}
                >
                  Apartments
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav scrolled={scrolled} />

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Phone number (visible when scrolled on desktop) */}
              <a
                href={PHONE_HREF}
                className={`
                  hidden lg:inline-flex items-center gap-1.5 text-sm font-medium
                  transition-all duration-[var(--transition-fast)]
                  ${scrolled
                    ? 'text-text-muted hover:text-primary opacity-100'
                    : 'opacity-0 pointer-events-none'
                  }
                `}
              >
                <Phone size={14} />
                {PHONE_NUMBER}
              </a>

              {/* CTA Button (desktop) */}
              <Link href={BOOKING_HREF} className="hidden lg:block">
                <Button variant="accent" size="sm">
                  Jetzt buchen
                </Button>
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`
                  lg:hidden flex items-center justify-center w-10 h-10 rounded-lg
                  transition-colors duration-[var(--transition-fast)]
                  cursor-pointer
                  ${scrolled
                    ? 'text-text hover:bg-secondary'
                    : 'text-text hover:bg-primary/5'
                  }
                `}
                aria-label="Menu oeffnen"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </>
  );
}
