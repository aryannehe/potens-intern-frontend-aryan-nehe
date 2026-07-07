import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  valueLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, maxLength, valueLength = 0, className = '', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex flex-col gap-1.5 w-full text-left">
        <div className="flex justify-between items-baseline select-none">
          {label && (
            <label
              htmlFor={textareaId}
              className="text-xs font-semibold text-brand-blue-700 tracking-wide uppercase"
            >
              {label}
            </label>
          )}
          {maxLength && (
            <span
              className={`text-[11px] font-mono font-medium ${
                valueLength >= maxLength ? 'text-brand-red-600 font-bold' : 'text-slate-400'
              }`}
            >
              {valueLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full min-h-[120px] px-3.5 py-2.5 bg-white border ${
            error
              ? 'border-brand-red-500 focus-visible:ring-brand-red-500'
              : 'border-brand-blue-200 focus-visible:ring-brand-blue-800'
          } rounded-xl text-slate-800 text-sm font-medium transition-colors shadow-sm focus-ring resize-none placeholder-slate-400`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          maxLength={maxLength}
          {...props}
        />
        {error ? (
          <span
            id={`${textareaId}-error`}
            role="alert"
            className="text-xs font-semibold text-brand-red-600 mt-0.5"
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={`${textareaId}-helper`}
            className="text-xs text-slate-500 mt-0.5"
          >
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
