import React, { useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, style, onFocus, onBlur, ...props }, ref) => {
    const inputId = id || React.useId();
    const helperId = `${inputId}-helper`;
    const [focused, setFocused] = useState(false);

    const wrapperStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      width: '100%',
    };

    const labelStyle: React.CSSProperties = {
      fontFamily: "'JetBrains Mono', 'Fira Mono', Menlo, Consolas, monospace",
      fontSize: '0.8125rem',
      fontWeight: 700,
      color: '#dfdfe2',
      letterSpacing: '0.02em',
    };

    const inputBaseStyle: React.CSSProperties = {
      padding: '0.625rem 0.875rem',
      fontSize: '1rem',
      fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#f5f6f7',
      backgroundColor: '#0a0a23',
      border: `1px solid ${error ? '#ffadad' : focused ? '#198eee' : '#3b3b4f'}`,
      borderRadius: '0.375rem',
      outline: 'none',
      transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: focused && !error
        ? '0 0 0 3px rgba(25, 142, 238, 0.15)'
        : focused && error
        ? '0 0 0 3px rgba(255, 173, 173, 0.15)'
        : 'none',
      ...style,
    };

    const helperStyle: React.CSSProperties = {
      fontSize: '0.875rem',
      color: error ? '#ffadad' : '#858591',
      fontFamily: "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      minHeight: '1.25rem',
      transition: 'color 150ms ease',
    };

    return (
      <div style={wrapperStyle}>
        {label && (
          <label htmlFor={inputId} style={labelStyle}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          style={inputBaseStyle}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || helperText ? helperId : undefined}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
        />
        {(error || helperText) && (
          <span id={helperId} style={helperStyle} aria-live={error ? 'polite' : undefined}>{error || helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
