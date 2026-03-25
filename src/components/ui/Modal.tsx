'use client';

import {
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// =============================================================================
// Modal Component
// =============================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  maxWidth = 'lg',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
  // Escape key handler
  // ---------------------------------------------------------------------------
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // ---------------------------------------------------------------------------
  // Click outside handler
  // ---------------------------------------------------------------------------
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  // ---------------------------------------------------------------------------
  // Focus trap: focus content on open
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isOpen]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Dialog'}
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-[var(--transition-base)]
        ${isOpen
          ? 'visible opacity-100'
          : 'invisible opacity-0 pointer-events-none'
        }
      `}
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-text/40 backdrop-blur-sm
          transition-opacity duration-[var(--transition-base)]
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`
          relative w-full ${maxWidthClasses[maxWidth]}
          bg-white rounded-2xl shadow-xl
          transition-all duration-[var(--transition-base)]
          ${isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
          }
          ${className}
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-xl font-semibold text-text">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="
                flex items-center justify-center w-8 h-8 rounded-full
                text-text-muted hover:text-text hover:bg-secondary
                transition-colors duration-[var(--transition-fast)]
                cursor-pointer
              "
              aria-label="Schliessen"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <button
            type="button"
            onClick={onClose}
            className="
              absolute top-4 right-4 z-10
              flex items-center justify-center w-8 h-8 rounded-full
              text-text-muted hover:text-text hover:bg-secondary
              transition-colors duration-[var(--transition-fast)]
              cursor-pointer
            "
            aria-label="Schliessen"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export type { ModalProps };
