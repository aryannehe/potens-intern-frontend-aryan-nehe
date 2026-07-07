import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-brand-blue-700 tracking-wide uppercase select-none"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full min-h-[44px] px-3.5 py-2.5 bg-white border ${
            error
              ? 'border-brand-red-500 focus-visible:ring-brand-red-500'
              : 'border-brand-blue-200 focus-visible:ring-brand-blue-800'
          } rounded-xl text-slate-800 text-sm font-medium transition-colors shadow-sm focus-ring placeholder-slate-400`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error ? (
          <span
            id={`${inputId}-error`}
            role="alert"
            className="text-xs font-semibold text-brand-red-600 mt-0.5"
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={`${inputId}-helper`}
            className="text-xs text-slate-500 mt-0.5"
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
