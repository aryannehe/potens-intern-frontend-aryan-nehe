import React, { forwardRef } from 'react';
import { useLanguage } from '../features/language/LanguageContext';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', fullWidth = false, isLoading = false, loadingText, className = '', disabled, ...props }, ref) => {
    const { t } = useLanguage();
    const baseStyle =
      'inline-flex items-center justify-center font-semibold text-sm rounded-xl px-5 py-3 transition-all duration-200 focus-ring min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed select-none';
    
    const variants = {
      primary:
        'bg-brand-blue-900 text-white hover:bg-brand-blue-950 active:scale-[0.98] shadow-glow-blue',
      secondary:
        'bg-white text-brand-blue-800 border border-brand-blue-200 hover:bg-brand-blue-50 active:scale-[0.98]',
      danger:
        'bg-brand-red-600 text-white hover:bg-brand-red-700 active:scale-[0.98]',
      ghost:
        'bg-transparent text-brand-blue-600 hover:bg-brand-blue-50 active:scale-[0.98]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';
    const displayLoadingText = loadingText || t.loadingText;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${variants[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{displayLoadingText}</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
