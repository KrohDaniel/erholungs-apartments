'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// =============================================================================
// Button Component
// =============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  asChild?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-light active:bg-primary-dark ' +
    'shadow-sm hover:shadow-md',
  secondary:
    'bg-transparent text-primary border-2 border-primary ' +
    'hover:bg-primary hover:text-white active:bg-primary-dark',
  accent:
    'bg-accent text-text hover:bg-accent-light active:bg-accent-dark ' +
    'shadow-sm hover:shadow-md font-semibold',
  ghost:
    'bg-transparent text-text hover:bg-secondary active:bg-secondary-dark',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-2.5 text-base gap-2',
  lg: 'px-8 py-3.5 text-lg gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className = '',
      children,
      asChild,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const classes = [
      'inline-flex items-center justify-center rounded-lg font-medium',
      'transition-all duration-[var(--transition-base)]',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
      'cursor-pointer select-none',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconElement = loading ? (
      <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
    ) : (
      icon
    );

    return (
      <button ref={ref} className={classes} disabled={isDisabled} {...props}>
        {iconElement && iconPosition === 'left' && iconElement}
        {children}
        {iconElement && iconPosition === 'right' && iconElement}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
