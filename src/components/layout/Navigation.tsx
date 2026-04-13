'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { NavigationItem } from '@/types';

// =============================================================================
// Navigation Data
// =============================================================================

export const NAV_ITEMS: NavigationItem[] = [
  {
    label: 'Apartments',
    href: '/erholungs-apartment/',
    children: [
      { label: 'Kellerchen', href: '/erholungs-kellerchen/' },
      { label: 'Apartment', href: '/erholungs-apartment/' },
    ],
  },
  { label: 'Buchen', href: '/buchen/' },
  { label: 'Massage', href: '/wohlbefinden-massage/' },
  { label: 'Umgebung', href: '/bad-lippspringe/' },
  { label: 'Bewertungen', href: '/bewertungen/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const PHONE_NUMBER = '0177 1666353';
export const PHONE_HREF = 'tel:+491771666353';
export const EMAIL = 'info@erholungs-apartments.de';
export const BOOKING_HREF = '/buchen/';

// =============================================================================
// Active Link Detection
// =============================================================================

export function useActiveLink(href: string): boolean {
  const pathname = usePathname();
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

// =============================================================================
// Desktop Navigation
// =============================================================================

interface DesktopNavProps {
  scrolled?: boolean;
}

export function DesktopNav({ scrolled }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1" aria-label="Hauptnavigation">
      {NAV_ITEMS.map((item) =>
        item.children ? (
          <DropdownNavItem key={item.href} item={item} pathname={pathname} scrolled={scrolled} />
        ) : (
          <NavLink key={item.href} item={item} pathname={pathname} scrolled={scrolled} />
        )
      )}
    </nav>
  );
}

// =============================================================================
// Single Nav Link
// =============================================================================

interface NavLinkProps {
  item: NavigationItem;
  pathname: string;
  scrolled?: boolean;
}

function NavLink({ item, pathname, scrolled }: NavLinkProps) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={`
        relative px-4 py-2 text-sm font-medium rounded-lg
        transition-colors duration-[var(--transition-fast)]
        ${isActive
          ? 'text-primary'
          : 'text-text-light hover:text-primary hover:bg-secondary'
        }
      `}
    >
      {item.label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-accent rounded-full" />
      )}
    </Link>
  );
}

// =============================================================================
// Dropdown Nav Item
// =============================================================================

interface DropdownNavItemProps {
  item: NavigationItem;
  pathname: string;
  scrolled?: boolean;
}

function DropdownNavItem({ item, pathname, scrolled }: DropdownNavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive =
    pathname === item.href ||
    item.children?.some(
      (child) => pathname === child.href || pathname.startsWith(child.href + '/')
    );

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg
          transition-colors duration-[var(--transition-fast)]
          cursor-pointer
          ${isActive
            ? 'text-primary'
            : 'text-text-light hover:text-primary hover:bg-secondary'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-[var(--transition-fast)] ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`
          absolute top-full left-0 mt-1 w-52
          bg-white rounded-xl shadow-lg border border-border-light
          py-2 z-50
          transition-all duration-[var(--transition-fast)]
          ${isOpen
            ? 'visible opacity-100 translate-y-0'
            : 'invisible opacity-0 -translate-y-2'
          }
        `}
      >
        {item.children?.map((child) => {
          const isChildActive = pathname === child.href;
          return (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setIsOpen(false)}
              className={`
                block px-4 py-2.5 text-sm
                transition-colors duration-[var(--transition-fast)]
                ${isChildActive
                  ? 'text-primary bg-secondary font-medium'
                  : 'text-text-light hover:text-primary hover:bg-secondary'
                }
              `}
            >
              {child.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export type { DesktopNavProps };
