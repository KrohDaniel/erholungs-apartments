import { type HTMLAttributes, type ReactNode } from 'react';

// =============================================================================
// Card Component & Subcomponents
// =============================================================================

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  className?: string;
}

function Card({ children, hover = false, className = '', ...props }: CardProps) {
  const classes = [
    'bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden',
    'transition-all duration-[var(--transition-base)]',
    hover
      ? 'hover:shadow-lg hover:-translate-y-1 hover:border-border cursor-pointer'
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`px-6 pt-6 pb-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div
      className={`px-6 pb-6 pt-2 border-t border-border-light ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps };
