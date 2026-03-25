'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Phone, ChevronRight } from 'lucide-react';
import { NAV_ITEMS, PHONE_NUMBER, PHONE_HREF, BOOKING_HREF } from './Navigation';
import { Button } from '@/components/ui/Button';

// =============================================================================
// Mobile Menu
// =============================================================================

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // ---------------------------------------------------------------------------
  // Body scroll lock
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Focus trap & auto-focus close button
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  const handleFocusTrap = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Close on route change
  // ---------------------------------------------------------------------------
  const [prevPathname, setPrevPathname] = useState(pathname);
  useEffect(() => {
    if (pathname !== prevPathname) {
      setPrevPathname(pathname);
      onClose();
    }
  }, [pathname, prevPathname, onClose]);

  // ---------------------------------------------------------------------------
  // Close on Escape + focus trap
  // ---------------------------------------------------------------------------
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      handleFocusTrap(e);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleFocusTrap]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[45] bg-text/30 backdrop-blur-sm
          transition-opacity duration-[var(--transition-base)]
          lg:hidden
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`
          fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm
          bg-white shadow-xl
          transition-transform duration-[var(--transition-slow)] ease-out
          lg:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-light">
          <span className="text-lg font-semibold text-primary">Menu</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="
              flex items-center justify-center w-10 h-10 rounded-full
              text-text-muted hover:text-text hover:bg-secondary
              transition-colors duration-[var(--transition-fast)]
              cursor-pointer
            "
            aria-label="Menu schliessen"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 py-6 overflow-y-auto max-h-[calc(100dvh-180px)] sm:max-h-[calc(100dvh-200px)]" aria-label="Mobile Navigation">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                item.children?.some((c) => pathname === c.href);

              return (
                <li key={item.href}>
                  {/* Parent link */}
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center justify-between px-4 py-3.5 rounded-xl
                      text-base font-medium
                      transition-colors duration-[var(--transition-fast)]
                      ${isActive
                        ? 'text-primary bg-secondary'
                        : 'text-text hover:text-primary hover:bg-secondary/60'
                      }
                    `}
                  >
                    {item.label}
                    {!item.children && (
                      <ChevronRight
                        size={16}
                        className="text-text-muted"
                      />
                    )}
                  </Link>

                  {/* Children */}
                  {item.children && (
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-border-light pl-4">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className={`
                                flex items-center justify-between px-3 py-2.5 rounded-lg
                                text-sm
                                transition-colors duration-[var(--transition-fast)]
                                ${isChildActive
                                  ? 'text-primary font-medium bg-secondary'
                                  : 'text-text-light hover:text-primary hover:bg-secondary/60'
                                }
                              `}
                            >
                              {child.label}
                              <ChevronRight size={14} className="text-text-muted" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom CTA Section */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-border-light bg-white">
          <Link href={BOOKING_HREF} onClick={onClose}>
            <Button variant="accent" size="lg" fullWidth>
              Jetzt buchen
            </Button>
          </Link>

          <a
            href={PHONE_HREF}
            className="
              flex items-center justify-center gap-2 mt-4
              text-sm text-primary font-medium
              hover:text-primary-light
              transition-colors duration-[var(--transition-fast)]
            "
          >
            <Phone size={16} />
            {PHONE_NUMBER}
          </a>
        </div>
      </div>
    </>
  );
}

export type { MobileMenuProps };
