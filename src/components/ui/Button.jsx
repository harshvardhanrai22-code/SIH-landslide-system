import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable Button component with loading state, variants, and accessible focus outlines.
 */
export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  fullWidth = false,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed rounded-md';

  const variants = {
    primary:
      'bg-[#2d5a44] text-white hover:bg-[#234735] focus:ring-[#2d5a44] active:bg-[#1a3729]',
    secondary:
      'bg-stone-100 text-stone-900 border border-stone-300 hover:bg-stone-200 focus:ring-stone-400',
    outline:
      'bg-transparent text-stone-800 border border-stone-300 hover:bg-stone-50 focus:ring-stone-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      )}
      {children}
    </button>
  );
};
