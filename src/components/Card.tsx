import React, { forwardRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  interactive?: boolean;
  role?: string;
  tabIndex?: number;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, selected = false, interactive = false, className = '', ...props }, ref) => {
    const baseStyle =
      'bg-white border rounded-2xl p-5 shadow-premium transition-all duration-200 focus-ring outline-none select-none';
    
    const borderStyle = selected
      ? 'border-brand-blue-800 ring-1 ring-brand-blue-800 shadow-premium-hover scale-[1.01]'
      : 'border-brand-blue-100';

    const hoverStyle = interactive && !selected
      ? 'hover:border-brand-blue-300 hover:shadow-premium-hover hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyle} ${borderStyle} ${hoverStyle} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
